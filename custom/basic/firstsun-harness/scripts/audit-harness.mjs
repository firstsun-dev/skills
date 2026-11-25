#!/usr/bin/env node
// Static audit of agent guardrails. Reports PASS / FAIL / SKIP / NOT RUN per capability; no score.
// Reads files only: it never executes the target project's commands.
import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ENTRYPOINTS = ['AGENTS.md', 'CLAUDE.md'];
const OTHER_INSTRUCTIONS = ['GEMINI.md', '.github/copilot-instructions.md'];
const LEGACY_FILES = ['feature_list.json', 'progress.md', 'session-handoff.md'];
// A path under archive/ is history, not an active dependency.
const LEGACY_REF = /(?<!archive\/[\w./-]*)\b(feature_list\.json|progress\.md|session-handoff(\.md)?)\b/;
const GATE_FILES = ['init.sh', 'Makefile', 'package.json'];
const GATE_DIRS = ['scripts', 'tools', '.github/workflows'];
const GATE_EXT = /\.(sh|bash|mjs|cjs|js|ts|py|ya?ml)$/;

const isFile = (p) => existsSync(p) && statSync(p).isFile();
const read = (p) => readFileSync(p, 'utf8');

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'archive', '__pycache__'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile()) out.push(p);
  }
  return out;
}

// Entrypoints plus files they @import, de-duplicated through symlinks.
function loadInstructions(root) {
  const seen = new Map();
  const add = (file) => {
    if (!isFile(file)) return;
    const real = realpathSync(file);
    if (seen.has(real)) return;
    const text = read(file);
    seen.set(real, { name: path.relative(root, file), text });
    for (const [, ref] of text.matchAll(/^@(\S+\.md)\s*$/gm)) add(path.resolve(path.dirname(file), ref));
  };
  ENTRYPOINTS.forEach((f) => add(path.join(root, f)));
  const startup = [...seen.values()];
  OTHER_INSTRUCTIONS.forEach((f) => add(path.join(root, f)));
  return { startup, all: [...seen.values()] };
}

function section(text, heading) {
  const out = [];
  let level = 0;
  let fenced = false;
  for (const line of text.split('\n')) {
    if (line.startsWith('```')) fenced = !fenced;
    const h = !fenced && /^(#{1,6})\s+(.*)/.exec(line);
    if (h) {
      if (level && h[1].length <= level) level = 0;
      if (!level && heading.test(h[2])) level = h[1].length;
    }
    if (level) out.push(line);
  }
  return out.join('\n');
}

function documentedCommands(docs) {
  const commands = [];
  for (const { text } of docs) {
    const body = section(text, /verif|test|build|check|驗證|測試/i);
    for (const [, block] of body.matchAll(/```(?:bash|sh|shell)?\n([\s\S]*?)```/g)) {
      for (const raw of block.split('\n')) {
        const cmd = raw.replace(/\s+#.*$/, '').trim();
        if (cmd && !cmd.startsWith('#')) commands.push(cmd);
      }
    }
  }
  return [...new Set(commands)];
}

// Returns a problem string when a command points at something that does not exist.
function unresolved(root, cmd) {
  // An argument like `--scope <name>` is usage; a command that is itself a placeholder is unfinished.
  if (cmd.startsWith('<')) return `placeholder left in "${cmd}"`;
  const first = cmd.split(/\s+/)[0];
  if (first.startsWith('./') && !existsSync(path.join(root, first))) return `${first} does not exist`;
  const script = /^(?:npm|pnpm|bun|yarn)\s+run\s+([\w:.-]+)/.exec(cmd)?.[1] ?? (/^(?:npm|pnpm|yarn)\s+test\b/.test(cmd) ? 'test' : null);
  const pkg = path.join(root, 'package.json');
  // Workspace filters and subdirectory packages are not resolved here.
  if (script && isFile(pkg) && !JSON.parse(read(pkg)).scripts?.[script]) return `package.json has no "${script}" script`;
  return null;
}

export function audit(root) {
  const { startup, all } = loadInstructions(root);
  const checks = [];
  const add = (id, status, detail) => checks.push({ id, status, detail });

  const bytes = startup.reduce((n, d) => n + Buffer.byteLength(d.text), 0);
  const lines = startup.reduce((n, d) => n + d.text.split('\n').length - 1, 0);
  const hasEntry = startup.some((d) => d.text.trim());
  add('instructions', hasEntry ? 'PASS' : 'FAIL',
    hasEntry ? `${startup.map((d) => d.name).join(', ')}: ${lines} lines, ${bytes} bytes` : `no non-empty ${ENTRYPOINTS.join(' or ')}`);

  const commands = documentedCommands(startup);
  const problems = commands.map((c) => unresolved(root, c)).filter(Boolean);
  add('verification-commands', commands.length && !problems.length ? 'PASS' : 'FAIL',
    !commands.length ? 'no fenced shell command under a verification/test heading' : problems.join('; ') || `${commands.length} documented`);
  add('verification-execution', 'NOT RUN', 'static audit; run the documented commands and record results in the PR');

  const safety = startup.some((d) => /production|secret|credential|destructive|approval|正式環境|機密|憑證/i.test(d.text));
  add('safety-constraints', safety ? 'PASS' : 'FAIL',
    safety ? 'mentioned; adequacy needs human review' : 'no production, secret, or approval constraint found');

  const left = LEGACY_FILES.filter((f) => isFile(path.join(root, f)) && !isIgnored(root, f));
  add('legacy-state-files', left.length ? 'FAIL' : 'PASS', left.length ? `migrate first: ${left.join(', ')}` : 'none');

  const hits = (docs) => docs.flatMap(({ name, text }) =>
    text.split('\n').map((l, i) => (LEGACY_REF.test(l) ? `${name}:${i + 1}` : null)).filter(Boolean));
  const refs = hits(all);
  add('legacy-instruction-refs', !all.length ? 'SKIP' : refs.length ? 'FAIL' : 'PASS',
    !all.length ? 'no instruction files' : refs.slice(0, 10).join(', ') || 'none');

  const gates = [
    ...GATE_FILES.map((f) => path.join(root, f)).filter(isFile),
    ...GATE_DIRS.flatMap((d) => walk(path.join(root, d)).filter((f) => GATE_EXT.test(f))),
  ];
  const gateRefs = hits(gates.map((f) => ({ name: path.relative(root, f), text: read(f) })));
  add('state-file-gates', !gates.length ? 'SKIP' : gateRefs.length ? 'FAIL' : 'PASS',
    !gates.length ? 'no verification scripts or workflows found' : gateRefs.slice(0, 10).join(', ') || `${gates.length} files scanned`);

  return { target: root, startupContext: { files: startup.length, lines, bytes }, checks, ok: !checks.some((c) => c.status === 'FAIL') };
}

// Only exact-name root entries in .gitignore: legacy scratch files that stay local.
function isIgnored(root, file) {
  const ignore = path.join(root, '.gitignore');
  return isFile(ignore) && read(ignore).split('\n').some((l) => l.trim().replace(/^\//, '') === file);
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('Usage: node scripts/audit-harness.mjs [--target DIR] [--json]\nExit 0: no FAIL. Exit 1: at least one FAIL. Exit 2: usage error.');
    process.exit(0);
  }
  const t = args.indexOf('--target');
  const unknown = args.filter((a, i) => !['--json', '--target'].includes(a) && !(t >= 0 && i === t + 1));
  const target = path.resolve(t >= 0 ? args[t + 1] ?? '' : '.');
  if (unknown.length || (t >= 0 && !args[t + 1]) || !existsSync(target) || !statSync(target).isDirectory()) {
    console.error('usage error: see --help');
    process.exit(2);
  }
  const result = audit(target);
  if (args.includes('--json')) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(`Harness audit: ${result.target}`);
    for (const c of result.checks) console.log(`${c.status.padEnd(8)} ${c.id.padEnd(24)} ${c.detail}`);
  }
  process.exitCode = result.ok ? 0 : 1;
}
