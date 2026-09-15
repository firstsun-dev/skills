import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join, relative, sep } from 'node:path';

const ALLOWED_BRAND_CATEGORIES = ['Build', 'Design', 'Grow'];
const REQUIRED_STRING_FIELDS = [
  'id',
  'displayName',
  'brandCategory',
  'platformCategory',
  'version',
  'shortDescription',
  'longDescription',
  'defaultPrompt',
];

const FIRSTSUN_DEV_AUTHOR = { name: 'Firstsun Dev' };

// The five legacy per-platform bundles this task's generator replaces.
// Exact names confirmed against this repository's plugins/ directory.
const LEGACY_PLUGIN_DIRS = [
  'external-agent-workflows',
  'external-career-health',
  'external-developer-workflows',
  'external-frontend-design',
  'external-video-design',
];

// The standalone personal bundle this task's generator retires.
const LEGACY_STANDALONE_DIR = 'plugin-most-used';

const CODEX_MARKETPLACE_PATH = '.agents/plugins/marketplace.json';
const CLAUDE_MARKETPLACE_PATH = '.claude-plugin/marketplace.json';

function fail(message) {
  throw new Error(`External marketplace catalog: ${message}`);
}

function toPosixPath(path) {
  return path.split(sep).join('/');
}

function toJsonDocument(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

// Recursively collects every regular file beneath `absoluteDir`, in
// alphabetical order at each level, so output construction is deterministic.
// Symbolic links are rejected outright: public plugin packages must contain
// real files only, never symlinks (which don't survive being copied/zipped
// onto another machine).
function collectRegularFiles(absoluteDir) {
  const files = [];
  const names = readdirSync(absoluteDir).sort((a, b) => a.localeCompare(b));
  for (const name of names) {
    const absolutePath = join(absoluteDir, name);
    const stat = lstatSync(absolutePath);
    if (stat.isSymbolicLink()) {
      fail(`${absolutePath}: symbolic link is not portable`);
    } else if (stat.isDirectory()) {
      files.push(...collectRegularFiles(absolutePath));
    } else if (stat.isFile()) {
      files.push(absolutePath);
    } else {
      fail(`${absolutePath}: unsupported file type (expected a regular file or directory)`);
    }
  }
  return files;
}

function pluginIdsFromOutputs(outputs) {
  const ids = new Set();
  for (const key of outputs.keys()) {
    const match = /^plugins\/([^/]+)\//.exec(key);
    if (match) ids.add(match[1]);
  }
  return ids;
}

function assertRepoRoot(repoRoot) {
  const markers = ['AGENTS.md', 'external', 'marketplace/external/catalog.json'];
  for (const marker of markers) {
    if (!existsSync(join(repoRoot, marker))) {
      fail(`refusing to write outputs: ${repoRoot} is missing ${marker} (not the skill arsenal repo root?)`);
    }
  }
}

function pluginsDirChildren(repoRoot) {
  const pluginsDir = join(repoRoot, 'plugins');
  if (!existsSync(pluginsDir)) return [];
  return readdirSync(pluginsDir);
}

// Immediate children of plugins/ that writeOutputs does not recognize as
// either a current catalog plugin or one of the five known legacy bundles
// it is responsible for deleting. writeOutputs must refuse to run rather
// than silently delete (or silently ignore) anything else found here.
function unrecognizedPluginChildren(repoRoot, catalogPluginIds) {
  const allowed = new Set([...catalogPluginIds, ...LEGACY_PLUGIN_DIRS]);
  return pluginsDirChildren(repoRoot).filter((name) => !allowed.has(name));
}

// Immediate children of plugins/ that checkOutputs considers drift: anything
// that isn't a current catalog plugin, including a stale legacy bundle that
// writeOutputs would have deleted, or any other unrecognized directory.
function driftPluginChildren(repoRoot, catalogPluginIds) {
  return pluginsDirChildren(repoRoot).filter((name) => !catalogPluginIds.has(name));
}

function skillDirectories(absolutePath) {
  if (!existsSync(absolutePath)) return [];
  if (existsSync(join(absolutePath, 'SKILL.md'))) return [absolutePath];
  return readdirSync(absolutePath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => skillDirectories(join(absolutePath, entry.name)));
}

export function discoverSkills(repoRoot, plugin) {
  const seenNames = new Set();
  const records = [];

  for (const sourceRoot of plugin.sourceRoots) {
    const absoluteRoot = join(repoRoot, sourceRoot);
    if (!existsSync(absoluteRoot)) {
      fail(`${plugin.id} source root does not exist: ${sourceRoot}`);
    }
    for (const absolutePath of skillDirectories(absoluteRoot)) {
      const name = basename(absolutePath);
      if (seenNames.has(name)) {
        fail(`${plugin.id} has duplicate skill name: ${name}`);
      }
      seenNames.add(name);
      records.push({
        name,
        absolutePath,
        relativePath: relative(repoRoot, absolutePath),
      });
    }
  }

  records.sort((a, b) => a.name.localeCompare(b.name));

  if (records.length !== plugin.expectedSkillCount) {
    fail(
      `${plugin.id} expected ${plugin.expectedSkillCount} skills but discovered ${records.length}`,
    );
  }

  return records;
}

export function loadCatalog(repoRoot) {
  const path = join(repoRoot, 'marketplace/external/catalog.json');
  const catalog = JSON.parse(readFileSync(path, 'utf8'));

  if (catalog.name !== 'firstsun-external') fail('name must be firstsun-external');
  if (typeof catalog.displayName !== 'string' || catalog.displayName.trim() === '') {
    fail('displayName must be a non-empty string');
  }
  if (typeof catalog.promise !== 'string' || catalog.promise.trim() === '') {
    fail('promise must be a non-empty string');
  }
  if (!Array.isArray(catalog.plugins) || catalog.plugins.length === 0) fail('plugins must be non-empty');

  const ids = new Set();
  for (const plugin of catalog.plugins) {
    for (const key of REQUIRED_STRING_FIELDS) {
      if (typeof plugin[key] !== 'string' || plugin[key].trim() === '') {
        fail(`${plugin.id ?? 'plugin'}.${key} must be a non-empty string`);
      }
    }
    if (ids.has(plugin.id)) fail(`duplicate plugin id: ${plugin.id}`);
    ids.add(plugin.id);
    if (!ALLOWED_BRAND_CATEGORIES.includes(plugin.brandCategory)) {
      fail(`${plugin.id}.brandCategory is invalid`);
    }
    if (!Number.isInteger(plugin.expectedSkillCount) || plugin.expectedSkillCount < 1) {
      fail(`${plugin.id}.expectedSkillCount must be a positive integer`);
    }
    if (!Array.isArray(plugin.sourceRoots) || plugin.sourceRoots.length === 0) {
      fail(`${plugin.id}.sourceRoots must be non-empty`);
    }
    for (const sourceRoot of plugin.sourceRoots) {
      if (typeof sourceRoot !== 'string' || !sourceRoot.startsWith('external/') || sourceRoot.includes('..')) {
        fail(`${plugin.id} source root must stay inside external/`);
      }
    }
  }

  // Discover skills for every plugin now so structural problems (missing
  // source roots, in-plugin duplicate names, expectedSkillCount mismatches)
  // surface as soon as the catalog is loaded, and so we can additionally
  // enforce that skill names are unique across the *entire* catalog — an
  // installer has no way to disambiguate two plugins offering a skill with
  // the same name.
  const globalNames = new Map();
  for (const plugin of catalog.plugins) {
    const skills = discoverSkills(repoRoot, plugin);
    for (const skill of skills) {
      if (globalNames.has(skill.name)) {
        fail(`duplicate skill name across plugins: ${skill.name}`);
      }
      globalNames.set(skill.name, plugin.id);
    }
  }

  return catalog;
}

// Builds the complete set of generated files for both platforms, purely from
// the catalog and the skill files discovered on disk — nothing hand-edited.
// Returns a Map of POSIX-style repo-relative path -> file content (a JSON
// string for manifests, a Buffer for copied skill files so binary content
// survives byte-for-byte). Iteration order follows catalog order for
// plugins and alphabetical order for skills within a plugin, which combined
// with two-space/trailing-newline JSON formatting makes the output
// deterministic across runs.
export function buildOutputs(repoRoot, catalog) {
  const outputs = new Map();
  const codexPlugins = [];
  const claudePlugins = [];

  for (const plugin of catalog.plugins) {
    codexPlugins.push({
      name: plugin.id,
      source: { source: 'local', path: `./plugins/${plugin.id}` },
      category: plugin.platformCategory,
    });
    claudePlugins.push({
      name: plugin.id,
      description: plugin.shortDescription,
      author: FIRSTSUN_DEV_AUTHOR,
      category: plugin.platformCategory.toLowerCase(),
      source: `./plugins/${plugin.id}`,
    });

    const codexPluginManifest = {
      name: plugin.id,
      version: plugin.version,
      description: plugin.shortDescription,
      author: FIRSTSUN_DEV_AUTHOR,
      skills: './skills/',
      interface: {
        displayName: plugin.displayName,
        shortDescription: plugin.shortDescription,
        longDescription: plugin.longDescription,
        developerName: FIRSTSUN_DEV_AUTHOR.name,
        category: plugin.platformCategory,
        capabilities: [],
        defaultPrompt: plugin.defaultPrompt,
      },
    };
    outputs.set(`plugins/${plugin.id}/.codex-plugin/plugin.json`, toJsonDocument(codexPluginManifest));

    const claudePluginManifest = {
      name: plugin.id,
      version: plugin.version,
      description: plugin.shortDescription,
      author: FIRSTSUN_DEV_AUTHOR,
    };
    outputs.set(`plugins/${plugin.id}/.claude-plugin/plugin.json`, toJsonDocument(claudePluginManifest));

    const skills = discoverSkills(repoRoot, plugin);
    for (const skill of skills) {
      for (const absoluteFile of collectRegularFiles(skill.absolutePath)) {
        const relativeWithinSkill = toPosixPath(relative(skill.absolutePath, absoluteFile));
        const outputPath = `plugins/${plugin.id}/skills/${skill.name}/${relativeWithinSkill}`;
        outputs.set(outputPath, readFileSync(absoluteFile));
      }
    }
  }

  const codexMarketplace = {
    name: 'firstsun-external',
    interface: { displayName: catalog.displayName },
    plugins: codexPlugins,
  };
  const claudeMarketplace = {
    name: 'firstsun-external',
    description: catalog.promise,
    owner: FIRSTSUN_DEV_AUTHOR,
    plugins: claudePlugins,
  };

  // Set root manifests last but keep them first in iteration order by
  // rebuilding the map — cosmetic only, does not affect written content.
  const ordered = new Map();
  ordered.set(CODEX_MARKETPLACE_PATH, toJsonDocument(codexMarketplace));
  ordered.set(CLAUDE_MARKETPLACE_PATH, toJsonDocument(claudeMarketplace));
  for (const [key, value] of outputs) ordered.set(key, value);

  return ordered;
}

// Deletes only the resolved, validated targets this generator owns, then
// writes every entry in `outputs`. Refuses to run against a directory that
// doesn't look like the skill arsenal repo root, and refuses to delete
// anything if plugins/ contains an immediate child that is neither a
// current catalog plugin nor a known legacy bundle (reported, not removed).
export function writeOutputs(repoRoot, outputs) {
  assertRepoRoot(repoRoot);

  const catalogPluginIds = pluginIdsFromOutputs(outputs);
  const unexpected = unrecognizedPluginChildren(repoRoot, catalogPluginIds);
  if (unexpected.length) {
    fail(
      `refusing to write outputs: unexpected plugins/ entries (not deleted): ${unexpected
        .map((name) => `plugins/${name}`)
        .join(', ')}`,
    );
  }

  const dirTargets = [
    LEGACY_STANDALONE_DIR,
    ...[...catalogPluginIds].map((id) => `plugins/${id}`),
    ...LEGACY_PLUGIN_DIRS.map((name) => `plugins/${name}`),
  ];
  for (const relativeDir of dirTargets) {
    rmSync(join(repoRoot, relativeDir), { recursive: true, force: true });
  }
  for (const relativeFile of [CODEX_MARKETPLACE_PATH, CLAUDE_MARKETPLACE_PATH]) {
    rmSync(join(repoRoot, relativeFile), { force: true });
  }

  for (const [relativePath, content] of outputs) {
    const absolutePath = join(repoRoot, relativePath);
    mkdirSync(dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, content);
  }
}

// Read-only comparison between `outputs` (from buildOutputs) and what's
// actually on disk. Never mutates the repository. Returns a list of drift
// descriptions; an empty array means the repo already matches the catalog.
export function checkOutputs(repoRoot, outputs) {
  const drift = [];

  for (const [relativePath, expectedContent] of outputs) {
    const absolutePath = join(repoRoot, relativePath);
    if (!existsSync(absolutePath) || lstatSync(absolutePath).isDirectory()) {
      drift.push(`missing: ${relativePath}`);
      continue;
    }
    const actual = readFileSync(absolutePath);
    const expected = Buffer.isBuffer(expectedContent) ? expectedContent : Buffer.from(expectedContent, 'utf8');
    if (!actual.equals(expected)) {
      drift.push(`changed: ${relativePath}`);
    }
  }

  if (existsSync(join(repoRoot, LEGACY_STANDALONE_DIR))) {
    drift.push(`unexpected: ${LEGACY_STANDALONE_DIR}`);
  }

  const catalogPluginIds = pluginIdsFromOutputs(outputs);
  for (const name of driftPluginChildren(repoRoot, catalogPluginIds)) {
    drift.push(`unexpected: plugins/${name}`);
  }

  const expectedByPlugin = new Map();
  for (const key of outputs.keys()) {
    const match = /^plugins\/([^/]+)\//.exec(key);
    if (!match) continue;
    if (!expectedByPlugin.has(match[1])) expectedByPlugin.set(match[1], new Set());
    expectedByPlugin.get(match[1]).add(key);
  }
  for (const [pluginId, expectedKeys] of expectedByPlugin) {
    const pluginDir = join(repoRoot, 'plugins', pluginId);
    if (!existsSync(pluginDir)) continue; // already reported as missing above
    for (const absoluteFile of collectRegularFiles(pluginDir)) {
      const key = toPosixPath(relative(repoRoot, absoluteFile));
      if (!expectedKeys.has(key)) {
        drift.push(`unexpected: ${key}`);
      }
    }
  }

  return drift;
}
