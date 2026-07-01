# CI/CD & Deployment Conventions

## Unified Workflow

Firstsun projects use a **Unified Workflow** architecture in GitHub Actions. This pattern ensures that all applications in a monorepo are tested and deployed consistently while optimizing for speed through path-based filtering.

### Pipeline Stages

1. **Prepare**:
   - Detect changes using `dorny/paths-filter`.
   - Install dependencies with `pnpm install --frozen-lockfile`.
   - Run global `pnpm run lint`.
   - Determine the next version (e.g., via `semantic-release --dry-run`).
2. **App-specific Jobs**:
   - Run in parallel.
   - Only execute if the app or its dependencies (e.g., `packages/*`) have changed.
   - **Must** include: Unit tests, Integration tests, and E2E tests (if applicable).
3. **Deploy**:
   - Runs only on the `main` branch after all app jobs succeed.
   - Uses `wrangler` for Cloudflare deployment.
   - Executes database migrations before worker deployment.
4. **Release**:
   - Runs only on the `main` branch after successful deployment.
   - Uses `semantic-release` to create tags and GitHub Releases.

---

## Deployment Standards

### Cloudflare Workers
- **Wrangler**: Always use `pnpm exec wrangler` to ensure the workspace version is used.
- **API Token**: Use `CLOUDFLARE_API_TOKEN` secret. Never use global API keys.
- **Environments**: Use `wrangler.toml` environments (e.g., `[env.production]`) to manage different bindings.

### Database Migrations (D1)
- Migrations **MUST** be run in the CI pipeline before deployment.
- Command pattern: `pnpm run db:migrate:prod`.
- Fail the pipeline if migrations fail.

---

## Performance & Optimization

- **Node Version**: Default to the latest LTS (currently Node 24); Node 22 is the minimum supported floor. Pin via `actions/setup-node` with `node-version: 24` and `cache: 'pnpm'`.
- **Caching**: Always cache `pnpm` store and `node_modules`.
- **Self-hosted Runners**: Use `runs-on: self-hosted` for internal infrastructure or to speed up builds by avoiding public runner queue times.
- **Concurrency**: Use `concurrency` groups in workflows to cancel in-progress runs on the same branch.

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```
