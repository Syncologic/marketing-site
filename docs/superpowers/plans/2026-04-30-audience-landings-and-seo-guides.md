# Plan 2 — Audience Landings, Bespoke Pages, and First SEO Guides

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the eight Plan-2 routes — `/pricing`, `/self-hosted`, `/developers`, the four core use-case landings, and the two first SEO guides — at both `/` and `/pt-br/`, fed by Astro content collections, served with proper SEO metadata, JSON-LD, robots.txt, and Vercel Analytics, ready to merge from `development` to `main` (production).

**Architecture:** Two tightly-scoped foundation tasks (#74 page templates + content collections + shared section components, #75 site-wide SEO + analytics) unblock six independently-shippable page tasks (#76-#84). Each page task ships its own English content **plus** an English-copy placeholder pt-BR mirror (real translations are Plan 3). Once all pages land, #87 verifies + opens the deploy PR.

**Tech Stack:** Astro 5+ (existing), MDX content collections (Astro `defineCollection` + zod schemas), Tailwind tokens (existing `tailwind.config.mjs`), `@astrojs/sitemap` (already wired), `@vercel/speed-insights/astro` (new), schema.org JSON-LD (inline), no new runtime dependencies.

---

## Plan-1 → Plan-2 boundary

Plan 1 shipped: Astro scaffold, Tailwind tokens, i18n infra (en + pt-br placeholder), UI primitives (`Button`, `Card`, `Input`, `Section`, `ProviderLogo`), layout (`Layout`, `Nav`, `Footer`), waitlist API + form (Step 1 + Step 2), homepage (`/`) with animated `TransferPlanner`, and the deploy to `main`.

Plan 2 starts from `development` (branched from production `main` on 2026-04-30). Open repo gaps to fill in this plan:

- `src/content/config.ts` is empty — **no collections defined yet**.
- `Hero.astro` (generic) and `FAQ.astro` do not exist.
- No `src/pages/use-cases/` or `src/pages/guides/` templates.
- No `src/pages/pricing.astro`, `self-hosted.astro`, `developers.astro`, or any pt-BR mirror except `index` (and `index` will need to be added too).
- No `robots.txt`, no homepage JSON-LD, no Speed Insights wiring (Web Analytics is wired via `astro.config.mjs`).
- `astro.config.mjs` already has `@astrojs/sitemap` registered — no config change needed beyond rebuilding.

## Branching & PR strategy

`main` is production. `development` is the integration target. Every task in this plan:

1. Branches off **`development`** (`git worktree add .worktrees/<branch> -b <branch> development`).
2. Lands via PR targeting **`development`**, body must include `Closes #<issue>`.
3. After all Plan-2 PRs merge to `development` and #87 verifies, a single `development` → `main` deploy PR ships everything to production.

Never commit to `main` or `development` directly.

## File Structure (created or modified by this plan)

```
src/
├── content/
│   ├── config.ts                                  # #74 step 1 — defines useCases + guides collections
│   ├── use-cases/
│   │   ├── en/
│   │   │   ├── cloud-to-cloud-transfer.mdx        # #80
│   │   │   ├── business-cloud-migration.mdx       # #81
│   │   │   ├── scheduled-cloud-backup.mdx         # #82
│   │   │   └── private-runner.mdx                 # #83
│   │   └── pt-br/
│   │       ├── cloud-to-cloud-transfer.mdx        # #80
│   │       ├── business-cloud-migration.mdx       # #81
│   │       ├── scheduled-cloud-backup.mdx         # #82
│   │       └── private-runner.mdx                 # #83
│   └── guides/
│       ├── en/
│       │   ├── move-files-between-clouds-without-downloading.mdx  # #85
│       │   └── transfer-google-drive-to-onedrive.mdx              # #86
│       └── pt-br/
│           ├── move-files-between-clouds-without-downloading.mdx  # #85
│           └── transfer-google-drive-to-onedrive.mdx              # #86
├── components/
│   ├── sections/
│   │   ├── Hero.astro                             # #74 — generic landing/guide hero
│   │   └── FAQ.astro                              # #74 — accordion (pricing + developers)
│   └── layout/
│       └── JsonLd.astro                           # #75 — script JSON-LD injector
├── pages/
│   ├── pricing.astro                              # #76
│   ├── self-hosted.astro                          # #77
│   ├── developers.astro                           # #78
│   ├── use-cases/
│   │   └── [slug].astro                           # #74 — dynamic template (en)
│   ├── guides/
│   │   └── [slug].astro                           # #74 — dynamic template (en)
│   └── pt-br/
│       ├── index.astro                            # #76? actually exists or not — see below
│       ├── pricing.astro                          # #76
│       ├── self-hosted.astro                      # #77
│       ├── developers.astro                       # #78
│       ├── use-cases/
│       │   └── [slug].astro                       # #74 — dynamic template (pt-br)
│       └── guides/
│           └── [slug].astro                       # #74 — dynamic template (pt-br)
public/
├── robots.txt                                     # #75
└── og/                                            # #75 — per-page OG images (1200x630)
    ├── default-en.png                             # #75 (rename of og-default.png if needed)
    └── default-pt-br.png                          # #75
src/i18n/
├── en.json                                        # extended by every page task
└── pt-br.json                                     # extended by every page task (English placeholder copy)
```

## Issue tree (mirrors GitHub parent/sub-issue structure)

```
#73 Plan 2 Tracking — Audience Landings & SEO Guides     (umbrella)
├── #74 Foundation: page templates + collections + Hero + FAQ
├── #75 Foundation: site-wide SEO, robots, JSON-LD, Speed Insights
├── #76 Bespoke page: /pricing (en + pt-br)
├── #77 Bespoke page: /self-hosted (en + pt-br)
├── #78 Bespoke page: /developers (en + pt-br)
├── #79 Use-case landings (parent)
│   ├── #80 /use-cases/cloud-to-cloud-transfer
│   ├── #81 /use-cases/business-cloud-migration
│   ├── #82 /use-cases/scheduled-cloud-backup
│   └── #83 /use-cases/private-runner
├── #84 SEO guides (parent)
│   ├── #85 /guides/move-files-between-clouds-without-downloading
│   └── #86 /guides/transfer-google-drive-to-onedrive
└── #87 Verification, Lighthouse, deploy PR (development → main)
```

## Dependency graph (parallelism)

```
#74 ─┐
    ├─→ #76  (pricing)        ─┐
    ├─→ #77  (self-hosted)    ─┤
    ├─→ #78  (developers)     ─┤
    ├─→ #80 #81 #82 #83      ─┤── #87 (verify + deploy)
    └─→ #85 #86              ─┘
#75  (parallel with everything; no code dep on #74)
```

**#74 and #75 are the only foundation tasks; once #74 merges, #76 through #84 are all parallel.** #75 can run in parallel with the page work (independent files). #87 is the final gate.

---

## Task #74 — Foundation: page templates + content collections + Hero + FAQ

**Branch:** `feat/plan-2-foundation-templates`
**Closes:** #74
**Public dependencies:** Plan-1 primitives (`Button`, `Card`, `Section`, `Input`, `ProviderLogo`, `WaitlistForm`, `Layout`, `Nav`, `Footer`), Tailwind tokens, i18n utils.

### Files

- Create: `src/content/config.ts` (replace empty placeholder)
- Create: `src/components/sections/Hero.astro`
- Create: `src/components/sections/FAQ.astro`
- Create: `src/pages/use-cases/[slug].astro`
- Create: `src/pages/guides/[slug].astro`
- Create: `src/pages/pt-br/use-cases/[slug].astro`
- Create: `src/pages/pt-br/guides/[slug].astro`
- Modify: `src/i18n/en.json` and `src/i18n/pt-br.json` — add `useCases.*`, `guides.*`, `faq.*`, `hero.*` keys used by templates and components.

### Step 1: Define content collections

- [ ] Replace `src/content/config.ts` with two collections, each with locale-scoped folders. Frontmatter is the single source of truth for everything the template renders that isn't body MDX.

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const useCaseSchema = z.object({
  // Routing
  locale: z.enum(['en', 'pt-br']),
  slug: z.string(),                       // matches filename, used for hreflang twin lookup
  // SEO
  title: z.string().min(8).max(70),
  description: z.string().min(40).max(180),
  ogImage: z.string().optional(),         // /og/<file>.png; falls back to default-<locale>.png
  // Hero
  eyebrow: z.string(),
  headline: z.string(),
  subheading: z.string(),
  primaryCta: z.object({ label: z.string(), href: z.string().default('#waitlist') }),
  secondaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
  // Waitlist segmentation hint — must match enum in src/lib/validation.ts
  waitlistSegment: z.enum([
    'one_time_transfer', 'business_migration', 'scheduled_backup',
    'private_runner', 'browser_runner', 'local_backup', 'developer', 'self_hosted',
  ]),
  // Page metadata
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

const guideSchema = z.object({
  locale: z.enum(['en', 'pt-br']),
  slug: z.string(),
  title: z.string().min(8).max(70),
  description: z.string().min(40).max(180),
  ogImage: z.string().optional(),
  eyebrow: z.string(),
  headline: z.string(),
  subheading: z.string(),
  // Soft CTA — guide pages don't pre-segment
  primaryCta: z.object({ label: z.string(), href: z.string().default('#waitlist') }),
  // Optional segment hint when the guide naturally maps to one
  waitlistSegment: z.enum([
    'one_time_transfer', 'business_migration', 'scheduled_backup',
    'private_runner', 'browser_runner', 'local_backup', 'developer', 'self_hosted',
  ]).optional(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

export const collections = {
  'use-cases': defineCollection({ type: 'content', schema: useCaseSchema }),
  guides: defineCollection({ type: 'content', schema: guideSchema }),
};
```

- [ ] Run `npx astro sync` to regenerate `.astro/types.d.ts`. Expected: no errors (collections empty so far).
- [ ] Commit: `chore(content): define use-cases and guides collection schemas`

### Step 2: Create the generic `Hero.astro`

- [ ] Create `src/components/sections/Hero.astro` — used by `[slug].astro` (use-cases + guides) and any bespoke page that wants the same hero shape.

```astro
---
// src/components/sections/Hero.astro
import Section from '../ui/Section.astro';
import Button from '../ui/Button.astro';

interface Props {
  eyebrow?: string;
  headline: string;
  subheading?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  surface?: 'white' | 'soft' | 'dark';
}

const {
  eyebrow,
  headline,
  subheading,
  primaryCta,
  secondaryCta,
  surface = 'white',
} = Astro.props;
---

<Section surface={surface} padding="lg">
  <div class="container-wide">
    <div class="max-w-[760px] flex flex-col gap-6">
      {eyebrow && (
        <p class="text-compact text-brand-blue uppercase tracking-wide">{eyebrow}</p>
      )}
      <h1 class="text-display-2 lg:text-display-1 text-dark-charcoal text-balance">
        {headline}
      </h1>
      {subheading && (
        <p class="text-body text-slate-gray max-w-[640px]">{subheading}</p>
      )}
      <div class="flex flex-wrap gap-3 mt-2">
        <Button href={primaryCta.href} variant="primary" size="lg">{primaryCta.label}</Button>
        {secondaryCta && (
          <Button href={secondaryCta.href} variant="ghost" size="lg">{secondaryCta.label}</Button>
        )}
      </div>
      <slot name="meta" />
    </div>
    <slot name="visual" />
  </div>
</Section>
```

- [ ] Commit: `feat(sections): generic Hero component for landings and guides`

### Step 3: Create `FAQ.astro` accordion

Used by `/pricing` (#76) and `/developers` (#78). Pure HTML `<details>` — no JS required.

- [ ] Create `src/components/sections/FAQ.astro`:

```astro
---
// src/components/sections/FAQ.astro
import Section from '../ui/Section.astro';

interface FaqItem {
  q: string;
  a: string;
}

interface Props {
  title: string;
  items: FaqItem[];
  surface?: 'white' | 'soft' | 'dark';
}

const { title, items, surface = 'soft' } = Astro.props;
---

<Section surface={surface} padding="md">
  <div class="container-wide max-w-[840px]">
    <h2 class="text-h1 text-dark-charcoal mb-8">{title}</h2>
    <ul class="flex flex-col gap-3">
      {items.map((item) => (
        <li class="border border-divider rounded-card bg-white">
          <details class="group">
            <summary class="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 text-h3 text-dark-charcoal">
              <span>{item.q}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="transition-transform group-open:rotate-180"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div class="px-6 pb-5 -mt-1 text-body text-slate-gray">
              {item.a}
            </div>
          </details>
        </li>
      ))}
    </ul>
  </div>
</Section>
```

- [ ] Commit: `feat(sections): FAQ accordion component`

### Step 4: Use-case dynamic template

Same template in two locations (en + pt-br) so Astro generates `/use-cases/<slug>` and `/pt-br/use-cases/<slug>` from the right collection folder.

- [ ] Create `src/pages/use-cases/[slug].astro`:

```astro
---
// src/pages/use-cases/[slug].astro
import { getCollection, getEntry } from 'astro:content';
import Layout from '../../components/layout/Layout.astro';
import Nav from '../../components/layout/Nav.astro';
import Footer from '../../components/layout/Footer.astro';
import Hero from '../../components/sections/Hero.astro';
import WaitlistForm from '../../components/sections/WaitlistForm.astro';
import StickyWaitlistBar from '../../components/sections/StickyWaitlistBar.astro';

export async function getStaticPaths() {
  const entries = await getCollection('use-cases', (e) => e.data.locale === 'en');
  return entries.map((entry) => ({
    params: { slug: entry.data.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
const ogImage = entry.data.ogImage ?? '/og/default-en.png';
---

<Layout title={entry.data.title} description={entry.data.description} ogImage={ogImage}>
  <Nav slot="nav" />
  <Hero
    eyebrow={entry.data.eyebrow}
    headline={entry.data.headline}
    subheading={entry.data.subheading}
    primaryCta={entry.data.primaryCta}
    secondaryCta={entry.data.secondaryCta}
  />
  <article class="prose prose-syncologic container-wide py-section max-w-[760px]">
    <Content />
  </article>
  <WaitlistForm defaultSegment={entry.data.waitlistSegment} />
  <StickyWaitlistBar />
  <Footer slot="footer" />
</Layout>
```

- [ ] Mirror to `src/pages/pt-br/use-cases/[slug].astro` (only the `getStaticPaths` filter changes from `'en'` to `'pt-br'`, and the OG fallback to `/og/default-pt-br.png`):

```astro
---
// src/pages/pt-br/use-cases/[slug].astro
import { getCollection } from 'astro:content';
import Layout from '../../../components/layout/Layout.astro';
import Nav from '../../../components/layout/Nav.astro';
import Footer from '../../../components/layout/Footer.astro';
import Hero from '../../../components/sections/Hero.astro';
import WaitlistForm from '../../../components/sections/WaitlistForm.astro';
import StickyWaitlistBar from '../../../components/sections/StickyWaitlistBar.astro';

export async function getStaticPaths() {
  const entries = await getCollection('use-cases', (e) => e.data.locale === 'pt-br');
  return entries.map((entry) => ({
    params: { slug: entry.data.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
const ogImage = entry.data.ogImage ?? '/og/default-pt-br.png';
---

<Layout title={entry.data.title} description={entry.data.description} ogImage={ogImage}>
  <Nav slot="nav" />
  <Hero
    eyebrow={entry.data.eyebrow}
    headline={entry.data.headline}
    subheading={entry.data.subheading}
    primaryCta={entry.data.primaryCta}
    secondaryCta={entry.data.secondaryCta}
  />
  <article class="prose prose-syncologic container-wide py-section max-w-[760px]">
    <Content />
  </article>
  <WaitlistForm defaultSegment={entry.data.waitlistSegment} />
  <StickyWaitlistBar />
  <Footer slot="footer" />
</Layout>
```

- [ ] Commit: `feat(pages): use-case dynamic templates (en + pt-br)`

### Step 5: Guide dynamic template

Identical structure to use-case; the only difference is the collection name.

- [ ] Create `src/pages/guides/[slug].astro` (English, querying `getCollection('guides', e => e.data.locale === 'en')`).
- [ ] Create `src/pages/pt-br/guides/[slug].astro` (mirror, `'pt-br'`).
- [ ] Both pages render `<Hero>` then the MDX `<Content />` then a soft `<WaitlistForm>` (passing `entry.data.waitlistSegment` if present).
- [ ] Commit: `feat(pages): guide dynamic templates (en + pt-br)`

### Step 6: Add a `prose` typography rule for MDX content

The MDX article body needs sane typography defaults inside the constrained container. Add a small `.prose-syncologic` ruleset to `src/styles/global.css` (no `@tailwindcss/typography` plugin — keep dependency surface flat).

- [ ] Append to `src/styles/global.css`:

```css
.prose-syncologic { color: var(--syncologic-slate-gray, #5D6C7B); }
.prose-syncologic h2 { @apply text-h1 text-dark-charcoal mt-12 mb-4; }
.prose-syncologic h3 { @apply text-h3 text-dark-charcoal mt-8 mb-3; }
.prose-syncologic p { @apply text-body mb-5; }
.prose-syncologic ul { @apply list-disc pl-6 mb-5 text-body; }
.prose-syncologic ol { @apply list-decimal pl-6 mb-5 text-body; }
.prose-syncologic li { @apply mb-2; }
.prose-syncologic a { @apply text-brand-blue underline underline-offset-2; }
.prose-syncologic strong { @apply text-dark-charcoal font-medium; }
.prose-syncologic code { @apply bg-soft-gray rounded-input px-1.5 py-0.5 text-caption; }
```

- [ ] Commit: `style(prose): typography rules for MDX article bodies`

### Step 7: Add i18n keys touched by templates

- [ ] Add to `src/i18n/en.json` (and the same keys with English placeholder copy in `pt-br.json`):

```jsonc
{
  "useCases": {
    "indexTitle": "Use cases",
    "indexDescription": "Pick the workflow that matches what you're trying to do."
  },
  "guides": {
    "indexTitle": "Guides",
    "indexDescription": "How to move files between cloud providers without downloading them first."
  },
  "faq": {
    "title": "Common questions"
  }
}
```

- [ ] Commit: `chore(i18n): keys for use-case + guide templates`

### Step 8: Verify

- [ ] `npx astro sync && npx astro check` — zero errors. Templates compile against empty collections (zero static paths is fine).
- [ ] `npm run dev` — visit `/use-cases/anything` and `/guides/anything` — both should 404 (no MDX yet) but not error.
- [ ] `npm run build` — clean static build, no warnings about missing routes.
- [ ] Push, open PR `feat: page templates + content collections + Hero + FAQ` against `development`. PR body: `Closes #74`.

---

## Task #75 — Foundation: site-wide SEO + analytics + robots + JSON-LD

**Branch:** `feat/plan-2-seo-foundation`
**Closes:** #75
**Public dependencies:** none on #74. Independent of all page work — can land in parallel.

### Files

- Create: `public/robots.txt`
- Create: `public/og/default-en.png`, `public/og/default-pt-br.png` (1200×630, brand)
- Create: `src/components/layout/JsonLd.astro`
- Modify: `src/components/layout/Layout.astro` — accept optional `jsonLd` slot, ensure OG fallback uses locale-specific default.
- Modify: `src/pages/index.astro` (and `src/pages/pt-br/index.astro` once it exists) — inject homepage `Organization` + `WebSite` JSON-LD.
- Modify: `package.json` — add `@vercel/speed-insights` dependency.
- Modify: `astro.config.mjs` — Speed Insights enabled via Vercel adapter (`webAnalytics` already on).
- Modify: `src/components/layout/Layout.astro` — add `<SpeedInsights />` script.

### Step 1: robots.txt

- [ ] Create `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://syncologic.com/sitemap-index.xml
```

- [ ] Commit: `feat(seo): robots.txt allowing all bots, pointing at sitemap`

### Step 2: Per-locale default OG image

The current `Layout.astro` references `/og-default.png`. Move to `/og/default-<locale>.png` so pt-BR pages can have a localized fallback even if a page doesn't override.

- [ ] Add 1200×630 PNGs to `public/og/`:
  - `default-en.png` — Brand Blue gradient + Syncologic wordmark + "Move files between clouds without downloading them first."
  - `default-pt-br.png` — same, with "Mova arquivos entre nuvens sem baixar antes."
  - These can be authored once in Figma using `DESIGN.md` tokens; commit the rendered PNGs.
- [ ] Modify `src/components/layout/Layout.astro` to default by locale:

```astro
const og = ogImage ?? `${siteUrl}/og/default-${locale}.png`;
```

- [ ] Delete the legacy `/og-default.png` if it exists.
- [ ] Commit: `feat(seo): per-locale default OG images`

### Step 3: JSON-LD injector

- [ ] Create `src/components/layout/JsonLd.astro`:

```astro
---
interface Props {
  schema: Record<string, unknown> | Record<string, unknown>[];
}
const { schema } = Astro.props;
const json = JSON.stringify(schema);
---
<script type="application/ld+json" is:inline set:html={json} />
```

- [ ] Modify `Layout.astro` to add an optional `jsonLd` slot rendered inside `<head>`:

```astro
<head>
  ...
  <slot name="head" />
</head>
```

- [ ] Commit: `feat(seo): JsonLd component + head slot in Layout`

### Step 4: Homepage JSON-LD (Organization + WebSite)

- [ ] Modify `src/pages/index.astro` (English) to pass JSON-LD via the new head slot:

```astro
---
import Layout from '../components/layout/Layout.astro';
import JsonLd from '../components/layout/JsonLd.astro';
// ...existing imports...

const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://syncologic.com';
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Syncologic',
  url: siteUrl,
  logo: `${siteUrl}/assets/brand/icon-black.png`,
  sameAs: [],
};
const siteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: siteUrl,
  name: 'Syncologic',
  inLanguage: ['en', 'pt-BR'],
};
---

<Layout title={...} description={...}>
  <JsonLd slot="head" schema={[orgSchema, siteSchema]} />
  ...
</Layout>
```

- [ ] Mirror to `src/pages/pt-br/index.astro` (will be created in #76/#77/#78 flow if not already; if it doesn't exist yet, create a minimal pt-BR index that imports the English homepage components — copy stays English placeholder per i18n rules).
- [ ] Commit: `feat(seo): homepage Organization + WebSite JSON-LD`

### Step 5: Vercel Speed Insights

- [ ] Add dependency:

```
npm i @vercel/speed-insights
```

- [ ] Modify `Layout.astro` to render the script (Astro-compatible import):

```astro
---
import { SpeedInsights } from '@vercel/speed-insights/astro';
// ...
---
<body>
  ...
  <SpeedInsights />
</body>
```

- [ ] Commit: `feat(analytics): enable Vercel Speed Insights`

### Step 6: Verify

- [ ] `npm run build` — no errors. Confirm `dist/sitemap-*.xml` is generated.
- [ ] Open `dist/index.html` — confirm `<script type="application/ld+json">` is present and valid JSON.
- [ ] `npm run dev`, hit `http://localhost:4321/robots.txt` — confirm content.
- [ ] PR `feat: site-wide SEO foundation (robots, JSON-LD, OG defaults, Speed Insights)` against `development`. Body: `Closes #75`.

---

## Task #76 — Bespoke page: `/pricing` (en + pt-br)

**Branch:** `feat/plan-2-pricing`
**Closes:** #76
**Depends on:** #74 (uses `Hero`, `FAQ`).
**Parallelizable with:** #77, #78, #79*, #84*, #75.

### Files

- Create: `src/pages/pricing.astro`
- Create: `src/pages/pt-br/pricing.astro`
- Modify: `src/i18n/en.json` and `src/i18n/pt-br.json` — add `pricing.*` block (hero, hypotheses, what-affects-cost, cloud-vs-private, early-access, faq).

### Page composition (matches `content.md` §10 — Pricing Interest)

Sections, top-to-bottom:

1. `<Hero surface="white">` — eyebrow "Pricing", headline "Choose the transfer mode that matches your volume, schedule, and trust needs.", subheading explaining hypotheses, primary CTA `#waitlist`, secondary CTA `#hypotheses`.
2. `<Section surface="soft">` — Pricing hypotheses grid: 4 cards (`Free`, `Pro`, `Business`, `Private Runner`). Each card: title, monthly price guess, 3-bullet inclusion list, "What we're trying to learn" footer. Use `<Card radius="card" elevation="flat">`.
3. `<Section surface="white">` — "What affects cost" — 3 columns: data volume, frequency, runner choice. Plain text.
4. `<Section surface="soft">` — "Cloud vs Private Runner economics" — short comparison table.
5. `<Section surface="dark">` — Early-access note: anyone who joins now can shape pricing.
6. `<WaitlistForm defaultSegment={null} segmentationQuestion="pricing">` — id `waitlist`. (No segment hint; pricing visitors come from many use cases.)
7. `<FAQ title={t('pricing.faq.title')} items={...}>` — 4–6 items: "Is there really no firm price yet?", "Will Private Runner cost more?", "What about open-source self-hosting pricing?", "Will I be charged automatically when launch comes?", etc.
8. `<Footer />`

### Step 1: English page scaffold

- [ ] Create `src/pages/pricing.astro` using the structure above. Follow the homepage (`src/pages/index.astro`) for import + slot patterns. Pull copy from `getT(locale)` keys under `pricing.*`.

- [ ] Add the `pricing.*` keys to `src/i18n/en.json`. Keep copy short (3 lines per block max — `DESIGN.md` rule). Cover: `pricing.hero.{eyebrow,headline,subheading,primaryCta,secondaryCta}`, `pricing.hypotheses.{title,subtitle,free,pro,business,privateRunner}` (each as `{name,price,features[],footnote}`), `pricing.affects.{title,volume,frequency,runner}`, `pricing.cloudVsPrivate.{title,table}`, `pricing.earlyAccess.{headline,body}`, `pricing.faq.{title,items[]}`.

- [ ] Mirror keys to `src/i18n/pt-br.json` with English-placeholder copy (Plan 3 replaces).

- [ ] Commit: `feat(pages): /pricing English + i18n keys`

### Step 2: pt-BR mirror

- [ ] Create `src/pages/pt-br/pricing.astro` — same structure as English file. The page reads from the same `t()` keys; locale resolution happens in `Layout.astro`/`getLocaleFromUrl`.

- [ ] Commit: `feat(pages): /pt-br/pricing mirror`

### Step 3: Verify

- [ ] `npm run dev` — visit `http://localhost:4321/pricing` and `http://localhost:4321/pt-br/pricing`. Manual visual check at desktop (1280px) and mobile (375px). Confirm:
  - Hero headline + subheading display correctly.
  - 4 hypothesis cards in a 2×2 grid (desktop) / stacked (mobile).
  - FAQ accordion expand/collapse works (no JS required).
  - Waitlist form at id `waitlist`.
  - Footer + Nav present, language switch jumps to `/pt-br/pricing`.
- [ ] `npm run lint` — zero errors.
- [ ] `npm run build` — clean.
- [ ] `design-check` skill — audit page against `DESIGN.md` and the `.claude/rules/` Always/Never lists.
- [ ] PR `feat: /pricing landing page (en + pt-br)` against `development`. Body: `Closes #76`.

---

## Task #77 — Bespoke page: `/self-hosted` (en + pt-br)

**Branch:** `feat/plan-2-self-hosted`
**Closes:** #77
**Depends on:** #74 (`Hero`).
**Parallelizable with:** #76, #78, #79*, #84*, #75.

### Files

- Create: `src/pages/self-hosted.astro`
- Create: `src/pages/pt-br/self-hosted.astro`
- Modify: `src/i18n/en.json` + `pt-br.json` — `selfHosted.*` block.

### Page composition (matches `content.md` §10 — Self-Hosted Future)

1. `<Hero surface="white">` — eyebrow "Self-hosted future", headline "Source-visible. Self-hostable. On your timeline.", subheading per spec.
2. `<Section surface="soft">` — "Architecture principles": control plane vs data plane diagram (text/SVG), bullets explaining why this matters.
3. `<Section surface="white">` — "Private Runner first": call out current Private Runner work as the first concrete step.
4. `<Section surface="soft">` — "Future self-host model": three planned levels (Private Runner / Full self-host / Air-gapped) — clearly labeled "Planned, not committed".
5. `<Section surface="dark">` — "Source-visible trust": brief words about why core code stays public.
6. `<WaitlistForm defaultSegment="self_hosted">`.
7. `<Footer />`.

### Step 1 / 2 / 3: same shape as #76 — English page → pt-BR mirror → verify.

- [ ] Commit per file as in #76.
- [ ] PR `feat: /self-hosted landing page (en + pt-br)` against `development`. Body: `Closes #77`.

---

## Task #78 — Bespoke page: `/developers` (en + pt-br)

**Branch:** `feat/plan-2-developers`
**Closes:** #78
**Depends on:** #74 (`Hero`, `FAQ`).
**Parallelizable with:** #76, #77, #79*, #84*, #75.

### Files

- Create: `src/pages/developers.astro`
- Create: `src/pages/pt-br/developers.astro`
- Modify: `src/i18n/en.json` + `pt-br.json` — `developers.*` block.

### Page composition (matches `content.md` §10 — Developer Automation, but bespoke not use-case)

1. `<Hero surface="white">` — eyebrow "Developers", headline "Automate cloud transfers with a real API.", subheading.
2. `<Section surface="soft">` — "Future API shape": short OpenAPI-flavored snippet (POST /jobs example) shown as code block; text on what the API will and won't do.
3. `<Section surface="white">` — "CLI story": planned `syncologic` CLI sample command, what it'll cover.
4. `<Section surface="soft">` — "Runner model for developers": Cloud / Browser / Private + which one fits which workflow.
5. `<Section surface="white">` — "Webhook use cases": 3–4 scenarios (job-finished webhook, daily report, etc.).
6. `<Section surface="dark">` — "No premature SDK promise": explicit note that we won't ship SDKs until the API is stable.
7. `<WaitlistForm defaultSegment="developer">` — adds an extra question: "Which surface matters most: API / CLI / webhooks / self-hosting?" (handled via `additionalSegmentationQuestion` prop on `WaitlistForm` — add prop in this task if not already supported).
8. `<FAQ>` — 4 items: "When will the API be available?", "Will there be a free tier for the API?", "Can I self-host the API?", "Will you ship official SDKs?".
9. `<Footer />`.

If `WaitlistForm` doesn't already accept an additional segmentation question, this task adds a `extraQuestion?` prop (no new segment enum — collected in `localStorage` and skipped if not provided). **Don't expand the DB schema** in this plan; the question is signal-only on the front end and can be PATCHed into a future generic `notes` column if Plan 3+ adds one.

### Step 1 / 2 / 3: same shape as #76 — English page → pt-BR mirror → verify.

- [ ] PR `feat: /developers landing page (en + pt-br)` against `development`. Body: `Closes #78`.

---

## Task #79 — Use-case landings (parent)

**Closes:** #79
**Depends on:** #74.
**Sub-issues:** #80–#83 are content-authoring tasks. Each sub-issue is independently parallelizable once #74 is merged.

Each sub-issue:

- Branch: `feat/plan-2-use-case-<slug>`
- Files: `src/content/use-cases/en/<slug>.mdx` + `src/content/use-cases/pt-br/<slug>.mdx`
- PR body: `Closes #79<N>` and `Refs #79`.

The dynamic templates from #74 render these MDX files at `/use-cases/<slug>` (en) and `/pt-br/use-cases/<slug>` (pt-BR).

### Frontmatter contract (every MDX file)

```yaml
---
locale: en                                    # or pt-br for the mirror
slug: cloud-to-cloud-transfer                 # MUST match filename
title: "Cloud-to-cloud file transfer — Syncologic"
description: "Move folders between Google Drive, OneDrive, Dropbox, and S3 without pulling everything through your laptop."
ogImage: /og/use-case-cloud-to-cloud-en.png   # optional; falls back to default
eyebrow: "For one-time and recurring transfers"
headline: "Move folders between cloud drives without downloading them first."
subheading: "Connect a source and destination, preview the diff, run the transfer in the cloud or on your own machine, and get a clear report."
primaryCta:
  label: "Join the cloud-to-cloud waitlist"
  href: "#waitlist"
secondaryCta:
  label: "See how it works"
  href: "#how-it-works"
waitlistSegment: one_time_transfer
publishedAt: 2026-04-30
---
```

### Body sections (consistent across F1–F4)

Each MDX body has the same 5 H2 sections so the rendered pages feel uniform:

```mdx
## Who this is for
- 2–3 bullets naming the public.

## What you'll do
1. Connect source provider.
2. Connect destination provider.
3. Preview the diff.
4. Pick a runner (Cloud / Browser / Private).
5. Run the transfer and download the report.

## Why this beats download-and-reupload
2–3 short paragraphs.

## Three ways to run a transfer
Brief cards / list referencing Cloud / Browser / Private Runner. Reuse copy patterns from the homepage `RunnerCards` section but in prose.

## Common provider pairs
Bullet list of 4–6 source→destination pairs relevant to the use case.
```

After the body, the template injects `<WaitlistForm defaultSegment={frontmatter.waitlistSegment}>` automatically — **MDX should not include a manual waitlist form**.

### Sub-issue list

#### #80 `/use-cases/cloud-to-cloud-transfer`

- [ ] Create `src/content/use-cases/en/cloud-to-cloud-transfer.mdx` with `waitlistSegment: one_time_transfer`. Body sections per the contract; segmentation question: "Which two clouds do you want to connect?".
- [ ] Mirror to `src/content/use-cases/pt-br/cloud-to-cloud-transfer.mdx` (English placeholder copy).
- [ ] Verify: `npm run dev`, visit `/use-cases/cloud-to-cloud-transfer` and `/pt-br/use-cases/cloud-to-cloud-transfer`. Manual visual at desktop + mobile.
- [ ] PR. Body: `Closes #80` (and `Refs #79`).

#### #81 `/use-cases/business-cloud-migration`

- [ ] Create both MDX files with `waitlistSegment: business_migration`. Segmentation phrasing: "Are you migrating a team, company, or personal account?". Sections emphasize: preview/dry-run, run reports, scheduling, Private Runner option for sensitive moves.
- [ ] PR. `Closes #81`.

#### #82 `/use-cases/scheduled-cloud-backup`

- [ ] Create both MDX files with `waitlistSegment: scheduled_backup`. Body emphasizes scheduled jobs, change detection, backup reports, destination options (S3 prominent).
- [ ] PR. `Closes #82`.

#### #83 `/use-cases/private-runner`

- [ ] Create both MDX files with `waitlistSegment: private_runner`. Body emphasizes the data path (source → user's runner → destination), outbound connection model, NAS/VPS examples, comparison vs Cloud Runner.
- [ ] PR. `Closes #83`.

After all four sub-issues merge, close #79 (the parent) with a verification comment listing the 4 PRs.

---

## Task #84 — SEO guides (parent)

**Closes:** #84
**Depends on:** #74.
**Sub-issues:** #85, #86 — content-authoring, parallelizable.

Same workflow as #79. The frontmatter contract is the same as use-cases (with `waitlistSegment` optional). The body structure is different — guides answer the search query first and only mention Syncologic at the end.

### Body section template (every guide)

```mdx
## What people usually try first
2–3 paragraphs honestly describing the manual / browser-download approach and where it breaks (large folders, OAuth limits, time, bandwidth).

## What works better
A short, useful answer to the search query — not a product pitch. Cite rclone, native provider migration tools, etc., as legitimate options.

## When that still isn't enough
Specific cases (large team, recurring sync, privacy needs) where the simple answers fall short.

## How Syncologic does this
3–4 short paragraphs explaining the connect → preview → runner choice → run flow. Mention each runner option once.

## Caveats
Be honest about what's missing right now (pre-launch, not all providers yet, browser runner has tab requirement).
```

The template injects a soft `<WaitlistForm>` at the end — guide pages do not pre-segment unless `waitlistSegment` is set in frontmatter.

### Sub-issue list

#### #85 `/guides/move-files-between-clouds-without-downloading`

- [ ] Create `src/content/guides/en/move-files-between-clouds-without-downloading.mdx`. Frontmatter: title and meta-description anchoring on the broad query; **no `waitlistSegment`** (broad intent).
- [ ] Mirror to `src/content/guides/pt-br/move-files-between-clouds-without-downloading.mdx` (English placeholder).
- [ ] Verify routes + visual.
- [ ] PR. `Closes #85` (and `Refs #84`).

#### #86 `/guides/transfer-google-drive-to-onedrive`

- [ ] Create both MDX files. Frontmatter: title/description targeting the GDrive → OneDrive query. `waitlistSegment: one_time_transfer` (this query maps cleanly to the cloud-to-cloud use case).
- [ ] Body emphasizes: official Microsoft Mover.io is gone; Google Takeout-then-upload is fragile for large drives; Workspace migrations differ from personal; Syncologic offers preview + report + runner choice.
- [ ] PR. `Closes #86`.

After both sub-issues merge, close #84 with a verification comment.

---

## Task #87 — Verification + Lighthouse + deploy PR

**Branch:** N/A (no code changes — verification + deploy PR)
**Closes:** #87
**Depends on:** #74, #75, #76, #77, #78, #79, #84 all merged to `development`.

### Step 1: Branch sanity

- [ ] `git fetch origin; git switch development; git pull --ff-only`. Confirm all expected files are present.
- [ ] `npx astro sync && npx astro check && npm run build` — clean.
- [ ] `npm test` — all unit tests still pass.

### Step 2: Lighthouse mobile (≥ 90 Performance)

For each new route, run Lighthouse in Chromium DevTools (mobile preset, simulated 4G, throttled CPU):

- [ ] `/pricing` — Performance ≥ 90, LCP < 1.5s.
- [ ] `/self-hosted` — same.
- [ ] `/developers` — same.
- [ ] `/use-cases/cloud-to-cloud-transfer` — same.
- [ ] `/use-cases/business-cloud-migration` — same.
- [ ] `/use-cases/scheduled-cloud-backup` — same.
- [ ] `/use-cases/private-runner` — same.
- [ ] `/guides/move-files-between-clouds-without-downloading` — same.
- [ ] `/guides/transfer-google-drive-to-onedrive` — same.
- [ ] Same 9 routes under `/pt-br/`.

If any route fails: open a fix PR against `development`. Do not promote to `main` with failing scores.

### Step 3: Manual click-through

- [ ] Walk Nav from homepage → each page → back. Confirm:
  - Use-cases dropdown shows all 4 slugs and links resolve.
  - Pricing / Self-hosted / Developers links resolve.
  - Language switcher in Nav jumps to the right twin route on every page.
  - Footer language switcher does the same.
  - Waitlist form appears (or sticky bar appears on mobile) on every page.
- [ ] Submit a test waitlist signup from the new `/pricing` page in dev — confirm it lands in Supabase with `source_page = '/pricing'`.

### Step 4: Open the deploy PR (`development` → `main`)

- [ ] Open a PR titled `release: Plan 2 — audience landings + first SEO guides` from `development` to `main`.
- [ ] PR body: bulleted list of every Plan-2 PR merged into development, plus Lighthouse summary.
- [ ] **Wait for explicit user approval before merging.** This is a production deploy — confirm before clicking.
- [ ] After merge: Vercel auto-deploys. Spot-check `https://syncologic.com/pricing` and one of the use-case pages live.
- [ ] Close #87 with a comment listing the deploy commit SHA.

---

## Plan 3 / out of scope for this plan

- **Real Brazilian Portuguese translations** of all 9 new routes + existing homepage. Plan 2 ships English-placeholder pt-BR.
- **Comparison pages** (`/compare/*`) — wait for first waitlist signal on which competitors visitors mention.
- **Remaining 4 use cases** (`browser-transfer`, `local-nas-backup`, `developer-automation`, additional self-host variants) — wait for waitlist data.
- **Remaining 4–5 SEO guides** — validate format with #85+#86 first.
- **Per-page custom OG images** beyond defaults — add them when a page underperforms in social shares.

## Self-review checklist (run after writing the plan)

- [x] **Spec coverage:** every "first-build priority" page in `.claude/rules/content.md` (homepage already shipped + pricing + self-hosted + 4 use cases + 2 guides) is covered. `/developers` is included in #78 because spec section 5 lists it as a bespoke route.
- [x] **No placeholders:** every step has concrete file paths and code/copy direction. No "TBD" or "implement appropriately".
- [x] **Type consistency:** `waitlistSegment` enum matches `src/lib/validation.ts` exactly.
- [x] **Branching:** every task explicitly branches from `development` and PRs target `development`. The deploy gate (#87) is the only `development → main` PR.
- [x] **Parallelism:** after #74 merges, #75/#76/#77/#78/#80-F4/#85-G2 are all independent. #75 is independent of #74 and can land any time. The dependency tree has only one foundation gate.
- [x] **Issue count:** 1 tracking + 8 parents + 6 sub-issues = 15. Down from 40+ in Plan 1.
