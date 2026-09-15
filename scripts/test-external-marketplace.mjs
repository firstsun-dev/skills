import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { discoverSkills, loadCatalog } from './lib/external-marketplace.mjs';

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'firstsun-marketplace-'));
  mkdirSync(join(root, 'marketplace/external'), { recursive: true });
  mkdirSync(join(root, 'external/basic/alpha'), { recursive: true });
  writeFileSync(join(root, 'external/basic/alpha/SKILL.md'), '---\nname: alpha\n---\n');
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
