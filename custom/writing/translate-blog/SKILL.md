---
name: translate-blog
description: Translate a Chinese blog article to English for the firstsun blog. Use this skill whenever the user asks to translate an article, convert a post to English, or create an English version of a Chinese blog post. The skill handles the full pipeline: translating the body content, transforming frontmatter fields (title prefix, category, tags, author name), and saving the output to the mirrored English path under blog/en/.
---

# Blog Article Translator (ZH-TW → EN)

This skill translates a Chinese blog article into English and saves it to the correct location in the English blog directory tree.

## Your job

1. Read the source Chinese article
2. Determine the output path
3. Translate content and transform frontmatter
4. Write the English file

## Path mirroring

The source is always under `blog/zh-tw/`. Mirror it to `blog/en/` by replacing only that prefix — keep everything else (subdirectories, filename) exactly the same.

```
blog/zh-tw/tech/ai-agent-coding.md  →  blog/en/tech/ai-agent-coding.md
blog/zh-tw/apple/macos/xxxx.md      →  blog/en/apple/macos/xxxx.md
```

If the target directory doesn't exist yet, create it.

## Frontmatter transformation rules

| Field | Rule |
|---|---|
| `title` | Translate fully, including the bracketed prefix (see prefix map below) |
| `slug` | Keep exactly as-is — never change the slug |
| `draft` | Keep same value as source |
| `description` | Translate to English |
| `author` | Map: `藥藥` → `Yaoyao`, `秀秀` → `Xiuxiu`. Other values keep as-is |
| `pubDate` | Keep as-is |
| `heroImage` | Keep as-is |
| `hideHeroImage` | Keep as-is |
| `category` | Map to English equivalent (see category map below) |
| `tags` | Translate each tag individually to natural English equivalents |

### Category map

| Chinese | English |
|---|---|
| 技術原力 | Tech Force |
| 科技玩物 | Tech Gadgets |
| 生活拾光 | Lifestyle |
| 香氣實驗室 | Aroma Lab |
| 心靈補藥 | Soul Remedy |

### Title prefix map

| Chinese prefix | English prefix |
|---|---|
| `[開發手記]` | `[Dev Notes]` |
| `[數位選物]` | `[Digital Picks]` |
| `[生活圖鑑]` | `[Life Guide]` |
| `[香氛百科]` | `[Aroma Guide]` |
| `[修行成長]` | `[Growth Mindset]` |
| `[AI Agent]` | `[AI Agent]` |

If you encounter a prefix not in this map, translate it naturally and keep the bracket format.

## Translating the body

Match the writing style and tone of the original — technical articles should sound technical, personal essays should feel personal, lifestyle content should be relaxed and conversational. Don't flatten everything into a single neutral register.

Preserve all Markdown formatting: headings, code blocks, tables, blockquotes, lists, bold/italic. Don't add or remove structural elements.

For code blocks: translate inline comments if they're in Chinese, leave code itself unchanged.

For section headings that follow the template pattern (e.g., `## 背景 (Context)`), keep the English part if one was included, or translate naturally if not.

## After writing the file

Tell the user:
- The output path
- A brief summary of what was translated (article title, category, tag count)
- Whether the output directory had to be created

If the source article has an empty `description` or `title`, fill in what you translated rather than leaving it blank — this is a good chance to write a clean English SEO description based on the content.
