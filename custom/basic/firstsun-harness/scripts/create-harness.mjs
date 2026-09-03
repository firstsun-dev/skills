#!/usr/bin/env node
import { chmod, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  copyTemplate,
  detectPackageManager,
  detectProject,
  exists,
  initScriptFromCommands,
  insertHygieneGate,
  parseArgs,
  verificationCommands,
  writeText
} from './lib/harness-utils.mjs';

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  console.log(`Usage: node scripts/create-harness.mjs [--target DIR] [--agent-file AGENTS.md|CLAUDE.md] [--package-manager npm|pnpm|yarn|bun] [--force|--upgrade]

Creates a minimal production harness:
  AGENTS.md or CLAUDE.md
  feature_list.json
  progress.md
  archive/YYYY-MM.md (current month)
  init.sh

Existing files are skipped unless --force is set.

--upgrade brings a harness scaffolded by an older version of this skill up to the
current templates. It creates whatever artifacts are missing and patches an
existing init.sh with the state-hygiene gate if it predates it. It never rewrites
content you have edited — progress.md, feature_list.json and the agent instruction
file are left exactly as they are. Idempotent: safe to re-run. Cannot be combined
with --force.`);
  process.exit(0);
}

const target = path.resolve(args.target || args._[0] || process.cwd());
const agentFile = args.agentFile || 'AGENTS.md';
const force = Boolean(args.force);
const upgrade = Boolean(args.upgrade);

if (force && upgrade) {
  console.error('--force and --upgrade are mutually exclusive: --force overwrites edited state files, --upgrade exists precisely to avoid that.');
  process.exit(1);
}
const project = await detectProject(target);
project.packageManager = detectPackageManager(target, args.packageManager);
const commands = args.commands
  ? String(args.commands).split(',').map((command) => command.trim()).filter(Boolean)
  : verificationCommands(project, args.packageManager);

await mkdir(target, { recursive: true });

const replacements = {
  AGENT_FILE_NAME: agentFile,
  PROJECT_PURPOSE: project.stack === 'generic'
    ? 'Project harness for reliable agent-assisted development.'
    : `Project harness for reliable agent-assisted development in a ${project.stack} codebase.`,
  VERIFICATION_COMMANDS: commands.map((command) => `- \`${command}\``).join('\n'),
  PRIMARY_VERIFICATION_COMMAND: './init.sh'
};

const results = [];
results.push(await copyTemplate('agents.md', path.join(target, agentFile), replacements, { force }));
results.push(await copyTemplate('feature-list.json', path.join(target, 'feature_list.json'), {}, { force }));
results.push(await copyTemplate('progress.md', path.join(target, 'progress.md'), {}, { force }));

// Local time, not UTC — the archive month should match the user's calendar.
const now = new Date();
const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
results.push(await copyTemplate(
  'archive/YYYY-MM.md',
  path.join(target, 'archive', `${yearMonth}.md`),
  { 'YYYY-MM': yearMonth },
  { force }
));

const initPath = path.join(target, 'init.sh');
if (force || !await exists(initPath)) {
  await writeText(initPath, initScriptFromCommands(commands));
  await chmod(initPath, 0o755);
  results.push({ path: initPath, status: 'written' });
} else if (upgrade) {
  // Patch, don't regenerate: the existing script's verification commands are the
  // project's own and are usually more accurate than anything detection produces.
  const existingInit = await readFile(initPath, 'utf8');
  const patched = insertHygieneGate(existingInit);
  if (patched === existingInit) {
    results.push({ path: initPath, status: 'skipped', reason: 'hygiene gate already present' });
  } else {
    await writeText(initPath, patched);
    await chmod(initPath, 0o755);
    results.push({ path: initPath, status: 'updated', reason: 'added state-hygiene gate' });
  }
} else {
  results.push({ path: initPath, status: 'skipped', reason: 'exists' });
}

console.log(`${upgrade ? 'Upgraded' : 'Created'} harness for ${target}`);
console.log(`Detected stack: ${project.stack}`);
console.log(`Verification commands:`);
for (const command of commands) {
  console.log(`  - ${command}`);
}
console.log('');
for (const result of results) {
  console.log(`${result.status.toUpperCase()} ${path.relative(target, result.path)}${result.reason ? ` (${result.reason})` : ''}`);
}
