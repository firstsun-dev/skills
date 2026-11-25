// node --test scripts/audit-harness.test.mjs
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { audit } from './audit-harness.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const good = '# P\n\n## Safety\nProduction changes need approval.\n\n## Verification\n```bash\n./check.sh  # fast\n```\n';

function project(t, files) {
  const root = mkdtempSync(path.join(tmpdir(), 'audit-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const [name, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    writeFileSync(path.join(root, name), text);
  }
  return root;
}
const status = (root) => Object.fromEntries(audit(root).checks.map((c) => [c.id, c.status]));

test('minimal compliant project passes; execution is never claimed', (t) => {
  const root = project(t, { 'AGENTS.md': good, 'check.sh': 'true\n' });
  assert.equal(audit(root).ok, true);
  assert.equal(status(root)['verification-execution'], 'NOT RUN');
  assert.equal(status(root)['state-file-gates'], 'SKIP');
});

test('empty project fails and has no score', (t) => {
  const result = audit(project(t, {}));
  assert.equal(result.ok, false);
  assert.equal('overall' in result, false);
  assert.equal(result.checks.find((c) => c.id === 'instructions').status, 'FAIL');
});

test('legacy files, references, and gates each fail', (t) => {
  const s = status(project(t, {
    'AGENTS.md': `${good}\nRead progress.md first.\n`,
    'check.sh': 'true\n',
    'feature_list.json': '{}',
    '.github/workflows/ci.yml': 'run: wc -l progress.md\n',
  }));
  assert.equal(s['legacy-state-files'], 'FAIL');
  assert.equal(s['legacy-instruction-refs'], 'FAIL');
  assert.equal(s['state-file-gates'], 'FAIL');
});

test('archived history and ignored local scratch are allowed', (t) => {
  const root = project(t, {
    'AGENTS.md': `${good}\nHistory: archive/legacy-harness/progress.md\n`,
    'check.sh': 'true\n',
    '.gitignore': 'session-handoff.md\n',
    'session-handoff.md': 'old\n',
    'archive/legacy-harness/progress.md': 'old\n',
  });
  assert.equal(audit(root).ok, true);
});

test('missing commands and placeholders fail', (t) => {
  assert.equal(status(project(t, { 'AGENTS.md': good }))['verification-commands'], 'FAIL');
  const npm = good.replace('./check.sh  # fast', 'npm run lint');
  assert.equal(status(project(t, { 'AGENTS.md': npm, 'package.json': '{"scripts":{}}' }))['verification-commands'], 'FAIL');
});

test('parameterized usage is not a placeholder', (t) => {
  const usage = good.replace('./check.sh  # fast', './check.sh --scope <name>');
  assert.equal(audit(project(t, { 'AGENTS.md': usage, 'check.sh': 'true\n' })).ok, true);
});

test('the unfilled template does not pass', (t) => {
  const template = readFileSync(path.join(here, '../templates/agents.md'), 'utf8');
  const s = status(project(t, { 'AGENTS.md': template }));
  assert.equal(s['verification-commands'], 'FAIL');
  assert.equal(s['legacy-instruction-refs'], 'PASS');
});

test('symlinked and imported instructions are counted once', (t) => {
  const root = project(t, { 'AGENTS.md': good, 'check.sh': 'true\n' });
  symlinkSync('AGENTS.md', path.join(root, 'CLAUDE.md'));
  assert.equal(audit(root).startupContext.files, 1);
  const imported = project(t, { 'CLAUDE.md': '@AGENTS.md\n', 'AGENTS.md': good, 'check.sh': 'true\n' });
  assert.equal(audit(imported).startupContext.files, 2);
  assert.equal(audit(imported).ok, true);
});

test('CLI exit codes', (t) => {
  const cli = (...args) => spawnSync(process.execPath, [path.join(here, 'audit-harness.mjs'), ...args]).status;
  assert.equal(cli('--target', project(t, { 'AGENTS.md': good, 'check.sh': 'true\n' })), 0);
  assert.equal(cli('--target', project(t, {})), 1);
  assert.equal(cli('--target', '/nonexistent'), 2);
  assert.equal(cli('--force'), 2);
});
