---
name: d1-drizzle-schema
description: "Generate Drizzle ORM schemas for Cloudflare D1 databases with correct D1-specific patterns."
---

# D1 Drizzle Schema

Generate correct Drizzle ORM schemas for Cloudflare D1 while avoiding D1-specific bugs.

## Core Reference

Choose the appropriate reference based on your progress:

- **Schema Workflow**: Scaffolding and bulk insert patterns.
  - Read [references/WORKFLOW.md](references/WORKFLOW.md).
- **Column Patterns**: Complete type reference for D1-compatible columns.
  - Read [references/COLUMNS.md](references/COLUMNS.md).
- **D1 Specifics**: TROUBLESHOOTING limits and SQLite differences.
  - Read [references/d1-specifics.md](references/d1-specifics.md).

---
## Critical D1 Differences
- **Bound Params**: Limit is 100 (affects batch size).
- **JSON**: Stored as TEXT, handled via `{ mode: 'json' }`.
- **FK Enforced**: Foreign keys are always ON.
