#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const bundles = {
  'external-agent-workflows': ['external/ai-agents', 'external/basic', 'external/think'],
  'external-developer-workflows': [
    'external/develop/code-quality',
    'external/develop/devops',
    'external/develop/security',
    'external/develop/internationalization-i18n',
    'external/develop/windmill-rust-backend',
  ],
  'external-frontend-design': ['external/develop/frontend'],
  'external-video-design': ['external/video-design'],
  'external-career-health': ['external/career', 'external/health', 'external/lifestyle'],
};

function skillDirectories(path) {
  if (existsSync(join(path, 'SKILL.md'))) return [path];
  return readdirSync(path, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => skillDirectories(join(path, entry.name)));
}

for (const [plugin, sourceRoots] of Object.entries(bundles)) {
  const target = join(root, 'plugins', plugin, 'skills');
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });

  for (const sourceRoot of sourceRoots) {
    for (const source of skillDirectories(join(root, sourceRoot))) {
      cpSync(source, join(target, basename(source)), { recursive: true });
    }
  }
}
