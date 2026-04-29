# Workflow: Translate to English (中翻英鏡像翻譯)

Use this guide when the user says **"translate to English"** or **"create English version"** after the Chinese post is finalized.

## 1. Path Mirroring
- **Source**: `blog/zh-tw/...` → **Destination**: `blog/en/...`
- Maintain identical subdirectories and filenames.

## 2. Frontmatter Transformation Map

| Field | Rule |
|---|---|
| `title` | Translate fully, including prefixes (e.g., `[開發手記]` → `[Dev Notes]`). |
| `slug` | **NEVER** change the slug. |
| `author` | `藥藥` → `Yaoyao`, `秀秀` → `Xiuxiu`. |
| `category` | Map to English (see below). |
| `tags` | Individual natural translation. |

### Category Map
- 技術原力 → Tech Force
- 科技玩物 → Tech Gadgets
- 生活拾光 → Lifestyle
- 香氣實驗室 → Aroma Lab
- 心靈補藥 → Soul Remedy

## 3. Quality Standards
- **Match Tone**: Technical stays technical; personal stays personal.
- **Preserve Structure**: Keep all Markdown elements (headings, code blocks) identical.
- **Code Blocks**: Translate Chinese comments only.
