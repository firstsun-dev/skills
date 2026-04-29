---
name: blog-master
description: "Comprehensive blog management skill. Use this to: 1) Polish, refine, and optimize Chinese articles with 2026 GEO standards, OR 2) Translate finalized Chinese articles to English mirroring the project structure."
---

# Blog Master (部落格大師)

This skill manages the entire blog content lifecycle, from iterative Chinese polishing to final English translation.

---

## 🛠 Workflow A: Polish & Refine (中文潤稿與優化)

Use this workflow when the user asks to **"improve"**, **"polish"**, **"review"**, or **"fix"** a Chinese article.

### 1. Brand Voice & Tone
Our house style is **"knowledgeable friend sharing genuine experience"** — warm, approachable, but grounded.
- **Avoid Hype**: No "剁手", "超尊榮", or excessive exclamation marks.
- **Avoid Jarring Memes**: No "瑞凡", "霸特", or baby-talk like "錢錢".
- **EEAT Signals**: Prefer first-person perspective ("根據我實測..."). Ensure **Information Gain** by suggesting personal anecdotes if the text feels like generic AI summary.

### 2. 2026 SEO (GEO) Requirements
- **TL;DR Summary**: Ensure a 3-bullet "重點摘要" section exists.
- **Direct Answers**: Under each H2/H3, the first paragraph must directly answer the heading's intent (40-60 words).

### 3. Iterative Process
1. **Analyze**: Run Language, Reference, and GEO checks.
2. **Present**: Show suggestions side-by-side.
3. **Confirm**: **Wait for user approval** before applying any changes.

---

## 🌍 Workflow B: Translate to English (中翻英鏡像翻譯)

Use this workflow when the user says **"translate to English"** or **"create English version"** after the Chinese post is finalized.

### 1. Path Mirroring
- **Source**: `blog/zh-tw/...` → **Destination**: `blog/en/...`
- Maintain identical subdirectories and filenames. Create destination folders if missing.

### 2. Frontmatter Transformation

| Field | Rule |
|---|---|
| `title` | Translate fully, including prefixes (e.g., `[開發手記]` → `[Dev Notes]`). |
| `slug` | **NEVER** change the slug. |
| `author` | `藥藥` → `Yaoyao`, `秀秀` → `Xiuxiu`. |
| `category` | Map to English (e.g., 技術原力 → Tech Force). |
| `tags` | Individual natural translation. |

### 3. Quality Standards
- **Match Tone**: Technical stays technical; personal stays personal.
- **Preserve Structure**: Do NOT change Markdown elements or code logic.
- **Code Blocks**: Translate Chinese comments only.

---

## 📂 Presentation & Commands
AI will automatically select the correct workflow based on your intent.
- **Intent: "幫我看看這篇"** → Triggers Workflow A.
- **Intent: "翻譯成英文"** → Triggers Workflow B.
