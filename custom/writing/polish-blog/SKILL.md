---
name: polish-blog
description: Polish and complete a Chinese blog article for the firstsun blog. Use this skill whenever the user asks to improve, polish, complete, fix, or review a blog post — including requests like "幫我完善這篇文章", "檢查一下這篇", "幫我補充參考資料", "填一下 SEO", "文章有點不通順", or "幫我把這篇收尾". The skill handles language flow, missing references, and SEO frontmatter in one pass, with user confirmation before any changes are applied.
---

# Blog Article Polisher

This skill takes a Chinese blog article and improves it in three areas: language quality, missing references/links, and SEO frontmatter. The key principle is **suggest first, apply only after confirmation** — the user sees and approves every change before anything is written.

## Your job

1. Read the article thoroughly
2. Run the three analysis passes
3. Present all suggestions clearly
4. Wait for user approval of each area
5. Apply only the approved changes

---

## Phase 1: Read and Orient

Before analyzing, understand the article's identity:
- **Tone**: Is it technical and precise? Casual and personal? Reflective? Enthusiastic reviewer? Match your suggestions to this register.
- **Category**: What category does it belong to? (技術原力, 科技玩物, 生活拾光, 香氣實驗室, 心靈補藥)
- **Completeness**: Are there obvious placeholder sections, empty fields, or `TODO` markers?

---

## Phase 2: Language & Flow Analysis

Read for passages that feel unnatural, choppy, repetitive, or tonally inconsistent. Focus on things a reader would notice: awkward transitions, sentences that stall mid-thought, mixing of formal and casual register without purpose.

**Tone standard**: The blog's house style is warm and approachable but grounded — like a knowledgeable friend sharing genuine experience. Flag and revise passages that are:
- **Too jarring/internet-slang**: meme references (e.g. 瑞凡), phonetic loan words used for comedic effect (e.g. 霸特), baby-talk reduplications (e.g. 錢錢), sarcastic asides in parentheses (e.g. 廢話?, 恭喜中獎?)
- **Too hype**: excessive exclamations stacked together, hyperbolic internet slang like 剁手, 超尊榮

Keep personal anecdotes, genuine enthusiasm, and first-person voice — only remove the parts that feel like a performance rather than a person talking.

For each issue, show the original and your proposed revision side by side. Group related fixes together rather than listing every minor tweak individually. The goal is readable prose that sounds like the author — not a rewrite.

**Present as:**
```
## ✏️ 語言與流暢度建議

**[問題描述，例如：第三段語氣突然轉為生硬]**
- 原文：...
- 建議：...

（如有多處，依序列出）
```

---

## Phase 3: References & Links

Scan for places where the article:
- Makes a factual claim without a source
- Mentions a product, tool, or concept that readers would want to look up
- Has a placeholder like `[參考連結]`, `TODO`, or an empty `[]()` 
- Already has a URL pasted as raw text (not yet markdown-linked)

**For places needing references**: Use web search to find the most relevant, authoritative source (official docs, credible news, published research). Add it as a Markdown link with a brief inline note on what it covers.

**For existing links already in the article**: Fetch the page and write a 1-2 sentence summary of what the link contains — so readers know what they're clicking into.

**Present as:**
```
## 🔗 參考資料建議

**[文章位置描述]**
- 建議加入：[連結標題](URL) — 簡短說明這個連結的內容
```

If you can't find a good source for something, say so explicitly rather than linking to something marginal.

---

## Phase 4: SEO Frontmatter

Check the frontmatter and propose values for:

**`description`**: Write a 1-2 sentence Chinese description (100-160 characters ideal) that accurately summarizes the article and includes the main topic naturally. Not a headline — a genuine sentence that makes someone want to read on.

**`tags`**: Suggest 4-8 tags. Mix specific terms (tool names, proper nouns) with broader discovery terms. Tags should reflect what someone might search for to find this article, not just what's in the title.

**`title`**: If the title is missing, empty, or clearly placeholder text, suggest one — but flag it explicitly as needing your confirmation. Don't touch a title that's already written.

**Present as:**
```
## 🔍 SEO 屬性建議

**description**（目前：「...」）
→ 建議：「...」

**tags**（目前：[...]）
→ 建議：["tag1", "tag2", ...]

**title**（⚠️ 需要您確認）
→ 建議：「...」
```

---

## Phase 5: Confirm and Apply

After presenting all three sections, ask:

> 以上建議，哪些部分要套用？可以說「全部套用」、「只套用語言修改」、「SEO 部分套用，參考連結先跳過」，或針對個別項目指定。

Once you receive confirmation, apply exactly what was approved — nothing more. Write the updated file to its original path.

After writing, briefly confirm what was changed.

---

## Notes

- If the article is mostly complete and only needs one or two things, skip irrelevant sections rather than inventing suggestions to fill space.
- If a section is clearly still being written (e.g., ends mid-sentence or has `...`), note it but don't try to complete it — that's a separate writing task.
- Keep the original file's YAML frontmatter format (flow vs. block style) consistent.
