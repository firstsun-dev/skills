# Cloudflare Deployment with GitHub Actions

Patterns for deploying Cloudflare Workers and D1 databases using `wrangler`.

## Workflow Step Template

```yaml
- name: Deploy to Cloudflare
  run: |
    cd apps/my-worker
    pnpm exec wrangler deploy
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

## D1 Database Migrations

Always run migrations before deploying the worker to ensure the schema matches the code.

```yaml
- name: Run D1 Migrations
  run: |
    cd apps/my-worker
    pnpm run db:migrate:prod
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

## Environment Secrets

- **CLOUDFLARE_API_TOKEN**: Create an API Token in Cloudflare Dashboard with "Edit Cloudflare Workers" permissions and add it to GitHub Secrets.
- **Wrangler Config**: Ensure `wrangler.toml` is correctly configured with `compatibility_date` and bindings.
