# Contributing

Thanks for working on Syncologic's marketing site.

## Setup

```bash
node --version              # match package.json engines
npm install
cp .env.example .env        # fill Supabase / Resend / KV / waitlist secrets
npm run dev                 # http://localhost:4321
```

On Windows: use WSL (Ubuntu or Debian). Native Windows is not supported.

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
