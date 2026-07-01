---
name: firstsun-project-init
description: "End-to-end bootstrap flow for a brand-new project under the firstsun-dev GitHub org: select and install relevant skills from firstsun-dev/skills into the local project, scaffold an agent harness via harness-creator, create and configure the GitHub repo (description, topics), and register the project in firstsun-dev/.github's profile README. Use this whenever the user says things like 'init 一個新專案', 'bootstrap a new project for firstsun-dev', 'create a repo under firstsun-dev org and set it up', or asks to set up a new Claude Code project end-to-end from scratch — even if they only mention one part of the flow (e.g. just 'install some skills for this project'), since the other stages are usually wanted too."
origin: firstsun-dev/skills
---

# Firstsun Project Init

A single project usually needs four things before it's actually ready to work in: the right skills installed locally, an agent harness so Claude Code stays reliable across sessions, a real GitHub repo under the `firstsun-dev` org with an accurate description and topics, and a listing in the org's public profile so the project is discoverable. Doing these one at a time, in separate conversations, is how repos end up half-configured. This skill runs all four in one pass, in order, so nothing gets forgotten.

Two of the four steps are hard to undo (creating a repo, editing the org-wide profile README). Treat those as checkpoints, not formalities — show the user exactly what you're about to do and wait for a yes before doing it.

## Prerequisites

Before starting, confirm with the user (or infer from context):
- **Project name** and a one-sentence purpose ("what does this project do")
- **Local project directory** — an existing folder, or one to create
- **Visibility** — public or private repo
- Whether this is a fresh repo or the user already has one (skip repo creation if so)

## Step 1 — Select and install skills

Don't guess at skills from the project name alone. Ask the user what the project actually is (tech stack, domain — e.g. "Cloudflare Worker with D1", "Astro blog", "Python CLI") if it isn't already clear from the conversation or an existing codebase in the target directory.

1. Fetch the current catalog from `firstsun-dev/skills` — read `SKILLS_LIST.md` (raw GitHub content or a shallow clone) to see what's available and where each skill lives (`custom/<domain>/<name>` or `external/<domain>/<name>`).
2. Match the project's tech stack and purpose against the catalog. Favor precision over coverage — installing 3 well-matched skills beats installing 10 loosely-related ones, since every installed skill's description competes for triggering attention later.
3. Propose your shortlist to the user with a one-line reason for each ("workers-best-practices — you're deploying to Cloudflare Workers") and let them adjust before installing.
4. Install each approved skill into the target project directory:
   ```bash
   cd <project-dir>
   npx skills add firstsun-dev/skills/<domain>/<skill-name>
   ```
   This registers the skill in the project's `skills-lock.json` pointing at the versioned source in `firstsun-dev/skills` — do not hand-copy the skill files.

## Step 2 — Scaffold the agent harness

Invoke the `harness-creator` skill (via the Skill tool) against the target project directory to set up the reliability scaffolding: `CLAUDE.md`/`AGENTS.md`, `feature_list.json`, `progress.md`, `init.sh`, and `session-handoff.md` as appropriate for the project's size and shape. Let harness-creator's own judgment drive the specifics of what gets created — this step is local and reversible, so no extra confirmation is needed beyond the harness-creator skill's own flow.

## Optional — Wire GitHub Issues into the harness

Once the repo exists (Step 3) and the harness is scaffolded (Step 2), the two can reinforce each other: the harness gives an agent a reliable way to *work*, and Issues give it a reliable, shared *source of truth* that survives across sessions and machines — something a local `progress.md` alone can't do. Offer this to the user as an enhancement once the base harness is in place; it's optional and only worth doing if the project expects multi-session or multi-person work.

- **Mirror `feature_list.json` from open Issues.** Instead of (or in addition to) hand-maintaining feature state locally, have `init.sh` run `gh issue list --state open` at startup and reconcile it against `feature_list.json`. Each Issue becomes a feature entry; closing an Issue is how a feature gets marked done. This keeps the state visible to anyone looking at the repo, not just whoever ran the last session.
- **Post session handoff as an Issue comment, not just a file.** A `session-handoff.md` is invisible until someone opens that exact file. Appending the same handoff notes (progress, blockers, next step) as a `gh issue comment` on the relevant Issue makes it timestamped, attributable, and discoverable by anyone watching the Issue.
- **Fold Issue state into Definition of Done.** Add "the corresponding Issue is updated or closed" as a checklist item alongside validation gates. This stops an agent from declaring a feature done in local files while the externally-visible state still shows it open.
- **Use Issue scope as the agent's scope boundary.** Instead of relying only on prose in `CLAUDE.md` ("stay in scope"), point the agent at a specific Issue and treat its description as the literal boundary — changes outside what the Issue describes should prompt a pause and a question, not silent scope creep.
- **Use labels/assignees for multi-agent coordination.** When more than one agent or session might touch the repo concurrently, use Issue labels (`in-progress`, `blocked`) and assignees as a lightweight lock so two agents don't converge on the same files at once.

If the user wants this wired in concretely, add a `gh issue list` sync step near the top of `init.sh` and note the Issue-comment handoff convention in `CLAUDE.md`'s "End of Session" section — don't build a separate tracking system in parallel with Issues, since that reintroduces the same local/remote drift this is meant to fix.

## Step 3 — Create the GitHub repo (checkpoint)

This is externally visible and not trivially reversible — confirm with the user before running anything.

1. Draft and show the user:
   - Repo name (default: the project directory name, adjust if it collides or the user wants something else)
   - Visibility (public/private)
   - One-sentence description
   - 3-6 topics/tags (derive from the tech stack and the skills installed in Step 1 — e.g. `cloudflare-workers`, `astro`, `typescript`)
2. Once approved, create it:
   ```bash
   gh repo create firstsun-dev/<repo-name> --<public|private> --description "<description>" --source=. --remote=origin
   ```
   If the repo already exists or was created without topics/description, reconcile with:
   ```bash
   gh repo edit firstsun-dev/<repo-name> --description "<description>" --add-topic <topic1> --add-topic <topic2>
   ```
3. Push the initial commit if the user wants the scaffold from Steps 1-2 committed (ask first — don't assume; some users want to review the local state before it goes remote).

## Step 4 — Register in the org profile (checkpoint)

`firstsun-dev/.github`'s `profile/README.md` is the org's public landing page — every edit here is visible to anyone who views the org. Confirm the exact wording before pushing.

1. Clone or pull the latest `firstsun-dev/.github` repo.
2. Open `profile/README.md` and find the section that best fits the new project (by type — tool, library, app — matching the existing section structure; don't invent a new section unless none fits).
3. Draft a one-line entry (name + short description + repo link) matching the existing entries' format exactly — same table/list style, same tone.
4. Show the user the exact diff before committing. Once approved:
   ```bash
   git add profile/README.md
   git commit -m "docs: add <repo-name> to org profile"
   git push
   ```
   Do not force-push or rewrite history on this repo — it's shared, low-traffic, and any conflict should be resolved by re-pulling, not overwriting.

## Definition of done

- [ ] Selected skills installed and present in the project's `skills-lock.json`
- [ ] Harness scaffolding created via `harness-creator` and reviewed by the user
- [ ] Repo exists under `firstsun-dev`, with correct visibility, description, and topics
- [ ] `firstsun-dev/.github/profile/README.md` updated and pushed, entry matches existing formatting
- [ ] User has confirmed both checkpoint steps (repo creation, profile README edit) before they happened, not after
