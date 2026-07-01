# Unified Workflow Template

This template provides a comprehensive CI/CD pipeline for a monorepo with multiple apps and shared packages.

## Pipeline Structure (`.github/workflows/cicd.yml`)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

env:
  NODE_VERSION: 24 # use latest LTS, minimum Node 22

jobs:
  # 1. Prepare and Lint
  prepare:
    runs-on: ubuntu-latest
    outputs:
      should_run_app_a: ${{ steps.changes.outputs.app_a }}
      should_run_app_b: ${{ steps.changes.outputs.app_b }}
    steps:
      - uses: actions/checkout@v6
      - name: Check for changes
        id: changes
        uses: dorny/paths-filter@v4
        with:
          filters: |
            app_a:
              - 'apps/app-a/**'
              - 'packages/shared/**'
              - 'pnpm-lock.yaml'
            app_b:
              - 'apps/app-b/**'
              - 'packages/shared/**'
              - 'pnpm-lock.yaml'

      - uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v6
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm run lint

  # 2. App-specific Pipelines
  app-a:
    needs: prepare
    if: needs.prepare.outputs.should_run_app_a == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: pnpm/action-setup@v6
      - name: Test App A
        run: pnpm --filter app-a run test

  app-b:
    needs: prepare
    if: needs.prepare.outputs.should_run_app_b == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: pnpm/action-setup@v6
      - name: Test App B
        run: pnpm --filter app-b run test

  # 3. Deploy (Conditional on main)
  deploy:
    needs: [app-a, app-b]
    if: github.ref == 'refs/heads/main' && always() && !contains(needs.*.result, 'failure')
    runs-on: ubuntu-latest
    steps:
      - name: Deploy logic here
        run: echo "Deploying..."

  # 4. Release
  release:
    needs: deploy
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Release logic here
        run: echo "Releasing..."
```

## Key Benefits
- **Atomicity**: All checks pass before any deployment starts.
- **Efficiency**: Only apps with changes (or shared dependency changes) are tested.
- **Consistency**: Centralized linting and dependency management.
