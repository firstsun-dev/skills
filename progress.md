# Session Progress Log

## Current State

**Last Updated:** 2026-09-08
**Active Feature:** feat-013 done; feat-005 next up

Completed work is archived in [archive/](./archive/), one file per calendar month — this file only tracks what's still open.

## What's In Progress

- [ ] feat-005: Remaining external/ validation failures — not started this session

## Since Last Update

feat-013 (rebuild external skill provenance and update gate) completed 2026-09-08. All 65
external `skills-lock.json` entries had drifted to `sourceType: local` (regressed twice via
the weekly `update-external-skills.yml` PR, first on 2026-07-28, never self-healing since the
drift-check recomputed its own baseline from the already-corrupted file). Root cause: the
per-skill restore heuristic in `setup.sh`'s `register_skills()` string-matches the value
`npx skills add <local-dir>` just wrote, and `npx` always resolves to the latest published
`skills` package at run time — a serialization change there (e.g. dropping the `./` prefix)
silently defeats that heuristic. Rebuilt all 65 entries from live upstream and added a new
CI step that unconditionally force-restores `source`/`sourceType`/`skillPath` from a pre-run
snapshot for any skill that was `sourceType: github` beforehand, independent of what
setup.sh/npx produced — closing the recurrence path regardless of npx version drift.
`setup.sh` itself is unchanged (out of scope — user asked to fix the CI path only); a manual
local `./setup.sh --external` run is still exposed to the same heuristic bug.

feat-011 (harness enforcement + upgrade gaps) completed 2026-09-03. Two gaps found by
auditing three real harnesses (skills, firstsun-blog, git-files-sync): the validator only
scored state hygiene after a state file had already grown, and template improvements could
never reach a harness scaffolded before them. Added a leading-indicator check plus a
non-destructive `--upgrade` mode, then applied it to this repo (`init.sh` gained the gate).

feat-012 (drop session-handoff.md) completed 2026-09-03. User's call: an architecture doc covers
the durable half of a handoff, and the branch (commits + PR description) covers the transient
half, so the file was pure conflict surface. Removed from the skill and this repo. Side benefit:
the validator no longer demands a file that must also be gitignored — a fresh clone scores
100/100 where it previously lost a lifecycle point.

feat-010 (add plugin-settings external skill) completed 2026-07-16. Archived the official
`anthropics/claude-code` "Plugin Settings" skill into `external/develop/devops/plugin-settings/`.
Fixed only the `name:` field (was `Plugin Settings`, spec violation) — left all body content
untouched per user instruction not to hand-edit external skill content. Body is 544 lines
(over the 500-line guideline); user decided to keep as-is and record as a known exception,
consistent with feat-005's existing precedent that external/ upstream content isn't hand-edited.
skills-lock.json registered with source=anthropics/claude-code (not firstsun-dev/skills).

feat-009 (cleanup-cadence for harness-creator) completed 2026-07-06 (commit 3b3a18a).
Convention decided with user: archive is a time-based directory `archive/YYYY-MM.md`;
`progress-archive.md` is obsolete (this repo's own copy migrated to `archive/2026-07.md`).

## What's Next

1. Fix name/directory mismatches: `external/develop/windmill-rust-backend` (name field says "rust-backend"), `external/think/decision-management` (name field says "running-decision-processes")
2. Fix invalid name format: `external/video-design/ckm-banner-design` (name field is "ckm:banner-design" — colon not allowed)
3. Split or trim oversized SKILL.md bodies (>500 lines): `imagegen-frontend-mobile` (1465 lines),
   `imagegen-frontend-web` (987 lines), `brandkit` (798 lines), `mental-health-psychoeducation` (561 lines)
4. Rewrite imperative-voice descriptions to third-person: `fitness-coach`, `habit-tracker`,
   `workout-program-designer` (also fix verbatim description-in-body repeat), `remotion-best-practices`
   (missing "when to use")
5. Convert backtick-style references to markdown links: `healthkit`, `personal-productivity`
6. Fix `firecrawl-search` "See also" links pointing to non-existent sibling skills

## Blockers / Risks

- `references/*.md` cross-link to each other ("Related Patterns"). Pre-existing (commit
  2f666a4), unchanged by feat-011, but arguably a nested-reference-chain smell.
- The remaining fixes in feat-005 are mechanical (frontmatter edits, link formatting) except the 4 oversized
bodies, which need a real content split (progressive disclosure into references/) rather than a one-line fix.

## Notes for Next Session

Start with `./init.sh`, then work through feat-005's "What's Next" list above — each item maps to a specific
skill directory. Fix, then re-run `/validate-skills` on just that skill before moving to the next.
