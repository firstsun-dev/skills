# Firstsun Skill Arsenal (Gemini Context)

This repository is a centralized "Skill Arsenal" for AI Agents (Gemini CLI, Claude Code). It provides modular, domain-specific knowledge "Gems" and skills.

## Repository Structure & Taxonomy

- `custom/`: Original or modified skills.
- `external/`: Community skills (downloaded for inspection).
- `gem/`: Consolidated instruction sets (txt) for Google Gemini "Gems".
- `SKILLS_LIST.md`: The central index of all available skills with Chinese descriptions.

### Domains
Skills are categorized into the following domains:
- `basic/`: General-purpose tools (skill-manager, brainstorming, etc.).
- `develop/`: Software engineering patterns and conventions.
- `obsidian/`: Knowledge management and Markdown automation.
- `writing/`: Content creation and translation.
- `think/`: Mental models and logic.
- `health/`: Bio-optimization and training.

## Maintenance Mandates

1. **English First**: All `SKILL.md` files MUST be in English for maximum LLM compatibility.
2. **Flattened Design**: Skill folders should be direct children of their domain folders.
3. **Registering Changes**:
   - Use `./setup.sh` (v1.2.0+) to register skills. It defaults to **Remote** registration (`firstsun-dev/skills/...`).
   - Use `./setup.sh --local` for active development.
4. **Syncing Index**: Whenever adding or moving a skill, update `SKILLS_LIST.md` immediately.
5. **Branding**: Use "Firstsun Skill Arsenal" or "Firstsun Skill Manager" in all documentation.
6. **Lock File Hygiene**: `skills-lock.json` MUST preserve the **original external sources** for all skills in the `external/` directory. Do not point them to `firstsun-dev/skills`. Only `custom/` skills should point to the internal repository.
7. **Authoritative Source**: The directory `@custom/develop/firstsun-dev-conventions/**` is the authoritative source for Firstsun project standards. Agents MUST prioritize fetching/referencing the latest version from `firstsun-dev/skills` when working in any project that consumes this skill.

## Core Workflows

- **Adding External Skill**: Download to root, move to `external/<domain>/`, register, and update `SKILLS_LIST.md`.
- **Creating Custom Skill**: Use `skill-creator` guidelines, add to `custom/<domain>/`, register, and update `SKILLS_LIST.md`.
- **Exporting Gems**: Consolidate multiple skills into `gem/<category>.txt` using the `skill-manager` workflow.
