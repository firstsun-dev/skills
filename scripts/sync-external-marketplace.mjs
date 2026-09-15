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
