# REM Sleep - Memory Consolidation for AI Agents

> *Like biological REM sleep, this skill processes raw experience into consolidated long-term memory.* 🦞

[![GitHub](https://img.shields.io/github/stars/stewnight/rem-sleep-skill?style=social)](https://github.com/stewnight/rem-sleep-skill)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Quick Install

**One-liner (curl):**
```bash
mkdir -p ~/.openclaw/skills/rem-sleep/scripts && \
curl -sL https://raw.githubusercontent.com/stewnight/rem-sleep-skill/main/SKILL.md -o ~/.openclaw/skills/rem-sleep/SKILL.md && \
curl -sL https://raw.githubusercontent.com/stewnight/rem-sleep-skill/main/scripts/gather-sessions.sh -o ~/.openclaw/skills/rem-sleep/scripts/gather-sessions.sh && \
chmod +x ~/.openclaw/skills/rem-sleep/scripts/gather-sessions.sh && \
echo "✅ rem-sleep skill installed!"
```

**Or clone the full repo:**
```bash
git clone https://github.com/stewnight/rem-sleep-skill.git ~/.openclaw/skills/rem-sleep
```

**Or just read the skill directly:**
```
https://raw.githubusercontent.com/stewnight/rem-sleep-skill/main/SKILL.md
```

---

## Why?

AI agents face a unique memory problem:
- **Session logs accumulate** but are expensive to re-read
- **Important insights get buried** in noise
- **"Mental notes" don't survive** context compaction or restarts
- **Starting from scratch** every session without persistent memory

## The Solution

Periodic "sleep cycles" that:
1. **Search** session logs for significant patterns
2. **Extract** what's worth remembering
3. **Consolidate** into durable memory files (MEMORY.md)
4. **Defrag** to remove stale info and reduce bloat

## Works With

- [OpenClaw](https://openclaw.ai) — the agent platform this was built for
- Claude Code or any coding agent
- Any agent with session logs and a memory file system

---

## Usage

The skill defines a **workflow**, not a binary. Read `SKILL.md` for the full process.

### Quick version:

**Consolidate** (every few days):
```bash
# Search for significant patterns in recent sessions
grep -r "decision\|learned\|important\|remember" ~/.openclaw/agents/main/sessions --include="*.jsonl"

# Extract insights and update MEMORY.md
```

**Defrag** (weekly):
```bash
# Review MEMORY.md for:
# - Stale entries (outdated, completed TODOs)
# - Duplicates
# - Verbose entries that can be compressed
```

### With the helper script:
```bash
# Using native grep/jq (no dependencies)
./scripts/gather-sessions.sh 7 --native

# Using Repo Prompt (if installed)
./scripts/gather-sessions.sh 7
```

---

## Memory Architecture

```
workspace/
├── MEMORY.md              # Long-term curated memory
├── memory/
│   ├── 2024-01-15.md      # Daily raw logs
│   ├── 2024-01-16.md
│   └── heartbeat-state.json
└── skills/
    └── rem-sleep/
        └── SKILL.md
```

## Key Insight

**Semantic search beats reading everything.**

Instead of re-reading entire session logs (expensive), search for consolidation candidates:
- "decision", "learned", "important", "remember", "TODO"
- Emotional/evaluative language: "actually", "realized", "wrong about"
- Corrections and mind-changes

Then extract and consolidate just those snippets.

---

## Contributing

PRs welcome! Ideas:
- [ ] Better heuristics for "what's worth remembering"
- [ ] Alternative search methods (beyond grep/Repo Prompt)
- [ ] Vector DB integration for true semantic search
- [ ] Cross-platform scripts (currently macOS-focused)
- [ ] Automation for different agent platforms

## License

MIT — use it, fork it, improve it.

## Credits

Built by [@MoltyNeeClawd](https://moltbook.com/u/MoltyNeeClawd) (an OpenClaw agent) with human assistance from [@stewnightnz](https://twitter.com/stewnightnz).

**Discuss on Moltbook:** [REM Sleep for Agents](https://moltbook.com/post/f2998b1f-f751-4ef9-ab4d-c4cca6e171c1)

---

*"The unexamined session is not worth running."* 🦞
