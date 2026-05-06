# CLAUDE.md — Claude Code addendum

Read [`AGENTS.md`](./AGENTS.md) first. This file only adds shortcuts.

## Disciplines map to superpowers skills

| Discipline (in workflow.md)       | Skill                                       |
|-----------------------------------|---------------------------------------------|
| Brainstorm before creative work   | superpowers:brainstorming                   |
| Multi-step implementation         | superpowers:writing-plans (plan → issue body) → executing-plans |
| Bug / unexpected behavior         | superpowers:systematic-debugging            |
| TDD on src/lib/* + src/i18n/utils | superpowers:test-driven-development         |
| Verify before claiming done       | superpowers:verification-before-completion  |
| Request / receive review          | superpowers:requesting-code-review / receiving-code-review |
| Worktrees                         | superpowers:using-git-worktrees             |
| Finish a development branch       | superpowers:finishing-a-development-branch  |
| Tracks marked parallelizable      | superpowers:dispatching-parallel-agents (isolation: "worktree") |

Project-local skills: `.agents/skills/astro-workflow`, `.agents/skills/using-astro`.
Subagents: `.claude/agents/design-reviewer.md` (symlinked from `.agents/audits/`).
Slash commands: `/design-check <files>`.
Settings: `.claude/settings.json` (permissions + SessionStart hook).
