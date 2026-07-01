---
name: github-actions
description: Unified CI/CD workflow patterns for monorepos, including path-based filtering, semantic release, and Cloudflare deployment. Replaces the legacy React Native focus with modern web standards.
origin: firstsun-dev/skills
priority: authoritative
---

# GitHub Actions (Unified Workflow)

## Overview

Modern CI/CD patterns for monorepos focusing on efficiency, path-based execution, and automated release cycles. This skill prioritizes the "Unified Workflow" architecture used in Firstsun projects.

## When to Apply

Use this skill when:
- Setting up CI/CD for a monorepo (pnpm workspaces).
- Implementing path-based job filtering to reduce CI costs and time.
- Automating Cloudflare Workers/Pages deployment.
- Integrating `semantic-release` for automated versioning and tagging.
- Configuring self-hosted runners or specific environments (NAS/Backup sites).

## Quick Reference

1. **Path Filtering**: Use `dorny/paths-filter` to detect changes in specific apps or packages.
2. **Needs Mechanism**: Chain jobs using `needs` to ensure correct execution order (Prepare -> App Jobs -> Deploy -> Release).
3. **Environment Isolation**: Define shared variables at the top-level `env` and sensitive secrets in GitHub Settings.
4. **Self-hosted Runners**: Specify `runs-on: self-hosted` for internal infrastructure deployment.
5. **Action Versions**: Always pin to the latest major version of each action, matching what `firstsun-dev/.github` (org-wide workflows repo) uses (e.g. `actions/checkout@v6`, `actions/setup-node@v6`, `pnpm/action-setup@v6`, `dorny/paths-filter@v4`, `actions/upload-artifact@v7`, `actions/download-artifact@v8`). Check the local clone's `.github/workflows/` and `actions/setup/action.yml` for the current authoritative versions before writing a new workflow — don't rely on stale examples.
6. **Node Version**: Default to the latest LTS (currently Node 24); Node 22 is the minimum supported floor.

## References

| File | Description |
|------|-------------|
| [unified-workflow.md](./references/unified-workflow.md) | Template for a unified monorepo CI/CD pipeline |
| [cloudflare-deploy.md](./references/cloudflare-deploy.md) | Deployment patterns for Cloudflare Workers and D1 |

## Problem -> Skill Mapping

| Problem | Start With |
|---------|------------|
| Setup a full CI/CD pipeline from scratch | [unified-workflow.md](./references/unified-workflow.md) |
| Automate Cloudflare Workers deployment | [cloudflare-deploy.md](./references/cloudflare-deploy.md) |
