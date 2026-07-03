---
name: firstsun-pm
description: Expert project management for the Firstsun-Dev organization. This skill standardizes issue creation across multiple repositories, ensures all tasks are correctly linked to the central Project Board (#6), and enforces naming conventions. Trigger this whenever the user says "add a task", "create a ticket", "new job", "manage projects", or wants to update task estimates/priorities.
---

# Firstsun-Dev Project Manager Skill

This skill ensures that all engineering and content tasks within the `firstsun-dev` organization are managed with high precision and consistency.

## 🎯 Central Project Hubs
- **Organization**: `firstsun-dev`
- **Project Board (default)**: [FirstSun-Dev 產品開發 (Project #6)](https://github.com/orgs/firstsun-dev/projects/6)
- **Project Board (Heaven repos)**: [Heaven Monorepo & WWW (Project #8)](https://github.com/orgs/firstsun-dev/projects/8) — dedicated board for `heaven-monorepo` and `heaven-www` only, mirroring Project #6's fields and conventions exactly.

## 📋 Standard Workflow for New Tasks

When a user asks to add a new task or "job":

1.  **Identify Repository**: Determine which repo the task belongs to, then route to the matching project board:
    - `heaven-monorepo`, `heaven-www` → **Project #8**.
    - `infra-config`: Ansible, Terraform, VPS, Backups. → Project #6.
    - `blog`: Article writing, UI changes for the blog. → Project #6.
    - `innovation-apps`: Diet-manager or other internal tools. → Project #6.
    - `watermark-s3-uploader`: Obsidian plugin releases. → Project #6.
    - `git-files-sync`: Obsidian plugin development/marketing. → Project #6.
2.  **Format Title**: Always use the prefix: `[Category]: Short Description`.
    - `[Infra]`: Server/Network setup.
    - `[DevOps]`: Automation, Backups, Gitea mirroring.
    - `[Feature]`: New app functionality.
    - `[UI]`: Design, Remotion, Layout.
    - `[Content]`: Writing, Documentation.
    - `[Bug]`: Error fixing.
    - `[Refactor]`: Code cleanup.
3.  **Create Issue**: Use `gh issue create --repo firstsun-dev/<repo> --title "[Category]: Description" --body "..." --label "enhancement"`.
4.  **Add to Project**: Immediately add the new issue to the repo's matching board:
    - `gh project item-add <6|8> --owner firstsun-dev --url <ISSUE_URL>`.
5.  **Set Fields**: Ask the user or propose **Estimate (Hours)** and **Priority (P0/P1/P2)**. Update using:
    - `gh project item-edit <6|8> --id <ITEM_ID> --field-id <ESTIMATE_FIELD_ID> --number <HOURS>`
    - `gh project item-edit <6|8> --id <ITEM_ID> --field-id <PRIORITY_FIELD_ID> --single-select-option-id <OPTION_ID>`

## 🛠️ Field Reference (Project #6 — infra-config, blog, innovation-apps, watermark-s3-uploader, git-files-sync)
- **Status Field ID**: `PVTSSF_lADOEDVJmM4BVcvzzhQ4e0Y`
- **Priority Field ID**: `PVTSSF_lADOEDVJmM4BVcvzzhQ4e3M`
  - P0: `79628723`
  - P1: `0a877460`
  - P2: `da944a9c`
- **Estimate Field ID**: `PVTF_lADOEDVJmM4BVcvzzhQ4e3U`

## 🛠️ Field Reference (Project #8 — heaven-monorepo, heaven-www)
- **Status Field ID**: `PVTSSF_lADOEDVJmM4BcZT0zhXCePc`
- **Priority Field ID**: `PVTSSF_lADOEDVJmM4BcZT0zhXCeVA`
  - P0: `66b6113d`
  - P1: `1ab7d45f`
  - P2: `d5d996fd`
- **Estimate Field ID**: `PVTF_lADOEDVJmM4BcZT0zhXCeV8`
- **Size Field ID**: `PVTSSF_lADOEDVJmM4BcZT0zhXCeVE` (XS/S/M/L/XL — same options as Project #6, not currently referenced by the workflow above but available if needed)

## 🛡️ Guiding Principles
- **Respect Community Issues**: Never change the title of issues submitted by external users. Only apply naming conventions to internal/self-created tasks.
- **Link First**: Always ensure an issue exists in a repository before adding it to the board (avoid "Draft Items" if possible).
