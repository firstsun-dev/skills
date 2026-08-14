# Firstsun Skills

**Reusable AI agent skills for engineering workflows.**

Firstsun Skills is the shared skill repository used across Firstsun Dev projects. It keeps Firstsun-maintained skills and reviewed third-party skills in one place so coding agents can reuse the same engineering practices without copying prompt fragments between repositories.

The repository is intentionally provider-neutral. Skills may be used from Claude Code, Gemini CLI, Codex, or other compatible agent environments when the underlying skill format is supported.

## What lives here

### Firstsun-maintained skills

`custom/` contains skills created or substantially adapted for Firstsun engineering workflows.

Examples include project initialization, agent harness design, project management, Cloudflare development conventions, reliability practices, and repository automation.

### External skills

`external/` contains third-party community skills retained with their source and version information for review, reuse, and controlled updates.

External skills remain attributable to their original authors. Their presence in this repository does not imply Firstsun authorship.

### Gem instruction sets

`gem/` contains composed instruction sets for workflows that benefit from a larger bundled context instead of individual agent skills.

## Catalog

See [SKILLS_LIST.md](./SKILLS_LIST.md) for the current catalog and repository taxonomy.

## Installation

### Install a single skill

Use `npx skills add` so the project records the source in its skill lockfile rather than copying files manually.

```bash
npx skills add firstsun-dev/skills --skill=<skill-name>
```

For a checked-out local repository, the existing scripts can also register or export groups of skills:

```bash
# Register repository skills globally for supported agents
./setup.sh

# Export a domain into the current project
./export.sh <domain>
```

## Adding external skills

When adding a community skill, preserve provenance and keep the local taxonomy stable:

1. Add the upstream skill with `npx skills add` into a temporary local agent directory.
2. Review the skill before moving it into `external/`.
3. Place it in the appropriate local domain rather than mirroring an arbitrary upstream directory layout.
4. Keep the source/version information in `skills-lock.json` where applicable.
5. Update [SKILLS_LIST.md](./SKILLS_LIST.md).
6. Commit the skill and attribution changes together.

A third-party skill should not be silently rewritten into a Firstsun-maintained skill. If Firstsun substantially changes its behavior or policy, move the maintained variant into `custom/` and keep the lineage clear.

## Repository principles

- **English-first skills** — canonical `SKILL.md` instructions are written in English for agent interoperability.
- **Provider-neutral by default** — do not couple a reusable skill to one agent unless the task itself is provider-specific.
- **Precision over volume** — a small set of relevant installed skills is better than loading every available skill into every project.
- **Clear provenance** — distinguish Firstsun-maintained work from third-party community work.
- **Taxonomy alignment** — organize skills around how they are used in Firstsun engineering workflows.
- **Versioned sources** — retain lock/source information so external updates can be reviewed instead of drifting silently.

## Project initialization

[`firstsun-project-init`](./custom/basic/firstsun-project-init/SKILL.md) applies the Firstsun Dev repository baseline to new projects.

New repositories default to **Workshop** status. Initialization prepares the engineering baseline; it does not automatically grant organization-profile placement, a pinned slot, or a case study. Promotion to Supporting or Flagship status is based on evidence and deliberate curation.

## Firstsun Dev

Firstsun Skills is maintained as part of [Firstsun Dev](https://github.com/firstsun-dev), the engineering arm of Firstsun / 首陽問路.

> Build useful things. Operate them well. Share what we learn.
