# D1 Drizzle Schema Workflow

Step-by-step guide for scaffolding and maintaining a Drizzle ORM data layer on Cloudflare D1.

## Workflow

### 1. Generate Drizzle Schema
Create schema files using D1-correct column patterns (see [references/COLUMNS.md](COLUMNS.md)).

### 2. Export Types
Always export inferred types for every table:
```typescript
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

### 3. Set Up Scripts
Add to `package.json`:
```json
{
  "db:generate": "drizzle-kit generate",
  "db:migrate:local": "wrangler d1 migrations apply DB --local",
  "db:migrate:remote": "wrangler d1 migrations apply DB --remote"
}
```

### 4. Bulk Insert Pattern
D1 limits bound parameters to 100. Calculate batch size:
```typescript
const BATCH_SIZE = Math.floor(100 / COLUMNS_PER_ROW)
for (let i = 0; i < rows.length; i += BATCH_SIZE) {
  await db.insert(table).values(rows.slice(i, i + BATCH_SIZE))
}
```

### 5. Runtime Usage
```typescript
import { drizzle } from 'drizzle-orm/d1'
const db = drizzle(env.DB, { schema })
```
