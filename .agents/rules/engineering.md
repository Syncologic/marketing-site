# Engineering Rules

## Code style

- **TypeScript strict.** No `any`. Prefer `unknown` + narrowing at boundaries.
- **No comments explaining what code does.** Only WHY when non-obvious.
- **No multi-paragraph docstrings.** One short line max.
- **No backwards-compatibility shims** for code we control. Change the code.
- **No half-finished implementations.** Ship complete or don't merge.
- **Three similar lines beats a premature abstraction.** Wait for the third use before extracting a helper.

## Astro specifics

- Default to **zero client JS**. Use Astro's static rendering. When JS is genuinely needed:
  - Single `<script>` tag at the bottom of the component.
  - No framework runtime (no React, Vue, Solid).
  - Keep it under 20KB gzipped per page.
- API routes (`src/pages/api/**`) **must** export `export const prerender = false;`.
- Server-only env vars accessed via `import.meta.env.*` — never `process.env.*` in route handlers.
- Use `Astro.url` for current URL, never reconstruct.
- Components in `.astro` files; logic in `.ts` files. Don't put fetch logic in `.astro` front-matter beyond a few lines.

## API endpoint discipline

Every endpoint:
1. **Validates** the body with a `zod` schema in `.strict()` mode.
2. **Rate-limits** via `checkPostBudget` / `checkPatchBudget` (per-IP minute / hour / day).
3. Returns **stable error codes** (`invalid_input`, `rate_limited`, `not_found`, `already_completed`, `server_error`).
4. **Never leaks** internal error messages — log server-side, return code-only.
5. Uses the local `json(data, status)` helper for consistent response shape.

Privileged mutations (PATCH, DELETE):
- Require an HMAC token in a header (`x-waitlist-token`).
- Verify with `verifyToken(rowId, token)` from `src/lib/hmac.ts`.
- Reject with 401 on mismatch — no detail.

Public forms:
- **Honeypot field** required (hidden, `tabindex=-1`, `autocomplete=off`). Filled = silent 200, no DB row.
- **No CAPTCHA** in Plan 1 — rate limiting + honeypot is enough until we see real abuse.

## Database

- Migrations live in `supabase/migrations/<timestamp>_<name>.sql`.
- **RLS enabled** on every table. Default deny; service-role policy for server access.
- `created_at` / `updated_at` on every row. `set_updated_at()` trigger.
- **Hash IPs** (`ip_hash` column), never store raw.
- **Tokens** (unsubscribe, etc.) generated via `gen_random_bytes` server-side, never client-supplied.

## Testing

- **TDD** when adding to `src/lib/`: failing test → implementation → green.
- **Vitest** is the only test runner. `npm test` runs all; `npm test -- <pattern>` for one.
- Tests live in `src/**/__tests__/*.test.ts`.
- Pure logic gets unit tests (i18n utils, hmac, validation). Astro components do not — manual review covers them.
- Manual end-to-end pass for waitlist flows before deploy (curl scripts in plan Task 24).

## Pre-merge checklist

Before claiming a task done:
1. `npm run lint` — Astro check + TS, **zero errors**.
2. `npm test` — all passing.
3. `npm run build` — clean production build.
4. For UI changes: run `npm run dev`, verify in browser at the actual breakpoint(s) the change targets.
5. For API changes: hit the endpoint with `curl`, confirm the contract.

If you can't test the UI in a browser, **say so explicitly** rather than claiming success.

## Performance budget

- Lighthouse mobile **Performance ≥ 90** before merging any homepage / landing-page change.
- No webfonts beyond Montserrat.
- Images: WebP with JPEG fallback, `loading="lazy"` below the fold, explicit `width`/`height`.
- Client JS ≤ 20KB gzipped per page.
- No blocking third-party scripts.

## Accessibility

- Every interactive element keyboard-reachable.
- Visible focus ring (3px brand-blue, 2px offset — global default in `global.css`).
- Form inputs always paired with `<label>` or `aria-label`.
- Animations respect `prefers-reduced-motion`.
- Color contrast ≥ WCAG AA. The DESIGN.md token pairs are pre-validated; don't introduce new color combinations without checking.
- `<link rel="alternate" hreflang>` for every locale pair (handled in `Layout.astro`).

## Git workflow

- **`main` is production.** It auto-deploys to Vercel. Never commit directly to `main`.
- **`development` is the integration branch.** All feature work branches from `development`, and PRs target `development`. Promotion to `main` is a separate deliberate "deploy" PR after a batch of features is verified on the dev preview.
- **ALWAYS** create an isolated worktree via `superpowers:using-git-worktrees` before touching code, branched from `development` (not `main`). Every task, no exceptions.
- Plans live in `./docs/superpowers/plans/`. Execute task-by-task; commit after each task as the plan instructs.
- **Never** skip git hooks (`--no-verify`) or commit signing.
- **Never** force-push to `main` or `development`.
- Commit messages follow conventional format: `feat(scope):`, `fix(scope):`, `chore:`, `docs:`, `test:`. Do **not** include `Co-Authored-By: Claude` trailers.
- Stage files explicitly (`git add <path>`), never `git add -A` or `git add .` — too easy to grab `.env` or local junk.

## Risky actions — confirm first

Always ask before:
- Running migrations against a non-local database.
- `vercel deploy`, `vercel --prod`, or any `vercel env` mutation.
- Force-pushing, rebasing shared branches, or `git reset --hard` after work has started.
- Deleting branches or worktrees that contain unpushed commits.
- Adding a new dependency. The stack is intentionally small.

## Dev server etiquette

- On Windows: use WSL (Ubuntu / Debian). Native Windows is not supported
  (bash hooks, npm scripts, git hooks, symlinks under .claude/ all assume
  Linux/macOS/WSL).
- Start with `npm run dev` (Astro on `:4321`).
- Don't leave background dev servers running across sessions — they hold ports and confuse later runs.
- For curl tests against the dev server, hit `http://localhost:4321/api/waitlist` directly — no need for ngrok or tunnels in Plan 1.

## When something fails

- **Diagnose root cause.** Don't sprinkle `try/catch` to make errors disappear.
- **Don't bypass checks.** A failing pre-commit hook means the commit is broken; fix the cause, then re-stage and create a NEW commit (never `--amend` to silence a hook).
- **Don't retry in a sleep loop.** If a command fails, read the error.

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
