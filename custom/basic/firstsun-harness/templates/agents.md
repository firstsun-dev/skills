# {{PROJECT_NAME}}

<One or two sentences: what this is and what runs in production.>

<!-- Delete sections and comments that do not apply. Keep this file short. -->

## Start

Read this file, then only what the task needs. From an issue: the issue, linked PRs, and any named
OpenSpec change. Resuming: the Draft PR, its commits, checks, and review comments.

## Task tracking

- Tasks and status: <GitHub Issues + project board>. Small self-contained changes need only a PR.
- Progress and handoff: branch, commits, Draft PR. Unfinished work goes to an issue.
- Durable decisions: <docs/decisions/>. Specifications for complex changes: <openspec/>.

## Scope

- One task per branch (use a worktree when sessions run in parallel).
- Check open PRs for overlap. No unrelated refactoring; file an issue instead.

## Safety

- Never print or commit secrets.
- <Production resources, what needs approval, preflight and rollback.>

## Verification

```bash
<existing command, e.g. npm test>
```

<Which changes need which additional checks.>

## Definition of Done

Required checks `PASS`; anything `SKIP` or `NOT RUN` is stated with a reason. Evidence is in the PR.
Remaining work is tracked in issues.
