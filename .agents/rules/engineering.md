# Engineering

## Code style

TypeScript strict, no `any`. No comments explaining WHAT — only WHY when non-obvious, one line max. No backwards-compat shims for code we control. No half-finished implementations. Three similar lines beats a premature abstraction.

## Astro specifics

- **Default to zero client JS.** When JS is needed: single `<script>` at the bottom of the component, no framework runtime, ≤ 20KB gzipped per page.
- API routes (`src/pages/api/**`) **must** export `export const prerender = false;`.
- Server-only env vars: `import.meta.env.*` — never `process.env.*` in route handlers.
- Cross-locale links: `getRelativeLocaleUrl()` — never hardcode `/pt-br/...`.
- Images: `<Image>` / `<Picture>` from `astro:assets` with explicit `width`/`height`.
- Logic in `.ts` files; keep `.astro` front-matter thin.

## API endpoint discipline

Every endpoint:
1. Validates body with `zod` in `.strict()` mode.
2. Rate-limits via `checkPostBudget` / `checkPatchBudget`.
3. Returns stable error codes only (see architecture.md).
4. Never leaks internal messages — log server-side, return code only.
5. Uses the local `json(data, status)` helper.

Privileged mutations (PATCH/DELETE): require HMAC token in `x-waitlist-token`, verify via `verifyToken(rowId, token)`, reject 401 with no detail.

Public forms: honeypot required (hidden, `tabindex=-1`, `autocomplete=off`). Filled = silent 200.

## Database

Migrations: `supabase/migrations/<timestamp>_<name>.sql`. RLS enabled on every table (default deny, service-role policy for server access). `created_at`/`updated_at` on every row via `set_updated_at()` trigger. Hash IPs (`ip_hash`) — never raw. Tokens via `gen_random_bytes` server-side — never client-supplied.

## Testing

TDD when adding to `src/lib/`: failing test → implementation → green. Vitest only, under `src/**/__tests__/*.test.ts`. Pure logic gets unit tests (i18n utils, hmac, validation). `.astro` components do not.

## Accessibility & performance

Every interactive element keyboard-reachable. Visible focus ring (3px brand-blue, 2px offset — global default). Inputs paired with `<label>` or `aria-label`. Animations respect `prefers-reduced-motion`. Color contrast ≥ WCAG AA — use validated DESIGN.md token pairs.

Lighthouse mobile **Performance ≥ 90** for any public-page change. Client JS ≤ 20KB gzipped per page. No blocking third-party scripts. No webfonts beyond Montserrat.

## Errors

Diagnose root cause. Don't sprinkle `try/catch` to mute errors. Don't retry in a sleep loop — read the error.
