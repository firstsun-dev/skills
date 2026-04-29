# Edge-First Development

Ensuring local development matches the Cloudflare Workers runtime (`workerd`).

## Environment Alignment

To avoid "works in Node, breaks in Workers" issues:
- **Astro 6+**: Use the built-in `workerd` dev server.
- **Legacy/Full Simulation**: Always test complex logic with `npx wrangler pages dev` or `wrangler dev --remote`.
- **No Node.js Built-ins**: Avoid `fs`, `path`, or `crypto` (use `globalThis.crypto` instead).

## Bindings & Locals

Access your D1 database and other bindings through `context.locals.runtime.env`:
```ts
const db = drizzle(context.locals.runtime.env.DB);
```
Ensure `wrangler types` is run to maintain type safety for the `Env` interface.
