---
name: firstsun-project-init
description: "Bootstraps a firstsun-dev project end-to-end: selects relevant skills, scaffolds the agent harness, creates or reconciles the GitHub repository, applies repository metadata and README standards, and classifies the project under Firstsun Dev governance. New projects default to Workshop and are not automatically promoted into the organization profile, pinned repositories, or case studies."
origin: firstsun-dev/skills
---

# Firstsun Project Init

Bootstrap the project, not the publicity.

This skill prepares a new or existing `firstsun-dev` project so it is technically ready to work on and consistent with Firstsun Dev's repository standards. It installs the right skills, scaffolds the agent harness, creates or reconciles the GitHub repository, establishes public-facing metadata and README expectations, and records the project's current brand tier.

A newly created repository does **not** automatically deserve organization-profile placement, a pinned slot, or a case study. New projects default to **Workshop**. Promotion is earned later through observable engineering evidence.

## Firstsun Dev repository model

Firstsun Dev is the engineering arm of Firstsun / 首陽問路.

> Build useful things. Operate them well. Share what we learn.

Repository governance uses three tiers:

- **Workshop** — the default for new, experimental, early, or narrowly internal-facing projects. Public is allowed when appropriate, but Workshop repos are not automatically promoted or featured.
- **Supporting** — a project with a clear problem, usable or reproducible workflow, baseline verification, and enough maturity to represent part of the Firstsun engineering ecosystem.
- **Flagship** — a deliberately curated project with real external use or meaningful production dogfooding, sustained maintenance, operational evidence, and a distinct role in the Firstsun Dev brand story.

Promotion is a curation decision, not a side effect of repository creation.

## Prerequisites

Before starting, infer from the conversation or existing codebase when possible. Only ask when a required fact cannot be resolved safely.

Resolve:

- project name and one-sentence purpose
- local project directory
- visibility — public or private
- whether this is a new repository or an existing one
- main tech stack and deployment/runtime shape
- whether the project already has users, production usage, or other evidence relevant to later classification

## Step 1 — Select and install skills

Do not infer skills from the repository name alone. Match them to the actual stack, domain, and workflow.

Only select skills that already live under `firstsun-dev/skills` in `custom/` or `external/`. If the catalog has a gap, flag the gap instead of silently pulling an unrelated skill from elsewhere.

1. Read the current `SKILLS_LIST.md`.
2. Use `find-skills` when available to surface likely candidates.
3. Cross-check suggestions against the actual project.
4. Favor precision over quantity.
5. Install approved skills through `npx skills add` so `skills-lock.json` records the source and version.

```bash
cd <project-dir>
npx skills add firstsun-dev/skills/<domain>/<skill-name>
```

Do not hand-copy skill directories into the project.

## Step 2 — Scaffold the agent harness

Invoke `firstsun-harness` for the target project.

Let that skill decide which reliability artifacts are appropriate, such as `CLAUDE.md`, `AGENTS.md`, `feature_list.json`, `progress.md`, `init.sh`, and `session-handoff.md`.

The harness is an engineering baseline, not a branding artifact. Keep it proportional to project complexity.

## Optional — GitHub Issues and project-board integration

Use GitHub Issues when the project benefits from durable, cross-session work tracking. The harness and Issues should reinforce one another rather than become independent sources of truth.

Useful patterns include:

- derive or reconcile local feature state from open Issues
- use the Issue body as the implementation scope boundary
- post meaningful session handoffs to the related Issue
- include Issue state in Definition of Done
- use labels and assignees to reduce multi-agent collisions

Before adding work to the shared organization project, read the current board conventions instead of relying on stale field IDs or copied assumptions.

## Step 3 — Create or reconcile the GitHub repository

Repository creation is externally visible and not trivially reversible. Show the intended repository name, visibility, description, and topics before creating it.

### Metadata contract

Keep GitHub metadata focused and non-promotional.

**Description** should answer what the project is or what problem it solves.

Good:

> Obsidian plugin for selective file sync with GitHub, GitLab, and Gitea.

Avoid self-awarded adjectives and technology dumps such as:

> Powerful production-grade Firstsun AI platform built with TypeScript, Docker, and Cloudflare.

**Topics** are for discovery taxonomy only: domain, ecosystem, and primary technology when useful. Do not add `firstsun`, `portfolio`, `side-project`, or similar branding topics merely for ownership signaling.

**Homepage URL** should point to a real product page, documentation site, live app, or distribution page when one exists. Leave it empty rather than linking somewhere irrelevant just to fill the field.

For an existing repository, reconcile metadata instead of recreating it.

### Public README contract

For public Supporting or Flagship candidates, and for Workshop repos intended for outside users, the canonical `README.md` should be **English-first**.

Traditional Chinese is a first-class localization when useful, but prefer a separate localized document such as `README.zh-TW.md` or `USAGE_zh.md` rather than paragraph-by-paragraph bilingual duplication.

The first viewport should answer, as quickly as practical:

1. **What is this?**
2. **Who is it for / what problem does it solve?**
3. **Why does it matter or what is the primary value?**
4. **Can I use or verify it now?** — release, demo, screenshot, CI, install path, or equivalent when relevant

Recommended order:

```text
Project name
One-line value / problem statement
Useful status evidence
Screenshot or demo when relevant
How it works / usage
Architecture / development details
Attribution / Firstsun relationship
```

Do not force a common Firstsun banner, logo, or decorative badge set across repositories. Product identity comes first. Firstsun ownership or maintenance belongs in secondary attribution:

- `A Firstsun Dev project.` for owned projects
- `Maintained by Firstsun Dev.` for maintained forks

For forks, preserve upstream attribution clearly and distinguish inherited functionality from Firstsun-authored changes.

### Evidence-first presentation

Prefer verifiable evidence over self-description:

- CI status
- release state
- live downloads when meaningful
- compatibility tests
- public service health
- architecture documentation
- reproducible test or deployment paths

Avoid turning a temporary snapshot metric into the central brand claim.

### Existing organization conventions

Project initialization should respect current organization-wide engineering conventions, but it should not hard-code assumptions that conflict with existing projects. When a distribution, workflow, registry, deployment, or project-board policy already exists elsewhere in Firstsun Dev, inspect the current source of truth and reuse the appropriate convention for this project.

## Step 4 — Classify the project

Every initialized project receives a brand tier, but initialization itself never grants promotion.

### Default: Workshop

New projects default to **Workshop** even when public.

A Workshop repository may be fully usable, have CI and releases, and be public. It is **not** automatically listed in the organization profile, pinned, or given a case study.

### Workshop → Supporting

Consider promotion only when evidence shows most of the following:

- clear, concrete problem or use case
- README explains the project without requiring insider context
- reproducible installation, execution, or demo path
- baseline verification such as tests, lint, build, or equivalent
- reasonable maintenance state
- public metadata follows the Firstsun repository contract

Promotion should still be an explicit curation decision.

### Supporting → Flagship

Flagship status has a substantially higher bar. A candidate should demonstrate most of the following:

- real external usage or meaningful production dogfooding
- sustained maintenance rather than one-time implementation
- operational evidence such as compatibility testing, releases, monitoring, service status, or reliability practices
- clear technical or product decisions with meaningful trade-offs
- a distinct role that adds something not already represented by existing flagships
- mature public presentation and attribution

A project is not Flagship merely because it is technically complex or personally exciting.

## Step 5 — Evaluate public brand placement

This step is an evaluation, **not an automatic write to `.github/profile/README.md`**.

### Organization profile

Only add a repository to the organization profile when it materially improves the curated Firstsun Dev story. The profile should favor selected flagship stories, the shared engineering and operational backbone, and a deliberately small set of supporting projects.

Do not treat the organization profile as a complete repository index.

### Pinned repositories

Pinned repositories are a storefront, not an inventory list. Do not pin a repository simply because it is new, public, or recently active.

### Case studies

Do not create a case study as part of initialization.

A public engineering case study is justified when there is a real story with evidence:

```text
Context
→ Constraint
→ Decision
→ Trade-offs
→ Operational evidence
→ What changed / what we learned
```

A case study should not be a longer README, a technology list, or a portfolio-style feature recap.

### Private implementations

Private repositories are not portfolio objects by themselves. When a private system becomes brand-relevant, expose an appropriate public evidence surface instead: architecture overview, design decisions, operating model, service status, deployment or monitoring evidence, or lessons learned.

## Definition of done

- [ ] Relevant skills selected from `firstsun-dev/skills` and installed through the supported skill workflow
- [ ] Agent harness created or reconciled through `firstsun-harness`
- [ ] Repository exists under `firstsun-dev` or the existing repository was reconciled
- [ ] Repository visibility is intentional
- [ ] Description expresses project value rather than branding or self-evaluation
- [ ] Topics are discovery-oriented
- [ ] Public README follows the English-first / first-viewport contract when intended for outside users
- [ ] Project follows the current applicable organization engineering conventions
- [ ] Project is classified; **new projects default to Workshop**
- [ ] No organization-profile, pinning, or case-study promotion happened merely because initialization completed
- [ ] Any promotion beyond Workshop was based on explicit evidence and an intentional curation decision
