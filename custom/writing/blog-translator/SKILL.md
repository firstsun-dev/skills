---
name: blog-translator
description: "Translate blog articles from Chinese (ZH-TW) to English (EN) while maintaining frontmatter mapping, title prefixes, and project-specific directory structures. Use this skill for bulk or one-shot translation after the source article is finalized."
---

# Blog Translator (部落格翻譯官)

This skill handles the final stage of the content workflow: mirroring a finalized Chinese article into the English section of the blog.

## 1. Path Mirroring Logic
- Source: `blog/zh-tw/...`
- Destination: `blog/en/...`
- **Rule**: Replace the language prefix only; maintain all subdirectories and filenames.

## 2. Frontmatter Transformation Map

| Field | Rule |
|---|---|
| `title` | Translate fully, including prefixes (see map). |
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

### Title Prefix Map
- `[開發手記]` → `[Dev Notes]`
- `[數位選物]` → `[Digital Picks]`
- `[生活圖鑑]` → `[Life Guide]`
- `[修行成長]` → `[Growth Mindset]`

## 3. Translation Quality Standards
- **Preserve Structure**: Keep all Markdown elements (headings, code blocks, lists) identical.
- **Match Tone**: Technical stays technical; personal stays personal. Avoid "flattening" the voice into generic AI text.
- **Code Blocks**: Translate Chinese comments within code, but do NOT change the code logic itself.

## 4. Post-Translation Sync
- Check if the destination directory exists; create it if not.
- Provide a brief summary: "Translated [Title] to [Path], Tags: X."
