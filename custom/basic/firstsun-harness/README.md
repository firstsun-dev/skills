# firstsun-harness

A compact skill for building and auditing harnesses around AI coding agents.

It helps a repository provide five things agents need: instructions, state, verification, scope boundaries, and lifecycle handoff.

> Forked from [walkinglabs/learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering) on 2026-07-04 and maintained independently in this repo (`custom/basic/firstsun-harness/`). It no longer tracks upstream.

## Install

```bash
npx skills add firstsun-dev/skills --skill firstsun-harness
```

Or copy `custom/basic/firstsun-harness/` into your skill path.

## Use

Paths are relative to this skill's directory:

```bash
node scripts/create-harness.mjs --target /path/to/project
node scripts/validate-harness.mjs --target /path/to/project
node scripts/run-benchmark.mjs --target /path/to/project --html /path/to/report.html
```

The scripts use only Node.js built-in modules. They can be run after copying the skill directory into another repository.

## What It Creates

- `AGENTS.md` or `CLAUDE.md`
- `feature_list.json`
- `progress.md` (open work only)
- `archive/YYYY-MM.md` (completed work, one file per calendar month)
- `init.sh`

`create-harness.mjs` detects common project types and package managers. It supports Node/npm/pnpm/yarn/bun, Python, Go, Rust, Maven, Gradle, and .NET at a basic verification-command level.

## What It Checks

`validate-harness.mjs` scores the five harness subsystems:

1. Instructions
2. State
3. Verification
4. Scope
5. Lifecycle

The score is structural. It tells you whether the harness is present and coherent; it does not replace real before/after agent-session testing.

## Status

- [x] Minimal harness scaffolding
- [x] Five-subsystem validation
- [x] HTML assessment report
- [x] Structural benchmark report
- [x] 10 eval cases
- [x] Generic verification detection for common stacks
- [ ] Optional real before/after agent-session replay

## Files

```text
firstsun-harness/
├── SKILL.md
├── agents/openai.yaml
├── scripts/
│   ├── create-harness.mjs
│   ├── validate-harness.mjs
│   ├── render-assessment-html.mjs
│   ├── run-benchmark.mjs
│   └── lib/harness-utils.mjs
├── templates/
│   ├── agents.md
│   ├── archive/YYYY-MM.md
│   ├── feature-list.json
│   ├── feature-list.schema.json
│   ├── init.sh
│   └── progress.md
├── references/
└── evals/evals.json
```

## Boundaries

This skill is for harness engineering, not model selection, prompt tuning alone, or app architecture. Keep project-specific facts in the target repository.
