# CLAUDE.md

Project harness for reliable agent-assisted work on the Firstsun Skill Arsenal.

This repo is a skill library, not a software project — there is no build/test suite. "Verification" here means the repo stays internally consistent: every `SKILL.md` passes validation, every skill is registered in `SKILLS_LIST.md`, and `skills-lock.json` points to the correct sources.

## Startup Workflow

Before making changes:

1. **Confirm working directory** with `pwd`
2. **Read this file** completely
3. **Read `GEMINI.md`** — repository structure, taxonomy, and maintenance mandates
4. **Read `custom/basic/skill-manager/SKILL.md`** — the authoritative SOP for adding/moving/exporting skills
5. **Run `./init.sh`** to verify environment is healthy
6. **Read `feature_list.json`** to see current feature state
7. **Review recent commits** with `git log --oneline -5`

If baseline verification is failing, repair that first before adding new scope.

## Working Rules

- **Follow the SOPs in `skill-manager`**: External skills SOP (download → archive → validate → document → push → remote install) and Custom skills SOP (create → implement → validate → document → push → remote install). Do not skip the `/validate-skills` gate.
- **One feature at a time**: Pick exactly one unfinished feature from `feature_list.json`.
- **Verification required**: Don't claim a skill addition/move is done without running `/validate-skills` on it.
- **Flattened design**: New skill folders are direct children of their domain folder unless the domain already has >10 skills (see `skill-manager` conditional-nesting rule).
- **Sync `SKILLS_LIST.md`**: Any time a skill's location or description changes, update the corresponding entry immediately.
- **Stay in scope**: Don't modify files unrelated to the current feature.
- **Leave clean state**: Next session must be able to run `./init.sh` immediately.

## Required Artifacts

- `feature_list.json` — Feature state tracker (source of truth)
- `progress.md` — Session continuity log
- `init.sh` — Standard startup and verification path

## Definition of Done

A feature (e.g., adding, moving, or fixing a skill) is done only when ALL of the following are true:

- [ ] Target behavior is implemented (skill created/moved/edited)
- [ ] `/validate-skills` ran clean on the affected skill(s) — no FAIL items remain
- [ ] `SKILLS_LIST.md` reflects the current path and description
- [ ] `skills-lock.json` sources are correct (external skills keep their original upstream source; only `custom/` points to `firstsun-dev/skills`)
- [ ] Evidence recorded in `feature_list.json` or `progress.md`
- [ ] Repository remains restartable from `./init.sh`

## End of Session

Before ending a session:

1. Update `progress.md` with current state
2. Update `feature_list.json` with new feature status
3. Record any unresolved risks or blockers; put "where I stopped" in the branch's commit messages / PR description, not in a repo state file
4. Commit with descriptive message once work is in safe state
5. Leave repo clean enough for next session to run `./init.sh` immediately

## Verification Commands

```bash
# Full verification (recommended)
./init.sh
```

Required checks:
- `/validate-skills` — validate all (or changed) skills against the agentskills.io spec
- `git status` — no unexpected untracked/modified files outside current feature scope
- Confirm `SKILLS_LIST.md` links resolve to real paths

## Escalation

If you encounter:
- **Taxonomy ambiguity** (which domain a skill belongs in): Consult `skill-manager`'s Taxonomy Alignment section, otherwise ask user.
- **Nesting threshold questions** (>10 skills in a domain): Re-read the Flattened vs. Conditional Nesting rule in `skill-manager`.
- **Repeated validation failures**: Update progress, flag for human review.
- **Scope ambiguity**: Re-read `feature_list.json` for definition of done.
