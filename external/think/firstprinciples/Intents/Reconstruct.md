# Reconstruct

An optimal solution built from scratch using only the fundamental truths and hard constraints identified through Deconstruct and Challenge.

## Ideal State

- The reconstruction states only the hard constraints it builds on (physics, math, verified facts, true immutable requirements); soft constraints, assumptions and "how it's always been done" are excluded from that list.
- The function to optimize is defined as an outcome, not a method: "persist and retrieve user data reliably", not "we need a database"; "deploy and scale components independently", not "we need microservices".
- At least three blank-slate approaches appear, none shaped by the current solution and none dropped for looking infeasible, each checked against: satisfies the hard constraints, achieves the function, simpler than current.
- The recommended solution is the approach that maximizes simplicity, and the recommendation states its reasoning.
- When an analogous problem has been solved in an unrelated field, that solution is applied here (as the snowmobile combined tank treads, a boat motor and a bicycle seat into a new category); no analogy is forced when none helps.
- When cost is part of the question, the rebuilt solution is costed from material, compute or physical limits, not from the market price or the inherited form.
- An explicit delta against the current approach is shown: the Current / Reconstructed / Delta comparison across complexity, cost, performance and flexibility, what gets eliminated (complexity that was not fundamental), what is new, and what was actually correct all along.
- An implementation path names the first steps toward the reconstructed solution.

## Anti-criteria

- The current solution's price is never restated back as the answer.
- No soft constraint or unvalidated assumption is carried into the reconstruction as if it were fundamental.
- When the inherited assumptions are wrong, the inherited form is not patched; the solution is rebuilt from the hard constraints.

## Inputs

The hard constraints, from a Challenge run or supplied directly by the caller:
```
→ FirstPrinciples/Reconstruct given constraints [X, Y, Z]
```

## Output format

```markdown
## Reconstruction: [Subject]

### Hard Constraints Only
1. [Immutable constraint 1]
2. [Immutable constraint 2]
3. [Immutable constraint 3]

### Function to Optimize
[What we're actually trying to accomplish - outcome, not method]

### Blank Slate Solutions

**Option A: [Name]**
- Approach: [Description]
- How it satisfies constraints: [Explanation]
- Pros: [Benefits]
- Cons: [Drawbacks]

**Option B: [Name]**
- Approach: [Description]
- How it satisfies constraints: [Explanation]
- Pros: [Benefits]
- Cons: [Drawbacks]

**Option C: [Name]**
- Approach: [Description]
- How it satisfies constraints: [Explanation]
- Pros: [Benefits]
- Cons: [Drawbacks]

### Cross-Domain Insights
- From [Field 1]: [Applicable concept]
- From [Field 2]: [Applicable concept]

### Recommended Solution
**[Option X]** because [reasoning]

### Comparison to Current Approach

| Aspect | Current | Reconstructed | Delta |
|--------|---------|---------------|-------|
| Complexity | [X] | [Y] | [Simpler/Same/More] |
| Cost | [X] | [Y] | [Lower/Same/Higher] |
| Performance | [X] | [Y] | [Better/Same/Worse] |
| Flexibility | [X] | [Y] | [More/Same/Less] |

### What We're Eliminating
- [Thing that wasn't fundamental]
- [Complexity from soft constraints]

### What We're Adding
- [New approach from first principles]
- [Cross-domain technique]

### Implementation Path
1. [First step to move toward reconstructed solution]
2. [Second step]
3. [Third step]
```

The Cross-Domain Insights section is left out when no analogy applies.

## Examples

File storage for a web app. Hard constraints: bytes persist durably, are retrievable by identifier, and fit a known capacity. Function: "durably store and retrieve files for a web application". Options: object storage (S3-style), SQLite + backups, content-addressed storage (the Git idea). Recommended: SQLite + backups, because 90% of applications never exceed single-machine capacity. Against the current S3 + CDN: three services become one file, $500/mo becomes about $5/mo of backup, 50ms p50 becomes 1ms, flexibility drops slightly. Eliminated: IAM configuration, CDN cache invalidation, network latency on every file operation. Added: a backup script, size monitoring, and a migration path for when the limits are actually hit.

Reconstructions often land in one of three shapes: a component disappears ("we need a message queue" → direct function calls at our scale), the form changes while the function stays (web app → CLI tool for technical users), or separate steps merge ("microservices" → modular monolith).
