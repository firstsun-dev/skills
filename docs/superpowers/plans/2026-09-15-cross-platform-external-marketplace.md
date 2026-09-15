# Cross-Platform Firstsun External Marketplace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish identical seven-plugin Firstsun External catalogs for ChatGPT/Codex and Claude Code from one canonical configuration.

**Architecture:** A canonical JSON catalog defines shared identity, the Build/Design/Grow taxonomy, and source roots. A focused Node.js library validates the catalog, discovers canonical external skills, copies portable plugin packages, and renders both platform formats; a thin CLI supports write and drift-check modes. Node's built-in assertion library provides fixture-based tests without adding dependencies.

**Tech Stack:** Node.js ESM and built-in `node:fs`, `node:path`, `node:assert`, and `node:os`; JSON manifests; Bash verification; GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-15-cross-platform-external-marketplace-design.md`

## Global Constraints

- Marketplace identifier is `firstsun-external`; display name is `Firstsun External`.
- The public promise is “Curated skills for practical AI development.”
- Publish seven plugins grouped as Build, Design, and Grow, with every external skill assigned exactly once.
- Both platform outputs must share plugin IDs, versions, descriptions, source membership, and copied skill contents.
- Public plugin packages contain real files, never symlinks.
- Canonical third-party content remains under `external/`; generated copies are never edited directly.
- External provenance in `skills-lock.json` must remain unchanged.
- Do not publish `custom/`, `plugin-most-used`, or the personal `tianyao-skills` marketplace through this catalog.
- Generation is deterministic and stale generated output fails local verification and CI.

## File Map

- Create `marketplace/external/catalog.json`: sole hand-maintained marketplace and bundle definition.
- Create `scripts/lib/external-marketplace.mjs`: pure catalog validation, discovery, rendering, copying, and parity functions.
- Modify `scripts/sync-external-marketplace.mjs`: thin `--write`/`--check` CLI around the library.
- Create `scripts/test-external-marketplace.mjs`: dependency-free fixture and repository contract tests.
- Regenerate `.agents/plugins/marketplace.json`: Codex marketplace output.
- Regenerate `.claude-plugin/marketplace.json`: Claude marketplace output.
- Replace `plugins/external-*` with seven generated `plugins/<plugin-id>` packages containing dual manifests.
- Delete `plugin-most-used`: remove the local-only package from the public repository catalog surface.
- Modify `init.sh`: enforce marketplace tests and zero-drift output.
- Modify `.github/workflows/update-external-skills.yml`: stage and verify both platform outputs.
- Modify `README.md`: document one public marketplace with two clients.
- Modify `SKILLS_LIST.md`: document the three categories, seven bundles, and generated counts.
- Modify `feature_list.json` and `progress.md`: record completion evidence and leave a restartable repository.

---

### Task 1: Define and validate the canonical catalog

**Files:**
- Create: `marketplace/external/catalog.json`
- Create: `scripts/lib/external-marketplace.mjs`
- Create: `scripts/test-external-marketplace.mjs`

**Interfaces:**
- Produces: `loadCatalog(repoRoot: string): Catalog`
- Produces: `discoverSkills(repoRoot: string, plugin: PluginDefinition): SkillRecord[]`
- `Catalog` contains `name`, `displayName`, `promise`, and ordered `plugins`.
- `PluginDefinition` contains `id`, `displayName`, `brandCategory`, `platformCategory`, `version`, `shortDescription`, `longDescription`, `defaultPrompt`, `expectedSkillCount`, and `sourceRoots`.
- `SkillRecord` contains `name`, `absolutePath`, and `relativePath`.

- [ ] **Step 1: Write catalog validation and discovery tests**

Create `scripts/test-external-marketplace.mjs` with a temporary fixture helper and these initial cases:

```js
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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

const root = fixture();
try {
  writeCatalog(root);
  const catalog = loadCatalog(root);
  assert.equal(catalog.name, 'firstsun-external');
  assert.deepEqual(discoverSkills(root, catalog.plugins[0]).map((skill) => skill.name), ['alpha']);
  assert.throws(() => writeCatalog(root, { name: 'wrong-name' }) || loadCatalog(root), /firstsun-external/);
} finally {
  rmSync(root, { recursive: true, force: true });
}

console.log('external marketplace tests: PASS');
```

Add separate fixtures before finishing the test file for duplicate plugin IDs, source roots outside `external/`, missing source roots, duplicate skill directory names, and `expectedSkillCount` mismatch. Each must assert the exact diagnostic fragment.

- [ ] **Step 2: Run the test and confirm the module is missing**

Run: `node scripts/test-external-marketplace.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/lib/external-marketplace.mjs`.

- [ ] **Step 3: Implement minimal catalog validation and recursive discovery**

Create `scripts/lib/external-marketplace.mjs`. Export `loadCatalog` and `discoverSkills`; validate all fields named in the Interfaces block, allow only brand categories `Build`, `Design`, and `Grow`, reject absolute/traversing source roots, recursively find directories containing `SKILL.md`, sort by skill name, and reject duplicate names. Use this error style so tests and CI remain actionable:

```js
function fail(message) {
  throw new Error(`External marketplace catalog: ${message}`);
}

export function loadCatalog(repoRoot) {
  const path = join(repoRoot, 'marketplace/external/catalog.json');
  const catalog = JSON.parse(readFileSync(path, 'utf8'));
  if (catalog.name !== 'firstsun-external') fail('name must be firstsun-external');
  if (!Array.isArray(catalog.plugins) || catalog.plugins.length === 0) fail('plugins must be non-empty');
  const ids = new Set();
  for (const plugin of catalog.plugins) {
    for (const key of ['id', 'displayName', 'brandCategory', 'platformCategory', 'version', 'shortDescription', 'longDescription', 'defaultPrompt']) {
      if (typeof plugin[key] !== 'string' || plugin[key].trim() === '') fail(`${plugin.id ?? 'plugin'}.${key} must be a non-empty string`);
    }
    if (ids.has(plugin.id)) fail(`duplicate plugin id: ${plugin.id}`);
    ids.add(plugin.id);
    if (!['Build', 'Design', 'Grow'].includes(plugin.brandCategory)) fail(`${plugin.id}.brandCategory is invalid`);
    if (!Number.isInteger(plugin.expectedSkillCount) || plugin.expectedSkillCount < 1) fail(`${plugin.id}.expectedSkillCount must be a positive integer`);
    if (!Array.isArray(plugin.sourceRoots) || plugin.sourceRoots.length === 0) fail(`${plugin.id}.sourceRoots must be non-empty`);
    for (const sourceRoot of plugin.sourceRoots) {
      if (!sourceRoot.startsWith('external/') || sourceRoot.includes('..')) fail(`${plugin.id} source root must stay inside external/`);
    }
  }
  return catalog;
}
```

Import `readFileSync` from `node:fs` and `join` from `node:path`; use the explicit checks above rather than weakening validation to truthiness tests.

- [ ] **Step 4: Add the approved seven-plugin catalog**

Create `marketplace/external/catalog.json` with these exact mappings and `version: "1.0.0"` for every plugin:

```json
{
  "name": "firstsun-external",
  "displayName": "Firstsun External",
  "promise": "Curated skills for practical AI development.",
  "plugins": [
    { "id": "agent-toolkit", "displayName": "Agent Toolkit", "brandCategory": "Build", "platformCategory": "Developer", "expectedSkillCount": 13, "sourceRoots": ["external/ai-agents", "external/basic", "external/think"] },
    { "id": "software-delivery", "displayName": "Software Delivery", "brandCategory": "Build", "platformCategory": "Developer", "expectedSkillCount": 16, "sourceRoots": ["external/develop/code-quality", "external/develop/devops", "external/develop/security", "external/develop/internationalization-i18n", "external/develop/windmill-rust-backend"] },
    { "id": "spec-driven-development", "displayName": "Spec-Driven Development", "brandCategory": "Build", "platformCategory": "Developer", "expectedSkillCount": 16, "sourceRoots": ["external/develop/openspec"] },
    { "id": "frontend-product-design", "displayName": "Frontend & Product Design", "brandCategory": "Design", "platformCategory": "Design", "expectedSkillCount": 19, "sourceRoots": ["external/develop/frontend"] },
    { "id": "visual-content", "displayName": "Visual Content", "brandCategory": "Design", "platformCategory": "Design", "expectedSkillCount": 10, "sourceRoots": ["external/video-design"] },
    { "id": "career-productivity", "displayName": "Career & Productivity", "brandCategory": "Grow", "platformCategory": "Productivity", "expectedSkillCount": 5, "sourceRoots": ["external/career", "external/lifestyle"] },
    { "id": "health-wellness", "displayName": "Health & Wellness", "brandCategory": "Grow", "platformCategory": "Productivity", "expectedSkillCount": 7, "sourceRoots": ["external/health"] }
  ]
}
```

Expand every plugin object with the required version, descriptions, and default prompt before saving. Descriptions must say “reviewed third-party skills” or “curated third-party skills”; Health & Wellness must state that it is not medical care.

- [ ] **Step 5: Run unit and repository contract tests**

Run: `node scripts/test-external-marketplace.mjs`

Expected: PASS and `external marketplace tests: PASS`; the real catalog discovers exactly 86 unique external skills.

- [ ] **Step 6: Commit the catalog contract**

```bash
git add marketplace/external/catalog.json scripts/lib/external-marketplace.mjs scripts/test-external-marketplace.mjs
git commit -m "feat(marketplace): define canonical external catalog"
```

### Task 2: Generate portable dual-platform packages

**Files:**
- Modify: `scripts/lib/external-marketplace.mjs`
- Modify: `scripts/sync-external-marketplace.mjs`
- Modify: `scripts/test-external-marketplace.mjs`
- Regenerate: `.agents/plugins/marketplace.json`
- Regenerate: `.claude-plugin/marketplace.json`
- Delete: `plugin-most-used/**`
- Replace: `plugins/external-*/**` with `plugins/{agent-toolkit,software-delivery,spec-driven-development,frontend-product-design,visual-content,career-productivity,health-wellness}/**`

**Interfaces:**
- Consumes: `loadCatalog(repoRoot)` and `discoverSkills(repoRoot, plugin)` from Task 1.
- Produces: `buildOutputs(repoRoot: string, catalog: Catalog): Map<string, string | Buffer>`.
- Produces: `writeOutputs(repoRoot: string, outputs: Map<string, string | Buffer>): void`.
- Produces: `checkOutputs(repoRoot: string, outputs: Map<string, string | Buffer>): string[]` where an empty array means no drift.

- [ ] **Step 1: Add a failing fixture test for both marketplace formats**

Extend the temporary fixture to call `buildOutputs` and assert:

```js
const outputs = buildOutputs(root, loadCatalog(root));
const codex = JSON.parse(outputs.get('.agents/plugins/marketplace.json'));
const claude = JSON.parse(outputs.get('.claude-plugin/marketplace.json'));
assert.deepEqual(codex.plugins.map((plugin) => plugin.name), ['agent-toolkit']);
assert.deepEqual(claude.plugins.map((plugin) => plugin.name), ['agent-toolkit']);
assert.deepEqual(codex.plugins[0].source, { source: 'local', path: './plugins/agent-toolkit' });
assert.equal(claude.plugins[0].source, './plugins/agent-toolkit');
assert.ok(outputs.has('plugins/agent-toolkit/.codex-plugin/plugin.json'));
assert.ok(outputs.has('plugins/agent-toolkit/.claude-plugin/plugin.json'));
assert.ok(outputs.has('plugins/agent-toolkit/skills/alpha/SKILL.md'));
```

Also assert both plugin manifests share `name`, `version`, `description`, and author `Firstsun Dev`; verify the Codex manifest contains its `interface` fields and the Claude manifest contains the shared metadata supported by that format.

- [ ] **Step 2: Run tests and confirm generation exports are missing**

Run: `node scripts/test-external-marketplace.mjs`

Expected: FAIL because `buildOutputs` is not exported.

- [ ] **Step 3: Implement deterministic in-memory output construction**

Implement `buildOutputs` so JSON always uses two-space indentation, a trailing newline, catalog order for plugins, alphabetical order for discovered skills, and POSIX `/` separators in output keys. Construct the two marketplace entries exactly as follows:

```js
const codexEntry = {
  name: plugin.id,
  source: { source: 'local', path: `./plugins/${plugin.id}` },
  category: plugin.platformCategory,
};
const claudeEntry = {
  name: plugin.id,
  description: plugin.shortDescription,
  author: { name: 'Firstsun Dev' },
  category: plugin.platformCategory.toLowerCase(),
  source: `./plugins/${plugin.id}`,
};
```

Use the same canonical plugin data for both plugin manifests. Copy every file below each discovered skill into the output map and reject symbolic links with `lstatSync(path).isSymbolicLink()`.

- [ ] **Step 4: Implement exact output reconciliation and CLI modes**

Replace the current hard-coded script with argument handling:

```js
#!/usr/bin/env node
import { resolve } from 'node:path';
import { buildOutputs, checkOutputs, loadCatalog, writeOutputs } from './lib/external-marketplace.mjs';

const repoRoot = resolve(import.meta.dirname, '..');
const mode = process.argv[2] ?? '--write';
const outputs = buildOutputs(repoRoot, loadCatalog(repoRoot));

if (mode === '--write') {
  writeOutputs(repoRoot, outputs);
} else if (mode === '--check') {
  const drift = checkOutputs(repoRoot, outputs);
  if (drift.length) {
    console.error(`External marketplace drift:\n${drift.map((path) => `- ${path}`).join('\n')}`);
    process.exitCode = 1;
  }
} else {
  console.error('Usage: node scripts/sync-external-marketplace.mjs [--write|--check]');
  process.exitCode = 2;
}
```

`writeOutputs` must remove only these resolved, validated targets before writing: `.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`, `plugin-most-used`, the seven catalog plugin directories, and the five explicit legacy `plugins/external-*` directories. It must report any other immediate child of `plugins/` as unexpected instead of deleting it. Reject a repository root that lacks `AGENTS.md`, `external/`, or `marketplace/external/catalog.json` before removal.

`checkOutputs` must report missing, changed, and unexpected generated files, including legacy plugin directories. It must never mutate the repository.

- [ ] **Step 5: Test write, check, mutation detection, and symlink rejection**

In the temporary fixture, run `writeOutputs`, assert `checkOutputs` returns `[]`, mutate the copied `SKILL.md`, and assert its path is reported. Add a symlink fixture where supported and assert generation fails with `symbolic link is not portable`.

Run: `node scripts/test-external-marketplace.mjs`

Expected: PASS.

- [ ] **Step 6: Generate the repository outputs**

Run: `node scripts/sync-external-marketplace.mjs --write`

Expected: the two root manifests name `firstsun-external`; exactly seven immediate directories exist under `plugins/`; every plugin contains both manifests; `plugin-most-used` and all five legacy `plugins/external-*` directories are gone.

- [ ] **Step 7: Verify parity and deterministic generation**

Run: `node scripts/sync-external-marketplace.mjs --check`

Expected: exit 0 with no drift output.

Run:

```bash
git diff --binary > /tmp/firstsun-marketplace-before.diff
node scripts/sync-external-marketplace.mjs --write
git diff --binary > /tmp/firstsun-marketplace-after.diff
cmp /tmp/firstsun-marketplace-before.diff /tmp/firstsun-marketplace-after.diff
```

Expected: `cmp` exits 0, proving a second generation introduces no further diff.

- [ ] **Step 8: Commit portable marketplace generation**

```bash
git add .agents/plugins/marketplace.json .claude-plugin/marketplace.json plugins scripts/lib/external-marketplace.mjs scripts/sync-external-marketplace.mjs scripts/test-external-marketplace.mjs
git add -u plugin-most-used
git commit -m "feat(marketplace): generate dual-platform external bundles"
```

### Task 3: Enforce parity locally and in weekly synchronization

**Files:**
- Modify: `init.sh:4-48`
- Modify: `.github/workflows/update-external-skills.yml:105-176`
- Modify: `scripts/test-external-marketplace.mjs`

**Interfaces:**
- Consumes: CLI `node scripts/sync-external-marketplace.mjs --check` from Task 2.
- Produces: `./init.sh` fails when tests fail or tracked marketplace outputs drift.

- [ ] **Step 1: Prove drift checking fails on a controlled fixture**

Ensure the Task 2 test suite includes this sequence:

```js
writeOutputs(root, outputs);
assert.deepEqual(checkOutputs(root, outputs), []);
writeFileSync(join(root, '.claude-plugin/marketplace.json'), '{}\n');
assert.deepEqual(checkOutputs(root, outputs), ['.claude-plugin/marketplace.json']);
```

Run: `node scripts/test-external-marketplace.mjs`

Expected: PASS.

- [ ] **Step 2: Add the marketplace gate to `init.sh`**

Insert after repository structure sanity and before skill-directory validation:

```bash
echo "=== external marketplace parity ==="
node scripts/test-external-marketplace.mjs
node scripts/sync-external-marketplace.mjs --check
echo "OK: external marketplace outputs match the canonical catalog"
```

- [ ] **Step 3: Update the weekly workflow's generated-output scope**

Keep the existing refresh step, then add an explicit check step:

```yaml
      - name: Verify external marketplace parity
        run: node scripts/sync-external-marketplace.mjs --check
```

Replace the old `add-paths` entries for marketplace output with:

```yaml
            .agents/plugins/marketplace.json
            .claude-plugin/marketplace.json
            marketplace/external/catalog.json
            external/**
            plugins/**
            skills-lock.json
```

- [ ] **Step 4: Run all local gates**

Run: `node scripts/test-external-marketplace.mjs && node scripts/sync-external-marketplace.mjs --check && ./init.sh`

Expected: all three commands exit 0; `init.sh` prints the marketplace parity success line.

- [ ] **Step 5: Commit verification integration**

```bash
git add init.sh .github/workflows/update-external-skills.yml scripts/test-external-marketplace.mjs
git commit -m "ci(marketplace): enforce cross-platform parity"
```

### Task 4: Align public documentation with the new taxonomy

**Files:**
- Modify: `README.md:34-53`
- Modify: `SKILLS_LIST.md:197-210`

**Interfaces:**
- Consumes: seven plugin IDs, categories, and counts from `marketplace/external/catalog.json`.
- Produces: installation and catalog copy that describes one Firstsun External product on both platforms.

- [ ] **Step 1: Add a documentation contract test**

Extend `scripts/test-external-marketplace.mjs` to read the real repository `README.md` and `SKILLS_LIST.md`, then assert every plugin ID and both manifest paths occur. Assert the obsolete public names `tianyao-skills`, `most-used-skills`, and `external-career-health` do not occur in either marketplace documentation section.

Run: `node scripts/test-external-marketplace.mjs`

Expected: FAIL because the current documentation contains the obsolete names and lacks the seven IDs.

- [ ] **Step 2: Rewrite the README marketplace section**

Describe **Firstsun External** once, followed by:

- the promise “Curated skills for practical AI development”;
- Build, Design, and Grow with their plugin names;
- ChatGPT import instructions using repository URL `https://github.com/firstsun-dev/skills` and an empty Path;
- Claude Code installation using the repository's `.claude-plugin/marketplace.json` discovery flow;
- the guarantee that both clients receive identical copied skill contents;
- the generated-artifact warning for `plugins/` and both root manifests.

- [ ] **Step 3: Replace the Plugins table in `SKILLS_LIST.md`**

List one marketplace row followed by category subheadings and seven plugin rows with counts `13, 16, 16, 19, 10, 5, 7`. Link each plugin row to `./plugins/<plugin-id>/.codex-plugin/plugin.json` and mention that a sibling Claude manifest exists in the same package.

Remove the personal `tianyao-skills` and `most-used-skills` rows and the five legacy plugin rows.

- [ ] **Step 4: Run documentation and parity checks**

Run: `node scripts/test-external-marketplace.mjs && node scripts/sync-external-marketplace.mjs --check && git diff --check`

Expected: PASS with no stale-name assertion or whitespace errors.

- [ ] **Step 5: Commit documentation**

```bash
git add README.md SKILLS_LIST.md scripts/test-external-marketplace.mjs
git commit -m "docs(marketplace): present Build Design Grow catalog"
```

### Task 5: Complete repository verification and state records

**Files:**
- Modify: `feature_list.json`
- Modify: `progress.md`

**Interfaces:**
- Consumes: successful generator tests, parity check, JSON parsing, and `./init.sh`.
- Produces: feat-016 completion evidence and a clean restart state.

- [ ] **Step 1: Validate all JSON manifests explicitly**

Run:

```bash
jq -e . marketplace/external/catalog.json .agents/plugins/marketplace.json .claude-plugin/marketplace.json >/dev/null
find plugins -type f \( -path '*/.codex-plugin/plugin.json' -o -path '*/.claude-plugin/plugin.json' \) -print0 | xargs -0 -n1 jq -e >/dev/null
```

Expected: exit 0.

- [ ] **Step 2: Verify package shape and total assignment**

Run:

```bash
test "$(find plugins -mindepth 1 -maxdepth 1 -type d | wc -l)" -eq 7
test "$(find plugins -mindepth 4 -maxdepth 4 -type f -name SKILL.md | wc -l)" -eq 86
test "$(find plugins -type l | wc -l)" -eq 0
```

Expected: exit 0. If upstream changes during implementation, update `expectedSkillCount`, documentation counts, and the expected total together before rerunning.

- [ ] **Step 3: Run the complete repository gate**

Run: `./init.sh && git diff --check`

Expected: harness initialization and marketplace parity pass with no whitespace errors.

- [ ] **Step 4: Inspect scope and provenance**

Run: `git status --short` and `git diff -- skills-lock.json`

Expected: only feat-016 files are modified; `skills-lock.json` has no provenance changes.

- [ ] **Step 5: Record completion**

Set feat-016 to `done` in `feature_list.json` with evidence containing the seven plugin IDs, `86` assigned skills, the test command, parity command, `./init.sh`, and the implementation commit hashes. Update `progress.md` so feat-016 moves out of “What's In Progress” and its concise completion record points to the feature evidence.

- [ ] **Step 6: Commit final state records**

```bash
git add feature_list.json progress.md
git commit -m "chore(marketplace): record cross-platform catalog completion"
```

- [ ] **Step 7: Perform final clean verification**

Run: `node scripts/sync-external-marketplace.mjs --check && ./init.sh && git status --short`

Expected: both verification commands pass and `git status --short` prints nothing.
