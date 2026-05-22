---
name: monorepo-management
description: "Master monorepo management. Use this to set up or optimize multi-package repositories using Turborepo, pnpm workspaces, or Nx."
origin: firstsun-dev/skills
---

# Monorepo Management

Build and scale efficient multi-package repositories using modern tools.

## Supported Tools

Read the specific reference based on the project's toolset:

- **pnpm Workspaces**: Advanced dependency management with Catalogs.
  - See [references/PNPM.md](references/PNPM.md).
- **Turborepo**: High-performance task running and caching.
  - See [references/TURBO.md](references/TURBO.md).
- **Nx**: Advanced graph analysis and polyglot support.
  - See [references/NX.md](references/NX.md).
- **Boundary Enforcement**: Architecture safety and dependency rules.
  - See [references/BOUNDARY.md](references/BOUNDARY.md).

---
## Best Practices
- **pnpm Catalogs**: Use `catalogs` in `pnpm-workspace.yaml` to centralize dependency versions across the monorepo.
- **Shared Configs**: Centralize ESLint, TS, and Prettier configs in the root or a dedicated `packages/config`.
- **Boundary Enforcement**: Use ESLint `no-restricted-imports` to forbid relative imports across package boundaries.
- **Acyclic Graph**: Ensure dependencies only flow in one direction using graph analysis tools.
