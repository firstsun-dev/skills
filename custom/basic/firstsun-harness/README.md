# firstsun-harness

Lightweight engineering guardrails for coding agents: context, verification, scope isolation,
operational safety, knowledge persistence, and token efficiency. It keeps no state of its own;
tasks live in GitHub Issues, progress in branches and PRs.

## Install

```bash
npx skills add firstsun-dev/skills --skill firstsun-harness
```

## Use

Ask the agent to set up, audit, or migrate a repository. The audit also runs directly
(Node.js built-ins only, read-only):

```bash
node scripts/audit-harness.mjs --target /path/to/project
node --test scripts/audit-harness.test.mjs
```

## Files

| Path | Content |
|---|---|
| `SKILL.md` | Guardrails and workflow |
| `templates/agents.md` | Instruction entrypoint template |
| `references/` | Verification and safety; legacy migration |
| `scripts/` | Static audit and its tests |
| `evals/evals.json` | Behavioral scenarios |

## Upgrading from 1.x

2.0 removes `feature_list.json`, `progress.md`, `session-handoff.md`, monthly archives, the
state-size gate, the scaffolder (`create-harness.mjs`, including `--upgrade`), the five-subsystem
score, and the benchmark and HTML reports. There is no compatibility mode; see
[references/migration.md](references/migration.md).
