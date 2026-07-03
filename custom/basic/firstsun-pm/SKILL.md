---
name: firstsun-pm
description: Expert project management for the Firstsun-Dev organization. This skill standardizes issue creation across multiple repositories, ensures all tasks are correctly linked to the central Project Board (#6), and enforces naming conventions. Trigger this whenever the user says "add a task", "create a ticket", "new job", "manage projects", or wants to update task estimates/priorities.
---

# Firstsun-Dev Project Manager Skill

This skill ensures that all engineering and content tasks within the `firstsun-dev` organization are managed with high precision and consistency.

## 🎯 Central Project Hub
- **Organization**: `firstsun-dev`
- **Project Board**: [FirstSun-Dev 產品開發 (Project #6)](https://github.com/orgs/firstsun-dev/projects/6)

## 📋 Standard Workflow for New Tasks

When a user asks to add a new task or "job":

1.  **Identify Repository**: Determine which repo the task belongs to:
    - `infra-config`: Ansible, Terraform, VPS, Backups.
    - `blog`: Article writing, UI changes for the blog.
    - `innovation-apps`: Diet-manager or other internal tools.
    - `watermark-s3-uploader`: Obsidian plugin releases.
    - `git-files-sync`: Obsidian plugin development/marketing.
2.  **Format Title**: Always use the prefix: `[Category]: Short Description`.
    - `[Infra]`: Server/Network setup.
    - `[DevOps]`: Automation, Backups, Gitea mirroring.
    - `[Feature]`: New app functionality.
    - `[UI]`: Design, Remotion, Layout.
    - `[Content]`: Writing, Documentation.
    - `[Bug]`: Error fixing.
    - `[Refactor]`: Code cleanup.
3.  **Create Issue**: Use `gh issue create --repo firstsun-dev/<repo> --title "[Category]: Description" --body "..." --label "enhancement"`.
4.  **Add to Project**: Immediately add the new issue to Project #6:
    - `gh project item-add 6 --owner firstsun-dev --url <ISSUE_URL>`.
5.  **Set Fields**: Ask the user or propose **Estimate (Hours)** and **Priority (P0/P1/P2)**. Update using:
    - `gh project item-edit 6 --id <ITEM_ID> --field-id <ESTIMATE_FIELD_ID> --number <HOURS>`
    - `gh project item-edit 6 --id <ITEM_ID> --field-id <PRIORITY_FIELD_ID> --single-select-option-id <OPTION_ID>`

## 🛠️ Field Reference (Project #6)
- **Status Field ID**: `PVTSSF_lADOEDVJmM4BVcvzzhQ4e0Y`
- **Priority Field ID**: `PVTSSF_lADOEDVJmM4BVcvzzhQ4e3M`
  - P0: `79628723`
  - P1: `0a877460`
  - P2: `da944a9c`
- **Estimate Field ID**: `PVTF_lADOEDVJmM4BVcvzzhQ4e3U`

## 🛡️ Guiding Principles
- **Respect Community Issues**: Never change the title of issues submitted by external users. Only apply naming conventions to internal/self-created tasks.
- **Link First**: Always ensure an issue exists in a repository before adding it to the board (avoid "Draft Items" if possible).
