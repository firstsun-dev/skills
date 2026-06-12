---
name: astro-scss-best-practices
description: "Best practices for styling in Astro projects using SCSS Modules, namespaced imports, and design tokens. Use when creating or refactoring components in Astro to ensure maintainable and collision-free styles."
---

# Astro & SCSS Modules Best Practices

## Core Styling Rules

### 1. SCSS Modules Only
- Use **SCSS Modules** for all components — avoid Tailwind or inline `style` props.
- Co-locate `ComponentName.module.scss` with every component.
- Reference styles via `styles.className`.

### 2. Namespaced Imports (Crucial)
- **ALWAYS** use namespaced imports for SCSS helpers and tokens.
- **NEVER** use wildcard imports (`as *`).
- This prevents namespace pollution and CSS variable conflicts.

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

// ❌ WRONG - wildcard imports
@use "@/styles/tokens/spacing" as *;
```

### 3. Use Design Tokens
- Always use CSS variables from design tokens instead of hardcoded values.
- Colors: `var(--color-*)`
- Spacing: `var(--space-*)`
- Typography: `var(--font-*)`, `var(--text-*)`

### 4. Component Isolation
- Extract repeated UI patterns into reusable components in `src/components/`.
- Shared components should handle multiple locales via translations, not parallel variants.

---

## Code Quality
- **No `eslint-disable`**: Fix the root cause of linting errors.
- **Zero Warnings Policy**: Treat warnings as errors. Run `pnpm lint` after changes.
- **Path Aliases**: Use `@/` for `src/` and other defined aliases instead of relative paths like `../../`.
