# Agents Directory Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Note:** This is the LAST plan that lives in `docs/superpowers/plans/`. After it merges, the directory becomes deprecated and future plans go in GitHub issue bodies. Symbolic, sue us.

**Goal:** Restructure the repo so that all agent-neutral content lives in `.agents/`, with `.claude/` becoming a Claude-Code-only compatibility bridge (settings, hooks, slash commands, plus symlinks back to `.agents/` for shared content). Add a root `AGENTS.md` for Copilot/Codex/Cline/Aider, a first-run welcome flow, dependency/audit discipline, env-propagation across worktrees, and a parallel-task issue template — per the spec at `docs/superpowers/specs/2026-05-03-agents-restructure-design.md`.

**Architecture:** Pure file/symlink reorganization plus net-new convention files. Symlinks (Linux/macOS/WSL) keep `.claude/` working unchanged for the existing tooling while making `.agents/` the canonical home. No source-code changes; no runtime impact. Verification is structural (paths, symlink resolution, hook execution) plus existing project gates (`astro check`, `npm test`, `npm run build`).

**Tech Stack:** Bash 4+, GNU coreutils, git ≥ 2.32, gh CLI, npm, Astro 5.

**Spec reference:** Always cross-check `docs/superpowers/specs/2026-05-03-agents-restructure-design.md` for design intent and full file contents. This plan focuses on execution order; the spec is the source of truth for what each new file says.

---

## File Structure

After this plan completes, the repo has:

```
marketing-site/
├── AGENTS.md                          symlink → .agents/AGENTS.md
├── CLAUDE.md                          rewritten, ≤20 lines
├── .agents/
│   ├── AGENTS.md                      ≤80 lines, standing brief
│   ├── README.md                      ~20 lines, index
│   ├── WELCOME.md                     ~55 lines, versioned first-run
│   ├── rules/
│   │   ├── README.md                  index
│   │   ├── architecture.md            moved unchanged
│   │   ├── design-system.md           moved unchanged
│   │   ├── engineering.md             moved + deps section + WSL note
│   │   ├── workflow.md                NEW, ~110 lines
│   │   └── content/
│   │       ├── README.md              NEW, index
│   │       ├── voice-and-rules.md     NEW, extract from content.md
│   │       ├── sitemap.md             NEW, extract from content.md
│   │       ├── waitlist.md            NEW, extract from content.md
│   │       └── playbooks/
│   │           ├── homepage.md
│   │           ├── cloud-to-cloud-transfer.md
│   │           ├── business-cloud-migration.md
│   │           ├── scheduled-cloud-backup.md
│   │           ├── private-runner.md
│   │           ├── browser-transfer.md
│   │           ├── local-nas-backup.md
│   │           ├── developer-automation.md
│   │           ├── self-hosted.md
│   │           └── pricing.md         (each ~25 lines, extract from content.md §"Landing page playbooks")
│   ├── skills/
│   │   ├── astro-workflow/SKILL.md    moved + Windows-path fix
│   │   └── using-astro/SKILL.md       moved unchanged
│   ├── audits/
│   │   └── design-reviewer.md         moved + stale-ref fix
│   ├── scripts/
│   │   └── sync-env.sh                NEW, ~25 lines, executable
│   └── templates/
│       ├── issue.md                   NEW, ~45 lines
│       └── pr.md                      NEW, ~20 lines
├── .claude/
│   ├── settings.json                  edited — adds SessionStart hook
│   ├── settings.local.json            unchanged (gitignored)
│   ├── rules               → ../.agents/rules                     (symlink)
│   ├── skills              → ../.agents/skills                    (symlink)
│   ├── agents/
│   │   └── design-reviewer.md → ../../.agents/audits/design-reviewer.md (symlink)
│   ├── commands/
│   │   └── design-check.md           unchanged
│   └── hooks/
│       └── welcome.sh                 NEW, ~25 lines, executable
└── docs/
    └── superpowers/
        └── plans/
            ├── README.md              NEW — deprecation notice
            └── …existing files…       untouched
```

The legacy `.claude/worktrees/i18n-pt-br/` directory is removed. `.gitignore` gains `.agents/.welcomed`.

---

## Pre-task setup (do this once before Task 1)

Create the worktree for the implementation. We don't have an issue yet because the issue/PR conventions are precisely what this plan establishes — bootstrap exception. Use a temporary slug:

```bash
git fetch origin
git worktree add -b chore/agents-restructure \
  .worktrees/agents-restructure origin/development
# .env propagation — sync-env.sh doesn't exist yet, manual one-liner:
[[ -f .env ]] && cp .env .worktrees/agents-restructure/
cd .worktrees/agents-restructure
```

All subsequent paths in this plan are relative to that worktree.

After Task 1 lands, you can backfill: open the GitHub issue, rename the worktree later if you care about the `issue-<num>-<slug>` shape. Or leave it — it's a one-shot bootstrap.

---

## Task 1: Cleanup legacy worktree + .gitignore prep

**Files:**
- Modify: `.gitignore`
- Delete: `.claude/worktrees/i18n-pt-br/` (entire tree, including its `node_modules`)

- [ ] **Step 1: Prune the legacy worktree registration**

```bash
git worktree prune
git worktree list
```

Expected: only the main checkout and `chore/agents-restructure` worktree remain. The previous `i18n-pt-br` line should be gone (if it was still listed as `prunable`, prune drops it).

- [ ] **Step 2: Remove the legacy directory tree**

```bash
rm -rf .claude/worktrees/
```

Expected: `.claude/worktrees/` no longer exists. `.claude/` now contains only `agents/`, `commands/`, `rules/`, `skills/`, `settings.json`, `settings.local.json`.

- [ ] **Step 3: Add the welcome marker to .gitignore**

Append to `.gitignore`:

```
# Welcome marker — per-clone state
.agents/.welcomed
```

- [ ] **Step 4: Verify**

```bash
test ! -d .claude/worktrees && echo "ok: legacy gone"
grep -q "^.agents/.welcomed$" .gitignore && echo "ok: gitignore has marker"
```

Both should print `ok:` lines.

- [ ] **Step 5: Commit**

```bash
git add .gitignore
git rm -r --cached .claude/worktrees 2>/dev/null || true
git commit -m "chore: remove legacy .claude/worktrees and ignore .agents/.welcomed"
```

---

## Task 2: Create the .agents/ skeleton

**Files:**
- Create directories: `.agents/`, `.agents/rules/`, `.agents/rules/content/`, `.agents/rules/content/playbooks/`, `.agents/skills/`, `.agents/audits/`, `.agents/scripts/`, `.agents/templates/`, `.claude/hooks/`

- [ ] **Step 1: Create directory tree**

```bash
mkdir -p .agents/rules/content/playbooks
mkdir -p .agents/skills
mkdir -p .agents/audits
mkdir -p .agents/scripts
mkdir -p .agents/templates
mkdir -p .claude/hooks
```

- [ ] **Step 2: Verify**

```bash
find .agents .claude/hooks -type d | sort
```

Expected output (exactly these directories — no others):

```
.agents
.agents/audits
.agents/rules
.agents/rules/content
.agents/rules/content/playbooks
.agents/scripts
.agents/skills
.agents/templates
.claude/hooks
```

- [ ] **Step 3: Stage skeleton with .gitkeep markers (so git tracks empty dirs)**

git doesn't track empty directories. Don't add `.gitkeep` if a real file lands in the same task or a later task. Skip `.gitkeep` here — Tasks 3-15 fill these directories with real files. Move on.

- [ ] **Step 4: Commit (no files yet — skip)**

This task creates only directories; nothing to commit yet. The directories will be committed implicitly when their first file lands in later tasks. Move on without committing.

---

## Task 3: Move existing rules to .agents/rules/

**Files:**
- Move: `.claude/rules/architecture.md` → `.agents/rules/architecture.md` (no edits)
- Move: `.claude/rules/design-system.md` → `.agents/rules/design-system.md` (no edits)
- Move: `.claude/rules/README.md` → `.agents/rules/README.md` (one line edit — see step 2)

- [ ] **Step 1: Move two files unchanged**

```bash
git mv .claude/rules/architecture.md .agents/rules/architecture.md
git mv .claude/rules/design-system.md .agents/rules/design-system.md
git mv .claude/rules/README.md .agents/rules/README.md
```

- [ ] **Step 2: Update `.agents/rules/README.md` paths**

The README references `./design-system.md` (and friends) — relative paths still work after the move. But it also has a precedence list mentioning `./DESIGN.md`, which is now at `../../DESIGN.md`. Change the precedence section's link:

In `.agents/rules/README.md`, replace `./DESIGN.md` with `../../DESIGN.md`. Use Edit tool — single occurrence.

Also update the "consolidated source of truth" paragraph: change "These four files" to "These rules files" since `content.md` is being split.

- [ ] **Step 3: Verify**

```bash
ls .agents/rules/architecture.md .agents/rules/design-system.md .agents/rules/README.md
test ! -f .claude/rules/architecture.md && echo "ok: old gone"
grep -q "../../DESIGN.md" .agents/rules/README.md && echo "ok: path fixed"
```

- [ ] **Step 4: Commit**

```bash
git add .agents/rules/ .claude/rules/
git commit -m "chore(agents): move architecture/design-system/README rules to .agents/"
```

---

## Task 4: Move + edit engineering.md (deps + WSL additions)

**Files:**
- Move: `.claude/rules/engineering.md` → `.agents/rules/engineering.md`
- Edit: append "Dependency changes — extra discipline" section + add WSL note in setup section

- [ ] **Step 1: Move the file**

```bash
git mv .claude/rules/engineering.md .agents/rules/engineering.md
```

- [ ] **Step 2: Add WSL note**

Open `.agents/rules/engineering.md`. The current file has no explicit "setup" section, but it has a "## Dev server etiquette" section. Add a one-line item at the top of that section:

```
- On Windows: use WSL (Ubuntu / Debian). Native Windows is not supported
  (bash hooks, npm scripts, git hooks, symlinks under .claude/ all assume
  Linux/macOS/WSL).
```

- [ ] **Step 3: Append the dependency discipline section**

At the end of `.agents/rules/engineering.md`, append the full block from the spec § "`.agents/rules/engineering.md` — additions". Verbatim.

- [ ] **Step 4: Verify**

```bash
test -f .agents/rules/engineering.md && test ! -f .claude/rules/engineering.md && echo "ok: moved"
grep -q "Dependency changes — extra discipline" .agents/rules/engineering.md && echo "ok: deps appended"
grep -q "use WSL" .agents/rules/engineering.md && echo "ok: WSL note added"
```

- [ ] **Step 5: Commit**

```bash
git add .agents/rules/engineering.md .claude/rules/engineering.md
git commit -m "chore(agents): move engineering.md to .agents/, add deps discipline and WSL note"
```

---

## Task 5: Move skills/ and design-reviewer.md (with edits)

**Files:**
- Move: `.claude/skills/astro-workflow/SKILL.md` → `.agents/skills/astro-workflow/SKILL.md` (with Windows path fix)
- Move: `.claude/skills/using-astro/SKILL.md` → `.agents/skills/using-astro/SKILL.md` (no edits)
- Move: `.claude/agents/design-reviewer.md` → `.agents/audits/design-reviewer.md` (with stale-ref fix)

- [ ] **Step 1: Move skills**

```bash
mkdir -p .agents/skills/astro-workflow .agents/skills/using-astro
git mv .claude/skills/astro-workflow/SKILL.md .agents/skills/astro-workflow/SKILL.md
git mv .claude/skills/using-astro/SKILL.md .agents/skills/using-astro/SKILL.md
rmdir .claude/skills/astro-workflow .claude/skills/using-astro
```

- [ ] **Step 2: Fix Windows-only path in astro-workflow**

In `.agents/skills/astro-workflow/SKILL.md`, replace the line:

```
All commands assume you run from the project root (`C:\Users\Coffee\Documents\GitHub\syncologic\marketing-site`).
```

with:

```
All commands assume you run from the project root (the directory containing `package.json`).
```

- [ ] **Step 3: Move design-reviewer**

```bash
git mv .claude/agents/design-reviewer.md .agents/audits/design-reviewer.md
```

- [ ] **Step 4: Fix stale ref in design-reviewer**

In `.agents/audits/design-reviewer.md`, the "Source of truth" section references `syncologic_marketing_site_ideas.md` (which no longer exists). Replace that line and item with:

```
3. **`./.agents/rules/content/voice-and-rules.md`** and the relevant per-page playbook under `./.agents/rules/content/playbooks/` — only when reviewing copy or page structure (named-public, single CTA, segmentation question).
```

(Plays well after Task 6 creates those files. The reference is to the FUTURE state — that's intentional, since this commit is a chore that lands together with the content split logically.)

- [ ] **Step 5: Verify**

```bash
test -f .agents/skills/astro-workflow/SKILL.md && echo "ok: astro-workflow"
test -f .agents/skills/using-astro/SKILL.md && echo "ok: using-astro"
test -f .agents/audits/design-reviewer.md && echo "ok: design-reviewer"
test ! -d .claude/skills && test ! -d .claude/agents && echo "ok: old dirs cleared"
grep -q "C:" .agents/skills/astro-workflow/SKILL.md && echo "FAIL: Windows path still present" || echo "ok: Windows path removed"
grep -q "syncologic_marketing_site_ideas" .agents/audits/design-reviewer.md && echo "FAIL: stale ref" || echo "ok: stale ref fixed"
```

- [ ] **Step 6: Commit**

```bash
git add .agents/skills/ .agents/audits/ .claude/skills/ .claude/agents/
git commit -m "chore(agents): move skills and design-reviewer to .agents/, fix stale refs"
```

---

## Task 6: Split content.md into the new layout

**Files:**
- Source: `.claude/rules/content.md` (382 lines, mapped by heading earlier)
- Create: 14 files under `.agents/rules/content/`

This is the largest task by file count. Extract by heading from `.claude/rules/content.md` per the line-range map below. The line ranges come from the actual headings in the existing file (verified before plan was written).

**Source map (existing `.claude/rules/content.md`):**
- 1-12: title + Voice
- 13-22: Single broad message
- 23-37: Landing pages vs SEO pages
- 38-63: Page-type discipline
- 64-77: Naming consistency
- 78-114: Sitemap (the route table)
- 115-128: Suggested homepage flow
- 129-253: Landing page playbooks (10 page entries — homepage, cloud-to-cloud, business migration, scheduled backup, private runner, browser transfer, local-nas backup, developer automation, self-hosted, pricing)
- 254-286: SEO page playbooks (tables: provider transfer guides, comparison pages, educational pages)
- 287-337: Waitlist segmentation
- 338-352: Provider list (canonical)
- 353-359: i18n copy rules
- 360-368: Forbidden phrases
- 369-382: First-build priority

**Destination map:**

| New file | Sources from content.md (lines) |
|---|---|
| `.agents/rules/content/voice-and-rules.md` | 1-22 (title+voice+broad msg), 64-77 (naming), 360-368 (forbidden phrases) |
| `.agents/rules/content/sitemap.md` | 23-63 (landing-vs-SEO + page-type discipline), 78-114 (sitemap table), 254-286 (SEO playbooks) |
| `.agents/rules/content/waitlist.md` | 287-352 (waitlist segmentation + provider list), 353-359 (i18n), 369-382 (first-build priority) |
| `.agents/rules/content/playbooks/homepage.md` | 115-128 (homepage flow) + the homepage entry from 129-253 |
| `.agents/rules/content/playbooks/cloud-to-cloud-transfer.md` | the cloud-to-cloud entry from 129-253 |
| ...and so on for each of the 9 other landing pages | |

- [ ] **Step 1: Create `voice-and-rules.md`**

Extract lines 1-22, 64-77, and 360-368 from `.claude/rules/content.md`. Write as `.agents/rules/content/voice-and-rules.md` with a new top-level heading `# Voice and copy rules`. Drop the original file's `# Content & Copy Rules` H1 (replaced by the new H1). Keep the `## Voice`, `## The single broad message`, `## Naming consistency`, `## Forbidden phrases` headings as-is.

- [ ] **Step 2: Create `sitemap.md`**

Extract lines 23-63, 78-114, 254-286. Write as `.agents/rules/content/sitemap.md` with H1 `# Sitemap and page-type discipline`. Keep section headings: `## Landing pages vs SEO pages`, `## Page-type discipline`, `## Sitemap`, `## SEO page playbooks`.

- [ ] **Step 3: Create `waitlist.md`**

Extract lines 287-359 and 369-382 (skip forbidden phrases at 360-368, those went to voice-and-rules). Write as `.agents/rules/content/waitlist.md` with H1 `# Waitlist segmentation, provider list, and i18n`. Keep section headings: `## Waitlist segmentation`, `## Provider list (canonical)`, `## i18n copy rules`, `## First-build priority`.

- [ ] **Step 4: Create the 10 playbook files**

For each landing-page section in lines 129-253 of the source, extract that section's heading + table block into its own file under `.agents/rules/content/playbooks/<slug>.md` with H1 derived from the page name. Slugs (in the same order as the source):

```
homepage.md                      ← "1. Homepage" section + the suggested-homepage-flow content from lines 115-128
cloud-to-cloud-transfer.md       ← "2. Cloud-to-Cloud Transfer"
business-cloud-migration.md      ← "3. Business Cloud Migration"
scheduled-cloud-backup.md        ← "4. Scheduled Cloud Backup"
private-runner.md                ← "5. Private Runner"
browser-transfer.md              ← "6. Browser Transfer"
local-nas-backup.md              ← "7. Local NAS Backup"
developer-automation.md          ← "8. Developer Automation"
self-hosted.md                   ← "9. Self-Hosted Future"
pricing.md                       ← "10. Pricing Interest"
```

For each: drop the numbering ("1.", "2.", …) from the heading. H1 should be the page name without the number prefix. Body: the original Markdown table for that page, verbatim.

Tip: open the source once, copy each section, paste into the target file with a fresh `# <Page Name>` H1.

- [ ] **Step 5: Create `.agents/rules/content/README.md`**

Write a ~10-line index pointing to the four siblings:

```markdown
# Content rules — index

Read the file matching your task. Don't load `.agents/rules/content/` whole.

- [`voice-and-rules.md`](./voice-and-rules.md) — voice, single broad message, naming consistency, forbidden phrases.
- [`sitemap.md`](./sitemap.md) — sitemap routes, landing-vs-SEO discipline, SEO page playbooks.
- [`waitlist.md`](./waitlist.md) — waitlist segmentation, schema, provider list (canonical), i18n copy rules, first-build priority.
- [`playbooks/<page>.md`](./playbooks/) — one file per landing page with that page's playbook table.

When in doubt, see the project standing brief at `../../AGENTS.md`.
```

- [ ] **Step 6: Delete the original**

```bash
git rm .claude/rules/content.md
```

- [ ] **Step 7: Verify content preservation**

```bash
# Total line count of new files should be roughly equal to original (with some slack for new H1s).
orig=$(git show HEAD:.claude/rules/content.md | wc -l)
new=$(find .agents/rules/content -name '*.md' -exec wc -l {} + | tail -1 | awk '{print $1}')
echo "original=$orig new=$new"
# Spot-check that key strings landed in expected files.
grep -q "Voice" .agents/rules/content/voice-and-rules.md && echo "ok: voice"
grep -q "Sitemap" .agents/rules/content/sitemap.md && echo "ok: sitemap"
grep -q "Waitlist" .agents/rules/content/waitlist.md && echo "ok: waitlist"
ls .agents/rules/content/playbooks/ | wc -l
# Expected: 10
```

If the line count diff is >50 in either direction, content was lost or duplicated — investigate.

- [ ] **Step 8: Commit**

```bash
git add .agents/rules/content/ .claude/rules/content.md
git commit -m "chore(agents): split content.md into voice/sitemap/waitlist/playbooks for token economy"
```

---

## Task 7: Write workflow.md

**Files:**
- Create: `.agents/rules/workflow.md`

- [ ] **Step 1: Write the file**

Use the full content from spec § "`.agents/rules/workflow.md` (~110 lines)". Verbatim — including the env-files block in section 4.

- [ ] **Step 2: Verify size and structure**

```bash
wc -l .agents/rules/workflow.md
# Expected: 100-130 lines
grep -c "^## " .agents/rules/workflow.md
# Expected: 9 (one per section: 1, 2, 3, 4, 5, 6, 7, 8, 9)
```

- [ ] **Step 3: Commit**

```bash
git add .agents/rules/workflow.md
git commit -m "feat(agents): add rules/workflow.md (disciplines, parallel tasks, worktree+env)"
```

---

## Task 8: Write WELCOME.md and the .agents/ index

**Files:**
- Create: `.agents/WELCOME.md`
- Create: `.agents/README.md`

- [ ] **Step 1: Write WELCOME.md**

Use the full content from spec § "`.agents/WELCOME.md` (~55 lines)". Verbatim. Line 1 MUST be the HTML comment `<!-- welcome-version: 1 -->`.

- [ ] **Step 2: Write the .agents/ index**

Create `.agents/README.md`:

```markdown
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
```

- [ ] **Step 3: Verify**

```bash
head -1 .agents/WELCOME.md
# Expected: <!-- welcome-version: 1 -->
wc -l .agents/WELCOME.md
# Expected: 50-65 lines
test -f .agents/README.md && echo "ok: index"
```

- [ ] **Step 4: Commit**

```bash
git add .agents/WELCOME.md .agents/README.md
git commit -m "feat(agents): add WELCOME.md (versioned first-run) and .agents/ index"
```

---

## Task 9: Write templates and sync-env script

**Files:**
- Create: `.agents/templates/issue.md`
- Create: `.agents/templates/pr.md`
- Create: `.agents/scripts/sync-env.sh` (executable)

- [ ] **Step 1: Write issue.md**

Use the full content from spec § "`.agents/templates/issue.md` (~45 lines)". Verbatim, including the HTML comments delimiting the two modes.

- [ ] **Step 2: Write pr.md**

Use the full content from spec § "`.agents/templates/pr.md` (~20 lines)". Verbatim.

- [ ] **Step 3: Write sync-env.sh**

Use the full content from spec § "`.agents/scripts/sync-env.sh` (~25 lines)". Verbatim, including the shebang.

- [ ] **Step 4: Make sync-env.sh executable**

```bash
chmod +x .agents/scripts/sync-env.sh
```

- [ ] **Step 5: Smoke-test sync-env.sh**

If `.env` exists in the main checkout, the script should succeed when pointed at the current worktree.

```bash
.agents/scripts/sync-env.sh .
# Expected (if .env exists in main): "synced .env → ./"
ls -la .env
# Expected: .env appears in current dir
```

If `.env` is missing in main, the script should print the ERROR-with-instructions message and exit 1. Don't pre-emptively `rm .env` to test the failure case in this worktree — instead, do a quick read-through of the script's `if [[ ! -f "$main/.env" ]]` branch to confirm the message text matches the spec.

- [ ] **Step 6: Verify**

```bash
test -f .agents/templates/issue.md && grep -q "MODE 1: flat" .agents/templates/issue.md && echo "ok: issue template"
test -f .agents/templates/pr.md && grep -q "Closes #" .agents/templates/pr.md && echo "ok: pr template"
test -x .agents/scripts/sync-env.sh && echo "ok: script executable"
```

- [ ] **Step 7: Commit**

```bash
git add .agents/templates/ .agents/scripts/
git commit -m "feat(agents): add issue/PR templates and sync-env.sh"
```

---

## Task 10: Write the trimmed AGENTS.md

**Files:**
- Create: `.agents/AGENTS.md`

- [ ] **Step 1: Write the file**

Use the full content from spec § "`.agents/AGENTS.md` (≤80 lines)". Verbatim.

- [ ] **Step 2: Verify line budget**

```bash
wc -l .agents/AGENTS.md
# Expected: ≤80 lines (target hard cap)
```

If the file is over 80 lines, trim adjective-heavy sentences until under budget. Do NOT cut hard rules or workflow steps.

- [ ] **Step 3: Verify the standing brief is self-contained**

The file should reference all rule files by name:

```bash
for f in architecture design-system engineering workflow; do
  grep -q "rules/$f" .agents/AGENTS.md && echo "ok: refs $f" || echo "FAIL: missing $f ref"
done
grep -q "rules/content/" .agents/AGENTS.md && echo "ok: refs content"
grep -q "templates/issue.md" .agents/AGENTS.md && echo "ok: refs issue template"
grep -q "templates/pr.md" .agents/AGENTS.md && echo "ok: refs pr template"
```

- [ ] **Step 4: Commit**

```bash
git add .agents/AGENTS.md
git commit -m "feat(agents): add AGENTS.md standing brief (≤80 lines)"
```

---

## Task 11: Establish symlinks

**Files:**
- Create symlinks: `AGENTS.md` (root), `.claude/rules`, `.claude/skills`, `.claude/agents/design-reviewer.md`

- [ ] **Step 1: Create root AGENTS.md symlink**

```bash
ln -s .agents/AGENTS.md AGENTS.md
```

- [ ] **Step 2: Create .claude/rules symlink**

```bash
ln -s ../.agents/rules .claude/rules
```

- [ ] **Step 3: Create .claude/skills symlink**

```bash
ln -s ../.agents/skills .claude/skills
```

- [ ] **Step 4: Recreate .claude/agents/design-reviewer.md as a symlink**

```bash
mkdir -p .claude/agents
ln -s ../../.agents/audits/design-reviewer.md .claude/agents/design-reviewer.md
```

- [ ] **Step 5: Verify all symlinks resolve**

```bash
test -L AGENTS.md && readlink AGENTS.md
test -L .claude/rules && readlink .claude/rules
test -L .claude/skills && readlink .claude/skills
test -L .claude/agents/design-reviewer.md && readlink .claude/agents/design-reviewer.md
# Each should print the relative path target.
cat AGENTS.md | head -1
# Expected: "# Standing brief for AI agents"
cat .claude/rules/engineering.md | head -1
# Expected: "# Engineering Rules" (or whatever the H1 is in engineering.md)
cat .claude/agents/design-reviewer.md | head -1
# Expected: starts with "---" (frontmatter)
```

- [ ] **Step 6: Commit**

```bash
git add AGENTS.md .claude/rules .claude/skills .claude/agents/design-reviewer.md
git commit -m "feat(agents): add symlinks (root AGENTS.md, .claude/{rules,skills,agents/design-reviewer.md})"
```

---

## Task 12: Write the trimmed root CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` (root) — full rewrite

- [ ] **Step 1: Read the current CLAUDE.md (for context only — it gets replaced wholesale)**

```bash
wc -l CLAUDE.md
# Likely 213 lines; about to become ~22.
```

- [ ] **Step 2: Replace with the trimmed version**

Overwrite `CLAUDE.md` with the full content from spec § "Root `CLAUDE.md` (≤20 lines)".

- [ ] **Step 3: Verify line budget**

```bash
wc -l CLAUDE.md
# Expected: ≤22 lines (≤20 + a couple for blank lines)
grep -q "Read \[\`AGENTS.md\`\]" CLAUDE.md && echo "ok: defers to AGENTS.md"
grep -q "superpowers:brainstorming" CLAUDE.md && echo "ok: lists skills"
grep -q "design-reviewer" CLAUDE.md && echo "ok: refs subagent"
```

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "refactor: trim CLAUDE.md to a 20-line Claude-only addendum (defers to AGENTS.md)"
```

---

## Task 13: Write the welcome hook and wire it into settings.json

**Files:**
- Create: `.claude/hooks/welcome.sh` (executable)
- Modify: `.claude/settings.json` (add SessionStart hook block)

- [ ] **Step 1: Write welcome.sh**

Use the full content from spec § "`.claude/hooks/welcome.sh` (~25 lines)". Verbatim, including the shebang and `set -euo pipefail`.

- [ ] **Step 2: Make it executable**

```bash
chmod +x .claude/hooks/welcome.sh
```

- [ ] **Step 3: Add the hook to settings.json**

Open `.claude/settings.json`. After the closing brace of the existing `permissions` block (or `env` block, whichever is last), add a `hooks` block. The full settings should now end with:

```json
  },
  "env": {
    "ASTRO_TELEMETRY_DISABLED": "1"
  },
  "hooks": {
    "SessionStart": [
      { "command": ".claude/hooks/welcome.sh" }
    ]
  }
}
```

(Adjust commas — the `env` block now needs a trailing comma since `hooks` follows.)

- [ ] **Step 4: Validate JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('.claude/settings.json', 'utf8'))" && echo "ok: valid JSON"
```

- [ ] **Step 5: Smoke-test the hook**

```bash
# Force the welcome by ensuring the marker doesn't exist
rm -f .agents/.welcomed
# Run the hook directly
.claude/hooks/welcome.sh
# Expected stdout: starts with "FIRST-RUN WELCOME (welcome-version 1, was 0)."
#                  followed by the WELCOME.md body
test -f .agents/.welcomed && grep -q "welcome-version: 1" .agents/.welcomed && echo "ok: marker written"
# Run again — should output nothing
.claude/hooks/welcome.sh
# Expected: empty output (marker is up to date)
```

- [ ] **Step 6: Verify the marker is gitignored**

```bash
git status --porcelain | grep '.agents/.welcomed' && echo "FAIL: marker is tracked" || echo "ok: marker ignored"
```

If the marker shows up as untracked, double-check Task 1's `.gitignore` change.

- [ ] **Step 7: Commit**

```bash
git add .claude/hooks/welcome.sh .claude/settings.json
git commit -m "feat(claude): add SessionStart welcome hook + settings wiring"
```

---

## Task 14: Deprecate docs/superpowers/plans/

**Files:**
- Create: `docs/superpowers/plans/README.md`

- [ ] **Step 1: Write the deprecation notice**

Use the full content from spec § "`docs/superpowers/plans/README.md` (NEW — marca como deprecated)". Verbatim.

- [ ] **Step 2: Verify**

```bash
grep -q "DEPRECATED" docs/superpowers/plans/README.md && echo "ok: deprecated marker"
grep -q "issue body" docs/superpowers/plans/README.md && echo "ok: redirects to issues"
ls docs/superpowers/plans/ | grep -v README.md | wc -l
# Expected: ≥1 (existing historical files preserved)
```

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/plans/README.md
git commit -m "docs: deprecate docs/superpowers/plans/ (plans now live in issue bodies)"
```

---

## Task 15: Final verification

**Files:** none modified — pure verification.

- [ ] **Step 1: Re-resolve all symlinks**

```bash
find .claude .agents -type l -ls 2>/dev/null
# Expected output (4 symlinks):
#   <stat>  AGENTS.md → .agents/AGENTS.md  (technically at root, find this with `ls -la AGENTS.md`)
#   <stat>  .claude/rules → ../.agents/rules
#   <stat>  .claude/skills → ../.agents/skills
#   <stat>  .claude/agents/design-reviewer.md → ../../.agents/audits/design-reviewer.md
ls -la AGENTS.md
```

All four targets must exist and be readable.

- [ ] **Step 2: Run the project's gates**

```bash
npm run lint
# Expected: clean astro check
npm test
# Expected: all green
npm run build
# Expected: clean production build
```

If anything fails, the structural reorganization broke something — investigate the failing path. Most likely candidates: a path in a `.astro` file that pointed at `.claude/rules/...` or `syncologic_marketing_site_ideas.md`. The repo doesn't reference those at runtime (they're agent docs only) — so passing should be straightforward.

- [ ] **Step 3: Confirm welcome flow end-to-end**

```bash
rm -f .agents/.welcomed
.claude/hooks/welcome.sh > /tmp/welcome-output
test -s /tmp/welcome-output && echo "ok: welcome printed"
test -f .agents/.welcomed && echo "ok: marker created"
.claude/hooks/welcome.sh > /tmp/welcome-output-2
test ! -s /tmp/welcome-output-2 && echo "ok: second run is silent"
rm -f /tmp/welcome-output /tmp/welcome-output-2
```

- [ ] **Step 4: Confirm sync-env.sh end-to-end**

Create a throwaway worktree, run the script, verify `.env` lands.

```bash
git worktree add /tmp/agents-restructure-smoke -b chore/agents-restructure-smoke origin/development
.agents/scripts/sync-env.sh /tmp/agents-restructure-smoke
test -f /tmp/agents-restructure-smoke/.env && echo "ok: env synced"
git worktree remove /tmp/agents-restructure-smoke
git branch -D chore/agents-restructure-smoke
```

- [ ] **Step 5: Confirm the legacy worktree is gone**

```bash
git worktree list | grep "i18n-pt-br" && echo "FAIL: legacy worktree still listed" || echo "ok: legacy gone"
test ! -d .claude/worktrees && echo "ok: legacy dir gone"
```

- [ ] **Step 6: Confirm the deprecation README**

```bash
test -f docs/superpowers/plans/README.md && grep -q DEPRECATED docs/superpowers/plans/README.md && echo "ok"
```

- [ ] **Step 7: Visual verification (manual)**

Open the site in dev mode and click around briefly. Nothing should look different — this restructure shouldn't affect runtime. Verifies that no path references were broken in any `.astro` file.

```bash
npm run dev
# Visit http://localhost:4321
# Click homepage, /pricing, /self-hosted. Confirm no 404s, no console errors.
# Cmd-C to stop.
```

State explicitly in the PR body which breakpoints / pages were verified.

- [ ] **Step 8: Open the GitHub issue (retroactive)**

The implementation is done; create the issue retroactively so the PR closes it. Use `.agents/templates/issue.md` (now exists).

```bash
# Draft the body from the template, fill in:
#   Goal: Restructure repo to .agents/ + AGENTS.md compatibility bridge
#   Why:  Onboarding for non-Claude agents; remove .claude monopoly
#   Out of scope: Cursor/Windsurf/Gemini shims, .mcp.json
#   Tasks: (the 14 tasks above, all checked, since they're done)
#   Verification: lint/test/build/welcome flow/sync-env smoke test (all passed in step 7)
gh issue create --title "chore: restructure repo to .agents/ + compatibility bridge" --body-file <(cat <<'EOF'
[fill from template]
EOF
)
```

Capture the resulting issue number `<N>`.

- [ ] **Step 9: Open the PR**

```bash
git push -u origin chore/agents-restructure
gh pr create --base development \
  --title "chore: restructure repo to .agents/ + compatibility bridge" \
  --body-file <(cat <<EOF
## Summary
- Moves all agent-neutral content to .agents/ with .claude/ as a symlinked bridge
- Adds AGENTS.md (root symlink) for Copilot/Codex/Cline/Aider
- New conventions: welcome flow, worktree+env propagation, PR-mode commit gating, parallel tasks, deprecated docs/superpowers/plans/

## Closes
Closes #<N>

## Test plan
- [x] npm run lint
- [x] npm test
- [x] npm run build
- [x] welcome hook smoke test (force-trigger by removing marker)
- [x] sync-env.sh smoke test (throwaway worktree)
- [x] all four symlinks resolve

## Visual verification
Verified at: <breakpoints navigated>

## Notes
- Last plan to live in docs/superpowers/plans/ — folder now deprecated.
- No source-code changes; structure-only refactor.
EOF
)
```

- [ ] **Step 10: Cleanup the temp worktree (after PR merges)**

This step happens AFTER the PR merges to `development`. The implementer should record this as a post-merge action:

```bash
# After the PR merges:
cd ..   # leave the worktree
git worktree remove .worktrees/agents-restructure
git branch -d chore/agents-restructure
git worktree prune
```

---

## Self-review notes

This plan was self-reviewed before completion. Findings:

**Spec coverage:** Every spec section maps to a task — directory layout (Tasks 2-5), file moves (3-5), content split (6), new files (7-10), symlinks (11), CLAUDE.md trim (12), hook (13), deprecation (14), verification (15).

**Placeholder scan:** No "TBD" / "TODO" / "fill in details" remains. Two intentional cross-references to the spec ("Use the full content from spec § …") — those are not placeholders, they're a deliberate single-source-of-truth choice for large file contents (workflow.md, WELCOME.md, AGENTS.md, CLAUDE.md, templates, scripts). The implementer reads the spec for those.

**Type / path consistency:** All paths use the canonical form (`.agents/...` for canonical content, `.claude/...` for symlinks back). Worktree paths consistently start with `<project-root>/.worktrees/...`. Issue/branch slug conventions match across pre-task setup and Task 15 step 8.

**Open issues:** The pre-task setup uses `.worktrees/agents-restructure` (without an issue number) because we have no issue yet — bootstrap exception explicitly noted. Task 15 step 8 retroactively creates the issue. Acceptable for the one-shot meta case.
