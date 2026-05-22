# Yao Skill Arsenal

> A cross-domain, modular AI Agent skill repository managed by npx skills.

## 🚀 Overview

This repository serves as a centralized "Skill Arsenal" for various AI Agents (Gemini CLI, Claude Code, etc.). It organizes skills into **Custom** (internal) and **External** (community) domains to ensure clear ownership and maintainability.

## 📂 Directory Structure

- `custom/`: Your original or heavily modified skills.
- `external/`: Community skills downloaded for reference and inspection.
- `setup.sh`: Global registration script (links skills to `~/.agents/skills/`).
- `export.sh`: Project-level import script (links skills to current directory).

## 🛠 Core Commands

### 1. Global Registration (For all projects)
To register ALL skills for all AI agents on your machine:
```bash
./setup.sh
```

### 2. Project Import (For a specific project)
To import skills locally into a project without polluting the global environment:
```bash
cd <your-project>
~/skills/export.sh <domain>
```

### 3. Manual Installation (Single Skill or Directory)
```bash
# Install a single skill
npx skills add ~/skills/custom/obsidian/obsidian-bases -g

# Recursive Installation (For domains with nested categories, e.g., develop)
npx skills add ~/skills/external/develop -g --full-depth
```

## 📥 How to Add External Skills (SOP)

Follow these steps to add a community skill while keeping the code locally for review:

1. **Download to Root**: Go to the arsenal root and download the skill (do NOT use -g):
   ```bash
   cd ~/skills
   npx skills add <owner/repo@skill> -y
   ```
2. **Categorize & Align**: Move the downloaded folder from `.agents/skills/` to your desired `external/` domain. **MUST** align with our local taxonomy:
   ```bash
   # Example: moving a react skill to our nested 'frontend' category
   mkdir -p external/develop/frontend/
   mv .agents/skills/<skill-name> external/develop/frontend/
   ```
3. **Clean Cache**: Remove the temporary `.agents/` folder:
   ```bash
   rm -rf .agents/
   ```
4. **Register**: Run the setup script to link it to your agents:
   ```bash
   ./setup.sh
   ```
5. **Update List**: Sync [SKILLS_LIST.md](./SKILLS_LIST.md) with the new path and description.
6. **Commit**: Save the changes to Git:
   ```bash
   git add . && git commit -m "feat: add <skill-name> to external arsenal"
   ```

## 📜 Guiding Principles

- **English First**: All `SKILL.md` files must be in English for maximum LLM compatibility.
- **Flattened by Default**: Keep skills as direct children of domain folders unless the domain has >10 skills (Conditional Nesting).
- **Taxonomy Alignment**: Always prioritize our local folder structure over external repository layouts.
- **Separation of Concerns**: Keep original work in `custom/` and community work in `external/`.
- **Version Control**: Keep `skills-lock.json` in Git to track external sources and hashes.
