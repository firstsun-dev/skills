# Deconstruct

A problem, system, or concept broken down to its fundamental constituent parts and irreducible truths, with the gap between stated and actual cost mapped.

## Ideal State

- The stated components (what the market, industry or current design says the subject is made of) are listed, and each one is drilled into its actual constituents: for a physical or priced subject, material inputs, the minimum viable version and raw-material cost; for a software or process design, the job each part actually does and the minimum version that would still do it.
- The subject is taken apart until it reaches elements that cannot be decomposed further, and the Fundamental Truths list holds only those: laws of physics, mathematical certainties, empirically verified facts, and irreducible requirements.
- The gap between the stated cost or complexity and the actual fundamental cost is mapped in a Stated / Actual / Gap table, so the reader can see where the leverage is.
- The output ends with implications: what the gap means for the approach and what becomes possible now.

## Anti-criteria

- No industry best practice, "how it's always been done", market price, or piece of conventional wisdom is listed as a fundamental truth.
- No market price is accepted as a fundamental cost without being deconstructed to its constituents.

## Output format

```markdown
## Deconstruction: [Subject]

### What We're Told
[Common description of the subject]

### Stated Components
1. [Component 1]
2. [Component 2]
3. [Component 3]

### Actual Constituents
For each stated component, the fundamental parts:

**[Component 1]**:
- Actual parts: [list]
- Real cost/value: [amount]
- Insight: [what's different from stated]

**[Component 2]**:
- Actual parts: [list]
- Real cost/value: [amount]
- Insight: [what's different from stated]

### Fundamental Truths (Irreducible)
1. [Truth 1 - cannot be decomposed further]
2. [Truth 2 - physics/math/verified fact]
3. [Truth 3 - actual hard requirement]

### Key Gaps Identified
| Stated | Actual | Gap |
|--------|--------|-----|
| [X costs $Y] | [Materials cost $Z] | [$Y-Z is not fundamental] |

### Implications
- [What this means for our approach]
- [What becomes possible now]
```

## Examples

"Battery pack = $600/kWh" deconstructs to ~$80/kWh of commodity materials: 87% of the price is assembly and margin, not physics.

"Launching a rocket to orbit costs $65 million because aerospace is expensive" deconstructs to vehicle materials (aluminum alloys, titanium, copper, carbon fiber) at ~2% of the vehicle price and fuel (liquid oxygen, RP-1 kerosene) at ~$200,000 per launch. The fundamental truths are ~9.4 km/s delta-v to orbit, surviving aerodynamic and thermal loads, carrying the payload, and the rocket equation. Vehicle: $50M stated against $1M of materials, so $49M is not fundamental; "aerospace-grade" is often convention, and vertical integration recaptures the margin.
