---
name: astro-workflow
description: Use when running, validating, testing, building, previewing, or deploying this Astro 5 marketing site. Invoke before calling any `npm run`, `astro`, `vitest`, `prettier`, or `vercel` command so you pick the right flag set and project-specific verification steps.
---

# Astro Workflow

Authoritative command list for this repo. All commands assume you run from the project root (`C:\Users\Coffee\Documents\GitHub\syncologic\marketing-site`).

The package manager is **npm** (a `package-lock.json` is committed). Don't substitute `pnpm` or `yarn` — the lockfile would diverge.

## 1. Fast type + content validation

```bash
npm run lint
```

Runs `astro check` — a TypeScript + Astro template + content-collection schema check. Use after every non-trivial edit to a `.astro`, `.ts`, or `src/content/**` file. No engine launch, no dev server, completes in a few seconds.

This is the closest equivalent to a "did it parse" gate. **Always run it before claiming a task done.**

## 2. Run the dev server

```bash
npm run dev                                    # Astro on http://localhost:4321
```

Use for any UI, layout, or interaction verification. Visit the actual route at the targeted breakpoint(s) — type checking does not catch layout regressions, broken hreflang, or missed translations.

Don't leave background dev servers running across sessions — they hold port 4321 and confuse later runs.

For API routes, hit them directly with `curl`:

```bash
curl -X POST http://localhost:4321/api/waitlist -H "Content-Type: application/json" -d '{...}'
```

No tunnel needed for local testing.

## 3. Production build

```bash
npm run build                                  # full static + serverless build
npm run preview                                # serve the built output locally
```

`build` runs `astro build` with the `@astrojs/vercel` adapter and `output: 'static'`. It catches issues `astro check` misses: missing assets, broken `import.meta.env.*` references, oversized client JS, sitemap/redirect generation.

Run before claiming any change to a public page is done. Inspect output for:

- Per-page client JS budget (≤ 20KB gzipped per page).
- New unexpected dynamic routes (everything except `/api/waitlist*` should prerender).
- Sitemap / hreflang entries for both locales.

## 4. Tests (Vitest)

```bash
npm test                                       # one-shot run, all tests
npm run test:watch                             # watch mode while iterating
npm test -- src/lib/__tests__/hmac.test.ts     # single file
npm test -- -t "verifies token"                # by test name pattern
```

Tests live under `src/**/__tests__/*.test.ts`. Vitest is the only test runner — don't add Jest, Playwright, or others without an explicit decision.

Scope of tests in this repo:

- **Required:** anything in `src/lib/*` and `src/i18n/utils.ts`. TDD: failing test → implementation → green.
- **Not tested:** `.astro` components (manual review covers them).
- **Manual:** waitlist endpoints get a curl pass before deploy (per plan Task 24).

## 5. Format

```bash
npm run format                                 # prettier write across the repo
```

Prettier with `prettier-plugin-astro` is the formatter. There is no separate ESLint pass — `astro check` is the lint gate. Don't introduce ESLint without a reason; the toolchain is intentionally small.

## 6. Deploy

Deploys go through Vercel. **Never invoke `vercel deploy`, `vercel --prod`, or `vercel env` mutations without explicit user confirmation** — production is a shared boundary. CI / git push to the configured branch is the normal path.

Server-only env vars (`SUPABASE_*`, `RESEND_*`, `WAITLIST_TOKEN_SECRET`, `KV_*`) live in Vercel project settings, never in the repo. Only `PUBLIC_*` may be referenced from `.astro` markup that hydrates or any client `<script>`.

## 7. Verification checklist before claiming done

Run in this order. Stop at the first failure and fix before retrying.

1. `npm run lint` — `astro check` clean, **zero errors**.
2. `npm test` — all passing (only required if `src/lib/*` or `src/i18n/utils.ts` changed).
3. `npm run build` — clean production build (required for any public-page or routing change).
4. **For UI / layout / responsive / a11y changes**: `npm run dev`, then verify in a real browser at the targeted breakpoint(s). State the breakpoints checked (e.g. "verified at 375px, 768px, 1280px"). If you can't open a browser, **say so explicitly** rather than claiming success.
5. **For API changes**: `curl` the endpoint, confirm status code, JSON shape, and stable `error` code on failure paths.
6. **i18n changes**: confirm both `/en` and `/pt-br/...` routes render and that `<link rel="alternate" hreflang>` is correct.

## Common pitfalls

- **`process.env.*` in route handlers** — use `import.meta.env.*`. `process.env` is unavailable in the Vercel edge runtime path used by adapters.
- **Forgot `export const prerender = false;`** on a new API route under `src/pages/api/**`. The build will try to prerender it and fail or, worse, embed secrets at build time.
- **Hardcoded user-facing strings** in `.astro` templates. They go in `src/i18n/en.json` + `src/i18n/pt-br.json` (same commit) and are read via `getT(locale)`.
- **Inline hex colors** (`style="color:#..."` or `text-[#...]`). Use Tailwind tokens defined from `DESIGN.md` (`text-brand-blue`, `bg-soft-gray`, …).
- **Adding a framework runtime** (React, Vue, Solid) for client interactivity. The site is zero-JS by default; when JS is genuinely needed, use a single `<script>` tag at the bottom of the component, kept under 20KB gzipped per page.
- **`npm install <new-dep>` without asking.** The stack is intentionally small. Confirm before adding dependencies.
- **`git add -A` / `git add .`** picks up `.env`, build output, or local junk. Stage explicitly by path.
- **Skipping git hooks** (`--no-verify`) or commit signing — never. If a hook fails, fix the cause and create a NEW commit (don't `--amend` to silence it).
