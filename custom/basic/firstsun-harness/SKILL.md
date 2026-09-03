---
name: firstsun-harness
description: >-
  Build, audit, and improve harnesses that make AI coding agents reliable: AGENTS.md/CLAUDE.md
  instruction files, feature/state tracking, verification gates, scope boundaries, session
  lifecycle, memory persistence, context budgets, tool-permission safety, and multi-agent
  coordination. Use this whenever a coding agent is unreliable across sessions — forgets context,
  drifts out of scope, claims "done" before tests pass, or starts each session inconsistently —
  or when creating or assessing AGENTS.md, CLAUDE.md, feature_list.json, init.sh, progress.md, or
  or session state files. Reach for it even if the user never says the word "harness."
license: MIT
metadata:
  origin: firstsun-dev/skills
---

> Forked from [walkinglabs/learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering) on 2026-07-04 and now maintained independently in this repo. It no longer tracks upstream changes.

# firstsun-harness

Use this skill to make a repository easier for coding agents to start, stay in scope, verify work, and resume across sessions. Keep the harness small enough that agents actually follow it.

Not for model selection, prompt tuning in isolation, chat UI design, or general app architecture.

## Core Model

Every useful coding-agent harness has five subsystems:

| Subsystem | Minimal artifact | Purpose |
|---|---|---|
| Instructions | `AGENTS.md` or `CLAUDE.md` | Startup path, working rules, definition of done |
| State | `feature_list.json`, `progress.md`, `archive/YYYY-MM.md` | Current feature, status, evidence, next step; finished work archived monthly |
| Verification | `init.sh` or documented commands | Tests/checks the agent must run before claiming done |
| Scope | Feature dependencies and done criteria | Prevents overreach and half-finished work |
| Lifecycle | end-of-session routine; "where I stopped" in commits/PR, durable findings in the architecture doc | Makes the next session restartable without a shared scratch file that conflicts across worktrees |

## First Move

1. Inspect what already exists: instruction files, feature/state files, verification commands, docs, package manifests.
2. Ask only for missing context that cannot be inferred safely: target agent, desired file name, tolerance for structure, and whether overwriting is allowed.
3. Prefer a minimal harness first. Add memory, tool safety, multi-agent, or benchmark details only when the user's problem calls for them.

## Common Tasks

### Create a harness

Use the bundled script when working on a local repository (paths are relative to this skill's directory — in this repo, `custom/basic/firstsun-harness/`):

```bash
node scripts/create-harness.mjs --target /path/to/project
```

Options:

- `--agent-file CLAUDE.md` for Claude-oriented projects.
- `--package-manager npm|pnpm|yarn|bun` when detection is wrong.
- `--commands "cmd one,cmd two"` for custom verification.
- `--force` only after confirming overwrites are acceptable.

Then explain what was created and how the user should replace placeholder feature entries.

### Upgrade an existing harness

A harness scaffolded by an earlier version of this skill does not receive later
template improvements on its own, and an audit only reports the symptom once the
harness has already degraded. Bring it up to the current templates with:

```bash
node scripts/create-harness.mjs --target /path/to/project --upgrade
```

It creates whatever artifacts are missing, patches an existing `init.sh` with the
state-hygiene gate if it predates it, and leaves every file the project has edited
(`progress.md`, `feature_list.json`, the agent instruction file) untouched. It is
idempotent, and rejects `--force`, which would overwrite exactly those files.

Re-run the audit afterwards to confirm the gate registers.

### Audit an existing harness

Run:

```bash
node scripts/validate-harness.mjs --target /path/to/project
```

Report the five subsystem scores, the lowest-scoring area, and the first 2-3 changes that would improve reliability. Distinguish the two hygiene checks: "State files stay archived and concise" fails once a state file has already grown, while "State hygiene is enforced by the verification entrypoint" fails whenever nothing runs the size rule at startup — the second predicts the first, so fix it even while the files still look fine. Treat the lowest score as a candidate bottleneck; confirm with failures, logs, or task outcomes before claiming causality.

### Produce a report

Use when the user wants a shareable assessment:

```bash
node scripts/render-assessment-html.mjs --target /path/to/project
node scripts/run-benchmark.mjs --target /path/to/project --html /path/to/report.html
```

Be clear that this is a structural benchmark. The benchmark first runs a self-check — it scaffolds a throwaway harness and validates it, proving the bundled scripts work end-to-end — then scores the target and eval coverage. Real effectiveness still needs before/after agent sessions on representative tasks.

## When to Read References

Load only the reference needed for the user's problem:

- Memory across sessions: [Memory Persistence](references/memory-persistence-pattern.md)
- Reusable workflows as skills: [Skill Runtime](references/skill-runtime-pattern.md)
- Permissions, tools, concurrency: [Tool Registry & Safety](references/tool-registry-pattern.md)
- Context budget and progressive disclosure: [Context Engineering](references/context-engineering-pattern.md)
- Delegation and parallel agents: [Multi-Agent Coordination](references/multi-agent-pattern.md)
- Hooks, startup, long-running work: [Lifecycle & Bootstrap](references/lifecycle-bootstrap-pattern.md)
- Non-obvious failure modes: [Gotchas](references/gotchas.md)

## Design Rules

- Keep the root instruction file short: routing and invariants, not a full manual.
- Put project facts in project docs, not in the skill.
- Make verification commands explicit and runnable.
- Require evidence before marking a feature done.
- Use one active feature unless the harness has explicit multi-agent ownership boundaries.
- Prefer append/update state files over relying on chat history.
- Never hide destructive behavior in scripts; overwrites require explicit user approval.
- A rule that no gate enforces will rot. When you add one to an instruction file, add the check that fails on it.

## Deliverable Checklist

For a usable minimal harness, leave the target project with:

- [ ] `AGENTS.md` or `CLAUDE.md`
- [ ] `feature_list.json`
- [ ] `progress.md` (open work only, finished items archived)
- [ ] `archive/YYYY-MM.md` for the current month
- [ ] `init.sh`
- [ ] Documented verification evidence or next action

If you cannot create files, provide exact file contents and commands instead.
