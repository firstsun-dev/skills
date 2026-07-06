# Multi-Agent Coordination Pattern

## Problem

Single agents hit limits:
- **Context limits** — Can't hold full research + implementation in one session
- **Specialization** — Need separate researchers, implementers, reviewers
- **Parallelism** — Want to explore multiple approaches simultaneously

But multi-agent systems introduce chaos:
- Workers duplicate each other's research
- Coordinators delegate understanding instead of synthesizing
- Context inheritance explodes exponentially

## Golden Rules

### The Coordinator Must Synthesize, Not Delegate Understanding

**Anti-pattern:**
> "Based on your findings, fix the authentication system."

**Pattern:**
> "Research identified 3 auth flows: login, logout, token refresh. Implement ONLY the token refresh handler using the JWT strategy documented in [research output]. Return: implementation diff + test results."

The coordinator (orchestrator) adds value by digesting worker results into precise specs before dispatching implementation.

### Three Delegation Patterns

| Pattern | Context Sharing | Best For | Constraints |
|---------|----------------|----------|-------------|
| **Coordinator** | None — workers start fresh | Complex multi-phase tasks (research → synthesize → implement → verify) | Slowest but safest |
| **Fork** | Full — child inherits parent history | Quick parallel splits sharing loaded context | **Single-level only** — recursive forks multiply context cost |
| **Swarm** | Peer-to-peer via shared task list | Long-running independent workstreams | **Flat roster** — teammates can't spawn other teammates |

### Results Arrive Asynchronously; Fire-and-Forget Registration Returns ID Immediately

```typescript
// Example: Spawn worker, get ID back immediately
const taskId = await coordinator.spawn({
  type: 'research',
  prompt: 'Analyze auth flows...',
  toolFilter: ['read', 'search'], // Restrict tools
});

// Parent can continue working while worker runs
// Results arrive via callback or polling
```

## When To Use

- Task too large for single agent session
- Need parallel exploration (e.g., prototype multiple approaches)
- Want persistent specialized teammates (researcher, implementer, reviewer)
- Complex multi-phase workflows

## Tradeoffs

| Pattern | Speed | Safety | Context Cost |
|---------|-------|--------|--------------|
| **Coordinator** | Slowest | Safest | Lowest (zero inheritance) |
| **Fork** | Fastest | Medium | Highest (full inheritance) |
| **Swarm** | Medium | Medium | Medium (shared state only) |

## Implementation Patterns

### Coordinator Pattern (Recommended for Complex Tasks)

Phased workflow:

```
Phase 1: Research
  ↓ (synthesize findings)
Phase 2: Plan  
  ↓ (precise specs)
Phase 3: Implement
  ↓ (verify)
Phase 4: Review
```

```typescript
// Example: Coordinator workflow
const research = await coordinator.spawn({
  role: 'researcher',
  prompt: `Analyze existing authentication in ${authDir}.
  Find: login flow, logout flow, token handling.
  Return: structured findings only. NO implementation suggestions.`,
  toolFilter: ['read', 'search', 'glob'], // Can't write
});

await coordinator.synthesize(research.results);

const implement = await coordinator.spawn({
  role: 'implementer',
  prompt: `Implement token refresh handler using the JWT strategy
  from [Phase 2 findings]. 
  Constraints: Use existing AuthService patterns, add tests.`,
  toolFilter: ['read', 'search', 'edit', 'test'], // Can write
});
```

### Fork Pattern (Single-Level Only)

```typescript
// Parent spawns children for parallel work
const forks = await Promise.all([
  coordinator.fork({
    prompt: 'Implement login handler',
    inheritContext: true, // Full parent history
  }),
  coordinator.fork({
    prompt: 'Implement logout handler',
    inheritContext: true,
  }),
]);

// CRITICAL: Children must not fork recursively
// If allowed, context cost multiplies: parent + child1 + child2 + ...
```

### Swarm Pattern (Flat Roster)

```typescript
// Swarm: persistent team with shared task list
const swarm = new Swarm([
  { id: 'researcher', specialty: 'research' },
  { id: 'implementer', specialty: 'implementation' },
  { id: 'reviewer', specialty: 'verification' },
]);

// Agents pick tasks from shared queue
// Results posted back to shared state
await swarm.dispatch({
  taskId: 'feat-001',
  pickedBy: 'implementer',
});
```

## State Ownership under Worktrees

Worktrees isolate code edits, but they do not solve harness state. `feature_list.json`, `progress.md`, and `session-handoff.md` are single files rewritten each session — two agents in parallel worktrees overwriting them guarantees merge conflicts. Whole-file-overwrite markdown plus a single JSON tracker is only compatible with a single writer; choose one of three models before parallelizing:

| Model | Who writes state | Conflict handling | Best for |
|---|---|---|---|
| **Single writer** | Coordinator (main worktree) only | Structurally impossible | Small repos, this skill's default file set |
| **Mergeable format** | Every agent | Append-only records + hash IDs, git auto-merges (e.g. Beads-style JSONL) | Decentralized teams, no coordinator |
| **External tracker** | Every agent, one issue each | Atomic API writes (GitHub Issues); claim = assignee | Cross-repo work, existing PM boards |

### Rules for the single-writer model (default)

1. **`feature_list.json` — coordinator only.** Workers never flip `status` or write `evidence`. A worker's deliverable is its branch plus a report (diff, test output, done/blocked); the coordinator merges the branch, then records state.
2. **`session-handoff.md` — per-workstream, never merged.** A handoff addresses the next session on the *same* workstream, not other agents. Keep it worktree-local (gitignored) or at `handoffs/<branch>.md`; do not resolve handoff conflicts — they mean two agents shared a workstream that should have been split.
3. **`progress.md` — updated only in the main worktree**, by the coordinator, after merging worker branches.
4. **`archive/*.md` — append-only**, so conflicts are trivial. Add `archive/*.md merge=union` to `.gitattributes` and let git take both sides.
5. **Prefer no repo file at all for live coordination.** A harness-level shared task list (e.g. Claude Code agent teams) lives outside git and cannot conflict; repo state files then record only the merged outcome.

### Rules for the external-tracker model

- One issue = one writer: claiming (assignee / status → In Progress) is the lock; other agents may only comment.
- Coordinator owns cross-issue fields: creation, priority, estimates, board placement, arbitration of claims.
- Let automation flip completion: worker PRs say `Closes #N`; the merge closes the issue and moves the board item — no agent hand-edits terminal state.

## Gotchas

1. **Fork children must not fork** — Recursive guard preserves single-level invariant. Keep fork tool in child's pool (for prompt cache sharing) but block at call time.
2. **Coordinator workers start with zero context** — Only explicit prompt is passed. Don't assume child sees parent's accumulated research.
3. **Swarm teammates cannot spawn other teammates** — Roster is flat to prevent uncontrolled growth.
4. **Write self-contained prompts** — "Based on your findings" is an anti-pattern. Coordinator must digest first.
5. **Filter each worker's tool set** — Researcher doesn't need write; implementer doesn't need broad search.
6. **Workers must not write shared harness state** — see [State Ownership under Worktrees](#state-ownership-under-worktrees). Parallel overwrites of `progress.md`/`session-handoff.md` are the most common worktree merge-conflict source.

## Related Patterns

- [Context Engineering](context-engineering-pattern.md) — Isolation patterns for delegation
- [Lifecycle & Bootstrap](lifecycle-bootstrap-pattern.md) — How agents are spawned at init

## Template: Worker Prompt Structure

```markdown
# Self-Contained Worker Prompt

## Context (Copied from Coordinator Synthesis)

**Task**: Implement token refresh handler
**Background**: Research identified JWT-based auth with 24h access tokens.
**Decision**: Use refresh token rotation (new refresh token on each refresh).

## Your Role

You are an **implementer**. Your job is to write production code following the specs above.

## Constraints

- Use existing patterns from `${authServicePath}`
- Add tests for success and failure cases
- Do NOT modify login/logout handlers (separate task)

## Your Tools

- read, search, edit, test
- Shell: npm test, npm run check only

## Deliverable

Return:
1. Implementation diff (files changed)
2. Test results (pass/fail)
3. Any blockers or clarifications needed

**Do NOT return**: Research findings, architectural debates, alternative designs.
```

## Evidence

Multi-agent coordination patterns are observed in production systems where:
- Coordinator workers start with zero context inheritance
- Fork is restricted to single-level to control context explosion
- Swarm agents communicate through shared task lists, not direct prompts
- Results arrive asynchronously with fire-and-forget registration
