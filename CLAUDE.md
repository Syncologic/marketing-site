# CLAUDE.md — Syncologic Marketing Site

This file is the project's standing brief for Claude Code. Read it before any task. Keep it short on purpose.

## What this repo is

`syncologic/marketing-site` is the **first public surface** for Syncologic — a pre-launch product that moves files between clouds without downloading them first. The site exists to validate positioning and capture **segmented waitlist signups**, not to host the product itself.

Primary message:

> Move files between clouds without downloading them first.

## Reference documents (read when relevant)

- **`./DESIGN.md`** — design system: tokens, type scale, components, do/don't rules. **Authoritative for any visual decision.**
- **`./.claude/rules/`** — the consolidated project knowledge base (org architecture, repo boundaries, sitemap, page playbooks, segmentation, voice, engineering conventions). See the index below.
- **`./docs/superpowers/specs/`** — approved design specs for each phase.
- **`./docs/superpowers/plans/`** — current implementation plan(s).

## Rules folder (the project knowledge base)

All cross-cutting project knowledge lives under `./.claude/rules/`. Read the file matching the kind of work you're doing:

- **`.claude/rules/design-system.md`** — tokens, type scale, "Always" / "Never" lists. Read before any visual change.
- **`.claude/rules/architecture.md`** — org-level repo strategy, repo boundaries, runtime architecture, server-only secrets, file layout. Read before adding endpoints, dependencies, or asking "should this live here?"
- **`.claude/rules/content.md`** — voice, sitemap, every landing-page playbook, SEO playbooks, waitlist segmentation map + canonical enum lists, naming, forbidden phrases. Read before writing copy or adding pages.
- **`.claude/rules/engineering.md`** — TS / Astro / API / testing / git conventions. Read before writing code.

When rules conflict: `DESIGN.md` wins for visual choices, the active plan in `docs/superpowers/plans/` wins for current task sequencing, the rules files win for everything else, defaults lose to all of the above. Explicit user instructions always win.

## Working with Claude on this project

### Standard workflow (every task)

1. **Execute the task** on a feature branch — never on `main`. **ALWAYS** use `superpowers:using-git-worktrees` to create an isolated worktree before touching code. This is non-negotiable: every task starts in a worktree, no exceptions (including small fixes, doc edits, and config changes).
2. **Self-review** with `superpowers:verification-before-completion`. At minimum: `npm run lint`, the relevant test suite, and a real-browser pass at the targeted breakpoints for any UI change.
3. **Request review** via `superpowers:requesting-code-review` (or `design-check` for visual-only changes) before opening the PR.
4. **Open a PR** with `superpowers:finishing-a-development-branch`. The PR body **must reference the issue** it closes (e.g. `Closes #123`) so GitHub auto-links and auto-closes on merge. If there is no issue, create one first or state explicitly why none exists.

### Skills by task type

- **New feature / unclear requirements** → `superpowers:brainstorming` before any code.
- **Multi-step implementation** → `superpowers:writing-plans`, then `superpowers:executing-plans` or `superpowers:subagent-driven-development`.
- **Bug or unexpected behavior** → `superpowers:systematic-debugging` before proposing a fix.
- **Implementing any feature or bugfix** → `superpowers:test-driven-development` for anything in `src/lib/*` or `src/i18n/utils.ts`.

### Project-local skills

- **`astro-workflow`** (`.claude/skills/astro-workflow/SKILL.md`) — authoritative command list for running, validating, testing, building, and previewing this project.
- **`using-astro`** (`.claude/skills/using-astro/SKILL.md`) — Astro 5 best practices when editing `.astro` files, content collections, API routes, or images.
- **`design-check`** — audit a component, page, or section against `DESIGN.md` and the `.claude/rules/` Always/Never lists.

**Visual correctness cannot be verified headlessly.** For any UI, layout, animation, or responsive change, state explicitly that visual verification was not performed in a real browser at the targeted breakpoints — do not claim the change looks right based on code inspection or `astro check` alone.

## Tech stack (don't substitute without explicit reason)

- **Astro 4+** static-first, output `'static'`, `@astrojs/vercel` adapter
- **TypeScript** strict mode (`astro/tsconfigs/strict`)
- **Tailwind CSS** — design tokens from `DESIGN.md` extended in `tailwind.config.mjs`
- **MDX** via Astro content collections for use-case + guide pages
- **Supabase** (Postgres) — server-only via secret/service-role key
- **Resend** — transactional email (waitlist confirmation)
- **Vercel KV / Upstash Redis** — IP-keyed rate limiting
- **Vitest** — unit tests for `src/lib/*` and `src/i18n/utils.ts`
- **Zod** — schema validation at API boundaries
- **Lucide-astro** — icons (1.5px stroke)
- **Montserrat** via Google Fonts (300, 400, 500, 700)

## Architectural rules

### Static-first, server-minimal

The site is **99% static**. The only server code lives under `src/pages/api/` and serves the waitlist:
- `POST /api/waitlist` — create signup
- `PATCH /api/waitlist/[id]` — progressive segmentation (HMAC-token gated)
- `GET /api/waitlist/unsubscribe` — token-based removal

Do not add server endpoints for non-waitlist concerns. If a feature needs more server logic than this, it belongs in `syncologic/server`, not here.

### Boundary discipline

Per the architecture proposal (§1, §3):
- **Marketing-site owns:** marketing pages, waitlist capture/segmentation, SEO content.
- **Marketing-site does NOT own:** product code, auth, OAuth, runners, provider adapters, transfer logic, billing, dashboards, design-system packages, SDKs.
- If a task tempts you toward product logic, stop and ask. The repo split is intentional.

### Server-only secrets

These are read via `import.meta.env.*` and **must never reach the browser**:
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `WAITLIST_TOKEN_SECRET`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`.

Only `PUBLIC_*`-prefixed variables may be referenced from client-side code or `.astro` markup that hydrates.

Any API route using these must export `export const prerender = false;`.

### i18n is mandatory

Every page must work at `/<path>` (en) and `/pt-br/<path>` (pt-BR). Use:
- `getLocaleFromUrl(Astro.url)` to detect locale
- `getT(locale)` for translations
- `localizedPath(locale, pathname)` for cross-locale links
- `<link rel="alternate" hreflang>` set in `Layout.astro`

Never hardcode user-facing strings in `.astro` templates. They go in `src/i18n/en.json` and `src/i18n/pt-br.json`.

## Design system rules (from DESIGN.md)

These are not suggestions. If a design choice conflicts with `DESIGN.md`, `DESIGN.md` wins.

### Always

- **Pill-shaped CTAs** (`rounded-pill`, 100px radius) for every primary/secondary action.
- **Brand Blue (`#0064E0`)** is **only** for actionable elements — links, primary CTAs, focus rings, active states. Never decorative.
- **Montserrat** at the documented weight per role (Display/Heading/Body/Caption). Weight 500 for Display + Heading 1, weight 300 only at ≥28px.
- **8px spacing grid.** Section vertical padding: 80px desktop / 64px tablet / 48px mobile (use `py-section-lg` / `py-section` / `py-section-sm` tokens).
- **Generous whitespace** — sections breathe. Cramped layouts are a bug.
- **Alternating surfaces** white → soft-gray → white → near-black for vertical rhythm. Use `<Section surface="...">`.
- **Body copy ≤ 2–3 lines per block.** Long paragraphs are a bug.
- **Gradient scrim** (`linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6))`) under any text placed over imagery.
- **Touch targets ≥ 44×44px** on mobile.
- **`prefers-reduced-motion`** disables non-essential animation site-wide (handled in `global.css`).

### Never

- Sharp corners (< 8px radius). Inputs use 8px, cards 20px, feature cards 24px, pills 100px. Nothing else.
- Decorative borders or ornamental dividers — dividers are functional only.
- Drop shadows on cards in dark sections (use border + color separation).
- More than 2 levels of text hierarchy in a single card.
- Hex codes inline in components — always reference Tailwind tokens (`text-dark-charcoal`, `bg-soft-gray`, etc.) defined from `DESIGN.md` in `tailwind.config.mjs`.

### Component primitives

Reach for these before writing custom markup:
- `src/components/ui/Button.astro` — primary / secondary / ghost variants
- `src/components/ui/Card.astro` — flat / card / elevated
- `src/components/ui/Input.astro`
- `src/components/ui/Section.astro` — surface-aware wrapper (white / soft / dark)
- `src/components/ui/ProviderLogo.astro` — 7 providers

If a new primitive is needed more than once, add it under `ui/`. One-off layout markup stays in the page or section component.

## Content rules (from marketing-site-ideas.md §"Content Rules")

1. Every landing page names its **public** near the top.
2. Every landing page has **one primary CTA** (waitlist).
3. Every landing page asks **one segmentation question** that reveals demand.
4. SEO guides answer the search query **before** pitching the product.
5. No firm launch dates, provider coverage promises, or self-hosting timelines.
6. Use **product-like visuals** (transfer planner mockups), not abstract cloud illustrations.
7. Surface the **runner choice** (Cloud / Browser / Private) — it's a core differentiator.
8. **User-facing copy:** "Private Runner". **Technical docs:** "self-hosted runner". Don't mix.
9. Keep **"Move files between clouds without downloading them first"** as the single broad message.
10. Route by **use case**, not a generic waitlist.

## Waitlist segmentation taxonomy

Use cases (`src/lib/validation.ts`):
`one_time_transfer`, `business_migration`, `scheduled_backup`, `private_runner`, `browser_runner`, `local_backup`, `developer`, `self_hosted`.

Providers: `google_drive`, `onedrive`, `dropbox`, `s3`, `sftp`, `webdav`, `nextcloud`, `other`.
Sizes: `lt_10gb`, `10_to_100gb`, `100gb_to_1tb`, `gt_1tb`.
Frequencies: `one_time`, `weekly`, `daily`, `continuous`.
Runners: `cloud`, `browser`, `private`, `not_sure`.
Roles: `consumer`, `business`, `it`, `developer`, `homelab`.

Never invent new enum values without updating `validation.ts`, the migration, the form, and translations together.

## Engineering practice

### Workflow

- Plans live in `./docs/superpowers/plans/`. Execute task-by-task; commit after each task as the plan instructs.
- **Don't start implementation on `main`.** Use a feature branch or worktree.
- Never skip git hooks (`--no-verify`) or commit signing.

### Code style

- TypeScript strict. No `any`. Prefer `unknown` + narrowing at boundaries.
- Validate every API request body with a `zod` schema. Use `.strict()` to reject unknown keys.
- Server endpoints return JSON via the local `json(data, status)` helper, with a stable `error` code on failure.
- HMAC-sign anything the client will hand back to a privileged endpoint (waitlist row tokens via `src/lib/hmac.ts`).
- Hash IPs (`hashIp`) before storing or keying rate limits — never store raw IPs.
- No client-side JavaScript unless the feature genuinely requires it. Prefer Astro's static rendering. When JS is needed, use a single `<script>` tag at the bottom of the component, no framework runtime.

### Testing

- Unit tests for everything in `src/lib/` and `src/i18n/utils.ts`. Run with `npm test`.
- TDD when adding to `lib/`: failing test → implementation → green.
- Manual end-to-end pass for waitlist endpoints before deploy (curl scripts in plan Task 24).
- Run `npm run lint` (Astro check + TS) and `npm run build` before claiming a task done.

### Accessibility

- Every interactive element keyboard-reachable; visible focus ring (3px brand-blue, 2px offset — set globally in `global.css`).
- Form inputs always paired with a label or `aria-label`.
- Animations respect `prefers-reduced-motion`.
- Color contrast meets WCAG AA on all surfaces. The DESIGN.md token pairs are pre-validated; don't introduce new color combinations.
- Provide `<link rel="alternate" hreflang>` for every locale pair.

### Performance budget

- Lighthouse mobile **Performance ≥ 90** before merging a homepage or landing page change.
- No webfonts beyond Montserrat.
- Images: WebP with JPEG fallback, `loading="lazy"` below the fold, explicit `width`/`height`.
- Keep client JS under 20KB gzipped per page.

## When in doubt

- **Visual decision** → re-read `DESIGN.md`.
- **Page structure / copy direction** → re-read `syncologic_marketing_site_ideas.md`.
- **"Should this live here or in another repo?"** → re-read `syncologic_repository_architecture_proposal.md`.
- **"What's next?"** → check the active plan in `docs/superpowers/plans/`.
- **Anything else ambiguous** → ask before guessing.
