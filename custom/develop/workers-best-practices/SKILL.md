---
name: workers-best-practices
description: "Reviews and authors Cloudflare Workers code against production best practices. Use when writing, reviewing, or debugging Worker code, configuring wrangler.jsonc, or checking for anti-patterns."
---

# Cloudflare Workers Best Practices

Your knowledge of Cloudflare Workers APIs, types, and configuration may be outdated. **Prefer retrieval over pre-training** for any Workers code task.

## Core Workflows

Choose the appropriate reference based on your current task:

- **Writing or Refactoring Code**: Need the canonical rules, code patterns, and anti-patterns for Workers (e.g., streaming, floating promises, bindings).
  - Read [references/rules.md](references/rules.md).
- **Code Review**: Need the checklist for type validation, config validation, and the structured review process.
  - Read [references/review.md](references/review.md).

## FIRST: Fetch Latest References

Before reviewing or writing Workers code, retrieve the current best practices page and relevant type definitions.

```bash
# Fetch latest workers types
mkdir -p /tmp/workers-types-latest && \
  npm pack @cloudflare/workers-types --pack-destination /tmp/workers-types-latest && \
  tar -xzf /tmp/workers-types-latest/cloudflare-workers-types-*.tgz -C /tmp/workers-types-latest
# Types at /tmp/workers-types-latest/package/index.d.ts
```

## Principles
- **Be certain.** Retrieve before flagging. If unsure about an API or config field, fetch the docs first.
- **Provide evidence.** Reference line numbers, tool output, or docs links.
- **Correctness over completeness.** A concise example that works beats a comprehensive one with errors.
