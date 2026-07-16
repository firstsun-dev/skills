---
name: firstsun-dev-conventions
description: Comprehensive coding conventions and guardrails for Firstsun projects (Astro, React, Cloudflare). Integrates backend, styling, i18n, and testing standards.
origin: firstsun-dev/skills
priority: authoritative
---

# Firstsun Dev Conventions

Core rules always in effect for Firstsun projects. For domain-specific detail, read the relevant reference file before writing code.

| Situation | Read |
|---|---|
| Edge runtime (workerd), bindings, and env vars | [references/environment.md](references/environment.md) |
| Writing DB mutations / Astro Actions | [references/database.md](references/database.md) |
| Adding or changing actions / updating OpenAPI spec | [references/api.md](references/api.md) |
| Adding SEO tags, RSS, or sitemap changes | [references/seo-rss.md](references/seo-rss.md) |
| Adding images, tools (mini-apps), or content queries | [references/tools-images.md](references/tools-images.md) |
| Writing or planning e2e tests | [references/testing.md](references/testing.md) |
| Creating or modifying tool pages under `src/apps/tools/` | [references/tool-pages.md](references/tool-pages.md) |
| CI/CD, deployment, and GitHub Actions | [references/cicd.md](references/cicd.md) |
| Branching, commit messages, or git hooks (husky) | [references/git-workflow.md](references/git-workflow.md) |

---

## Code Quality

**No `eslint-disable` comments.** Fix the root cause. If the file is dependency-emitted and you truly can't touch it, document why in a comment.

**After every code change, run `pnpm lint` and confirm zero errors and zero warnings before considering the task done.** Warnings are not acceptable — treat them the same as errors and fix them immediately.

---

## Component Architecture

**Share components between ZH-TW and EN pages.** Both locales render the same React/Astro components — don't create parallel `PostCardZh`/`PostCardEn` variants. Handle locale-specific text via `useTranslations` (see i18n section).

**Component Isolation.** Extract repeated UI patterns into reusable components in `src/components/`. A component used in more than one place → pull it out.

---

## Styling

**SCSS Modules only — no Tailwind, no inline `style` props.** Co-locate `ComponentName.module.scss` with every component. Use `styles.className` references.

**Use design tokens** from `src/styles/tokens/` instead of hardcoded values:

| Category | Token pattern |
|---|---|
| Color | `var(--color-*)` |
| Spacing | `var(--space-*)` |
| Typography | `var(--font-*)`, `var(--text-*)` |
| Radius / Shadow / Motion | `var(--radius-*)`, `var(--shadow-*)`, `var(--duration-*)` |

**Reuse mixins** — check `src/styles/mixins/` (`_flex.scss`, `_layout.scss`, `_text.scss`) before writing custom helpers.

**Dark mode** — handled by tokens via `:root` / `[data-theme="dark"]`. Don't add `prefers-color-scheme` queries manually.

**SCSS imports — ALWAYS use namespaced imports, NEVER wildcard (`as *`):**

```scss
// ✅ CORRECT - namespaced imports
@use "@/styles/tokens/spacing" as spacing;
@use "@/styles/tokens/colors" as colors;
@use "@/styles/mixins/flex" as flex;
@use "@/styles/breakpoints/breakpoints" as bp;
@use "sass:map";

.container {
    @include flex.flex-col;
    gap: var(--space-4);
}

// ❌ WRONG - wildcard imports cause namespace pollution
@use "@/styles/tokens/spacing" as *;
@use "@/styles/tokens/colors" as *;
@use "@/styles/mixins/flex" as *;
```

**Why:** Wildcard imports (`as *`) pollute the global namespace and can cause CSS variable conflicts with parent components (e.g., ToolLayout styles being overridden). Always use explicit namespaces to avoid naming collisions.

---

## i18n

**Use `useTranslations` — no `if lang === 'zh-tw'` branches for UI strings:**

```ts
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
// t('nav.home'), t('blog.readMore')
```

Add missing keys to both locales in `src/i18n/ui.ts` before use — edit `src/i18n/ui.ts` directly and add the key under both `zh-tw` and `en`. Structural/routing logic may use `lang` directly — that's not a UI string.

---

## SVG / Icons

**Use `astro-icon` — not inline SVG or `<img src="*.svg">`:**

```astro
import { Icon } from 'astro-icon/components';
<Icon name="mdi:home" />
```

---

## E2E Testing / data-testid

**Before running e2e tests, always build them first:**

```bash
pnpm build:e2e    # Build e2e test suite
pnpm test:e2e     # Then run tests
```

The build step compiles Playwright fixtures and test setup — skipping it will cause test failures.

**Always use stable English keys for `data-testid`** — never use translated labels or Chinese text.

```astro
// ✅ CORRECT — stable, locale-independent
data-testid={`nav-link-${item.key}`}   // e.g. "nav-link-tools", "nav-link-tech"

// ❌ WRONG — breaks when locale changes or labels are renamed
data-testid={`nav-link-${item.label.toLowerCase()}`}  // e.g. "nav-link-工具"
```

For nav items, define a `key` field (English string) alongside `i18nKey`, and use `key` for testid generation. Tests reference testids like `nav-link-tools`, never `nav-link-工具`.

---

## TypeScript Path Aliases

Never climb with `../../`. Use project aliases:

| Alias | Resolves to |
|---|---|
| `@/` | `src/` |
| `@layouts/` | `src/layouts/` |
| `@assets/` | `src/assets/` |
| `@consts` | `src/consts.ts` |
