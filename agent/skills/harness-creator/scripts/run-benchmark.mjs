#!/usr/bin/env node
import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import {
  formatScoreReport,
  htmlReport,
  loadHarnessFiles,
  parseArgs,
  readJson,
  scoreHarness,
  writeText
} from './lib/harness-utils.mjs';

const execFileAsync = promisify(execFile);

const args = parseArgs(process.argv.slice(2));
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(scriptDir, '..');

if (args.help) {
  console.log(`Usage: node scripts/run-benchmark.mjs [--target DIR] [--output FILE] [--html FILE] [--no-self-check]

Runs a lightweight harness benchmark:
  1. Self-check: scaffold a throwaway harness and confirm it validates (proves the scripts work).
  2. Scores the current target harness.
  3. Checks eval coverage in evals/evals.json.
  4. Produces a JSON report and optional HTML report.

This is a structural benchmark, not an LLM judge. Use it before/after real agent sessions.`);
  process.exit(0);
}

const target = path.resolve(args.target || args._[0] || process.cwd());
const output = path.resolve(args.output || path.join(target, 'harness-benchmark.json'));
const evalPath = path.resolve(args.evals || path.join(skillRoot, 'evals', 'evals.json'));

const harnessResult = scoreHarness(await loadHarnessFiles(target));
const evals = await readJson(evalPath);
const evalResult = scoreEvals(evals);
const selfCheck = args.noSelfCheck ? { skipped: true } : await runSelfCheck();
const report = {
  generatedAt: new Date().toISOString(),
  target,
  selfCheck,
  harness: harnessResult,
  evals: evalResult,
  recommendation: recommend(harnessResult, evalResult)
};

await writeText(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Benchmark report written to ${output}`);
console.log('');
if (!selfCheck.skipped) {
  console.log(`Self-check: ${selfCheck.pass ? 'PASS' : 'FAIL'} — scaffolded harness scored ${selfCheck.score}/100`);
  if (!selfCheck.pass && selfCheck.error) console.log(`  ${selfCheck.error}`);
}
console.log(formatScoreReport(harnessResult, target));
console.log(`Eval coverage: ${evalResult.score}/100 (${evalResult.passed}/${evalResult.total})`);
console.log(`Recommendation: ${report.recommendation}`);

if (args.html) {
  const htmlPath = path.resolve(args.html);
  await writeText(htmlPath, renderBenchmarkHtml(report));
  console.log(`HTML benchmark report written to ${htmlPath}`);
}

if (
  harnessResult.overall < Number(args.minScore || 70) ||
  evalResult.score < Number(args.minEvalScore || 80) ||
  selfCheck.pass === false
) {
  process.exitCode = 1;
}

// Prove the bundled scripts actually work end-to-end: scaffold a harness into a throwaway
// directory, then score it. A structural eval-coverage check can't catch a broken
// create-harness.mjs — this can. Failure here means the skill ships broken, not just thin.
async function runSelfCheck() {
  let dir;
  try {
    dir = await mkdtemp(path.join(os.tmpdir(), 'harness-selfcheck-'));
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: 'selfcheck', scripts: { check: 'tsc', test: 'vitest run', build: 'vite build' } })
    );
    await execFileAsync('node', [path.join(scriptDir, 'create-harness.mjs'), '--target', dir]);
    const scored = scoreHarness(await loadHarnessFiles(dir));
    return {
      pass: scored.overall >= Number(args.minSelfCheckScore || 90),
      score: scored.overall,
      bottleneck: scored.bottleneck
    };
  } catch (error) {
    return { pass: false, score: 0, error: error.message };
  } finally {
    if (dir) await rm(dir, { recursive: true, force: true });
  }
}

function scoreEvals(evalsJson) {
  const cases = Array.isArray(evalsJson.evals) ? evalsJson.evals : [];
  const checks = [];
  checks.push({ pass: cases.length >= 10, message: 'At least 10 eval cases' });
  checks.push({ pass: cases.some((item) => /minimal|creation/i.test(item.name)), message: 'Covers minimal harness creation' });
  checks.push({ pass: cases.some((item) => /session|continuity/i.test(item.name)), message: 'Covers session continuity' });
  checks.push({ pass: cases.some((item) => /assessment|score/i.test(item.name)), message: 'Covers harness assessment' });
  checks.push({ pass: cases.some((item) => /verification/i.test(item.name)), message: 'Covers verification workflow' });
  checks.push({ pass: cases.some((item) => /memory/i.test(item.name)), message: 'Covers memory taxonomy' });
  checks.push({ pass: cases.some((item) => /tool|permission|safety/i.test(item.name)), message: 'Covers tool safety' });
  checks.push({ pass: cases.some((item) => /multi-agent|delegation|coordination/i.test(item.name)), message: 'Covers multi-agent coordination' });
  checks.push({ pass: cases.every((item) => item.prompt && item.expected_output && Array.isArray(item.expectations)), message: 'Each eval has prompt, expected output, expectations' });
  checks.push({ pass: cases.every((item) => item.expectations?.length >= 3), message: 'Each eval has at least three expectation checks' });

  const passed = checks.filter((check) => check.pass).length;
  return {
    score: Math.round((passed / checks.length) * 100),
    passed,
    total: checks.length,
    cases: cases.length,
    checks
  };
}

function recommend(harnessResult, evalResult) {
  if (harnessResult.overall >= 85 && evalResult.score >= 90) {
    return 'Ready for realistic before/after agent-session benchmarking.';
  }
  if (harnessResult.overall < 70) {
    return `Improve the ${harnessResult.bottleneck} subsystem before benchmarking agent behavior.`;
  }
  if (evalResult.score < 80) {
    return 'Expand eval coverage before treating benchmark results as representative.';
  }
  return 'Usable, with some gaps worth tightening after first real sessions.';
}

function renderBenchmarkHtml(report) {
  const selfCheckSection = report.selfCheck?.skipped
    ? ''
    : `<section>
      <h2>Script Self-Check <span>${report.selfCheck.pass ? 'PASS' : 'FAIL'}</span></h2>
      <p>Scaffolded a throwaway harness and scored it ${report.selfCheck.score}/100 — confirms the bundled scripts run end-to-end.${report.selfCheck.error ? ` Error: ${escapeHtml(report.selfCheck.error)}` : ''}</p>
    </section>`;
  const evalHtml = htmlReport(report.harness, `Harness Benchmark: ${path.basename(report.target)}`)
    .replace('</main>', `${selfCheckSection}<section>
      <h2>Eval Coverage <span>${report.evals.score}/100</span></h2>
      <p>${report.evals.passed}/${report.evals.total} benchmark checks passed across ${report.evals.cases} eval cases.</p>
      <ul>${report.evals.checks.map((check) => `<li class="${check.pass ? 'pass' : 'fail'}">${check.pass ? 'PASS' : 'FAIL'} ${escapeHtml(check.message)}</li>`).join('')}</ul>
    </section>
    <section>
      <h2>Recommendation</h2>
      <p>${escapeHtml(report.recommendation)}</p>
    </section>
  </main>`);
  return evalHtml;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
