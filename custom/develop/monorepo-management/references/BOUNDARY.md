# Monorepo Boundary Enforcement

Prevent dependency leaks and maintain a clean architecture by enforcing strict package boundaries.

## 1. ESLint Configuration
Use `no-restricted-imports` to prevent relative path imports that skip the workspace resolution.

```javascript
// eslint.config.js
export default [
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/../packages/**", "**/../../packages/**"],
              message: "Use the workspace package name (e.g., '@my-org/ui') instead of relative paths.",
            },
          ],
        },
      ],
    },
  },
];
```

## 2. Dependency Cruiser (Advanced)
For complex graphs, use `dependency-cruiser` to define high-level architecture rules.

```json
// .dependency-cruiser.json
{
  "forbidden": [
    {
      "name": "no-cross-app-imports",
      "from": { "path": "^apps/([^/]+)/" },
      "to": { "path": "^apps/(?!$1)" }
    }
  ]
}
```
