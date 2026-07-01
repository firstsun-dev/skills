---
name: skill-manager
description: "Guides AI agents on how to maintain the separated custom/ and external/ domains in the Firstsun Skill Arsenal."
origin: firstsun-dev/skills
---

# Skill Manager (SM)

## Repository Structure & Flattened Design (扁平化設計)

- `custom/`: Your internal/original skills.
- `external/`: Community skills downloaded for inspection and reference.

### Flattened vs. Conditional Nesting (扁平化與條件式嵌套)
To balance discoverability and organization:
- **Default (Flattened)**: Every skill folder SHOULD be a direct child of its domain folder for default detection by `npx skills add <directory>`.
- **Exception (Conditional Nesting)**: If a domain directory contains **more than 10 skills**, you MAY create one level of sub-directories (categories) to avoid clutter. 
  - *Note*: When nesting is used, users must use `npx skills add <path> --full-depth` to find all skills.
- **Sync Requirement**: Whenever a skill's location changes, you **MUST** immediately update the corresponding link in `SKILLS_LIST.md`.

### Taxonomy Alignment (目錄架構對齊)
To prevent fragmentation (e.g., mixing `search/` and `fetch/` for similar tools), you **MUST** map external skills to our existing local domains/categories:
- **Local Domains**: `basic/`, `develop/`, `obsidian/`, `video-design/`, `writing/`.
- **Ignore Provider Names**: If an external repo uses `research/firecrawl`, but we use `basic/`, move it to `external/basic/firecrawl-search/`.
- **Consistency over Originality**: Always prioritize our folder structure over the external repository's original layout.

## Utility Skills
Leverage these skills to maintain the repository:
- `/find-skills`: Discover existing skills in the ecosystem to avoid duplication.
- `/skills-validator`: Validate skills in `custom/` or `external/` against the agentskills.io spec.
- `/skills-creator`: Follow guided workflows to create new skills with proper structure.

### Refactoring & Efficiency
- **Progressive Disclosure**: Use the `/reference` pattern to keep skills efficient. Read [references/REFACTORING.md](references/REFACTORING.md) for the refactoring SOP.

## Core Commands
- Bulk Setup: `./setup.sh` registers all local skills (defaults to remote mode to preserve `skills-lock.json`). Use `./setup.sh --local` for active development; the script automatically safeguards `skills-lock.json` from local path changes.
- Bulk Export: `./export.sh <domain>` imports domain skills to a specific project.
- Manual Add: `npx skills add <path_to_directory> -l` to list all detectable skills.

## Gem Export Workflow (Gem 導出流程)
Use this workflow to consolidate multiple skills into a single "Gem" instruction set for Google Gemini.

1. **Identify Categories**: Group related skills (e.g., Lifestyle, Development, Writing).
2. **Extract Essence**: For each skill, extract:
   - Core Role/Persona.
   - Mandates/Principles (Mandates prioritized).
   - Primary Workflows (Step-by-step).
3. **Synthesize**: Combine into a structured prompt:
   - `# Role`: A unified persona (e.g., "The Lifestyle Architect").
   - `# Principles`: Consolidated foundational concepts (e.g., Minerva HCs + Learning Principles).
   - `# Capabilities`: Categorized toolsets (Health, Learning, etc.).
   - `# Interaction Style`: Guidelines for tone and output.
4. **Export**: Write the result to `gem/<category-name>.txt`.

## SOP for External Skills
1. **Download**: Run `npx skills add <repo_path>` in root (without -g) to inspect the skill.
2. **Archive**: Move from `.agents/skills/` to `external/<domain>/` (Ensure it is a direct child).
3. **Validate**: Run `/validate-skills` on the archived skill. Fix any FAIL items (name mismatch, body too long, bad link format, missing "when to use") before proceeding.
4. **Document**: Update `SKILLS_LIST.md` with the new skill's name, Chinese description, and link.
5. **Push**: Commit and push changes to GitHub.
6. **Remote Install**: Run `npx skills add <user>/<repo>/external/<domain>/<skill-name>` to register the version-controlled version.

## SOP for Custom Skills
1. **Create**: Create skill directory in `custom/<domain>/`.
2. **Implement**: Write `SKILL.md` following `skill-creator` guidelines.
3. **Validate**: Run `/validate-skills` on the new skill. Fix any FAIL items before proceeding.
4. **Document**: Add the new skill to `SKILLS_LIST.md`.
5. **Push**: Commit and push changes to GitHub.
6. **Remote Install**: Run `npx skills add <user>/<repo>/custom/<domain>/<skill-name>` to register.
