# Agents directory restructure — design

**Date:** 2026-05-03
**Status:** Draft for review
**Author:** Brainstormed with Claude (Opus 4.7)

## Goal

Restructure repository so that all cross-cutting AI-agent guidance lives under a neutral `.agents/` directory. `.claude/` becomes a Claude-Code-only compatibility bridge (settings, hooks, slash commands, plus symlinks back to `.agents/` for shared content). Other agents (Copilot, Codex CLI, Cline, Aider) get the same content via a root `AGENTS.md` symlink. Future agents (Cursor, Windsurf, Gemini) can be added with one-line shims.

Alongside the restructure, define explicit conventions for: first-run onboarding, worktree location, GitHub issue + PR workflow, PR-mode commit gating, dependency-change discipline, and parallel-task structure. Compress files to keep token budgets reasonable for $20-tier users.

## Non-goals

- Adding Cursor / Windsurf / Gemini-CLI shims now (left as future-easy via symlink/include).
- Migrating existing files in `docs/superpowers/plans/` — the directory becomes deprecated, but historical files stay for git reference.
- Replacing `superpowers:writing-plans` skill — kept as discipline; only the output destination changes (GitHub issue body instead of file under `docs/superpowers/plans/`).
- Adding a committed `.mcp.json` for Context7 — kept as "use if available" so the repo stays portable.

## Decisions summary

All resolved during brainstorming on 2026-05-03:

| # | Decision | Choice |
|---|---|---|
| 1 | Agents covered now | Claude Code (`.claude/`) + AGENTS.md (Copilot, Codex, Cline, Aider). Cursor/Windsurf/Gemini = future-easy via symlinks. |
| 2 | File language | All files in English. |
| 3 | Welcome detection | Per-clone marker file, version-aware. Hook (Claude) + textual instruction (others). Non-blocking. |
| 4 | Welcome translation | Welcome file stays English; agent translates *presentation* if dev communicates in another language. |
| 5 | Pre-PR commits | Status quo — `executing-plans` flow with per-task commits. |
| 6 | Post-PR-open commits | Gated. Diff + verification → dev OK → single commit + push per review round. |
| 7 | Issue creation | Agent proposes (title + body draft), dev OKs, then `gh issue create`. |
| 8 | Branch naming | `<type>/<slug>` where type ∈ {feat, fix, chore, docs, test}. |
| 9 | Worktree path | `<project-root>/.worktrees/issue-<num>-<slug>/`. Hard rule: never under `.agents/`, never under `.claude/`, never under any other subdirectory. |
| 10 | Plans → issues | `docs/superpowers/plans/` is deprecated. Implementation plans go in GitHub issue bodies via `.agents/templates/issue.md`. Specs in `docs/superpowers/specs/` stay. |
| 11 | Superpowers obligation | Disciplines described in plain prose in `.agents/rules/workflow.md`. CLAUDE.md provides skill mapping for Claude users. |
| 12 | Context7 MCP | "If available, consult." No committed `.mcp.json`. |
| 13 | Dependency discipline | Verify API/version (Context7 if available, web fetch otherwise) + run security audit delta + ask before `npm install`. |
| 14 | Security audit scope | Report only advisories introduced by the agent's changes; pre-existing issues out of scope unless dev asks. |
| 15 | `gh` CLI | Required for the workflow. If missing, agent recommends installation before proceeding. |
| 16 | RTK (token proxy) | Strongly recommended in `WELCOME.md`. Setup commands per agent. WSL note for Windows. |
| 17 | Windows | Use WSL. Native Windows is not supported (bash hooks, symlinks, RTK hook system all assume Linux/macOS/WSL). |
| 18 | Parallel tasks | Default flat checklist. Tracks only when 2+ chunks of ≥30 min each, with non-overlapping scopes. Writing for parallel-ability is required; executing in parallel is optional. |
| 19 | File size discipline | Compress AGENTS.md (100→80), CLAUDE.md (35→20), workflow.md (150→110). Split content.md (370 lines) into voice + sitemap + waitlist + per-page playbooks for token economy. |
| 20 | Env propagation | `.env.example` → `.env` (filled once in the main checkout, with dev guidance). After every `git worktree add`, agent runs `.agents/scripts/sync-env.sh` to copy `.env`, `.env.local`, `.env.production` into the new worktree. Idempotent; not auto-synced on edits. |

## Final directory layout

```
marketing-site/
├── AGENTS.md                          symlink → .agents/AGENTS.md
├── CLAUDE.md                          rewritten (≤20 lines), Claude-only addendum
├── DESIGN.md                          unchanged
├── README.md                          unchanged
│
├── .agents/                           canonical home for agent-neutral content
│   ├── AGENTS.md                      ≤80 lines — standing brief
│   ├── README.md                      ~20 lines — index + precedence
│   ├── WELCOME.md                     ~55 lines — first-run onboarding (versioned)
│   ├── rules/
│   │   ├── README.md                  unchanged (~25 lines)
│   │   ├── architecture.md            moved from .claude/ (~175 lines, no content change)
│   │   ├── content/                   NEW — split for token economy
│   │   │   ├── README.md              ~10 lines — index of content rules
│   │   │   ├── voice-and-rules.md     ~50 lines — voice, naming, forbidden phrases
│   │   │   ├── sitemap.md             ~30 lines — sitemap + landing/SEO discipline
│   │   │   ├── waitlist.md            ~80 lines — segmentation, schema, enums
│   │   │   └── playbooks/
│   │   │       ├── homepage.md
│   │   │       ├── cloud-to-cloud-transfer.md
│   │   │       ├── business-cloud-migration.md
│   │   │       ├── scheduled-cloud-backup.md
│   │   │       ├── private-runner.md
│   │   │       ├── browser-transfer.md
│   │   │       ├── local-nas-backup.md
│   │   │       ├── developer-automation.md
│   │   │       ├── self-hosted.md
│   │   │       └── pricing.md         ~25 lines each
│   │   ├── design-system.md           moved (~145 lines)
│   │   ├── engineering.md             moved + dep-verify + audit-delta + WSL note (~195 lines)
│   │   └── workflow.md                NEW (~110 lines) — disciplines + parallelism rules
│   ├── skills/
│   │   ├── astro-workflow/SKILL.md    moved + Windows-path fix (~110 lines)
│   │   └── using-astro/SKILL.md       moved (~257 lines)
│   ├── audits/
│   │   └── design-reviewer.md         moved + stale-ref fix (~93 lines)
│   ├── scripts/
│   │   └── sync-env.sh                NEW (~25 lines) — propagate local .env* files into worktrees
│   └── templates/
│       ├── issue.md                   NEW (~45 lines) — Goal/Why/Out-of-scope/Tasks/Verification
│       └── pr.md                      NEW (~20 lines) — Summary/Closes/Test plan
│
├── .claude/                           Claude Code only
│   ├── settings.json                  edited — adds SessionStart hook, keeps permissions
│   ├── settings.local.json            unchanged (gitignored)
│   ├── rules               → ../.agents/rules                     (symlink)
│   ├── skills              → ../.agents/skills                    (symlink)
│   ├── agents/
│   │   └── design-reviewer.md → ../../.agents/audits/design-reviewer.md (symlink)
│   ├── commands/
│   │   └── design-check.md           unchanged (~12 lines)
│   └── hooks/
│       └── welcome.sh                 NEW (~25 lines) — first-run welcome trigger
│
├── .worktrees/                        canonical worktree root (already gitignored)
│
└── docs/
    └── superpowers/
        ├── specs/                     unchanged — design specs stay here
        └── plans/
            ├── README.md              NEW — deprecation notice
            └── …existing files…       kept for git history; do not modify
```

## File contents

### `.agents/AGENTS.md` (≤80 lines)

```markdown
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
```

### Root `CLAUDE.md` (≤20 lines)

```markdown
# CLAUDE.md — Claude Code addendum

Read [`AGENTS.md`](./AGENTS.md) first. This file only adds shortcuts.

## Disciplines map to superpowers skills

| Discipline (in workflow.md)       | Skill                                       |
|-----------------------------------|---------------------------------------------|
| Brainstorm before creative work   | superpowers:brainstorming                   |
| Multi-step implementation         | superpowers:writing-plans (plan → issue body, NOT docs/superpowers/plans/) → executing-plans |
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
```

### `.agents/WELCOME.md` (~55 lines)

```markdown
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
3. **Plan, then execute.** Plans live in the issue body (not in
   `docs/superpowers/plans/`, which is deprecated). For design-heavy
   work, a spec goes in `docs/superpowers/specs/` first.
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
- `docs/superpowers/specs/` — current specs.

## Feedback

If the agent does something surprising or wrong, tell it. Rules are
versioned — when one changes meaningfully, the welcome version bumps and
you'll see this again with the update.
```

### `.agents/rules/workflow.md` (~110 lines)

```markdown
# Workflow rules

How every agent works on this repo, regardless of platform. Claude Code's
superpowers plugin maps each discipline to a skill — see CLAUDE.md.

## 1. Brainstorm before creative work
Explore intent before writing code. Ask one question at a time. Propose
2–3 approaches. Get the dev's approval. Spec writing (in
`docs/superpowers/specs/`) is OPTIONAL — only for design-heavy work.

## 2. Issues are where plans live

`docs/superpowers/plans/` is DEPRECATED. Do not create new files there.
Implementation plans go in GitHub issue bodies using
`.agents/templates/issue.md`.

The `gh` CLI is required. If `gh --version` fails, stop and recommend
installation (https://cli.github.com) before proceeding.

Flow:
- Agent drafts issue body matching the template.
- Agent shows the draft to the dev and asks for OK.
- Agent runs `gh issue create --body-file <draft>` and captures the
  resulting issue number.

## 3. Tasks: parallel-ability is proportional

Three rules when filling the issue's Tasks section:

**Default to flat.** Most issues are small. A 1–4 step issue with a
single logical sequence is a flat checklist. No tracks.

**Use tracks only when ALL hold:**
- Work splits into 2+ independent chunks.
- Each chunk is ≥ ~30 min of meaningful work.
- Chunks touch non-overlapping scopes.

If any condition fails, keep flat. Splitting trivial work into
micro-tracks ("rename in foo.ts" / "rename in foo.test.ts") is
over-fragmentation — collapse to flat.

**Discipline is the QUESTION, not the format.** Always ask "could
parts run independently and matter?" Sometimes "no, it's a 5-min fix"
is the honest answer. That's a flat list, and that's fine.

**Scope notation:**
- Concrete paths when ≤ 5 files.
- Glob when many files match: `src/components/**/*.astro`.
- Free-form when neither fits: `<project-wide rename>`,
  `<config + docs only>`.
- Omit if the Goal makes scope obvious.

If a track's scope overlaps another's or is "project-wide", they
aren't actually independent — merge or fall back to flat.

**Cross-track dependencies:** `**Depends on:** Track A complete` at
the top of the dependent track. Tracks without that line are
root-parallelizable.

## 4. Worktrees — strict location rule

Every implementation happens in its own worktree at:

    <project-root>/.worktrees/issue-<num>-<slug>/

`<project-root>` is the directory containing `package.json`. The
`.worktrees` directory MUST be at the root — NEVER under `.agents/`,
NEVER under `.claude/`, NEVER under `src/`, NEVER under any other
subdirectory.

Branch from `development`:

    git fetch origin
    git worktree add -b <type>/<slug> \
      .worktrees/issue-<num>-<slug> origin/development
    .agents/scripts/sync-env.sh .worktrees/issue-<num>-<slug>

`<type>` ∈ {feat, fix, chore, docs, test}.

**Environment files.** `.env`, `.env.local`, `.env.production` are
gitignored — they exist in the main checkout but not in fresh
worktrees. The flow:

1. Before the FIRST worktree of any work, verify `.env` exists in the
   main checkout. If not, stop and guide the dev:
       cp .env.example .env
       <fill in Supabase / Resend / KV / Waitlist secrets per the
        comments in .env.example>
2. After EVERY `git worktree add`, run the sync script (already shown
   above). It copies any of `.env`, `.env.local`, `.env.production`
   that exist in the main checkout into the new worktree. Idempotent.
3. For parallel tracks, repeat for each track worktree.

The agent does NOT auto-sync when `.env` changes in main — re-run the
script manually after editing credentials.

When merged or abandoned: `git worktree remove <path>` then
`git worktree prune`.

The issue's main worktree at `.worktrees/issue-<num>-<slug>/` always
exists on branch `<type>/<slug>` — that's where the PR opens from.

For parallel execution (optional), each track gets an additional
sub-branch and worktree:

    .worktrees/issue-<num>-<slug>/            ← integration branch <type>/<slug>
    .worktrees/issue-<num>-<slug>-track-A/    ← branch <type>/<slug>-track-A
    .worktrees/issue-<num>-<slug>-track-B/    ← branch <type>/<slug>-track-B

Track sub-branches are created from `<type>/<slug>` (so they share
the same base). When all tracks are done, the integration worktree
runs `git merge <type>/<slug>-track-A` and `git merge
<type>/<slug>-track-B`. Then the PR opens from `<type>/<slug>`.
One PR per issue.

Claude Code: `superpowers:dispatching-parallel-agents` with
`isolation: "worktree"` automates this.

## 5. Execute task by task
- Read the issue's task list as your plan.
- For each task: do the work, run scoped verification, commit with a
  conventional-commit message.
- After each commit, mark the checkbox via `gh issue edit` so progress
  is visible.
- TDD on `src/lib/*` and `src/i18n/utils.ts`: failing test first.

## 6. Verify before claiming done
- `npm run lint` — always.
- `npm test` — if `src/lib/*` or `src/i18n/utils.ts` changed.
- `npm run build` — if any public-page or routing change.
- For UI: state breakpoints verified in a real browser, or that visual
  verification was not possible.
- For API: `curl` the endpoint, confirm contract.

## 7. Open the PR
- Target: `development`. Never `main`.
- Body uses `.agents/templates/pr.md`, includes `Closes #<num>`.
- `gh pr create --base development …`

## 8. PR-mode commit gating
Detect via `gh pr view --json state -q .state 2>/dev/null`. If `OPEN`:
1. Modify code → run verification.
2. Present `git diff` + verification output.
3. Wait for explicit dev approval.
4. Then `git add && git commit && git push` — one combined commit per
   review round.

Never commit + push autonomously while a PR is open. Never force-push.

## 9. After merge
- The merge auto-closes the issue (via `Closes #<num>`).
- `git worktree remove` + `git worktree prune`.
- Promotion `development → main` is the dev's call.
```

### `.agents/rules/engineering.md` — additions

Append to existing file (after the "Risky actions — confirm first" section):

```markdown
## Dependency changes — extra discipline

The stack is intentionally small. Adding or upgrading a package needs
more than a green build.

Before proposing `npm install <pkg>` or any package.json version change:

1. **API + version verification.**
   - If Context7 MCP is available, consult it for current API and
     version compatibility with our stack.
   - If not, run a web search / WebFetch on the package's npm page or
     repo README and verify: latest stable version, Node requirement,
     compatibility with Astro 5 + TS strict + any peer deps in the tree.
   - Note the source you consulted in the proposal.

2. **Stop and ask.** Even with verification done, dependency additions
   and upgrades require explicit dev approval before `npm install` runs.

3. **Security audit delta.** When `package.json` or `package-lock.json`
   changes:
   - Pre-change: capture from the merge-base with `development` (or
     stash + audit + unstash if not yet committed).
   - Post-change: `npm audit --json` on the modified working tree.
   - Report ONLY advisories introduced by THIS change. Pre-existing
     issues are out of scope unless the dev explicitly asks for cleanup.
   - If a new high/critical advisory is introduced, propose alternatives
     (different package, pinned older version, no upgrade) before
     continuing.
   - Never run `npm audit fix` automatically — it rewrites the lockfile
     in ways that can break peer-dep resolution.
```

Also add a one-line WSL note in the existing setup section: "On Windows: use WSL (Ubuntu/Debian). Native Windows is not supported."

### `.agents/rules/content/` (split of current content.md)

Same content as today's `.claude/rules/content.md`, partitioned:

- **`README.md`** (~10 lines): one-paragraph index pointing to the right sub-file by task type.
- **`voice-and-rules.md`** (~50 lines): voice section, single broad message, naming consistency, forbidden phrases.
- **`sitemap.md`** (~30 lines): full sitemap, landing-vs-SEO discipline, page-type discipline.
- **`waitlist.md`** (~80 lines): waitlist segmentation, schema, canonical enums, i18n copy rules, provider list canonical order, first-build priority list.
- **`playbooks/<page>.md`** (~25 lines each, 10 files): one file per landing/SEO page, each holding only that page's playbook table.

No content lost. Token cost for a typical content task drops from ~5,550 → ~1,125 (loading voice-and-rules + one playbook).

### `.agents/templates/issue.md` (~45 lines)

```markdown
## Goal
<one sentence — what success looks like>

## Why
<motivation, constraint, deadline, link to spec if any>

## Out of scope
- <explicitly NOT covered>

## Tasks

> Default to a flat checklist. Use **tracks** only when the work splits
> into 2+ independent chunks of ≥30 min each, with non-overlapping
> scopes. Don't fragment small sequential work into micro-tracks.

<!-- MODE 1: flat (default). Delete the "tracks" block if using this. -->

**Scope:** <files / glob / free-form — omit if obvious from Goal>

- [ ] T1 — <description>
- [ ] T2 — <description>
- [ ] T3 — <description>

<!-- MODE 2: tracks (rare). Delete the "flat" block if using this. -->

### Track A — <short name>
**Scope:** <files / glob / free-form>
- [ ] A1 — <description>
- [ ] A2 — <description> [depends: A1]

### Track B — <short name>
**Depends on:** <Track A complete | nothing>
**Scope:** <files / glob / free-form>
- [ ] B1 — <description>

## Verification
- [ ] `npm run lint`
- [ ] `npm test` (or scoped: `npm test -- <pattern>`)
- [ ] `npm run build` (if relevant)
- [ ] <task-specific check>

## Notes
<deps changed, audit delta summary, anything reviewer should know>
```

### `.agents/templates/pr.md` (~20 lines)

```markdown
## Summary
<1–3 bullet points>

## Closes
Closes #<issue-number>

## Test plan
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] <task-specific>

## Visual verification (UI changes only)
Verified at: <breakpoints, e.g. 375px, 768px, 1280px>
OR: visual verification not performed (reason).

## Notes
<deps changed, audit delta, anything reviewer should know>
```

### `.agents/scripts/sync-env.sh` (~25 lines)

```bash
#!/usr/bin/env bash
# Sync local env files from the main checkout into a worktree.
# Usage: .agents/scripts/sync-env.sh <worktree-path>
set -euo pipefail

target="${1:-}"
if [[ -z "$target" || ! -d "$target" ]]; then
  echo "Usage: $0 <worktree-path>"
  exit 2
fi

# First entry in `git worktree list` is the main checkout
main=$(git worktree list --porcelain | awk '/^worktree/{print $2; exit}')

if [[ ! -f "$main/.env" ]]; then
  echo "ERROR: $main/.env does not exist."
  echo "Run from the main checkout:  cp .env.example .env"
  echo "Then fill Supabase / Resend / KV / Waitlist secrets per the"
  echo "comments in .env.example."
  exit 1
fi

for f in .env .env.local .env.production; do
  if [[ -f "$main/$f" ]]; then
    cp "$main/$f" "$target/"
    echo "synced $f → $target/"
  fi
done
```

### `.claude/hooks/welcome.sh` (~25 lines)

```bash
#!/usr/bin/env bash
set -euo pipefail
WELCOME=".agents/WELCOME.md"
MARKER=".agents/.welcomed"

[[ -f "$WELCOME" ]] || exit 0

want=$(grep -oE 'welcome-version: [0-9]+' "$WELCOME" | head -1 | grep -oE '[0-9]+')
have=$(grep -oE 'welcome-version: [0-9]+' "$MARKER" 2>/dev/null \
       | grep -oE '[0-9]+' || echo 0)

if [[ "$have" -lt "$want" ]]; then
  echo "FIRST-RUN WELCOME (welcome-version $want, was $have)."
  echo "Show the following to the dev VERBATIM as the first message"
  echo "before responding to their request — translate it into the"
  echo "dev's language if they're communicating with you in any"
  echo "language other than English. The file itself stays in English;"
  echo "translation is presentation-only. Then continue with their ask."
  echo "---"
  cat "$WELCOME"
  echo "---"
  printf 'welcome-version: %s\nfirst-seen: %s\n' \
         "$want" "$(date -u +%FT%TZ)" > "$MARKER"
fi
```

### `.claude/settings.json` — additions

Add SessionStart hook block (keep existing permissions and env):

```json
"hooks": {
  "SessionStart": [
    { "command": ".claude/hooks/welcome.sh" }
  ]
}
```

### `.gitignore` — additions

```
# Welcome marker — per-clone state
.agents/.welcomed
```

### `docs/superpowers/plans/README.md` (NEW)

```markdown
# DEPRECATED

This directory previously held implementation plans written by the
`superpowers:writing-plans` skill. As of 2026-05-03, implementation plans
live in **GitHub issue bodies** (see `.agents/templates/issue.md`).

Existing files are kept for git history. **Do not create new files
here. Do not modify existing files here.**

For Claude Code with the superpowers plugin: when the brainstorming skill
transitions to writing-plans, the plan content goes into the issue body
via `gh issue create --body-file` (and `gh issue edit` for revisions),
not into a file in this directory. See root `CLAUDE.md`.
```

## Cleanup operations (part of implementation, not design)

1. `git worktree prune` — drop the prunable `.claude/worktrees/i18n-pt-br` registration.
2. `rm -rf .claude/worktrees/` — remove the legacy directory tree (including its node_modules).
3. In `.agents/audits/design-reviewer.md`: replace the stale `syncologic_marketing_site_ideas.md` reference with `.agents/rules/content/` (specifically `.agents/rules/content/voice-and-rules.md` and the relevant per-page playbook under `.agents/rules/content/playbooks/`).
4. In `.agents/skills/astro-workflow/SKILL.md`: remove hardcoded Windows path (`C:\Users\Coffee\…`); replace with "the project root".
5. Add `.agents/.welcomed` to `.gitignore` (single line).
6. Verify all symlinks point correctly after the move.

## Migration order (high-level — detailed in the plan)

1. Create `.agents/` skeleton (directories + new files).
2. Move existing files from `.claude/rules/` and `.claude/skills/` to `.agents/`.
3. Move `.claude/agents/design-reviewer.md` to `.agents/audits/`.
4. Split `content.md` into the new layout under `.agents/rules/content/`.
5. Trim `AGENTS.md` and `CLAUDE.md` to the line budgets.
6. Write new files (`workflow.md`, `WELCOME.md`, templates, hook, sync-env script, deprecated README). Make `.agents/scripts/sync-env.sh` executable (`chmod +x`).
7. Establish symlinks: root `AGENTS.md`, `.claude/rules`, `.claude/skills`, `.claude/agents/design-reviewer.md`.
8. Add hook to `.claude/settings.json`.
9. Cleanup operations 1–5 above.
10. Verify the entire structure: `astro check`, `npm test`, `npm run build`, browse to confirm Claude Code reads the new files via symlinks, manually re-run welcome flow once.

## Verification

After implementation:

- `find .claude .agents -type l -ls` shows expected symlinks.
- `astro check`, `npm test`, `npm run build` all clean.
- `git worktree list` shows no `prunable` entries.
- Fresh shell session in the project triggers the welcome (delete
  `.agents/.welcomed` to test).
- `cat AGENTS.md` (root) returns content via the symlink.
- `cat .claude/rules/engineering.md` returns content via the symlink.
- The `design-reviewer` subagent runs successfully via `/design-check`.
- The deprecated `docs/superpowers/plans/README.md` is committed.
- `.agents/scripts/sync-env.sh` is executable and idempotent. Test:
  create a throwaway worktree, run the script, verify `.env` appears.
  Run again — same outcome (no errors, no duplicates).

## Open questions

None — all resolved during brainstorming.

## Out of scope (explicitly)

- Cursor / Windsurf / Gemini CLI shims (future-easy, not now).
- Committing a `.mcp.json` for Context7 (kept as "use if available").
- Migrating existing files in `docs/superpowers/plans/` (only deprecation notice added).
- Changes to existing specs in `docs/superpowers/specs/`.
- Any code changes outside the `.agents/` / `.claude/` / root-instruction-files scope.
