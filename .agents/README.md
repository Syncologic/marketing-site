# .agents/ — canonical home for AI-agent guidance

Every agent (Claude Code, Copilot, Codex, Cline, Aider, …) reads this
directory's content. The `.claude/` directory at the repo root contains
Claude-Code-specific config (settings, hooks, slash commands) plus
symlinks back here for shared content.

## Layout
- `AGENTS.md` — standing brief (read first).
- `WELCOME.md` — first-run onboarding (versioned).
- `rules/` — cross-cutting rules. Read the file matching your work.
- `skills/` — project-local how-to guides.
- `audits/` — agent-runnable audit checklists (e.g., design-reviewer).
- `scripts/` — small tooling shared across agents.
- `templates/` — body templates for `gh issue create` and PRs.

## Precedence (when rules conflict)
1. Explicit user instructions — always win.
2. `../DESIGN.md` (root) — visual source of truth.
3. The active spec under `../docs/superpowers/specs/` — current task scope.
4. Files in this directory — architecture, content, engineering, design-token usage, workflow.
5. Default agent behavior — lowest priority.

## Adding new agents
- `AGENTS.md` (root) is symlinked to `./AGENTS.md`. Compatible agents (Copilot, Codex, Cline, Aider) auto-discover.
- Cursor: add `.cursor/rules/main.mdc` with `@import ../../AGENTS.md`.
- Windsurf: symlink `.windsurfrules` to `./AGENTS.md`.
- Gemini CLI: symlink `GEMINI.md` to `./AGENTS.md`.
