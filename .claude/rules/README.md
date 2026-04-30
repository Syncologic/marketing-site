# Rules — the project knowledge base

These four files are the consolidated source of truth for everything cross-cutting in this repo. The root `CLAUDE.md` is the standing brief that points here.

| File | Read when |
|---|---|
| [`design-system.md`](./design-system.md) | Touching anything visual: components, pages, styles, tokens. |
| [`architecture.md`](./architecture.md) | Adding endpoints, dependencies, files, or asking "should this live here?" Also the source for org-level repo strategy and runtime architecture. |
| [`content.md`](./content.md) | Writing copy, naming things user-facing, adding waitlist enums, translating, planning new pages, picking a landing-page structure. |
| [`engineering.md`](./engineering.md) | Writing code: TS conventions, API discipline, testing, git workflow. |

## Precedence

When rules conflict:

1. **Explicit user instructions** — always win.
2. **`./DESIGN.md`** (root) — authoritative for visual choices.
3. **The active plan** under `./docs/superpowers/plans/` — authoritative for current task sequencing and scope.
4. **These rules files** — authoritative for everything else (architecture, content, engineering, design-token usage).
5. **Default Claude Code behavior** — lowest priority.

## Updating these files

These files are committed and shared. Update them when:
- A decision is made that should bind future sessions (not just the current task).
- A spec or plan changes a fact captured here.
- A new rule emerges from repeated correction.

Don't update them for one-off conversation context — that belongs in conversation, not in the repo.

## History

The original `syncologic_repository_architecture_proposal.md` and `syncologic_marketing_site_ideas.md` were distilled into `architecture.md` and `content.md` respectively, then removed. They were untracked at the time of deletion and have no git history — these distilled files are the only remaining record.
