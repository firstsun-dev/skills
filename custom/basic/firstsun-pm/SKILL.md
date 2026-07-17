---
name: firstsun-pm
description: Expert project management for the Firstsun-Dev organization. This skill standardizes issue creation across multiple repositories, ensures all tasks are correctly linked to the central Project Board (#6), and enforces naming conventions. Trigger this whenever the user says "add a task", "create a ticket", "new job", "manage projects", or wants to update task estimates/priorities.
---

# Firstsun-Dev Project Manager Skill

This skill ensures that all engineering and content tasks within the `firstsun-dev` organization are managed with high precision and consistency.

## 🎯 Central Project Hubs
- **Organization**: `firstsun-dev`
- **Project Board (default)**: [FirstSun-Dev 產品開發 (Project #6)](https://github.com/orgs/firstsun-dev/projects/6)
- **Project Board (Heaven repos)**: [Heaven Monorepo & WWW (Project #9)](https://github.com/orgs/firstsun-dev/projects/9) — dedicated board for `heaven-monorepo` and `heaven-www` only. Created via `copyProjectV2` from Project #6, so its fields, views, and all six built-in workflows (auto-close issue, item-closed→Done, etc.) are enabled identically.

## 📋 Standard Workflow for New Tasks

When a user asks to add a new task or "job":

1.  **Identify Repository**: Determine which repo the task belongs to, then route to the matching project board:
    - `heaven-monorepo`, `heaven-www` → **Project #9**.
    - `infra-config`: Ansible, Terraform, VPS, Backups. → Project #6.
    - `blog`: Article writing, UI changes for the blog. → Project #6.
    - `innovation-apps`: Diet-manager or other internal tools. → Project #6.
    - `watermark-s3-uploader` (Obsidian plugin) → Project #6.
    - `git-files-sync` (Obsidian plugin) → Project #6.
2.  **Format Title**: Across all repos, use **Conventional Commits** style: `type(scope): short description`, all lowercase, no `[Category]:` brackets.
    - Types: `feat`, `fix`, `docs`, `refactor`, `perf`, `chore`, `test`.
    - `scope` is optional — omit it if the change isn't tied to one area (e.g. use the repo/module name when it helps, like `feat(auth): ...` or `fix(gitea): ...`).
    - Examples: `feat: add ignore sync setting`, `fix: symbolic link pull fails`, `docs: list supported git providers in readme`, `chore(infra): rotate vps ssh keys`.
    - **Obsidian plugin repos** (`git-files-sync`, `watermark-s3-uploader`) are **public** — always write the title (and body) in **English** regardless of the language the user asked in.
    - Other internal repos (`infra-config`, `blog`, `innovation-apps`, `heaven-monorepo`, `heaven-www`) may keep the issue body in the user's language if that's how the team works, but the title itself should still follow Conventional Commits.
3.  **Create Issue**: Use `gh issue create --repo firstsun-dev/<repo> --title "<title>" --body "..." --label "enhancement"`, applying the Conventional Commits title format from step 2.
4.  **Add to Project**: Immediately add the new issue to the repo's matching board:
    - `gh project item-add <6|9> --owner firstsun-dev --url <ISSUE_URL>`.
5.  **Set Fields**: Ask the user or propose **Estimate (Hours)** and **Priority (P0/P1/P2)**. Update using:
    - `gh project item-edit <6|9> --id <ITEM_ID> --field-id <ESTIMATE_FIELD_ID> --number <HOURS>`
    - `gh project item-edit <6|9> --id <ITEM_ID> --field-id <PRIORITY_FIELD_ID> --single-select-option-id <OPTION_ID>`

## 🛠️ Field Reference (Project #6 — infra-config, blog, innovation-apps, watermark-s3-uploader, git-files-sync)
- **Status Field ID**: `PVTSSF_lADOEDVJmM4BVcvzzhQ4e0Y`
- **Priority Field ID**: `PVTSSF_lADOEDVJmM4BVcvzzhQ4e3M`
  - P0: `79628723`
  - P1: `0a877460`
  - P2: `da944a9c`
- **Estimate Field ID**: `PVTF_lADOEDVJmM4BVcvzzhQ4e3U`

## 🛠️ Field Reference (Project #9 — heaven-monorepo, heaven-www)
- **Status Field ID**: `PVTSSF_lADOEDVJmM4BcZVhzhXCfwg`
- **Priority Field ID**: `PVTSSF_lADOEDVJmM4BcZVhzhXCfxQ`
  - P0: `79628723`
  - P1: `0a877460`
  - P2: `da944a9c`
- **Estimate Field ID**: `PVTF_lADOEDVJmM4BcZVhzhXCfxY`
- **Size Field ID**: `PVTSSF_lADOEDVJmM4BcZVhzhXCfxU` (XS/S/M/L/XL — same options as Project #6, not currently referenced by the workflow above but available if needed)

## 🚀 Shipping Workflow (Issue → PR)

When a user asks to implement/ship/close out an issue (not just create one), drive it end-to-end and make sure the resulting PR auto-links to its issue:

1.  **Verify gates first**: Run the repo's lint, build, and test commands. Do not commit until all pass — never dismiss a failure as "pre-existing" without confirming with the user.
2.  **Commit**: Conventional Commits message, same title style as step 2 above.
3.  **Push**: To a feature branch (never straight to the repo's default branch).
4.  **Open the PR with an auto-link keyword in the body** — this is what makes GitHub auto-link the PR to the issue and auto-close the issue on merge:
    - Same-repo issue: include `Closes #<issue-number>` (or `Fixes` / `Resolves`) anywhere in the PR body.
    - Cross-repo issue (PR repo ≠ issue repo, e.g. PR in `heaven-monorepo` closing an issue filed in `heaven-www`): use the fully qualified form `Closes firstsun-dev/<issue-repo>#<issue-number>`.
    - Command: `gh pr create --repo firstsun-dev/<repo> --title "<same-style-as-issue-title>" --body "Closes #<issue-number>\n\n<description>"`.
    - Auto-close only fires if the PR merges into the repo's default branch — flag it to the user if the PR targets a non-default base.
5.  **Update the board**: Move the linked project item to "In Review" (or the repo's equivalent status) via `gh project item-edit --id <ITEM_ID> --field-id <STATUS_FIELD_ID> --single-select-option-id <OPTION_ID>`. Look up the option ID with `gh project field-list <6|9> --owner firstsun-dev` if not already known — don't guess it.

## 🛡️ Guiding Principles
- **Respect Community Issues**: Never change the title of issues submitted by external users. Only apply naming conventions to internal/self-created tasks.
- **English-only for Obsidian plugin repos**: `git-files-sync` and `watermark-s3-uploader` are public plugin repos with external contributors — write issue titles and bodies in English even if the user's request was in Chinese (or another language).
- **Conventional Commits titles everywhere**: every repo's issue titles use `type(scope): description` (see step 2) — no more `[Category]:` brackets, including for issues created before this convention (rename opportunistically when touching an old issue).
- **Link First**: Always ensure an issue exists in a repository before adding it to the board (avoid "Draft Items" if possible).
