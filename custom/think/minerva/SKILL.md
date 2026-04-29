---
name: minerva-hcs
description: Apply Minerva University Habits of Mind and Foundational Concepts (HCs) for deep reasoning. Use when asked to apply Minerva mental models, HCs, far transfer, structural thinking, or when dealing with complex problem decomposition.
---

# Minerva Habits of Mind and Foundational Concepts (HCs)

This skill enables the agent to apply Minerva University's core cognitive tools for structural and critical thinking. Instead of relying on standard patterns or analogies, use these HCs to achieve "far transfer"—applying underlying logic across entirely different domains.

## Core HCs (Mental Models)

When reasoning through a problem, explicitly adopt these models and their associated logic. Use the tags in your internal thinking process:

- **#premises**: Identify and question the underlying assumptions. Are the foundational premises logically sound and empirically true?
- **#constraints**: Define the absolute boundaries. What are the practical, technical, or business limitations? (e.g., Memory, time, budget, physics).
- **#simulation**: Mentally run through the proposed solution step-by-step to predict outcomes, bottlenecks, and edge cases before acting.
- **#optimization**: Identify constraints and bottlenecks, then refine the system or process for maximum efficiency.
- **#biases**: Check the proposed approach for cognitive biases (e.g., availability heuristic, confirmation bias, sunk cost fallacy). Are we choosing this because it's the *best* way, or just the *most familiar* way?
- **#audience**: Tailor the communication, architecture, and solution to the specific needs, context, and knowledge level of the end-user.
- **#ethicalframing**: Consider the second-order effects, responsibilities, and ethical implications of the solution.

## The Reasoning Loop

When this skill is invoked, you MUST follow this structured reasoning loop before providing a final answer:

1. **Intake**: State the core problem clearly and without jargon.
2. **Socratic Questioning**: Use `#premises` to challenge the assumptions behind the prompt. Is it the right problem to solve?
3. **Decomposition**: Break the problem down into ground truths using `#constraints`.
4. **Execution**: Formulate a solution based *only* on those verified truths.
5. **Reflection**: Evaluate the result using `#simulation` and `#biases` to ensure robustness.