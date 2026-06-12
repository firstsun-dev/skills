# Astro Actions & API Design

Comprehensive rules for building secure and maintainable APIs on Cloudflare using Astro Actions.

## Core Rules

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
