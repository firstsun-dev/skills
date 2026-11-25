# Migrating from the legacy harness

Legacy artifacts: `feature_list.json`, `progress.md`, `session-handoff.md`, monthly progress
archives, their size gates, and instructions that require reading or updating them.

Do not delete first. Do not mass-migrate several repositories before one pilot is reviewed.

## 1. Inventory

Instruction files; the state files on the default branch **and** uncommitted or ignored copies in
local checkouts; decision docs; OpenSpec changes; open issues and PRs; verification scripts and CI;
every script, test, or doc that references a state file:

```bash
git grep -nE 'feature_list|progress\.md|session-handoff' -- . ':!archive'
```

Check open branches that edit the state files; they will conflict with the removal.

## 2. Classify every entry

| Class | Destination |
|---|---|
| Completed work | Git history; the one-time archive |
| Already in an issue or PR | Nothing, or a comment adding missing facts |
| Untracked actionable work | Reconcile with open issues, then create few, grouped issues |
| Pending operator action | Issue, with owner action and any deadline |
| Temporary operational restriction | Instruction entrypoint, with lift condition and issue link |
| Permanent invariant | Instruction entrypoint or area doc |
| Durable decision | Decision doc / ADR |
| Obsolete or superseded | Archive only |

A status of "in progress" does not prove work remains, and "done" does not prove it was verified.
Check the evidence. Work specified in OpenSpec keeps its checklist there; the issue links to it
without copying it. Never copy secret values anywhere. In public repositories, do not publish
security details that were only ever private.

## 3. Cut over, in one change

1. Move the state files once to `archive/legacy-harness/`. Leave existing archives as they are.
2. Rewrite the startup, scope, end-of-session, and Definition of Done instructions
   ([template](../templates/agents.md)).
3. Remove only the state-file gates. Keep every build, test, lint, plan, syntax, integration, E2E,
   approval, idempotency, and rollback check.
4. Update scripts, tests, CI path filters, and active docs that referenced the files.
5. Keep ignored scratch files ignored so old local copies are not committed by accident.

## 4. Prove it

- Every classified entry has a destination (record the mapping in the PR description).
- The repository's verification passes; compare the stage list before and after, so that only
  state-file stages disappeared.
- `node scripts/audit-harness.mjs --target <repo>` reports no `FAIL`.
