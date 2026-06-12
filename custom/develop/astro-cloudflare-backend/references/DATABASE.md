# Cloudflare D1 & Drizzle ORM

Best practices for data modeling and migrations on Cloudflare D1.

## Performance: D1 Batching (Crucial)
Cloudflare D1 is HTTP-based. To minimize latency, **ALWAYS** use `db.batch()` when executing multiple independent queries in a single action.
```ts
// ✅ CORRECT - Executed in a single round-trip
const [user, posts] = await db.batch([
  db.select().from(users).where(eq(users.id, id)),
  db.select().from(posts).where(eq(posts.authorId, id))
]);
```

## Schema Changes & Migrations
1. Edit `src/db/schema.ts`.
2. Run `pnpm run db:generate` to create the migration file.
3. Run `pnpm run db:migrate` for local D1.
4. **Before Production Deploy**: Run `wrangler d1 execute <db-name> --remote --file=migrations/<generated>.sql`.
5. Finally, `wrangler deploy`.

> [!WARNING]
> **NEVER** manually create or edit files in `migrations/`. Always go through `db:generate` to avoid journal/snapshot drift.

## Data Patterns

### Env Var Access
Always try runtime first, fall back to `import.meta.env`:
```ts
const SECRET = (runtime?.env?.SECRET_KEY || import.meta.env.SECRET_KEY || "").toString().trim();
```

### Soft Delete Pattern
Use a `deletedAt` timestamp instead of SQL `DELETE` for tables needing trash/restore functionality.
```ts
// Soft delete
await db.update(table).set({ deletedAt: new Date() }).where(eq(table.id, id));
```
