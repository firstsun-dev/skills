---
name: notion-workstream
description: Maintain long-lived work context and tasks in Notion. Use when the user wants to create, read, update, split, organize, hand off, or review ongoing work, especially when AI needs to resume work across chats or sessions.
---

# Notion Workstream

Use one Notion database to maintain current work context and executable tasks. Keep the structure flat by default, minimize duplicated information, make hierarchy predictable, and require user confirmation before any write.

## Core principles

- **Properties store queryable state**: status, domain, relations, and similar information belong in database properties and should not be duplicated in page content.
- **Pages store current context**: page bodies describe goals, scope, decisions, constraints, and task requirements that are still true now. Do not use them as chronological logs.
- **Comments store events**: discussions, AI questions, user replies, execution results, reviews, fixes, and other time-ordered events should normally go into comments.
- **Flat by default**: normal structure uses L1 work context and L2 tasks only. AI must not create deeper levels on its own.
- **Read before acting**: when handling a task, read the necessary parent context without loading all history by default.
- **Preview before writing**: every Notion write must be previewed and confirmed by the user before execution.

## Database model

Common properties:

- `名稱` / `Name`: row title.
- `領域` / `Domain`: property for classification, filtering, and grouping. It exists on the same row as the name and status and does not participate in the L1/L2/L3+ hierarchy.
- `狀態` / `Status`: the single source of truth for lifecycle state. Do not maintain a second progress summary or status list in the page body.
- `上級項目` / `Parent item` and `子項目` / `Sub-items`: system properties automatically added when Notion Sub-items are enabled. They may be renamed and are used only for the work hierarchy.
- `最後更新` / `Last Updated`: last edited time for sorting and recency.

If an existing database already uses clear equivalent property names, preserve the existing schema rather than renaming fields only to match these examples.

## Hierarchy

```text
L1 Work context
├─ L2 Task
├─ L2 Task
└─ L2 Task
   └─ L3+ only when the user explicitly asks for subtasks
```

The L level is determined only by the Sub-items hierarchy represented by `Parent item` / `Sub-items`.

`Domain` is a property on the same row. It is not L0 and not a parent node.

### L1: Work context

L1 stores context that is shared by multiple L2 tasks and is still currently valid.

Suitable content includes:

- goals and scope;
- confirmed decisions;
- constraints and must-not-break conditions;
- background that cannot be reliably inferred from individual tasks but is needed across child tasks.

Do not put these in L1:

- progress already visible from the `Status` property;
- rollups or summaries of child task statuses;
- duplicated copies of database property values;
- chronological work logs.

Create L1 when:

- the user explicitly asks to create a work context;
- AI cannot find a suitable existing L1 and suggests creating one. In that case AI must not create it immediately and must first obtain user confirmation.

### L2: Task

L2 is the default, normal, primary execution unit under an L1 work context.

Each L2 should:

- be understandable on its own;
- be independently executable, completable, and reviewable;
- be allowed to depend on shared L1 context, but not require sibling tasks to reconstruct its own complete requirements;
- use the `Status` property for progress instead of maintaining another progress record in the page body.

Create new tasks as L2 by default.

If the user asks to "split" one task into multiple tasks, replace the original task with multiple **sibling tasks at the same level** by default. Do not preserve a parent that has become only a label and no longer carries independent information value.

Only preserve the original task and create a deeper level when the user explicitly asks for **subtasks**.

### L3+

L3 and deeper levels do not have new semantics. They are still tasks.

However, they are not a default planning mechanism:

- AI must not create L3+ merely because it believes a task could be decomposed further;
- use L3+ only when the user explicitly asks for subtasks or when the existing data already contains a deeper hierarchy;
- do not deepen or flatten existing structure merely for consistency.

## Comments: store events

Use comments for time-ordered information that may be historically useful but should not pollute the current page body, such as:

- human-AI discussion;
- questions raised by AI;
- the user's actual reply or decision;
- AI execution results;
- review findings;
- fixes and follow-up observations.

Comments are not part of the L1/L2/L3+ hierarchy.

Normal work does not require reading every comment first. Read relevant comments only when the current page does not sufficiently explain a rule, requirements appear contradictory, the reason behind a decision matters, or the user asks to review history.

If a comment produces a decision that remains valid and future work must know it, summarize that decision into the appropriate page body. Do not copy the full discussion into the page.

## Reading flow

When handling a work item:

1. Read the target row first.
2. Follow `Parent item` upward and read the necessary ancestors, at minimum enough to understand its L1 work context.
3. If the current information is sufficient, plan or act.
4. Read relevant comments only when something is unclear, contradictory, unexpectedly constrained, historically dependent, or explicitly requested by the user.
5. Do not read all siblings or comments merely because they exist.

## CRUD rules

### L1

- **Create**: when explicitly requested by the user, or after AI suggests one and receives user confirmation.
- **Read**: read the necessary shared context when working on child tasks.
- **Update**: update when shared current truth changes, such as goals, scope, decisions, or constraints.
- **Delete**: only when explicitly requested by the user and after the write-confirmation flow.

### L2

- **Create**: when creating a new independently executable task.
- **Read**: read the task itself and the necessary ancestor context.
- **Update**: when task requirements, active decisions, status, or other current truth changes.
- **Delete / Replace**: when explicitly requested by the user or after confirming that the task will be replaced by multiple sibling tasks.

### L3+

CRUD is the same as for tasks, but L3+ is used only when the user explicitly asks for subtasks or the existing structure already contains deeper levels.

### Comments

Creating, editing, or deleting comments is a Notion write and must follow the same preview-and-confirm flow.

## Write confirmation

Reading Notion does not require confirmation.

Any operation that changes Notion must follow:

```text
Read necessary data
→ Show the planned change
→ User confirms
→ Execute only the confirmed change
```

Writes include, but are not limited to:

- creating a page or row;
- editing page content or properties;
- changing status;
- adding, removing, or changing relations;
- moving an item to another parent;
- splitting, merging, replacing, or deleting tasks;
- creating, editing, or deleting comments.

The preview must make it clear which item will change, what will change, and whether hierarchy will change.

After confirmation, execute only the previewed scope. If new information discovered before execution requires a different change, show a new preview and obtain confirmation again.

## Page writing style

Do not force every L1 or L2 page into a rigid heading template.

The page only needs to clearly preserve currently valid information. Choose sections based on the work itself.

Prefer updating existing current-state content over appending a new copy after every change.

## Boundaries

- Do not treat `Domain` as hierarchy.
- `Parent item` / `Sub-items` represent only the work hierarchy.
- Do not create L1 on your own.
- Do not create L3+ on your own.
- Do not duplicate status or progress in page content.
- Do not create large numbers of historical pages for ordinary AI interactions.
- Do not require complete history to be read before every task.
- Do not write to Notion without confirmation.
- Do not overwrite confirmed user decisions merely because generic best practices suggest something else.
