---
name: firstsun-harness
description: >-
  Engineering guardrails for coding agents: concise AGENTS.md/CLAUDE.md instructions,
  reproducible verification and evidence-based Definition of Done, issue/branch/worktree
  scope isolation, production safety boundaries, and durable knowledge in the right place.
  Use when setting up or auditing a repository for agents, when an agent drifts out of scope,
  claims "done" without proof, or resumes work inconsistently, and when migrating a repo off
  legacy harness state files (feature_list.json, progress.md, session-handoff.md). Reach for
  it even if the user never says "harness."
license: MIT
metadata:
  origin: firstsun-dev/skills
  version: "2.0.0"
---

> Originally forked from [walkinglabs/learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering) (2026-07-04); maintained independently.

# firstsun-harness

Guardrails, not a state manager. The repository already has places for tasks, progress, and history;
the harness points agents at them and makes verification and safety explicit.

Not for task or board management (`firstsun-pm`), project bootstrap (`firstsun-project-init`),
prompt tuning, or app architecture.

## One source of truth per concern

| Concern | Canonical source |
|---|---|
| Tasks and backlog | GitHub Issues |
| Priority and workflow status | GitHub Projects |
| Implementation progress and handoff | Branch, commits, Draft PR |
| Agent instructions | `AGENTS.md` / `CLAUDE.md` |
| Architecture and durable knowledge | Repository docs / ADRs |
| Complex changes and specifications | OpenSpec |
| Verification evidence | Local test results, CI, PR |
| History | Git log and merged PRs |
| Operational safety | Repository guardrails and executable checks |

Never add a tracking file, database, or sync step that copies one of these into another.
If a repository uses a different tool for a concern, keep it; the rule is one source, not this list.

## Minimal baseline

1. A short instruction entrypoint ([template](templates/agents.md)). If both `AGENTS.md` and
   `CLAUDE.md` are needed, make one a symlink to (or `@import` of) the other.
2. The project's existing build and verification commands. Add a wrapper script only when no
   standard command already covers them.
3. The safety constraints that actually apply to this project.
4. Existing documentation, linked on demand.

Do not create empty placeholder documents.

## Set up or tighten a repository

1. Read the instruction files, manifests, CI workflows, and test entrypoints that already exist.
2. Reuse their commands and conventions. Ask only what cannot be inferred safely.
3. Write or trim the entrypoint. Keep routing and invariants; move manuals to docs.
4. Run the verification commands you documented. Documented but never executed is `NOT RUN`.
5. Audit (below).

Do not overwrite an instruction file the project has edited; propose the change as a diff.

## Working protocol (what the instructions should lead an agent to do)

**Start.** Read the entrypoint, then only what the task needs. From an issue: read the issue, its
linked PRs, and any OpenSpec change it names. Resuming: read the Draft PR description, its commits,
its checks, and review comments before editing. No full-repository or history scan by default; cap
list and MCP results (`--limit`, field selection, line ranges).

**Isolate.** One task, one branch, one worktree when sessions run concurrently. Before editing, check
open PRs and worktrees for overlap on the same files. No unrelated refactoring; unrelated findings
become issues. Several tasks may be in flight at once; nothing requires a global "active feature".

**Verify.** Report each check as one of:

| Result | Meaning |
|---|---|
| `PASS` | Ran and succeeded |
| `FAIL` | Ran and failed, or a required prerequisite is missing |
| `SKIP` | Deliberately not applicable, with the reason |
| `NOT RUN` | Should or could apply, but was not executed, with the reason |

Only `PASS` is evidence. A narrow tier passing does not imply a broader one. Never call a failure
pre-existing without reproducing it on the base branch and saying so. Details:
[verification and safety](references/verification-and-safety.md).

**Hand off.** Push the branch and keep the Draft PR description current: what changed, verification
results, what remains, risks. Unfinished actionable work goes to an issue. Durable decisions and traps
go to docs or an ADR. No end-of-session state file.

**Done** means: behavior implemented, required checks `PASS` (others disclosed), evidence in the PR,
remaining work tracked, and no safety boundary crossed.

Small self-contained changes need a branch and a PR, not an invented issue.

## Safety boundaries

Production resources, credentials, databases, and infrastructure state need explicit rules in the
entrypoint: what is read-only, what needs approval, which preflight a destructive operation requires,
and how to roll back. Existing approval boundaries are never loosened by a harness change. Prefer an
executable guard over prose. See [verification and safety](references/verification-and-safety.md).

## Audit

```bash
node scripts/audit-harness.mjs --target /path/to/project   # --json for machine output
```

Paths are relative to this skill's directory. It statically checks the instruction entrypoint,
documented verification commands, safety constraints, and leftover legacy state coupling, and reports
startup context size. It does not run the project's tests and gives no score. A clean audit shows the
structure is in place, not that agents behave better; for that, replay the scenarios in
[evals](evals/evals.json) and compare real sessions.

## Migrate from the legacy harness

If the audit reports legacy state files or references, follow
[migration](references/migration.md). Classify and reconcile their contents **before** removing
anything, and never recreate them afterwards.
