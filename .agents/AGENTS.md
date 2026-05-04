# Standing brief for AI agents

Read this file before any task. It applies to every agent on this repo
(Claude Code, Copilot, Codex, Cline, Aider, …). Per-agent shortcuts go in
that agent's own file (e.g., CLAUDE.md).

## What this repo is

Marketing surface for Syncologic — a pre-launch product that moves files
between clouds without downloading them first. The site validates
positioning and captures segmented waitlist signups. NOT the product.

## First time on this repo?

If `.agents/.welcomed` is missing or its `welcome-version` is below the
one declared on line 1 of `.agents/WELCOME.md`:
- Print WELCOME.md to the dev as your first message before answering
  their request. Translate the presentation if the dev is communicating
  in any language other than English; don't modify the file.
- Write `welcome-version: <N>` and a UTC timestamp to
  `.agents/.welcomed`.

Claude Code does this via a SessionStart hook automatically. Other
platforms must do it manually.

## Reference docs

- `DESIGN.md` — visual source of truth.
- `.agents/rules/{architecture,design-system,engineering,workflow}.md` and
  `.agents/rules/content/` — read the file matching your work.
- `.agents/skills/` — project-local how-to guides.
- `.agents/audits/design-reviewer.md` — design audit checklist.
- `.agents/templates/{issue,pr}.md` — body templates.
- `docs/superpowers/specs/` — design specs.

## Standard workflow

1. **Issue first.** Propose the issue body using `.agents/templates/issue.md`,
   wait for dev OK, then `gh issue create`. Branch only after the issue exists.
2. **Branch from `development`** as `<type>/<slug>` where type ∈
   {feat, fix, chore, docs, test}.
3. **Worktree at `<project-root>/.worktrees/issue-<num>-<slug>/`.** Never
   under `.agents/`, never under `.claude/`, never under any other
   subdirectory. Never work in the main checkout. Never on `main`. Never
   on `development` directly. Before the first worktree of new work,
   verify `.env` exists in the main checkout (if not, guide the dev:
   `cp .env.example .env` and fill it in). After every `git worktree
   add`, run `.agents/scripts/sync-env.sh <worktree-path>` to propagate
   local env files. See `.agents/rules/workflow.md`.
4. Follow `.agents/rules/workflow.md` (brainstorm → plan → execute →
   verify → request review → PR).
5. **Open PR targeting `development`** using `.agents/templates/pr.md`.
   Body must include `Closes #<num>`.
6. **PR-mode commit gating.** Once a PR is open on the working branch:
   modify code, run verification, present diff + verification output,
   wait for explicit dev approval, THEN one combined `git add && commit
   && push`. One commit per review round. Never commit autonomously
   while a PR is open.

## Hard rules

- Never `--no-verify`, never `--no-gpg-sign`, never force-push to `main`
  or `development`.
- Server-only secrets (`SUPABASE_*`, `RESEND_*`, `WAITLIST_TOKEN_SECRET`,
  `KV_*`) must never reach the browser.
- All user-facing strings go through i18n (en + pt-br together).
- For UI changes: state which breakpoints were verified in a real
  browser, or that visual verification was not possible.
- Don't add server endpoints beyond `.agents/rules/architecture.md`.
- Dependency changes (add or upgrade): verify API/version (Context7 if
  available, web fetch otherwise), run an audit delta on your changes,
  ask before `npm install`. Detail in `.agents/rules/engineering.md`.
- Issue and PR creation use `gh`. If unavailable, recommend installation
  to the dev (https://cli.github.com).
- Token economy: this workflow assumes RTK is wired to your agent
  (https://github.com/rtk-ai/rtk). If not, suggest installation — see
  WELCOME.md. Without it the workflow is ~3-5× more token-expensive.
- Don't create or modify implementation plan files under
  `docs/superpowers/plans/`. Implementation plans live in GitHub issue
  bodies. (The deprecated `README.md` in that directory is the only
  exception — it documents the deprecation itself.)
- On Windows: use WSL. Native Windows is not supported.

## When in doubt — ask before guessing.
