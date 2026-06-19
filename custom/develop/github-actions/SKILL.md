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
