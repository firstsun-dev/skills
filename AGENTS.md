# Firstsun Skill Arsenal

A public skill library, not an application: there is no build. "Verified" means the repository stays
consistent: every `SKILL.md` is valid, registered in `SKILLS_LIST.md`, sourced correctly in
`skills-lock.json`, and the external marketplace outputs match their catalog.

## Start

Read this file, then only what the task needs:

- Layout and taxonomy: `GEMINI.md`.
- Adding, moving or exporting a skill: `custom/basic/skill-manager/SKILL.md` (authoritative SOP).
- From an issue: the issue, linked PRs, and any named OpenSpec change. Resuming: the Draft PR, its
  commits, checks and review comments.

Do not load `archive/` by default.

## Task tracking

- Tasks and backlog: GitHub Issues. Priority and status: [Project #6](https://github.com/orgs/firstsun-dev/projects/6).
- Progress and handoff: branch, commits, Draft PR. Unfinished actionable work goes to an issue.
- Complex changes: `openspec/`. Design records: `docs/`. History: git log; retired state files are in
  `archive/legacy-harness/`.

## Scope

- One task per branch (a worktree when sessions run in parallel). Check open PRs for overlap; no
  unrelated refactoring.
- New skill folders are direct children of their domain folder unless the domain already has more than
  10 skills.
- Update `SKILLS_LIST.md` whenever a skill's location or description changes.

## Safety

- This repository is public: never commit or paste secrets, credentials or private details.
- Do not hand-edit `external/`: the weekly sync overwrites it. Fix upstream or document the exception (#22).
- `skills-lock.json` keeps original upstream sources for `external/`; only `custom/` points to
  `firstsun-dev/skills`. `npx skills add` or `update` run here can rewrite the whole file; review the diff.
- `./setup.sh` re-registers every skill. For a single-skill change use `npx skills add` for that skill only.
- Never merge, force push or rewrite history unless asked.

## Verification

```bash
./init.sh
```

`./init.sh` checks required files, marketplace parity and that every skill directory has a `SKILL.md`.
It does not validate skill contents. Also:

- Changed skills: run `/validate-skills` on them.
- `custom/basic/firstsun-harness/scripts/` changed: `node --test custom/basic/firstsun-harness/scripts/audit-harness.test.mjs`.
- Quote `description` frontmatter that contains ` #` or `: `; confirm the parsed text is complete.
- `SKILLS_LIST.md` links resolve.

## Definition of Done

Required checks `PASS`; anything `SKIP` or `NOT RUN` is stated with a reason in the PR. Remaining work
is tracked in issues. Ambiguous taxonomy or scope: ask.
