# Session Progress Log

## Current State

**Last Updated:** 2026-07-06
**Active Feature:** feat-005 - Remaining external/ validation failures (next up)

Completed work is archived in [archive/](./archive/), one file per calendar month — this file only tracks what's still open.

## What's In Progress

- [ ] feat-005: Remaining external/ validation failures — not started this session

## Since Last Update

feat-009 (cleanup-cadence for harness-creator) completed 2026-07-06 (commit 3b3a18a).
Convention decided with user: archive is a time-based directory `archive/YYYY-MM.md`;
`progress-archive.md` is obsolete (this repo's own copy migrated to `archive/2026-07.md`).

## What's Next

1. Fix name/directory mismatches: `external/develop/windmill-rust-backend` (name field says "rust-backend"), `external/think/decision-management` (name field says "running-decision-processes")
2. Fix invalid name format: `external/video-design/ckm-banner-design` (name field is "ckm:banner-design" — colon not allowed)
3. Split or trim oversized SKILL.md bodies (>500 lines): `imagegen-frontend-mobile` (1465 lines), `imagegen-frontend-web` (987 lines), `brandkit` (798 lines), `mental-health-psychoeducation` (561 lines)
4. Rewrite imperative-voice descriptions to third-person: `fitness-coach`, `habit-tracker`, `workout-program-designer` (also fix verbatim description-in-body repeat), `remotion-best-practices` (missing "when to use")
5. Convert backtick-style references to markdown links: `healthkit`, `personal-productivity`
6. Fix `firecrawl-search` "See also" links pointing to non-existent sibling skills

## Blockers / Risks

- None currently. The remaining fixes in feat-005 are mechanical (frontmatter edits, link formatting) except the 4 oversized bodies, which need a real content split (progressive disclosure into references/) rather than a one-line fix.

## Notes for Next Session

Start with `./init.sh`, then work through feat-005's "What's Next" list above — each item maps to a specific skill directory. Fix, then re-run `/validate-skills` on just that skill before moving to the next.
