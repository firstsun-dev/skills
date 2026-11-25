# Verification and safety

## Verification

- Document the exact command, working directory, and prerequisites. CI should call the same
  entrypoint developers run.
- State which changes require which tier (for example: fast checks always; integration for the
  areas touched).
- A missing tool, image, or credential for a required check is `FAIL` or `NOT RUN`, never `PASS`.
- An exit code hidden by a pipe, `|| true`, or a truncated log is not evidence. Check the status.
- Flaky: rerun, and report both the failure and the rerun. A green rerun does not erase the first.
- Pre-existing: reproduce on a clean base checkout, report it, and ask before proceeding past it.
- Evidence lives in the PR: command, result, and for failures the relevant output.

## Operational safety

Write constraints only for risks the project has.

| Surface | Default boundary | Preflight before a destructive step |
|---|---|---|
| Infrastructure state (Terraform etc.) | Plan is read-only; apply needs approval | Reviewed plan; no unexplained delete or replace |
| Hosts and deployments | Explicit host scope; approval for production | Dry run, inventory check, rollback path |
| Databases | No schema or data mutation without approval | Verified backup, restore path, topology check |
| Credentials | Never print, commit, or paste into issues, PRs, or logs | Identify consumers before rotating |
| Git and releases | No history rewrite, force push, or auto-merge unasked | Confirm branch and target |

- Temporary restrictions state the condition that lifts them and link the tracking issue. Delete them
  when the condition is met.
- Permanent invariants live in the instruction entrypoint, or in a doc the entrypoint names for the
  affected area.
- Approval for one operation or environment does not extend to the next.
