import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join, relative } from 'node:path';

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

function fail(message) {
  throw new Error(`External marketplace catalog: ${message}`);
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
