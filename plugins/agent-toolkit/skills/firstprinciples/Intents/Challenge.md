# Challenge

**Contents:** Ideal State · Anti-criteria · Output format · Examples

Every assumption and constraint classified as hard constraint (physics), soft constraint (choice), or unvalidated assumption, with the ones worth challenging named.

## Ideal State

- Everything presented as a constraint (requirements, "we have to..." statements, best practices, budget and timeline limits, policy) is listed and classified HARD, SOFT, or ASSUMPTION by the test in the classification table: is it a law of physics, or a choice someone made? A choice can be changed.
- Every classification carries the evidence that puts it in its bucket; a constraint with no stated reason is not counted as classified.
- At least one element treated as a hard constraint is reclassified as soft or as an unvalidated assumption, or the analysis states explicitly that every constraint survived the challenge as genuinely immutable and why.
- The output is sized to the question: a brief or inline pass returns the classification with evidence and the constraints worth challenging in a few lines; the full template, with provenance for every SOFT constraint, hidden constraints and recommended actions, is for a full run.
- Every SOFT constraint is traced to who decided it, why, and whether the original reason still holds.
- Every ASSUMPTION is paired with its evidence, its counter-evidence, and a test that could disprove it.
- The "remove it" test is applied to each non-hard constraint, and the constraints whose removal unlocks significant value are listed as worth challenging, each with what becomes possible.
- Hidden constraints, the implicit ones so assumed they were never stated ("of course we need a database", "obviously this needs auth"), are surfaced in their own list; these are the most dangerous constraints.
- The analysis ends with recommended actions: assumptions to validate and by what method, soft constraints to challenge and with which stakeholder, and hard constraints to accept and design around.

## Anti-criteria

- No policy, convention, choice, or market price is classified HARD; only what would break physics, math, or reality if violated is.
- No challenge ends with nothing reclassified and no stated reason why nothing could be.

## Output format

Each constraint is classified with the table in `SKILL.md` § Constraint Classification, then reported in the template below.

```markdown
## Constraint Analysis: [Subject]

### All Stated Constraints
1. [Constraint 1]
2. [Constraint 2]
3. [Constraint 3]
...

### Classification

#### HARD Constraints (Physics/Reality)
| Constraint | Why It's Hard | Cannot Be Changed Because |
|------------|---------------|---------------------------|
| [X] | [Physics law] | [Would violate reality] |

#### SOFT Constraints (Policy/Choice)
| Constraint | Who Decided | Original Reason | Still Valid? | If Removed? |
|------------|-------------|-----------------|--------------|-------------|
| [X] | [Person/team] | [Why] | [Yes/No/Maybe] | [What's possible] |

#### ASSUMPTIONS (Unvalidated)
| Assumption | Evidence | Counter-Evidence | Test To Validate |
|------------|----------|------------------|------------------|
| [X] | [What supports it] | [What contradicts] | [How to prove/disprove] |

### Hidden Constraints Found
- [Implicit assumption 1 that was never stated]
- [Implicit assumption 2]

### Constraints Worth Challenging
1. **[Constraint]**: [Why it should be challenged, what becomes possible]
2. **[Constraint]**: [Why it should be challenged, what becomes possible]

### Recommended Actions
- [ ] Validate assumption: [X] by [method]
- [ ] Challenge soft constraint: [Y] with [stakeholder]
- [ ] Accept hard constraint: [Z] and design around it
```

## Examples

Worked example: challenging "Enterprise Software Requirements", rendered as the deliverable in the Output format template.

```markdown
### Stated Constraints
1. Must support 10,000 concurrent users
2. Must have 99.99% uptime
3. Must integrate with SAP
4. Must pass SOC 2 audit
5. Must use approved vendor list
6. Must have 24/7 support
7. Must support IE11

### Classification

#### HARD Constraints
| Constraint | Why Hard | Cannot Change |
|------------|----------|---------------|
| (None identified) | - | - |

*Note: None of these are physics - all are choices*

#### SOFT Constraints
| Constraint | Who Decided | Original Reason | Still Valid? | If Removed? |
|------------|-------------|-----------------|--------------|-------------|
| 10k concurrent | Capacity planning | Peak load estimate | Maybe - check actual usage | Right-size infrastructure |
| 99.99% uptime | SLA template | Standard enterprise SLA | Maybe - check actual need | 99.9% = 10x cheaper |
| SAP integration | Finance team | Existing ERP | Yes - but scope negotiable | Simpler integration |
| SOC 2 | Security policy | Customer requirement | Yes - but scope matters | Focus on relevant controls |
| Approved vendors | Procurement | Risk management | Questionable | Better/cheaper options |
| 24/7 support | Sales promise | Customer expectation | Check contract | Business hours might suffice |
| IE11 support | Legacy policy | Old corporate standard | NO - IE11 is dead | Modern stack, 30% less effort |

#### ASSUMPTIONS
| Assumption | Evidence | Counter-Evidence | Test |
|------------|----------|------------------|------|
| "Need 10k concurrent" | Capacity doc | Actual peak: 847 | Check logs |
| "Customers require 99.99%" | Sales said so | No SLA penalties paid | Review contracts |
| "Must support IE11" | 2019 policy | IE11 EOL, 0.1% traffic | Check analytics |

### Constraints Worth Challenging
1. **IE11 Support**: Dead browser, removes 30% of frontend complexity
2. **10k Concurrent**: Actual usage is 847 peak - right-size saves $$$
3. **99.99% Uptime**: 99.9% is likely sufficient, 10x cost difference
4. **Approved Vendor List**: May exclude better solutions for no real risk reduction
```
