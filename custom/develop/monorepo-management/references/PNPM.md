# pnpm Workspaces Best Practices

Efficient dependency management in multi-package repositories.

## 1. Setup (`pnpm-workspace.yaml`)
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

## 2. Shared Configs (`.npmrc`)
```ini
shamefully-hoist=true
auto-install-peers=true
strict-peer-dependencies=true
```

## 3. Core Commands
- `pnpm add <dep> --filter <pkg>`: Add to specific package.
- `pnpm -r build`: Build all packages.
- `pnpm update -r`: Update all dependencies.
