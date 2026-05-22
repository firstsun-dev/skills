# pnpm Workspaces Best Practices

Efficient dependency management in multi-package repositories.

## 1. Setup (`pnpm-workspace.yaml`)
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

## 2. Shared Configs & Catalogs
### pnpm Catalogs (v9+)
Centralize versions in `pnpm-workspace.yaml`:
```yaml
catalogs:
  default:
    react: ^19.0.0
    typescript: ^5.0.0
```
Then use in `package.json`: `"react": "catalog:"`.

### .npmrc
```ini
shamefully-hoist=true
auto-install-peers=true
```

## 3. Core Commands
- `pnpm add <dep> --filter <pkg>`: Add to specific package.
- `pnpm -r build`: Build all packages.
- `pnpm update -r`: Update all dependencies.
