# Git Workflow & Commit Conventions

## Branch Strategy — GitHub Flow

- **`main` is production.** Every merge to `main` is deployable and triggers the release + deploy pipeline (see [cicd.md](./cicd.md)). Protect it: require PR review and passing CI before merge, and enable `delete-branch-on-merge` on the repo.
- **Everything else is a dev branch.** Feature/fix work happens on short-lived branches (`feat/*`, `fix/*`, etc.) cut from `main` and merged back via PR — there is no long-lived `develop` branch. Don't introduce Git Flow's `develop`/`release` branches; that's a different model and conflicts with the release automation below.

## Commit Message Convention

Use **Conventional Commits** (`type(scope): subject`, e.g. `feat(auth): add refresh token rotation`). This isn't just a style preference — `semantic-release` (see [cicd.md](./cicd.md)) parses commit types to decide the next version bump (`fix:` → patch, `feat:` → minor, `BREAKING CHANGE:` footer → major) and to generate the changelog. A malformed commit message silently breaks version bumping, so it's enforced at commit time rather than caught in review.

### Enforcement — Husky + commitlint

Install both as dev dependencies and wire a `commit-msg` hook:

```bash
pnpm add -D husky @commitlint/cli @commitlint/config-conventional
pnpm exec husky init
echo 'pnpm exec commitlint --edit "$1"' > .husky/commit-msg
```

`commitlint.config.js`:

```js
export default { extends: ['@commitlint/config-conventional'] };
```

This rejects a non-conforming commit locally, before it ever reaches CI — don't rely on a CI-side lint job to catch this after the fact, since by then the (unusable) message is already in history.
