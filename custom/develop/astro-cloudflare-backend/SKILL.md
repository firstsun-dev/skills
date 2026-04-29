---
name: astro-cloudflare-backend
description: "Best practices for backend development in Astro and Cloudflare projects using D1, Drizzle ORM, Astro Actions, and OpenAPI. Includes patterns for DB mutations, migrations, schema changes, and API documentation."
---

# Astro & Cloudflare Backend Best Practices

Comprehensive rules for building secure and maintainable backends on Cloudflare using Astro.

## Astro Actions & API Design

### 1. Centralized Mutations
- All DB mutations MUST go through **Astro Actions** in `src/actions/index.ts`.
- Never write directly to D1 from `.astro` components or one-off API routes.

### 2. Action Naming
- **Public actions**: camelCase, no prefix — e.g., `getLikes`, `submitComment`.
- **Admin actions**: `admin` prefix — e.g., `adminGetComments`, `adminFetchFeed`.

### 3. Handler Pattern (The Three Rules)
Every action handler must follow these standards:
1. **Guard the binding**: Return a safe fallback if `DB` is absent (for local dev).
2. **Try/Catch wrapping**: Read operations return fallbacks; write operations may throw.
3. **Input Validation**: Use `z` from `astro:schema` (not raw `zod`).

```ts
import { z } from "astro:schema";

export const server = {
  myAction: defineAction({
    input: z.object({ slug: z.string() }),
    handler: async (input, context) => {
      // 1. Guard
      if (!context.locals.runtime?.env?.DB) return { success: false };
      
      try {
        // 2. Try/Catch + Drizzle
        const result = await db.select()...get();
        return result || { data: null };
      } catch (error) {
        console.error("D1 Error:", error);
        throw new ActionError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }
  })
};
```

### 4. Auth Guards
- All admin actions must call `verifyAuth` at the top:
```ts
if (!(await verifyAuth(context))) throw new Error("Unauthorized");
```

### 5. OpenAPI Documentation
- Document actions in `src/pages/console/openapi.yml.ts`.
- Update the spec in the same commit whenever an action's input/output shape changes.

---

## Database (D1 & Drizzle ORM)

### 1. Env Var Access Pattern
Always try runtime first, fall back to `import.meta.env`:
```ts
const SECRET = (runtime?.env?.SECRET_KEY || import.meta.env.SECRET_KEY || "").toString().trim();
```

### 2. Schema Changes & Migrations
1. Edit `src/db/schema.ts`.
2. Run `pnpm run db:generate` to create the migration file.
3. Run `pnpm run db:migrate` for local D1.
4. **Before Production Deploy**: Run `wrangler d1 execute <db-name> --remote --file=migrations/<generated>.sql`.
5. Finally, `wrangler deploy`.

> [!WARNING]
> **NEVER** manually create or edit files in `migrations/`. Always go through `db:generate` to avoid journal/snapshot drift.

### 3. Soft Delete Pattern
Use a `deletedAt` timestamp instead of SQL `DELETE` for tables needing trash/restore functionality.

```ts
// Soft delete
await db.update(table).set({ deletedAt: new Date() }).where(eq(table.id, id));
```
