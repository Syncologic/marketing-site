# Contributing

Thanks for working on Syncologic's marketing site.

## Setup

**Prerequisites:** Node 20+, Docker (for the local Supabase stack).

### macOS / Linux / WSL

```bash
git clone <repo>
cd marketing-site
npm install
cp .env.example .env        # ships pre-filled — no edits needed for local dev
npm run db:start            # boots local Supabase (one-time per session)
npm run dev                 # http://localhost:4321
```

`.env.example` ships with the deterministic local Supabase JWT pre-filled. KV and Resend env vars stay blank — they activate in-memory and filesystem fakes when `astro dev` runs.

- Supabase Studio: <http://127.0.0.1:54323>
- Faked emails: `.local/dev-emails/<timestamp>-<to>.html`
- Stop Supabase: `npm run db:stop`

### Native Windows

We recommend WSL (Ubuntu or Debian) on Windows — once installed, the macOS / Linux / WSL snippet above works as-is. If you'd rather stay on native Windows, run the block below in **PowerShell as Administrator** (or with Developer Mode on: Settings → Privacy & Security → For Developers → *Developer Mode*). Admin / Dev Mode is needed only for the clone step, so Windows allows the `AGENTS.md` symlink to be created instead of being checked out as a text file.

```powershell
git config --global core.symlinks true   # once per machine — lets git create symlinks
git clone <repo>                          # admin / Dev Mode required so symlinks land
cd marketing-site
npm install
Copy-Item .env.example .env               # ships pre-filled — no edits needed
npm run db:start                          # Docker Desktop must be running first
npm run dev                               # http://localhost:4321
```

Sanity check after cloning: open `AGENTS.md` — you should see the brief, not the literal text `.agents/AGENTS.md`. If you see the path, the symlink didn't take; re-clone with admin / Dev Mode active.

### Day-to-day

| Command | What it does |
|---|---|
| `npm run dev` | Astro dev server, `--host` so it's reachable on your LAN |
| `npm run db:start` / `db:stop` | Start / stop local Supabase (idempotent) |
| `npm run db:reset` | Drop the local DB and replay all migrations |
| `npm run db:status` | URLs + Studio link |
| `npm run db:env` | Same info as env vars (if the shipped JWT stops working after a CLI upgrade, refresh from here) |

### What runs for real vs. faked

| Service | Local dev | Production |
|---|---|---|
| **Supabase** | Real Postgres via `npm run db:start` (Docker). Migrations apply, RLS enforced. | Hosted Supabase project. |
| **Vercel KV** | In-memory `Map` rate-limit store, resets when the dev server restarts. | Real Upstash Redis. |
| **Resend** | Email HTML written to `.local/dev-emails/*.html`. Open in a browser to preview. | Real Resend API. |
| **HMAC waitlist tokens** | Stable dev-only secret (`hmac.ts`). | Required `WAITLIST_TOKEN_SECRET`. |

The dev fakes only activate when `astro dev` is running (`import.meta.env.DEV`). `npm run build` throws if any required env var is missing.

## Branch model

- **`main`** is production. It auto-deploys to Vercel. Never commit directly.
- **`development`** is the integration branch. All feature work branches from it, all PRs target it. Promotion `development → main` is a deliberate "deploy" PR.

## Working on a change

1. Branch from `development` as `<type>/<slug>` where `<type>` is `feat`, `fix`, `chore`, `docs`, or `test`.
2. Optionally use a git worktree (`git worktree add .worktrees/<slug> -b <type>/<slug> origin/development`) to keep your main checkout clean.
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/): `feat(scope): …`, `fix(scope): …`, `chore: …`, `docs: …`, `test: …`. No `Co-Authored-By: Claude` trailers.
4. Stage explicitly with `git add <path>` — never `git add -A` or `.`.

## Verify before opening a PR

| When | Run |
|---|---|
| Always | `npm run lint` (astro check + TS, zero errors) |
| Touching `src/lib/*` or `src/i18n/utils.ts` | `npm test` |
| Any public-page or routing change | `npm run build` |
| UI change | open `npm run dev`, verify at target breakpoints |
| API change | `curl` the endpoint, confirm contract and stable error codes |

If you couldn't verify the UI in a browser, say so in the PR — don't claim success.

## Opening the PR

- Target `development` — never `main`.
- One issue per PR. Body should have: short summary, `Closes #<issue>` if applicable, test plan checklist, and the breakpoints you verified (UI changes only).

## Dependency policy

The stack is intentionally small (Astro 5, Tailwind, Supabase, Resend, Vercel KV, Vitest, Zod, Lucide-astro, Montserrat). Before adding or bumping a dependency:

1. Verify current version and Astro 5 / strict-TS compatibility on the package's npm page or repo.
2. Run `npm audit` before and after; report any newly introduced advisories.
3. Don't run `npm audit fix` automatically — it can rewrite the lockfile in surprising ways.

## Risky actions — confirm first

- Migrations against any non-local database.
- `vercel deploy`, `vercel --prod`, or `vercel env` mutations.
- Force-push, shared-branch rebase, `git reset --hard` after work started.
- Deleting branches or worktrees with unpushed commits.

Never `--no-verify`, never skip commit signing, never force-push `main` or `development`.

## Code rules

- [`DESIGN.md`](./DESIGN.md) — visual source of truth.
- [`.agents/rules/architecture.md`](./.agents/rules/architecture.md) — repo boundaries, endpoints, secrets, trust.
- [`.agents/rules/engineering.md`](./.agents/rules/engineering.md) — code style, API discipline, database, testing, a11y, performance.

## AI agents

If you're an AI agent, read [`AGENTS.md`](./AGENTS.md) first.
