# Workflow rules

How every agent works on this repo, regardless of platform. Claude Code's
superpowers plugin maps each discipline to a skill — see CLAUDE.md.

## 1. Brainstorm before creative work
Explore intent before writing code. Ask one question at a time. Propose
2–3 approaches. Get the dev's approval before any code or issue draft.

## 2. Issues are where plans live

Implementation plans go in GitHub issue bodies using
`.agents/templates/issue.md`. There is no separate plans or specs
directory — the issue body carries the full design and task list.

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
