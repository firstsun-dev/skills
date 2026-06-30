---
name: book-distiller
description: Distills books (PDF, EPUB, TXT) into structured AI Agent skills and Gemini Gems. Use when you need to transform a book's methodology into an actionable AI persona.
origin: firstsun-dev/skills
---

# Book Distiller

This skill provides a workflow for transforming long-form content (books, manuals, guides) into high-signal AI Agent instructions.

## Dependencies
The parsing scripts require the following Python libraries:
- `pymupdf` (for PDF)
- `ebooklib` (for EPUB)
- `beautifulsoup4` (for EPUB cleaning)

Install them via: `pip install pymupdf ebooklib beautifulsoup4`

## Core Workflow

### 1. File Parsing
Use the `scripts/parse_book.py` script to extract raw text from the source file.

```bash
python3 scripts/parse_book.py path/to/book.epub --output temp_raw.txt
```

### 2. Knowledge Distillation
Read the extracted text and use the prompt templates in [references/PROMPT_TEMPLATES.md](references/PROMPT_TEMPLATES.md) to distill the content.

**Distillation Strategy:**
- **Persona Extraction**: Identify the "Expert Role" the author represents.
- **Principle Extraction**: Identify the "Hard Truths" and "Axioms".
- **Workflow Extraction**: Identify "Step-by-Step" implementations.
- **Constraint Extraction**: Identify "Mandates" and "Anti-patterns".

### 3. Synthesis & Export
Follow the [skill-manager](../../basic/skill-manager/SKILL.md) SOP to save and register the results.

- **Taxonomy**: Ensure the new skill follows the "Flattened Design" and is placed in `custom/books/<book-slug>/`.
- **Refactoring**: If the distilled content is large (>100 lines), apply the **Progressive Disclosure** pattern as defined in [REFACTORING.md](../../basic/skill-manager/references/REFACTORING.md).
- **Registration**: Run `./setup.sh` and update `SKILLS_LIST.md`.
- **Gem Export**: Follow the **Gem Export Workflow** in `yao-skill-manager` to generate `gem/<book-slug>.txt`.

## Guidance for AI Agents

When distilling, focus on **Actionable Utility** over narrative description. 
- **Good**: "Workflow: Before starting task X, check for condition Y."
- **Bad**: "The book discusses the importance of Y in the context of X."

If the book is extremely large, distill chapter by chapter and consolidate the findings at the end.
