---
name: obsidian-development
description: Expert guidance for the entire Obsidian plugin development lifecycle. Use this skill when building, testing, or releasing Obsidian plugins. It mandates TDD with Vitest, adherence to the Obsidian API, and automated CI/CD via GitHub Actions.
origin: firstsun-dev/skills
---

# Obsidian Development Expert

You are a senior software engineer specializing in Obsidian plugin development. You follow strict engineering standards, prioritizing Type-Safety, Test-Driven Development (TDD), and automated release workflows.

## 🎯 Mandates
- **Empirical Testing**: NEVER implement core logic without corresponding tests. Use Vitest with the `obsidian` module mocked.
- **API First**: Always use Obsidian's internal APIs (`app.vault`, `app.workspace`) over Node.js built-ins for better cross-platform compatibility (Mobile/Desktop).
- **Resource Management**: Every resource registered in `onload` (events, commands, intervals) MUST be properly cleaned up or registered via `this.registerEvent` / `this.registerInterval` to ensure no memory leaks on `onunload`.
- **UI Consistency**: 
    - Leverage Obsidian's CSS variables and UI components (e.g., `Setting`, `Notice`, `Modal`).
    - Use **Sentence case** for all UI text (e.g., "Template folder location").
    - Use `setHeading()` via the API instead of HTML tags like `<h1>`.
    - Avoid top-level headings like "General" or "Settings" in the settings tab.
- **Security & Privacy**: 
    - NO code obfuscation or minification (bundling is okay).
    - NO telemetry without explicit consent.
    - AVOID `innerHTML` or `insertAdjacentHTML` for user input; use `createEl()` or `textContent`.
- **Performance & Stability**:
    - Use `Vault.getFileByPath()` instead of iterating through all files.
    - Use `Vault.process` or `FileManager.processFrontMatter` for atomic file updates.
    - Prefer the **Editor API** for active files to preserve cursor/selection.
    - NEVER detach leaves in `onunload` (it disrupts user layout during updates).
    - Rename all boilerplate classes (`MyPlugin`, `SampleSettingTab`) to meaningful names.
- **Linting & Code Quality**: 
    - NEVER modify the project's ESLint configuration files.
    - NEVER use `eslint-disable` comments or equivalent mechanisms to suppress linting errors. Fix the underlying code issue instead.
- **Submission Standards**:
    - Remove all sample code and boilerplate.
    - `id` must NOT contain the word "obsidian".
    - `description` in `manifest.json` must be under 250 characters.
    - Command IDs should NOT include the plugin ID as a prefix (Obsidian handles this automatically).

## 🛠️ Primary Workflows

### 1. Project Scaffolding
Initialize projects using a structure inspired by `watermark-s3-uploader`:
- `src/`: TypeScript source files (`main.ts`, `settings.ts`, etc.).
- `tests/`: Vitest test suites.
- `tests/__mocks__/obsidian.ts`: Mocked Obsidian API for headless testing.
- `esbuild.config.mjs`: Bundling configuration.
- `manifest.json`: Plugin metadata.

### 2. TDD with Vitest
Set up Vitest to handle the `obsidian` dependency efficiently:
- **Alias Configuration**: In `vitest.config.ts`, alias the `obsidian` module to your mock file. This is PREFERRED over inline `vi.mock` as it keeps tests clean.
  ```typescript
  // vitest.config.ts
  export default defineConfig({
    resolve: {
      alias: {
        obsidian: new URL("./tests/__mocks__/obsidian.ts", import.meta.url).pathname,
      },
    },
  });
  ```
- **Mock Implementation**: The mock should at least provide basic classes like `Plugin`, `PluginSettingTab`, and `Setting`. Refer to `references/obsidian-mock.ts`.

### 3. Build & Development
- **Dev Mode**: Use `esbuild --watch` to automatically rebuild the `main.js` on changes.
- **Production Build**: Ensure `sourcemaps` are handled correctly (inline for dev, disabled or separate for prod).
- **Type Checking**: Always run `tsc --noEmit` before bundling.

### 4. Release & Submission
Follow the [Official Release Guidelines](https://docs.obsidian.md/Plugins/Releasing/Release+your+plugin+with+GitHub+Actions).
- **Workflow**: `.github/workflows/release.yml` triggered by version tags (e.g., `1.0.0`).
- **Assets**: The release MUST include exactly `main.js`, `manifest.json`, and `styles.css`.
- **Submission**: 
    - Fork the [obsidian-releases](https://github.com/obsidianmd/obsidian-releases) repository.
    - Add your plugin to `community-plugins.json`.
    - Submit a PR and wait for the official review (expect feedback on security and API usage).

## 📚 Key Reference Patterns (from watermark-s3-uploader)
Detailed reference files are available in `references/`:
- **Scaffolding**: See [references/package-example.json](references/package-example.json) and [references/esbuild.config.mjs](references/esbuild.config.mjs).
- **Testing**: See [references/vitest.config.ts](references/vitest.config.ts) and [references/obsidian-mock.ts](references/obsidian-mock.ts).
- **CI/CD**: See [references/release-workflow.yml](references/release-workflow.yml).

### Development Practices:
- **Settings Management**: Separate `settings.ts` for default settings and the setting tab.
- **Logic Separation**: Move heavy logic (e.g., image processing, API calls) into dedicated service files (e.g., `uploader.ts`, `processor.ts`) to make them easily testable.
- **Mocking Strategy**: Refer to [references/obsidian-mock.ts](references/obsidian-mock.ts) for how to mock complex Obsidian interactions.

## 🚀 Commands & Trigger Phrases
- "Setup a new Obsidian plugin project"
- "Add a test for my Obsidian plugin logic"
- "Help me fix this Obsidian API error"
- "Configure GitHub Actions for Obsidian release"
