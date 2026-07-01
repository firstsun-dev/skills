# Progress Archive

Completed work, moved out of `progress.md` to keep that file scannable. Newest first.

## 2026-07-01

- feat-001: Harness bootstrap (CLAUDE.md, init.sh, feature_list.json, progress.md, session-handoff.md)
- feat-002: Fixed all custom/ skill validation failures (commit e885190)
- feat-003: Flattened unjustified external/ category containers (commit 696d571)
- feat-004: Added /validate-skills gate to skill-manager SOPs (commit add333a)
- feat-006: Weekly external-skills auto-update CI workflow (commits 29f7f41, f060d01)
- Ad-hoc: `github-actions` action-version bump + Node 24 default (commit 9f077db)
- Ad-hoc: public-repo org-secret checks, `delete-branch-on-merge`, actionlint script (commit 6070733)
- Ad-hoc: git-workflow conventions in `firstsun-dev-conventions`, private registry step in `firstsun-project-init`, stale checkout@v4 fix (commit feb1ed3)

Decisions made this period:
- **Domain nesting threshold**: Only flatten category containers when the domain has ≤10 total skills (per skill-manager's own rule). `develop/devops`, `develop/security`, `develop/frontend` were left nested since `develop/` has 33+ skills.
- **init.sh verification strategy**: Since this repo has no build/test suite, `init.sh` checks structural invariants instead — presence of `SKILLS_LIST.md`, `skills-lock.json`, and that every skill directory resolves to a `SKILL.md` (accounting for justified one-level nesting).
- **Portability split**: general coding/devops conventions (branch model, commit style, husky) go in `firstsun-dev-conventions` since it should work for non-firstsun-dev projects too; org-identity-bound specifics (the `registry.firstsun.org/firstsun-dev` registry, its org secrets) go in `firstsun-project-init` instead.
