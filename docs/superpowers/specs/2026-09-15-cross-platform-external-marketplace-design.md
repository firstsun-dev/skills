# Cross-Platform Firstsun External Marketplace Design

**Date:** 2026-09-15  
**Status:** Approved for specification; implementation requires a separate plan  
**Audience:** Individual developers who want practical, curated AI-agent skills

## Context

The repository currently exposes two unrelated marketplaces:

- `.agents/plugins/marketplace.json` publishes five portable external-skill bundles for ChatGPT and Codex.
- `.claude-plugin/marketplace.json` publishes the personal, local-only `most-used-skills` bundle for Claude Code.

Their names, audiences, bundle membership, packaging model, and update paths differ. Keeping both files at the repository root also makes the repository's public product unclear. The desired outcome is one public Firstsun External catalog whose contents are identical in ChatGPT/Codex and Claude Code while retaining the manifest syntax each platform expects.

## Product Positioning

The marketplace is a curated Firstsun product, not a complete mirror presented without judgment.

- **Marketplace name:** `firstsun-external`
- **Display name:** `Firstsun External`
- **Promise:** Curated skills for practical AI development.
- **Primary user:** An individual developer improving an AI-assisted workflow.
- **Publisher role:** Firstsun selects, reviews, groups, and updates third-party skills without claiming authorship.

Every user-facing description must distinguish Firstsun curation from upstream authorship. Bundle names should describe user outcomes rather than storage taxonomy.

## Goals

1. Publish the same plugin names and skill membership to ChatGPT/Codex and Claude Code.
2. Generate both marketplace formats from one canonical catalog.
3. Keep public packages portable when imported from GitHub.
4. Make drift detectable in local verification and CI.
5. Preserve upstream provenance in canonical external skills and `skills-lock.json`.
6. Keep the weekly external-skill update workflow responsible for refreshing generated marketplace packages.

## Non-Goals

- Publishing Firstsun-maintained `custom/` skills in this marketplace.
- Combining the personal `most-used-skills` bundle with the public catalog.
- Building a web storefront, ratings system, analytics service, or paid marketplace.
- Rewriting third-party skills merely to make the marketplace uniform.
- Depending on symlinks in GitHub-imported plugin packages.

## Canonical Catalog

Add a tracked catalog file at `marketplace/external/catalog.json`. It is the only manually maintained definition of:

- marketplace identity and shared descriptions;
- plugin identifiers, display names, categories, versions, and prompts;
- source roots included in each bundle;
- exclusions that require an explicit reason.

Generated marketplace manifests and copied skill packages must not be edited directly. The generator should place a short generated-file notice beside outputs where the format permits documentation.

The catalog uses source directories rather than enumerating every skill. Recursive discovery includes every directory containing `SKILL.md`, so newly synchronized skills enter their assigned bundle automatically. Duplicate skill names across source roots are fatal because installation would otherwise be ambiguous.

## Bundle Model

The initial cross-platform catalog retains five practical bundles:

| Plugin ID | Display name | Purpose |
| --- | --- | --- |
| `agent-workflows` | Agent Workflows | Agent orchestration, research, documentation, and reasoning |
| `developer-workflows` | Developer Workflows | Code quality, DevOps, security, infrastructure, i18n, and specification workflows |
| `frontend-design` | Frontend Design | Frontend construction, design systems, responsive UI, and interaction |
| `visual-production` | Visual Production | Video, Remotion, branding, banners, and data visualization |
| `career-wellness` | Career & Wellness | Career preparation, productivity, fitness, nutrition, sleep, and psychoeducation |

The `external-` prefix is removed from plugin IDs because the marketplace name already communicates provenance. Existing OpenSpec skills under `external/develop/openspec/` join `developer-workflows`; a sixth specification bundle is unnecessary until its independent usage justifies another installation decision.

## Generated Package Layout

Each public plugin is generated once and contains both platform manifests over one shared skill directory:

```text
plugins/<plugin-id>/
├── skills/
│   └── <skill-name>/...
├── .codex-plugin/
│   └── plugin.json
└── .claude-plugin/
    └── plugin.json
```

`skills/` contains real copied files rather than symlinks. This preserves GitHub portability and prevents importer behavior from depending on symlink support. The copies remain generated artifacts; canonical third-party content stays under `external/`.

## Marketplace Outputs

The generator writes two manifests with identical ordered plugin sets:

- `.agents/plugins/marketplace.json` uses Codex source objects with `source: "local"` and paths relative to the repository root.
- `.claude-plugin/marketplace.json` uses Claude-compatible string paths.

Both manifests use `firstsun-external` as the marketplace identifier and point to the same `plugins/<plugin-id>` directories. Platform-only fields may differ, but shared identity, descriptions, version, category, and bundle membership come from the canonical catalog.

The current `tianyao-skills` marketplace and `plugin-most-used` package are removed from the repository's public root marketplace. If the personal bundle is retained, it belongs in an explicitly private/local location outside the public marketplace generation path and is not documented as part of Firstsun External.

## Generation Flow

`scripts/sync-external-marketplace.mjs` becomes the single generator:

1. Parse and validate `marketplace/external/catalog.json`.
2. Resolve each configured external source root inside the repository.
3. Discover skill directories recursively and reject duplicate names.
4. Rebuild each `plugins/<plugin-id>/skills/` directory from canonical sources.
5. Generate both plugin manifests for every bundle.
6. Generate both marketplace manifests from the same ordered plugin collection.
7. Run an internal parity check before exiting successfully.

Generation must be deterministic: running it twice without source changes produces no Git diff.

## Validation and Failure Handling

The generator exits non-zero without claiming success when it encounters:

- malformed catalog JSON or missing required fields;
- a source root outside `external/`;
- a missing source root or a skill directory without `SKILL.md`;
- duplicate plugin IDs or duplicate skill names within a bundle;
- invalid generated JSON;
- different plugin sets or skill membership between platform outputs.

Verification covers:

1. Parse the catalog and every generated manifest with a strict JSON parser.
2. Confirm both marketplace manifests expose the same ordered plugin IDs.
3. Confirm each plugin has both manifests and one shared `skills/` directory.
4. Confirm copied skill directories exactly match their canonical external sources.
5. Run `/validate-skills` against affected canonical skills according to the repository's external-upstream exception policy.
6. Run `./init.sh` and check `git status` for unexpected changes.

CI runs the generator followed by `git diff --exit-code`. Any manually edited or stale generated output therefore fails verification.

## Documentation

Update `README.md` and `SKILLS_LIST.md` to present one public catalog with two supported clients. Installation instructions must state which manifest each client consumes while promising identical bundle content. Counts are generated or verified rather than maintained as unchecked prose.

Personal/local plugins must appear in a separate section so users do not mistake them for reviewed, portable Firstsun External packages.

## Rollout

1. Introduce the canonical catalog and parity validation without changing bundle membership except for adding the omitted OpenSpec source root.
2. Generate dual manifests for all five bundles.
3. Replace both root marketplace manifests with generated `firstsun-external` outputs.
4. Update documentation and the weekly synchronization workflow.
5. Run full repository verification and inspect the generated diff.
6. Import or synchronize the GitHub marketplace in ChatGPT, then add the same repository marketplace in Claude Code and confirm matching plugin lists.

Renaming existing plugin IDs creates new marketplace entries rather than silently adopting old workspace plugin identities. The rollout accepts that clean break because the existing packages are version `0.1.0` and the new names materially improve product clarity. Existing imported plugins can be removed after the new entries are verified.

## Success Criteria

- ChatGPT/Codex and Claude Code list the same five Firstsun External plugins.
- Every corresponding plugin contains the same skill names and files.
- OpenSpec skills are present in Developer Workflows.
- A change to the canonical catalog or `external/` can refresh both platforms with one command.
- CI catches any marketplace or bundle drift.
- Public descriptions consistently communicate Firstsun curation and third-party authorship.
