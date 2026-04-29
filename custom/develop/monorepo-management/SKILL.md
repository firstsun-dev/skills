---
name: monorepo-management
description: "Master monorepo management. Use this to set up or optimize multi-package repositories using Turborepo, pnpm workspaces, or Nx."
---

# Monorepo Management

Build and scale efficient multi-package repositories using modern tools.

## Supported Tools

Read the specific reference based on the project's toolset:

- **Turborepo**: Task running and caching.
  - See [references/TURBO.md](references/TURBO.md).
- **pnpm Workspaces**: Dependency management and workspaces.
  - See [references/PNPM.md](references/PNPM.md).
- **Nx**: Advanced graph analysis and polyglot support.
  - See [references/NX.md](references/NX.md).

---
## Best Practices
- **Shared Configs**: Centralize ESLint, TS, and Prettier configs in `packages/config`.
- **Acyclic Graph**: Ensure dependencies only flow in one direction.
