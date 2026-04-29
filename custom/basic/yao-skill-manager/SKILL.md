---
name: yao-skill-manager
description: "Guides AI agents on how to maintain the separated custom/ and external/ domains in yao-agent-skills."
---

# Yao Skill Manager (YSM)

## Repository Structure & Flattened Design (扁平化設計)
- `custom/`: Your internal/original skills.
- `external/`: Community skills downloaded for inspection and reference.

### Flattened vs. Conditional Nesting (扁平化與條件式嵌套)
To balance discoverability and organization:
- **Default (Flattened)**: Every skill folder SHOULD be a direct child of its domain folder for default detection by `npx skills add <directory>`.
- **Exception (Conditional Nesting)**: If a domain directory contains **more than 10 skills**, you MAY create one level of sub-directories (categories) to avoid clutter. 
  - *Note*: When nesting is used, users must use `npx skills add <path> --full-depth` to find all skills.
- **Sync Requirement**: Whenever a skill's location changes, you **MUST** immediately update the corresponding link in `SKILLS_LIST.md`.

## Core Commands
- Bulk Setup: `./setup.sh <domain>` registers everything globally.
- Bulk Export: `./export.sh <domain>` imports domain skills to a specific project.
- Manual Add: `npx skills add <path_to_directory> -l` to list all detectable skills.

## SOP for External Skills
1. Run `npx skills add <repo_path>` in root (without -g).
2. Move from `.agents/skills/` to `external/<domain>/` (Ensure it is a direct child).
3. Run `./setup.sh` to register.
4. **Update `SKILLS_LIST.md`**: Append the new skill to the appropriate category in `SKILLS_LIST.md` with its name, a Chinese description, and a link to its `SKILL.md`.

## SOP for Custom Skills
1. Create skill directory in `custom/<domain>/` (Ensure it is a direct child).
2. Implement `SKILL.md` following `skill-creator` guidelines.
3. Run `./setup.sh` to register.
4. **Update `SKILLS_LIST.md`**: Add the new skill to `SKILLS_LIST.md`.