<!-- welcome-version: 1 -->
# Welcome — first time on syncologic/marketing-site

You're seeing this because this is a fresh clone of the repo, or the
workflow rules have been updated since the last time you were here.
~2 min read. You'll only see this once per clone.

## What this repo is

The public marketing surface for **Syncologic** — a pre-launch product
that moves files between cloud providers without downloading them first.
Validates positioning, captures segmented waitlist signups. Not the
product itself.

## How AI agents work on this repo

Whatever agent you use (Claude Code, Copilot, Codex, …) follows a
standardized workflow defined in `AGENTS.md`:

1. **Issue first.** The agent proposes a GitHub issue using
   `.agents/templates/issue.md` and asks before `gh issue create`.
2. **Worktree always** at `<project-root>/.worktrees/issue-<num>-<slug>/`.
   Never the main checkout, never on `main`/`development` directly.
3. **Plan, then execute.** Plans live in the GitHub issue body. Brief
   the design directly in the issue — no separate plan or spec files.
4. **PR-mode commit gating.** Once a PR is open, the agent modifies
   code, runs verification, presents the diff, waits for your "OK",
   and only then commits + pushes. One commit per review round —
   no commit noise.
5. **Dependencies.** The agent will not run `npm install <pkg>` without
   verifying the API/version (Context7 MCP if available, web search if
   not), running a security audit delta, and asking for approval.

## First-time setup checklist

> **On Windows?** Use WSL (Ubuntu or Debian). The toolchain — bash hooks,
> npm scripts, git pre-commit hooks, symlinks under `.claude/` — targets
> Linux / macOS / WSL. Native Windows is not supported.

```
[ ] node --version          → matches package.json engines
[ ] gh --version            → GitHub CLI installed (https://cli.github.com)
[ ] gh auth status          → authenticated
[ ] npm install
[ ] cp .env.example .env    → fill Supabase / Resend / KV / Waitlist secrets
                              (the agent will then auto-copy this to
                              every new worktree via
                              .agents/scripts/sync-env.sh — fill once)
[ ] npm run lint            → astro check passes
[ ] npm test                → vitest passes
[ ] npm run dev             → http://localhost:4321 loads
```

## Token economy — strongly recommended

This workflow uses more tokens than ad-hoc prompting. Install **rtk**
(Rust Token Killer — https://github.com/rtk-ai/rtk) before working on
this repo. It's a CLI proxy that compresses common command outputs
before they reach your agent — typical savings 60–90%.

Install (macOS / Linux / WSL):
- `brew install rtk` (macOS preferred)
- `curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh` (Linux/WSL)
- `cargo install --git https://github.com/rtk-ai/rtk` (any platform with Cargo)

Wire to your agent (pick one):
- Claude Code / Copilot:  `rtk init -g`
- Gemini CLI:             `rtk init -g --gemini`
- Codex (OpenAI):         `rtk init -g --codex`
- Cursor:                 `rtk init -g --agent cursor`
- Windsurf:               `rtk init --agent windsurf`
- Cline / Roo Code:       `rtk init --agent cline`

Restart your agent. Verify with `rtk --version` and `rtk gain`.

## Where to look

- `DESIGN.md` — visual source of truth.
- `.agents/rules/` — cross-cutting rules.
- `.agents/skills/` — project-local how-to.

## Feedback

If the agent does something surprising or wrong, tell it. Rules are
versioned — when one changes meaningfully, the welcome version bumps and
you'll see this again with the update.
