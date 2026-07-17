---
name: permission-cleanup
description: "Audit and clean up Claude Code permission rules (permissions.allow/deny in ~/.claude/settings.json, project .claude/settings.json, and .claude/settings.local.json). Finds leaked credentials embedded in rule strings, dead one-off rules tied to expired job IDs/PIDs/dates, and rules already made redundant by a broader wildcard. Use when asked to 'organize permissions', '清理權限', 'clean up settings.json', or when a permissions file looks cluttered after many sessions."
origin: firstsun-dev/skills
---

# Permission Cleanup

Claude Code permission rules accumulate one at a time, per session, and are never pruned automatically. Over months this produces three kinds of rot in `permissions.allow`/`permissions.deny`:

1. **Leaked credentials** — a literal token/password/key that got captured verbatim into a rule string (e.g. someone approved `curl -H "Authorization: Bearer <real-token>" ...` once, and the real token is now sitting in plaintext in a settings file forever).
2. **Dead one-off rules** — rules tied to ephemeral state that can never occur again: exact PIDs (`kill 2492293`), paths containing a Claude Code job ID (`/tmp/claude-1000/.../<uuid-or-hex>/scratchpad/...`, `/home/tianyao/.claude/jobs/<hex>/...`), one-time dated filenames, or a fully inlined single-use debug script.
3. **Redundant rules** — a narrow/exact rule that a broader wildcard *already in the same file* fully covers (e.g. `Bash(git status)` when `Bash(git *)` is also present, or any specific `Bash(...)` rule when `Bash(*)` is present).

This skill is the read-audit-confirm-apply loop for cleaning that up. It does **not** touch the deeper question of whether the broad wildcards themselves are a good idea (that's a judgment call for the human — flag it, don't decide it).

## Scope and files

Permission rules live in, in cascade order (user < project < local):
- `~/.claude/settings.json` — user scope, every project.
- `<project>/.claude/settings.json` — project scope, **checked into git if not gitignored** — a leak here is shared with every clone.
- `<project>/.claude/settings.local.json` — local scope, gitignored by convention (verify with `git check-ignore -v <file>`, don't assume).

For a multi-project sweep, enumerate targets from `~/.claude/projects/` (session transcript dirs mirror project paths) or just ask the user which projects to cover.

## Step 1 — read only the permissions key

Settings files can carry other secret-bearing keys (`env`, MCP `headers`). Never dump the whole file into a report or transcript:

```bash
jq '.permissions' <file>
```

## Step 2 — categorize every rule

For each entry in `.allow` (and `.deny`, for context — never propose removing deny rules, the user set those deliberately):

- **Secret check**: does the string contain a credential-shaped literal (`Bearer <token>`, `sk-...`, `AKIA...`, a password= value, private key material) rather than a placeholder, env var, or command/domain name? If yes — **never print the value**. Report only: line number, a redacted form (first 4 + last 4 chars, `...` between), and the credential kind. Removing/rewriting the rule does not invalidate the credential — say so explicitly and tell the user to rotate it at the source.
- **Dead one-off check**: does the string embed a PID, a Claude Code job-ID path segment, a one-time date, or is it a fully inlined single-use script (not a reusable wildcard family)? These can be deleted outright — they can never match again.
- **Redundant check**: is there a broader wildcard rule *elsewhere in the same array* whose match-space fully contains this rule? Only flag full-coverage redundancy — partial overlap doesn't count. Note: `cmd` and `cmd *` are NOT redundant with each other (the no-args form and the with-args form are deliberately separate); don't flag those pairs.
- **Broad/risky, report-only**: wildcards with real destructive capacity (`git push *`, `rm *`, `git checkout *`, unscoped `Bash(*)`, `WebFetch(*)`) are worth surfacing to the user as a standing blast-radius decision, but this skill does not recommend narrowing or removing them on its own judgment — that's the user's call, distinct from the dead/redundant/secret categories above.

## Step 3 — for multi-project sweeps, delegate the read-only audit

One `Explore`-type subagent per project/file (Explore has no Edit/Write tool, which makes the read-only constraint structural, not just an instruction). Each prompt must be self-contained:
- Exact file path(s) to read.
- The three categories above, defined inline (subagents don't inherit this document).
- Explicit "do not print secret values, redact instead" instruction.
- Report format: exact rule strings verbatim (needed to match for later removal) except secrets, which stay redacted.

Do not have subagents apply edits — they report findings back for the orchestrator to consolidate and the human to confirm. Bring findings back to the user as one consolidated report grouped by project/file, not as a raw dump per agent.

## Step 4 — confirm before applying

Always show the user what would be removed/changed before editing, even for "obviously dead" rules — a rule that looks like an ephemeral job path might still be intentional. For secrets specifically, offer choices: delete the rule outright vs. rewrite it with an env-var placeholder (e.g. `$SERVICE_TOKEN`) so the pattern still pre-approves future non-literal invocations.

## Step 5 — apply safely

Never splice harvested rule strings into a shell one-liner (`echo`/`sed` into the JSON) — a rule string could contain a quote or brace that corrupts the file. Use the mktemp + `jq --slurpfile` + array-subtraction pattern:

```bash
TMPFILE=$(mktemp)
cat > "$TMPFILE" <<'RULES_EOF'
["exact rule string 1", "exact rule string 2", ...]
RULES_EOF
jq --slurpfile remove "$TMPFILE" \
  '.permissions.allow = ((.permissions.allow) - ($remove[0]))' \
  <file> > <file>.tmp
jq empty <file>.tmp && mv <file>.tmp <file>   # validate before overwrite
rm -f "$TMPFILE"
```

For token-redaction rewrites (secret → placeholder rather than deletion), use a dedicated `Edit` call per rule instead of a bulk jq pass — the exact string match matters and `Edit` fails loudly on a non-unique match.

Always `jq empty` the result before overwriting the original, and report back file-by-file what changed and the exact count removed/rewritten.

## Non-goals

- Does not decide whether broad wildcards (`Bash(*)`, `git push *`, etc.) should exist — only flags them.
- Does not touch `deny` rules.
- Does not rotate leaked credentials — only flags and (on request) removes/redacts the rule text. Rotation happens at the credential's origin system.
- Not a substitute for `/doctor`'s check 9 (which proposes *new* allow rules from denial patterns) — this skill goes the other direction, pruning existing rules.
