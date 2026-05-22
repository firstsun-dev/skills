# Turborepo Best Practices

Master monorepo task running and caching with Turborepo.

## 1. Initial Setup
```bash
npx create-turbo@latest my-monorepo
```

## 2. Configuration (`turbo.json`)
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", ".wrangler/**"]
    },
    "lint": { "cache": true },
    "test": { "cache": true },
    "check": { "cache": true },
    "dev": { "cache": false, "persistent": true }
  }
}
```

## 3. Remote Caching
- **Vercel**: `npx turbo login` then `npx turbo link`.
- **Custom**: Use S3/GCS adapters in 2026 enterprise setups.
