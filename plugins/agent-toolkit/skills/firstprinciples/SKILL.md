---
name: FirstPrinciples
evals:
  manual:
    reason: "the classification of constraints and assumptions must be judged against the supplied problem domain"
    falsifier: "the reviewer finds a claimed hard constraint unsupported or a material assumption omitted from the reconstruction"
metadata:
  short-description: "Rebuild solutions from fundamental truths by separating hard constraints, soft constraints, and assumptions. Use SystemsThinking for feedback loops."
version: 1.1.21
description: "Physics-based reasoning framework (Musk methodology) that deconstructs a problem to irreducible fundamental truths, classifies every element as hard constraint, soft constraint, or assumption, then reconstructs the optimal solution from fundamentals alone. USE WHEN first principles, fundamental truths, challenge assumptions, real constraint, rebuild from scratch, start over, physics first, question everything, reasoning by analogy. NOT FOR structural feedback loops (use SystemsThinking)."
---

# FirstPrinciples

**Contents:** Ideal State · Intent Routing · Constraint Classification · The Core Distinction · The Load-Bearing Rules · Output Format · Data & Config · Gotchas · Examples

Breaks a problem down to its fundamental truths and rebuilds the solution from there, instead of copying what already exists. Three steps, each an intent: DECONSTRUCT (break it into constituent parts and real values), CHALLENGE (classify every element as hard constraint, soft constraint, or unvalidated assumption; only physics is truly immutable), and RECONSTRUCT (build the optimal solution from the fundamentals alone). Outputs a parts breakdown, a constraint table, and a reconstructed solution. It is analysis, not implementation: a request to fix something is done directly, not through this skill. Other skills call it when inherited assumptions may be limiting the solution space: architecture work asking "constraint or convention?", RedTeam and pentests attacking assumed boundaries, RedTeam building counter-proposals with Reconstruct, and engineering escaping a local maximum.

## Ideal State

- What the analysis calls fundamental is only physics, math, verified fact or a truly immutable requirement; every market price, best practice and policy is shown to be convention and taken apart.
- The irreducible function of the subject is stated as an outcome, not a mechanism ("pick the right model and effort for a piece of work", not "a router"), and every component under discussion is marked as serving that function or not. Costing from fundamentals appears only when cost is part of the question.
- Output length matches the request: an inline, brief or terse pass returns the irreducible job, the classification with its evidence, and the key insight in a few lines, without empty template sections; the full templates are for full runs.
- A full run ends with a solution rebuilt from the hard constraints and compared against the current approach, plus the one assumption that was limiting it.

## Intent Routing

| Intent | Trigger | File |
|--------|---------|------|
| **Deconstruct** | "what is this actually made of", "break it down", "what is X irreducibly for", costs or complexity that seem fixed | `Intents/Deconstruct.md` |
| **Challenge** | "challenge assumptions", "is that a real constraint", "hard or inherited", "we can't do X" with no evidence | `Intents/Challenge.md` |
| **Reconstruct** | "rebuild from scratch", "start over", escape a local maximum, hard constraints already known | `Intents/Reconstruct.md` |

A full analysis runs them in order, Deconstruct → Challenge → Reconstruct; each also runs alone when its input is already in hand. A standalone Challenge hands its analysis to Reconstruct or back to the requester for a decision.

## Constraint Classification

Every intent uses this one classification; Challenge applies it to each constraint. Only hard constraints are truly immutable; soft constraints and assumptions are challenged.

| Type | Definition | Test | Examples | Can Change? |
|------|------------|------|----------|-------------|
| **HARD** | Physics/math/reality | Would violating this break laws of nature? | Speed of light, thermodynamics, gravity; "Data can't travel faster than light" | No |
| **SOFT** | Policy/choice/convention | Could a decision-maker change this? | "We use AWS", "We always use REST APIs", budget limits | Yes |
| **ASSUMPTION** | Unvalidated belief | Has this been tested? What's the evidence? | "Users won't accept that UX", "Too expensive" | Maybe false |

## The Core Distinction

Most reasoning is reasoning by analogy — "how did we solve something similar," "what do others do" — then copy it with tweaks. That inherits everyone else's assumptions and treats policy and convention as if they were laws of physics, so you optimize the suitcase instead of inventing wheels. First principles forces the split between what's actually immutable and what's merely inherited, then rebuilds from only the parts that can't change.

- **Reasoning by analogy** (default, often wrong): copies existing solutions with slight variations.
- **Reasoning from first principles** (this skill): asks "what is this actually made of?" and rebuilds from irreducible facts.

Invoked directly, or by other skills when inherited assumptions may be limiting the solution space — architecture work asking "constraint or convention?", RedTeam and pentests attacking assumed boundaries, engineering escaping local maxima.

## The Load-Bearing Rules

- **Market prices and industry best-practices are NOT fundamental truths.** "Batteries cost $600/kWh" or "hosting costs $10K/mo" are convention, not physics — deconstruct to material/compute cost before accepting them.
- **Optimize function over form** — what you're trying to accomplish, not how it's traditionally done (improve the wheel, don't polish the suitcase).
- **Rebuild, don't patch** — when the assumptions are wrong, start from the hard constraints rather than fixing the inherited form. Cross-domain solutions from unrelated fields often apply.

## Output Format

A full run (all three intents) reports in this combined shape; each intent's own template is in its file.

```markdown
## First Principles Analysis: [Topic]

### Deconstruction
- **Constituent Parts**: [List fundamental elements]
- **Actual Values**: [Real costs/metrics, not market prices]

### Constraint Classification
| Constraint | Type | Evidence | Challenge |
|------------|------|----------|-----------|
| [X] | Hard/Soft/Assumption | [Why] | [What if removed?] |

### Reconstruction
- **Fundamental Truths**: [Only the hard constraints]
- **Optimal Solution**: [Built from fundamentals]
- **Form vs Function**: [Are we optimizing the right thing?]

### Key Insight
[One sentence: what assumption was limiting us?]
```

## Data & Config

User customizations live at `<configRoot>/LIFEOS/USER/CUSTOMIZATIONS/SKILLS/FirstPrinciples/` (`configRoot` is `$CLAUDE_CONFIG_DIR` when set, else `~/.claude`). When that directory exists, its `PREFERENCES.md`, configurations and resources apply and override the defaults here; when it is absent, the defaults stand.

## Gotchas

- **The Core Distinction, The Load-Bearing Rules and Challenge's tabular worked example (`Intents/Challenge.md` § Examples) are measured keep-content; never cut them as choreography.** A 2026-10-10 quality pass cut all three and lost the A/B against the old text; restoring them won it back. Source: commit aaac137c88, suite `ab-firstprinciples-challenge`.

## Examples

```
User: "What is a model router fundamentally for, and what are the irreducible constraints on routing LLM work?"
→ Deconstruct → Challenge → Reconstruct
→ The router's job as an outcome, each design element marked as serving it or not, a constraint table with evidence, a rebuilt design, and the assumption that was limiting the current one
```

```
User: "Quick inline pass: judgment-layer question system for support-ticket routing. What is code, what is judgment, what does the decision irreducibly turn on?"
→ Challenge, compact
→ A few lines: the irreducible decision, which inputs code can decide exactly and which need judgment, and which inherited design choices are soft
```

```
User: "Cloud hosting costs $10,000/month. That's just what it costs."
→ Deconstruct
→ What the bill pays for (compute, storage, bandwidth, managed services); actual compute need is about $2,000, and the other $8,000 is convenience being chosen, such as managed Kubernetes and a fixed region
```
