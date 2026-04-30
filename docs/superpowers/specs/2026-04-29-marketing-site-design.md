# Syncologic Marketing Site — Design Spec

**Date:** 2026-04-29
**Repo:** `syncologic/marketing-site`
**Status:** Approved design, ready for implementation plan

---

## 1. Purpose

Build the Syncologic marketing site — the company's first public surface — to validate positioning, capture segmented waitlist signups, and route visitors to the use case that fits them. The product (cloud-to-cloud file transfer) is pre-launch; the site exists to learn which audience converts strongest before engineering invests heavily.

Primary message: **"Move files between clouds without downloading them first."**

## 2. Goals

- Validated waitlist signups segmented by audience, runner preference, and provider pair.
- Maximum surface area at launch: 10 landing/SEO pages × 2 locales (English + Brazilian Portuguese) = 20 routes.
- Trustworthy, calm, technical brand impression matching the Stripe/Linear/Vercel voice family.
- Static-first site with one server endpoint (`/api/waitlist`); deployable from a single git push.

## 3. Non-goals (deferred)

- Comparison pages (`/compare/*`) — wait for first waitlist data.
- The remaining 6 SEO guides — validate the format with the first 2 first.
- Public docs site, blog, customer logos, case studies.
- Self-hosted product code, app sign-up, marketing automation beyond confirmation email.
- A separate `/waitlist` page — the form lives inline on every page.

## 4. Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Astro 4+ | Static-first, server endpoints via adapter |
| Styling | Tailwind CSS | Extended with `DESIGN.md` tokens |
| Content | MDX via Astro content collections | For use-case pages and SEO guides |
| Hosting | Vercel | `@astrojs/vercel` adapter |
| Database | Supabase (managed Postgres) | Free tier covers waitlist scale; service-role key only on server |
| Email | Resend | Confirmation now; launch broadcast later |
| Rate limiting | Vercel KV (free tier) | Per-IP counters keyed by hashed IP + day |
| Analytics | Vercel Analytics + Speed Insights | Free with Vercel hosting |
| Typeface | Montserrat | Google Font, humanist sans-serif |
| Icons | Lucide | Open-source, 1.5px stroke |

The site is static-first with a single server endpoint for the waitlist API. The site remains 99% static.

## 5. Sitemap & routing

### Bespoke pages (each visually unique, individual `.astro` file)

- `/` — homepage, animated transfer planner hero
- `/pricing`
- `/self-hosted`
- `/developers`

### Use-case pages (single template + content collection)

- `/use-cases/cloud-to-cloud-transfer`
- `/use-cases/business-cloud-migration`
- `/use-cases/scheduled-cloud-backup`
- `/use-cases/private-runner`

### SEO guides (single template + content collection)

- `/guides/move-files-between-clouds-without-downloading`
- `/guides/transfer-google-drive-to-onedrive`

Every page exists at `/<path>` (English) and `/pt-br/<path>` (Brazilian Portuguese). 10 pages × 2 locales = 20 routes.

### Project structure

```
marketing-site/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── pricing.astro
│   │   ├── self-hosted.astro
│   │   ├── developers.astro
│   │   ├── use-cases/[slug].astro
│   │   ├── guides/[slug].astro
│   │   ├── pt-br/                       # mirrors English structure
│   │   │   ├── index.astro
│   │   │   ├── pricing.astro
│   │   │   ├── self-hosted.astro
│   │   │   ├── developers.astro
│   │   │   ├── use-cases/[slug].astro
│   │   │   └── guides/[slug].astro
│   │   └── api/
│   │       ├── waitlist.ts              # POST: create signup
│   │       ├── waitlist/[id].ts         # PATCH: segmentation
│   │       └── waitlist/unsubscribe.ts  # GET: token-based removal
│   ├── content/
│   │   ├── config.ts                    # collection schemas
│   │   ├── use-cases/
│   │   │   ├── en/
│   │   │   │   ├── cloud-to-cloud-transfer.mdx
│   │   │   │   ├── business-cloud-migration.mdx
│   │   │   │   ├── scheduled-cloud-backup.mdx
│   │   │   │   └── private-runner.mdx
│   │   │   └── pt-br/
│   │   │       └── (same 4 filenames)
│   │   └── guides/
│   │       ├── en/
│   │       └── pt-br/
│   ├── components/
│   │   ├── layout/                      # Layout, Nav, Footer, LanguageSwitcher
│   │   ├── ui/                          # Button, Card, Input, Section, ProviderLogo
│   │   ├── sections/                    # Hero, ProviderRow, RunnerCards, UseCaseRouter, TrustStory, WaitlistForm, FAQ
│   │   └── homepage/                    # TransferPlanner (animated hero)
│   ├── i18n/
│   │   ├── en.json
│   │   ├── pt-br.json
│   │   └── utils.ts                     # t() helper, locale detection
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── resend.ts
│   │   └── ratelimit.ts                 # Vercel KV wrapper
│   └── styles/
│       └── global.css
├── public/
│   └── assets/brand/                    # logos copied from /assets
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── .env.example
```

## 6. i18n

### Astro i18n config

```js
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'pt-br'],
  routing: {
    prefixDefaultLocale: false,    // English at root, /pt-br/* prefixed
    redirectToDefaultLocale: false,
    fallbackType: 'redirect',
  },
  fallback: { 'pt-br': 'en' },
}
```

### URL strategy

- English at root: `/`, `/use-cases/cloud-to-cloud-transfer`, etc.
- Brazilian Portuguese prefixed: `/pt-br/`, `/pt-br/use-cases/cloud-to-cloud-transfer`, etc.
- No auto-redirect on first visit. Manual language switcher in nav and footer. Choice persists in `localStorage.lang`.
- `<html lang="en">` or `<html lang="pt-br">` set per page for accessibility.

### Translation structure

- **UI strings** (nav, buttons, form labels, error messages): `src/i18n/en.json` and `src/i18n/pt-br.json`. Accessed via `t('key.subkey')` helper.
- **Bespoke page content** (homepage, pricing, self-hosted, developers): two `.astro` files per page, side-by-side. Easier to maintain than threading 100+ keys through one component.
- **Use-case pages and SEO guides**: locale-scoped folders inside content collections. Example: `src/content/use-cases/en/cloud-to-cloud-transfer.mdx` and `src/content/use-cases/pt-br/cloud-to-cloud-transfer.mdx`.

### Language used

Brazilian Portuguese (pt-BR) — not European Portuguese (pt-PT). Use Brazilian terminology throughout: "arquivos" not "ficheiros", "transferência", "armazenamento em nuvem", "você" rather than "tu".

### SEO (hreflang)

Every page emits in `<head>`:

```html
<link rel="canonical"  href="https://syncologic.com/<path>" />
<link rel="alternate" hreflang="en"        href="https://syncologic.com/<path>" />
<link rel="alternate" hreflang="pt-br"     href="https://syncologic.com/pt-br/<path>" />
<link rel="alternate" hreflang="x-default" href="https://syncologic.com/<path>" />
```

`@astrojs/sitemap` generates a multilingual `sitemap.xml`.

## 7. Design system → Tailwind

The full visual system is defined in `DESIGN.md`. Implementation translates its tokens into `tailwind.config.mjs` extensions so writing `bg-brand-blue`, `text-slate-gray`, `rounded-card`, `pt-section-lg` works directly.

### Color tokens

```js
colors: {
  'brand-blue':      { DEFAULT: '#0064E0', hover: '#0143B5', pressed: '#004BB9', light: '#47A5FA' },
  'dark-charcoal':   '#1C2B33',
  'slate-gray':      '#5D6C7B',
  'soft-gray':       '#F1F4F7',
  'warm-gray':       '#F7F8FA',
  'baby-blue':       '#E8F3FF',
  'near-black':      '#1C1E21',
  'divider':         '#DEE3E9',
  'success':         '#007D1E',
  'error':           '#C80A28',
}
```

Syncologic uses Brand Blue exclusively for actionable elements. No additional product-line accent colors.

### Typography

```js
fontFamily: { sans: ['Montserrat', 'Helvetica', 'Arial', 'sans-serif'] },
fontSize: {
  'display-1': ['64px', { lineHeight: '1.16', fontWeight: 500 }],
  'display-2': ['48px', { lineHeight: '1.17', fontWeight: 500 }],
  'h1':        ['36px', { lineHeight: '1.28', fontWeight: 500 }],
  'h2':        ['28px', { lineHeight: '1.21', fontWeight: 300 }],
  'h3':        ['18px', { lineHeight: '1.44', fontWeight: 700 }],
  'body':      ['18px', { lineHeight: '1.44', fontWeight: 400 }],
  'compact':   ['16px', { lineHeight: '1.50', fontWeight: 500, letterSpacing: '-0.01em' }],
  'caption':   ['14px', { lineHeight: '1.43', fontWeight: 400, letterSpacing: '-0.01em' }],
  'small':     ['12px', { lineHeight: '1.33', fontWeight: 400 }],
}
```

### Other tokens

```js
borderRadius: { 'input': '8px', 'card': '20px', 'feature': '24px', 'pill': '100px' },
spacing: { 'section-sm': '48px', 'section': '64px', 'section-lg': '80px' },
boxShadow: {
  'card':          '0 2px 4px rgba(0,0,0,0.10)',
  'card-elevated': '0 12px 28px rgba(0,0,0,0.20), 0 2px 4px rgba(0,0,0,0.10)',
}
```

### Surface alternation

Each section gets a `surface` prop (`white`, `soft`, `dark`). Sections set their own background, text color, and child styling rules. Components don't pick their own colors — they read from the section. This keeps the white/soft/dark walkthrough cadence consistent and prevents drop shadows on dark surfaces (per DESIGN.md).

## 8. Component inventory

### Layout (`src/components/layout/`)

- **`Layout.astro`** — wraps every page. Slots for `<head>` meta and content. Handles canonical URL, hreflang tags, OG image, locale class on `<html>`.
- **`Nav.astro`** — sticky frosted-glass nav. Items: Use cases (dropdown of 4), Pricing, Self-hosted, Developers, Language switcher, Join waitlist pill CTA. Mobile: hamburger collapses to full-screen overlay.
- **`Footer.astro`** — three columns (Product, Resources, Company), language switcher repeat, copyright with current year via `Intl.DateTimeFormat`.
- **`LanguageSwitcher.astro`** — dropdown with flag + language name. Computes the equivalent route in the other locale, persists choice to `localStorage.lang`, sets `lang` attribute on `<html>`.

### UI primitives (`src/components/ui/`)

- **`Button.astro`** — variants `primary` / `secondary` / `ghost`, sizes `sm` / `md` / `lg`. Hover/pressed/disabled per DESIGN.md.
- **`Card.astro`** — `rounded-card` (20px) or `rounded-feature` (24px) with optional shadow level.
- **`Input.astro`** — text/email input with focus ring and error state.
- **`Section.astro`** — surface-aware section wrapper. Prop `surface="white"|"soft"|"dark"`. Applies background, text color, and resets card shadows on dark surfaces.
- **`ProviderLogo.astro`** — renders any of the 7 providers (Google Drive, OneDrive, Dropbox, S3-compatible, SFTP, WebDAV, Nextcloud) as inline SVG. Single source of truth.

### Marketing sections (`src/components/sections/`)

- **`Hero.astro`** — generic page hero. Props: `eyebrow`, `headline`, `subheading`, `primaryCta`, `secondaryCta`, optional `visual` slot. Used by use-case pages and SEO guides.
- **`ProviderRow.astro`** — horizontal logo strip of the 7 providers, scrollable on mobile.
- **`RunnerCards.astro`** — 3-card grid: Cloud Runner / Browser Runner / Private Runner. Pulls copy from i18n.
- **`UseCaseRouter.astro`** — homepage section: 4 cards routing to the 4 use-case pages.
- **`TrustStory.astro`** — preview / scoped-access / progress / reports / runner-transparency points.
- **`WaitlistForm.astro`** — the two-step form (Section 9). Accepts `defaultSegment` prop so each use-case page pre-fills the segment.
- **`FAQ.astro`** — accordion list, used on pricing and developer pages.

### Homepage-specific (`src/components/homepage/`)

- **`TransferPlanner.astro`** — the animated hero (Section 10).

### Asset handling

- Existing `/assets/transparent_icon_for_*.png` and `/assets/logo_for_*.png` move to `/public/assets/brand/`.
- Logo component picks the right variant by section surface: light → `_for_white.png`, dark → `_for_black.png`.
- Favicon + Apple touch icon generated from the icon.
- OG images: 1200×630, generated per page via Vercel's OG image service. Default: hero headline rendered over a Brand Blue gradient + icon.

## 9. Waitlist flow

### Two-step UX

**Step 1 — visible by default on every page.**
- Single email input + "Join the waitlist" pill button.
- Inline near the bottom of every page; sticky bottom bar appears on mobile after the visitor scrolls past the first viewport.
- `segment_hint` is set by the page itself: use-case pages declare a `waitlistSegment` value in their MDX frontmatter (e.g., `business_migration` for `/use-cases/business-cloud-migration`); other pages send `null`. The form component reads this from props.
- On submit: client-side regex validation, then POST `/api/waitlist` with `{ email, source_page, segment_hint, locale }`.
- Optimistic UI: button changes "Joining…" → "✓ You're on the list" within ~600ms.
- Server inserts row, returns the row's `id` and an HMAC token used by Step 2.

**Step 2 — revealed in place after Step 1.**
- The form region transforms into a "Help us build this for you" card.
- Progressive form, one question at a time:
  1. **Use case** — one_time_transfer / business_migration / scheduled_backup / private_runner / browser_runner / local_backup / developer / self_hosted
  2. **Source provider** — 7 providers + "Other"
  3. **Destination provider** — 7 providers + "Other"
  4. **Estimated size** — < 10 GB / 10–100 GB / 100 GB–1 TB / > 1 TB
  5. **Frequency** — one-time / weekly / daily / continuous
  6. **Preferred runner** — cloud / browser / private / "not sure"
  7. **Role** — consumer / business / IT / developer / homelab
- Each click PATCHes `/api/waitlist/:id` with the changed field. Last-write-wins; users can navigate back and change earlier answers.
- Answers also persist to `localStorage` keyed by row ID, so a refresh doesn't lose them.
- Pre-fill: if the visitor is on `/use-cases/business-cloud-migration`, Question 1 is pre-selected as `business_migration`. They can change it.
- "Skip — finish later" link always visible; closes the card with a "We'll email you with the rest" message and triggers a final PATCH with `_complete: true`.
- After the last question or a Skip, one final PATCH carries `_complete: true`, which sets `segmentation_completed_at = now()` and locks the row.

### Backend endpoints

**`POST /api/waitlist`** (Astro server endpoint)

1. Honeypot check: hidden `website` form field must be empty. If filled, return 200 OK without inserting (silent spam handling).
2. Rate-limit per hashed IP via Vercel KV: 5/min, 20/hour, 50/day.
3. Validate body with `zod`: `{ email, source_page, segment_hint?, locale }`.
4. Look up by email — if exists, return existing `id` and a fresh HMAC token (idempotent).
5. Insert row with: `email`, `source_page`, `segment_hint`, `locale`, `user_agent`, `referrer`, `ip_hash`, `unsubscribe_token`, `created_at`.
6. Trigger Resend confirmation email (locale-appropriate template). Failure here is logged but does not block the response.
7. Return `{ id, token, status: 'created' | 'existed' }`.

**`PATCH /api/waitlist/:id`**

1. Validate `X-Waitlist-Token` HMAC matches `id` + secret.
2. Rate-limit per hashed IP: 60/min, 200/hour, 500/day.
3. Defense-in-depth: max 5 distinct row IDs PATCHed per IP per day.
4. Read row. **If `segmentation_completed_at IS NOT NULL` → 409 Conflict.**
5. Validate body via zod: only the 7 segmentation fields plus optional `_complete: true` are accepted.
6. Apply update (last-write-wins on whitelisted fields). Bump `updated_at` via DB trigger.
7. If `_complete: true`, set `segmentation_completed_at = now()` in the same UPDATE.
8. Return `{ status: 'ok' }`.

**`GET /api/waitlist/unsubscribe?token=...`**

1. Look up row by `unsubscribe_token`. If not found, render a generic "removed" page (don't reveal whether the token existed).
2. Set `removed_at = now()`. Render a confirmation page.

### Supabase schema

```sql
create table waitlist (
  id                          uuid primary key default gen_random_uuid(),
  email                       text not null unique,
  source_page                 text,
  segment_hint                text,
  locale                      text default 'en',
  use_case                    text,
  source_provider             text,
  dest_provider               text,
  est_size                    text,
  frequency                   text,
  preferred_runner            text,
  role                        text,
  user_agent                  text,
  referrer                    text,
  ip_hash                     text,
  unsubscribe_token           text default encode(gen_random_bytes(16), 'hex'),
  segmentation_completed_at   timestamptz,
  removed_at                  timestamptz,
  confirmed_at                timestamptz,
  created_at                  timestamptz default now(),
  updated_at                  timestamptz default now()
);

create index waitlist_use_case_idx on waitlist(use_case);
create index waitlist_locale_idx   on waitlist(locale);
create index waitlist_created_idx  on waitlist(created_at desc);

create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger waitlist_updated_at
  before update on waitlist
  for each row execute function set_updated_at();

alter table waitlist enable row level security;
create policy waitlist_insert_anon  on waitlist for insert with check (false);
create policy waitlist_service_all  on waitlist for all to service_role using (true);
```

The browser never talks to Supabase directly. The Astro server endpoint uses the Supabase service-role key from `process.env`. Anonymous role is blocked by RLS — even if the marketing site is compromised, attackers can only spam the waitlist via the API endpoint (which is rate-limited), not dump the data.

### Resend integration

Two transactional templates, two languages each (4 total at launch):

- **`waitlist-confirmation-en` / `waitlist-confirmation-pt-br`** — sent immediately after Step 1 succeeds. Plain copy:
  > "Thanks — you're on the Syncologic waitlist. We'll email you when there's something real to try.
  >
  > If you have 30 seconds, [tell us what you want to move →](link)"
  >
  > Link goes back to the page with the segmentation card pre-opened (carries the HMAC token), so abandoners get a second chance.
- **`waitlist-launch-en` / `pt-br`** — scaffolded but unused; populated when there is something to launch.

Resend API key is server-only env. No client-side Resend calls.

### Error handling

| Scenario | Handling |
|---|---|
| Network failure on POST | Form shows "Couldn't reach the server. Try again?" with retry button. Email is held in `localStorage` queue and retried on next page load. |
| Email already exists | Silent success ("✓ You're on the list"). We don't reveal registration status. |
| Rate limit hit | 429 → "Slow down a bit, try again in a minute." No retry queue. |
| Resend send fails | Insert succeeds anyway; failure logged. Confirmation email is non-critical path. |
| Honeypot triggered | 200 OK, but no row inserted. Spammers think they succeeded. |
| PATCH after `segmentation_completed_at` | 409 Conflict. Client shows "Your answers are already saved — email us to change them." |

### Environment variables

```
PUBLIC_SITE_URL=https://syncologic.com         # client-visible
SUPABASE_URL=                                   # server-only
SUPABASE_SERVICE_ROLE_KEY=                      # server-only
RESEND_API_KEY=                                 # server-only
WAITLIST_TOKEN_SECRET=                          # server-only — HMAC for PATCH auth
KV_URL=                                         # Vercel KV — server-only
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
```

Only `PUBLIC_*` vars are exposed to the browser (Astro convention).

## 10. Hero design (homepage)

The homepage hero is the highest-stakes visual on the site. It's the only built-from-scratch animated UI on the site — every other page uses the standard `Hero.astro` component.

### Approach

A pure CSS/HTML animated mockup of the product's "Compact" view — no static screenshot, no canvas, no JS. Animation runs on a 14-second loop.

### Layout

Split hero, two columns:

- **Left column** — wordmark, eyebrow ("Cloud-to-cloud transfer"), headline ("Move files between clouds without downloading them first."), subheading, two CTAs (primary "Join the waitlist" pill, secondary "See how it works" outline pill).
- **Right column** — the animated transfer planner card.

### The card

Wrapped in a window chrome (macOS-style traffic-light dots, window title `Transfer · /Photos 2024`, `Compact | Detailed` view-toggle pill on the right). The window chrome justifies the card shape — it reads as a real product window, not a marketing decoration.

The card body shows four sections:

1. **Source** — `Google Drive · /Photos 2024` with `2,341 files · 1.80 GB` (slate gray, neutral).
2. **Destination** — `OneDrive · /Backup` with `empty · +1.80 GB` (`+1.80 GB` rendered in success green, signaling the positive gain).
3. **Runner** — three pill segments: `Cloud` (active, brand-blue), `Browser`, `Private`.
4. **Status** — animated, two phases (see below).

### Animation

Single 14-second loop, repeats indefinitely, pure CSS keyframes. Forward only — never animates backward.

| Phase | Time | What's visible |
|---|---|---|
| Step 1 | 1.0–2.1 s | "Transferring · 0 / 2,341 files · 0.00 / 1.80 GB" — `0%` |
| Step 2 | 2.1–3.2 s | "Transferring · 585 / 2,341 files · 0.45 / 1.80 GB" — `25%` |
| Step 3 | 3.2–4.3 s | "Transferring · 1,170 / 2,341 files · 0.90 / 1.80 GB" — `50%` |
| Step 4 | 4.3–5.4 s | "Transferring · 1,756 / 2,341 files · 1.35 / 1.80 GB" — `75%` |
| Step 5 | 5.4–6.0 s | "Transferring · 2,341 / 2,341 files · 1.80 / 1.80 GB" — `100%` |
| Success card | 7.0–13.0 s | `✓ Transfer complete · 2,341 files · 1.80 GB · 4 min 12 s` (green) |
| Reset | 13.0–14.0 s | Success card fades out; bar snaps invisibly back to 0% |

The progress bar fills 0 → 100% smoothly between 1.0 s and 5.4 s, holds at 100% during step 5 (5.4–6.0 s), then resets while the success card is visible (no backward animation).

The five progress text lines are stacked absolutely so they don't shift the bar's position. Tabular numerals (`font-variant-numeric: tabular-nums`) keep digits aligned as numbers grow.

The reference implementation lives in `.superpowers/brainstorm/<session>/content/hero-A-v5.html` and should be ported into `src/components/homepage/TransferPlanner.astro` largely as-is.

### Accessibility

- All non-essential animation across the site respects `prefers-reduced-motion`. For the hero, the card displays the success state statically (skip the cycling animation). The same rule applies to any future motion (nav transitions, scroll reveals, etc.) — defined as a single global CSS rule in `global.css`.
- Decorative window chrome is `aria-hidden`; the card is announced to screen readers as "Demonstration of a Syncologic transfer: 2,341 files moving from Google Drive to OneDrive via the Cloud Runner. Transfer complete."
- Site-wide WCAG AA target: focus indicators on every interactive element, sufficient color contrast against all surfaces (Brand Blue on white passes; Slate Gray body on white passes; verify dark sections explicitly).

## 11. Voice & tone

Calm, technical, confident — the Stripe / Linear / Vercel family. Specifics:

- Short, precise sentences. No hype, no exclamation points.
- Treats the visitor as smart. Avoids "amazing", "unleash", "revolutionize".
- Direct verbs. "Move files" not "Effortlessly transfer your data".
- One claim per sentence. No stacked superlatives.
- Use the visitor's words, not engineering jargon. "Folder", not "directory tree".

The same principles apply in Brazilian Portuguese — translations should match the tone, not the words. "Junte-se à lista de espera" is correct; "Transforme sua experiência com transferências de arquivos" is not.

## 12. Analytics & SEO

### Analytics

Vercel Analytics + Speed Insights, enabled via `@vercel/analytics/astro`. Captures pageviews, top pages, devices, and Core Web Vitals. Free with Vercel hosting. No cookie banner needed (Vercel Analytics is privacy-friendly by default in EU mode).

### SEO baseline (per page)

- Unique `<title>` and `<meta name="description">` per page per locale.
- `<link rel="canonical">` and three `hreflang` tags (en, pt-br, x-default).
- OG title / description / image (1200×630 generated per page).
- Twitter card meta.
- Schema.org `WebSite` and `Organization` JSON-LD on the homepage.
- `robots.txt` allowing all, pointing to `sitemap.xml`.
- Multilingual `sitemap.xml` via `@astrojs/sitemap`.

### Performance targets

- Lighthouse Performance ≥ 95 on every page.
- LCP < 1.5 s on 4G simulated mobile.
- All images served as WebP with `loading="lazy"` below the fold.
- Montserrat preloaded with `font-display: swap`.

## 13. Hosting & deployment

- **Platform:** Vercel.
- **Adapter:** `@astrojs/vercel`.
- **Build command:** `astro build`.
- **Preview deployments** on every PR to verify copy and layout changes before merging to `main`.
- **Production:** auto-deploy from `main`.
- **Custom domain:** `syncologic.com` (assumed; configure in Vercel dashboard).
- **Environment variables:** set in Vercel dashboard with appropriate scope (production vs preview).

## 14. Open items for implementation

These are not blockers for the spec — they're things implementation will need to resolve in passing.

- **Confirmation email design** — final HTML for the two confirmation templates (English + pt-BR). Currently specified as plain text; can stay plain or get a simple branded layout. Decide when implementing.
- **Provider SVG sourcing** — official brand SVGs or simple geometric placeholders. Use the providers' branding guidelines where possible (Google Drive, OneDrive, Dropbox publish official assets).
- **Vercel KV vs Upstash** — both have free tiers. Vercel KV is simpler when already on Vercel; pick at implementation time based on quota limits visible at deploy.
- **Final copy for all 20 routes** — the design fixes structure and tone but not paragraph-level copy. Copy will be drafted iteratively during implementation.

## 15. Future (deferred decisions)

- Public docs site, blog, customer logos, case studies — wait for product launch.
- A/B testing infrastructure — wait for traffic.
- Email broadcast UI for sending launch announcements — Resend's audiences UI is sufficient for the first send.
- Comparison pages (`/compare/multcloud-alternative`, etc.) — wait for waitlist data to confirm which competitors visitors actually mention.
- Remaining 4 use-case pages (browser-transfer, local-nas-backup, developer-automation, additional self-host variants) — wait for first-batch waitlist data.
- Remaining 4–5 SEO guides — wait for first 2 to validate format and ranking effectiveness.
