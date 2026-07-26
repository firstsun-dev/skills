# {{AGENT_FILE_NAME}}

{{PROJECT_PURPOSE}}

## Startup Workflow

Before writing code:

1. **Confirm working directory** with `pwd`
2. **Read this file** completely
3. **Read project docs if present** (`docs/ARCHITECTURE.md`, `docs/PRODUCT.md`, README, or equivalent)
4. **Run `./init.sh`** to verify environment is healthy
5. **Read `feature_list.json`** to see current feature state
6. **Review recent commits** with `git log --oneline -5`

If baseline verification is failing, repair that first before adding new scope.

## Working Rules

- **One feature at a time**: Pick exactly one unfinished feature from `feature_list.json`
- **Verification required**: Don't claim done without running verification commands
- **Update artifacts**: Before ending session, update `progress.md` and `feature_list.json`
- **Keep state files short (two-tier model)**:
  - **Shared (merged carefully across worktrees):** `progress.md` (open work only, ~80 lines max) + `feature_list.json` (one-line evidence — commit hash + short pointer; narrative belongs in the commit message). When a feature finishes, move it to `archive/YYYY-MM.md` as one line: name + commit hash, and remove from `progress.md`.
  - **Per-checkout scratch:** `session-handoff.md` is **gitignored** — overwrite freely each session, never merge it across worktrees. It's this checkout's local "where I stopped" note, not a shared source of truth. Parallel worktrees each keep their own.
  - **Do-not-touch split:** permanent invariants (always-true) live in this file's Environment/Working rules; transient do-not-touch (tied to an in-progress feature) lives in `progress.md` and gets archived with its feature when done.
- **Stay in scope**: Don't modify files unrelated to the current feature
- **Leave clean state**: Next session must be able to run `./init.sh` immediately

## Required Artifacts

- `feature_list.json` — Feature state tracker (source of truth)
- `progress.md` — Session continuity log (open work only)
- `archive/YYYY-MM.md` — Completed work, one file per calendar month
- `init.sh` — Standard startup and verification path
- `session-handoff.md` — Optional, per-checkout scratch (gitignored, never merged)

## Definition of Done

A feature is done only when ALL of the following are true:

- [ ] Target behavior is implemented
- [ ] Required verification actually ran (tests / lint / type-check)
- [ ] Evidence recorded in `feature_list.json` or `progress.md`
- [ ] Repository remains restartable from standard startup path

## End of Session

Before ending a session:

1. Update `progress.md` with current state (open work + transient do-not-touch only; ≤80 lines)
2. Update `feature_list.json` with new feature status (one-line evidence + commit hash)
3. Move finished items from `progress.md` to `archive/YYYY-MM.md` (one line each: name + commit hash)
4. Record permanent invariants in this file's Environment/Working rules; transient do-not-touch in `progress.md`
5. Overwrite `session-handoff.md` with this checkout's "where I stopped" (gitignored — do not commit or merge it)
6. Commit shared state with descriptive message once work is in safe state
7. Leave repo clean enough for next session to run `./init.sh` immediately

## Verification Commands

```bash
# Full verification (recommended)
{{PRIMARY_VERIFICATION_COMMAND}}
```

Required checks:
{{VERIFICATION_COMMANDS}}

## Escalation

If you encounter:
- **Architecture decisions**: Consult project architecture docs if present, otherwise ask user
- **Unclear requirements**: Check product/requirements docs if present, otherwise ask user
- **Repeated test failures**: Update progress, flag for human review
- **Scope ambiguity**: Re-read `feature_list.json` for definition of done
