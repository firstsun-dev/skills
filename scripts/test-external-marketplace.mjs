import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import {
  buildOutputs,
  checkOutputs,
  discoverSkills,
  loadCatalog,
  writeOutputs,
} from './lib/external-marketplace.mjs';

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'firstsun-marketplace-'));
  mkdirSync(join(root, 'marketplace/external'), { recursive: true });
  mkdirSync(join(root, 'external/basic/alpha'), { recursive: true });
  writeFileSync(join(root, 'external/basic/alpha/SKILL.md'), '---\nname: alpha\n---\n');
  // writeOutputs sanity-checks that it's really operating on the skill
  // arsenal repo root before deleting anything.
  writeFileSync(join(root, 'AGENTS.md'), '# Agents\n');
  return root;
}

function writeCatalog(root, overrides = {}) {
  const catalog = {
    name: 'firstsun-external',
    displayName: 'Firstsun External',
    promise: 'Curated skills for practical AI development.',
    plugins: [{
      id: 'agent-toolkit',
      displayName: 'Agent Toolkit',
      brandCategory: 'Build',
      platformCategory: 'Developer',
      version: '1.0.0',
      shortDescription: 'Practical agent workflows.',
      longDescription: 'Reviewed third-party workflows for practical agent work.',
      defaultPrompt: 'Use the relevant Agent Toolkit skill for this task.',
      expectedSkillCount: 1,
      sourceRoots: ['external/basic'],
    }],
    ...overrides,
  };
  writeFileSync(join(root, 'marketplace/external/catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`);
}

function withFixture(fn) {
  const root = fixture();
  try {
    fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function basePlugin(overrides = {}) {
  return {
    id: 'agent-toolkit',
    displayName: 'Agent Toolkit',
    brandCategory: 'Build',
    platformCategory: 'Developer',
    version: '1.0.0',
    shortDescription: 'Practical agent workflows.',
    longDescription: 'Reviewed third-party workflows for practical agent work.',
    defaultPrompt: 'Use the relevant Agent Toolkit skill for this task.',
    expectedSkillCount: 1,
    sourceRoots: ['external/basic'],
    ...overrides,
  };
}

// --- Step 1 baseline: valid catalog loads and discovers skills ---
withFixture((root) => {
  writeCatalog(root);
  const catalog = loadCatalog(root);
  assert.equal(catalog.name, 'firstsun-external');
  assert.deepEqual(discoverSkills(root, catalog.plugins[0]).map((skill) => skill.name), ['alpha']);
});

// --- catalog.name must be firstsun-external ---
withFixture((root) => {
  writeCatalog(root, { name: 'wrong-name' });
  assert.throws(() => loadCatalog(root), /firstsun-external/);
});

// --- duplicate plugin IDs ---
withFixture((root) => {
  mkdirSync(join(root, 'external/basic/beta'), { recursive: true });
  writeFileSync(join(root, 'external/basic/beta/SKILL.md'), '---\nname: beta\n---\n');
  writeCatalog(root, {
    plugins: [
      basePlugin({ id: 'agent-toolkit', sourceRoots: ['external/basic'], expectedSkillCount: 2 }),
      basePlugin({ id: 'agent-toolkit', sourceRoots: ['external/basic'], expectedSkillCount: 2 }),
    ],
  });
  assert.throws(() => loadCatalog(root), /duplicate plugin id: agent-toolkit/);
});

// --- source root outside external/ ---
withFixture((root) => {
  writeCatalog(root, {
    plugins: [basePlugin({ sourceRoots: ['../outside'] })],
  });
  assert.throws(() => loadCatalog(root), /agent-toolkit source root must stay inside external\//);
});

// --- source root that does not exist on disk ---
withFixture((root) => {
  writeCatalog(root, {
    plugins: [basePlugin({ sourceRoots: ['external/does-not-exist'] })],
  });
  assert.throws(
    () => loadCatalog(root),
    /agent-toolkit source root does not exist: external\/does-not-exist/,
  );
});

// --- duplicate skill directory names within a plugin (two source roots, same skill name) ---
withFixture((root) => {
  mkdirSync(join(root, 'external/other/alpha'), { recursive: true });
  writeFileSync(join(root, 'external/other/alpha/SKILL.md'), '---\nname: alpha\n---\n');
  writeCatalog(root, {
    plugins: [basePlugin({ sourceRoots: ['external/basic', 'external/other'], expectedSkillCount: 2 })],
  });
  assert.throws(() => loadCatalog(root), /agent-toolkit has duplicate skill name: alpha/);
});

// --- expectedSkillCount mismatch ---
withFixture((root) => {
  writeCatalog(root, {
    plugins: [basePlugin({ expectedSkillCount: 2 })],
  });
  assert.throws(
    () => loadCatalog(root),
    /agent-toolkit expected 2 skills but discovered 1/,
  );
});

// --- duplicate skill name across two different plugins (catalog-wide uniqueness) ---
withFixture((root) => {
  mkdirSync(join(root, 'external/other/alpha'), { recursive: true });
  writeFileSync(join(root, 'external/other/alpha/SKILL.md'), '---\nname: alpha\n---\n');
  writeCatalog(root, {
    plugins: [
      basePlugin({ id: 'agent-toolkit', sourceRoots: ['external/basic'], expectedSkillCount: 1 }),
      basePlugin({ id: 'other-toolkit', sourceRoots: ['external/other'], expectedSkillCount: 1 }),
    ],
  });
  assert.throws(() => loadCatalog(root), /duplicate skill name across plugins: alpha/);
});

// --- Step 1: buildOutputs produces both marketplace formats ---
withFixture((root) => {
  writeCatalog(root);
  const outputs = buildOutputs(root, loadCatalog(root));
  const codex = JSON.parse(outputs.get('.agents/plugins/marketplace.json'));
  const claude = JSON.parse(outputs.get('.claude-plugin/marketplace.json'));

  assert.equal(codex.name, 'firstsun-external');
  assert.equal(claude.name, 'firstsun-external');
  assert.deepEqual(codex.plugins.map((plugin) => plugin.name), ['agent-toolkit']);
  assert.deepEqual(claude.plugins.map((plugin) => plugin.name), ['agent-toolkit']);
  assert.deepEqual(codex.plugins[0].source, { source: 'local', path: './plugins/agent-toolkit' });
  assert.equal(claude.plugins[0].source, './plugins/agent-toolkit');
  assert.ok(outputs.has('plugins/agent-toolkit/.codex-plugin/plugin.json'));
  assert.ok(outputs.has('plugins/agent-toolkit/.claude-plugin/plugin.json'));
  assert.ok(outputs.has('plugins/agent-toolkit/skills/alpha/SKILL.md'));

  const codexPlugin = JSON.parse(outputs.get('plugins/agent-toolkit/.codex-plugin/plugin.json'));
  const claudePlugin = JSON.parse(outputs.get('plugins/agent-toolkit/.claude-plugin/plugin.json'));
  for (const field of ['name', 'version', 'description']) {
    assert.equal(codexPlugin[field], claudePlugin[field], `plugin.json ${field} must match across formats`);
  }
  assert.deepEqual(codexPlugin.author, { name: 'Firstsun Dev' });
  assert.deepEqual(claudePlugin.author, { name: 'Firstsun Dev' });

  // Codex format carries the richer `interface` block; Claude's plugin.json
  // only supports the shared metadata fields.
  assert.equal(codexPlugin.interface.displayName, 'Agent Toolkit');
  assert.equal(codexPlugin.interface.shortDescription, 'Practical agent workflows.');
  assert.equal(codexPlugin.interface.longDescription, 'Reviewed third-party workflows for practical agent work.');
  assert.equal(codexPlugin.interface.defaultPrompt, 'Use the relevant Agent Toolkit skill for this task.');
  assert.deepEqual(Object.keys(claudePlugin).sort(), ['author', 'description', 'name', 'version']);

  // Output formatting is deterministic: two-space indent, trailing newline.
  const raw = outputs.get('.claude-plugin/marketplace.json');
  assert.ok(raw.endsWith('\n'));
  assert.ok(raw.includes('\n  "name"'));

  // Copied skill file content is preserved byte-for-byte.
  assert.equal(
    outputs.get('plugins/agent-toolkit/skills/alpha/SKILL.md').toString('utf8'),
    '---\nname: alpha\n---\n',
  );
});

// --- Step 5: writeOutputs / checkOutputs round-trip, drift detection, symlink rejection ---
withFixture((root) => {
  writeCatalog(root);
  const outputs = buildOutputs(root, loadCatalog(root));
  writeOutputs(root, outputs);

  assert.ok(existsSync(join(root, '.agents/plugins/marketplace.json')));
  assert.ok(existsSync(join(root, '.claude-plugin/marketplace.json')));
  assert.ok(existsSync(join(root, 'plugins/agent-toolkit/skills/alpha/SKILL.md')));
  assert.deepEqual(checkOutputs(root, outputs), []);

  // Mutating a copied file must surface as drift, and checkOutputs must not
  // repair it (read-only).
  const skillPath = join(root, 'plugins/agent-toolkit/skills/alpha/SKILL.md');
  writeFileSync(skillPath, '---\nname: alpha\n---\nmutated\n');
  const drift = checkOutputs(root, outputs);
  assert.ok(
    drift.includes('changed: plugins/agent-toolkit/skills/alpha/SKILL.md'),
    `expected drift to report the mutated file, got: ${JSON.stringify(drift)}`,
  );
  assert.equal(
    readFileSync(skillPath, 'utf8'),
    '---\nname: alpha\n---\nmutated\n',
    'checkOutputs must never mutate the repository',
  );

  // An unexpected legacy directory left behind must be reported as drift,
  // never silently deleted by checkOutputs.
  mkdirSync(join(root, 'plugins/external-agent-workflows'), { recursive: true });
  writeFileSync(join(root, 'plugins/external-agent-workflows/marker.txt'), 'stale\n');
  const driftWithLegacy = checkOutputs(root, outputs);
  assert.ok(driftWithLegacy.includes('unexpected: plugins/external-agent-workflows'));
  assert.ok(existsSync(join(root, 'plugins/external-agent-workflows/marker.txt')));

  // A second write must delete the legacy directory it owns and re-converge
  // to zero drift.
  writeOutputs(root, outputs);
  assert.ok(!existsSync(join(root, 'plugins/external-agent-workflows')));
  assert.deepEqual(checkOutputs(root, outputs), []);

  // writeOutputs refuses to touch a directory that isn't the repo root.
  const notARepo = mkdtempSync(join(tmpdir(), 'firstsun-marketplace-notrepo-'));
  try {
    assert.throws(() => writeOutputs(notARepo, outputs), /AGENTS\.md/);
  } finally {
    rmSync(notARepo, { recursive: true, force: true });
  }
});

// --- writeOutputs refuses to delete an unrecognized plugins/ directory ---
withFixture((root) => {
  writeCatalog(root);
  const outputs = buildOutputs(root, loadCatalog(root));
  mkdirSync(join(root, 'plugins/totally-unrelated'), { recursive: true });
  writeFileSync(join(root, 'plugins/totally-unrelated/keep.txt'), 'do not delete me\n');
  assert.throws(() => writeOutputs(root, outputs), /unexpected plugins\/ entries.*plugins\/totally-unrelated/s);
  assert.ok(existsSync(join(root, 'plugins/totally-unrelated/keep.txt')));
});

// --- symbolic links inside a skill directory are rejected ---
withFixture((root) => {
  writeCatalog(root);
  const targetFile = join(root, 'external/basic/alpha/real.txt');
  writeFileSync(targetFile, 'real file\n');
  const linkPath = join(root, 'external/basic/alpha/link.txt');
  try {
    symlinkSync(targetFile, linkPath);
  } catch (error) {
    // Symlink creation can require elevated privileges on some platforms
    // (notably Windows); skip this assertion where it isn't supported.
    console.log(`skipping symlink rejection test: ${error.message}`);
    return;
  }
  try {
    assert.throws(() => buildOutputs(root, loadCatalog(root)), /symbolic link is not portable/);
  } finally {
    rmSync(linkPath, { force: true });
  }
});

// --- Repository-level contract test: the real catalog against the real external/ tree ---
{
  const repoRoot = resolve(import.meta.dirname, '..');
  const catalog = loadCatalog(repoRoot);

  assert.equal(catalog.name, 'firstsun-external');
  assert.equal(catalog.displayName, 'Firstsun External');

  const allNames = new Set();
  let total = 0;
  for (const plugin of catalog.plugins) {
    const skills = discoverSkills(repoRoot, plugin);
    assert.equal(
      skills.length,
      plugin.expectedSkillCount,
      `${plugin.id}: expected ${plugin.expectedSkillCount} skills, discovered ${skills.length}`,
    );
    for (const skill of skills) {
      assert.equal(allNames.has(skill.name), false, `duplicate skill name across catalog: ${skill.name}`);
      allNames.add(skill.name);
    }
    total += skills.length;
  }

  assert.equal(total, 86, `expected 86 total external skills across all plugins, found ${total}`);
  assert.equal(allNames.size, 86, `expected 86 unique skill names, found ${allNames.size}`);
}

console.log('external marketplace tests: PASS');
