# Design Patterns: Progressive Disclosure (/reference)

To keep the AI's context efficient and the skill precise, use the **Progressive Disclosure** pattern. This involves splitting a massive `SKILL.md` into a lightweight "Navigator" and detailed "References".

## When to Refactor
Refactor a skill into the `/reference` pattern if:
1. The `SKILL.md` exceeds **100 lines**.
2. The skill contains **multiple distinct workflows** (e.g., "Polish" vs. "Translate").
3. The skill includes **large data tables** or complex code templates that are only needed at specific stages.

## Refactoring Procedure

### 1. Create a `references/` Directory
Within the skill folder, create a `references/` subdirectory to hold the detailed guides.

### 2. Extract Logic into Modules
Break down the content into logical, task-oriented Markdown files:
- `references/ACTIONS.md`: High-level workflow logic.
- `references/RULES.md`: Specific do's and don'ts.
- `references/TEMPLATES.md`: Bulk code snippets.

### 3. Simplify the `SKILL.md` (The Navigator)
Rewrite the root `SKILL.md` to act as a router:
- Keep the `description` clear and keyword-rich for triggering.
- Use a **"Core Workflows"** or **"Supported Tasks"** section.
- Provide explicit links to the reference files: `Read [references/FILE.md](references/FILE.md) for X.`

## Benefits
- **Token Efficiency**: The AI only loads the specific details it needs for the current turn.
- **Precision**: Prevents "knowledge bleed" (e.g., translation rules interfering with a grammar check).
- **Maintainability**: Makes it easier to update specific parts of a skill without touching the global entry point.
