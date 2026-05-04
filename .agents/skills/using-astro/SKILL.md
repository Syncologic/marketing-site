---
name: using-astro
description: Use when editing or adding `.astro` files, `src/pages/api/*` routes, `src/content/` collections, `client:*` directives, `astro:assets` images, `astro:i18n` helpers, `astro:transitions`, `prefetch` config, or sitemap/SEO meta in an Astro project. Also use when investigating slow LCP/CLS, layout shift on images, oversized client JS bundles, missing `prerender = false`, or hardcoded locale paths.
---

# Using Astro

Reference for Astro 5 best practices in this static-first marketing site. Defaults are intentional: ship HTML, hydrate islands, validate at boundaries.

## Core principle

**Static first. Hydrate the smallest island that justifies JS.** If you can't name the user benefit a script provides, don't ship the script.

## Quick reference

| Task | Use | Don't |
|---|---|---|
| Page is 100% static | No directive | `client:load` "just in case" |
| Above-fold interactive (nav, hero) | `client:load` | `client:visible` (FOUC on appear) |
| Below-fold widget | `client:visible` | `client:load` (blocks main thread) |
| Defer non-critical (newsletter, chat) | `client:idle` | `client:load` |
| Browser-only API (Web Audio, Canvas) | `client:only="<framework>"` | SSR + guards |
| Large list of cards | Astro component, no JS | React/Vue island |
| Form post → DB | `src/pages/api/*.ts` + zod | Client-side fetch w/o validation |
| Markdown/MDX content | Content collection (`defineCollection`) | Loose `.md` in `public/` |
| Remote/dynamic content | Live content collection (Astro 5) | `fetch()` in every page |
| Site nav / cross-locale link | `getRelativeLocaleUrl()` | Hardcoded `/pt-br/...` |
| Image > 0KB on disk | `<Image>` or `<Picture>` from `astro:assets` | `<img src="...">` |

## Client directives

```astro
---
import Counter from "../components/Counter.tsx";
---
{/* hydrate immediately — only for above-fold critical UI */}
<Counter client:load />

{/* hydrate when scrolled into view — default for below-fold */}
<Counter client:visible />

{/* hydrate when main thread is idle — secondary widgets */}
<Counter client:idle />

{/* hydrate at a media query — mobile-only menu, etc. */}
<Counter client:media="(max-width: 768px)" />

{/* never SSR; render only on client — for browser-only APIs */}
<Counter client:only="react" />
```

**Rule:** start without a directive. Add one only when you've named the interaction the user needs.

## API routes (server endpoints)

Every endpoint under `src/pages/api/**` MUST:

1. `export const prerender = false;`
2. Validate body with `zod` in `.strict()` mode.
3. Return JSON via a small helper for stable shape.
4. Use stable error codes (`invalid_input`, `rate_limited`, `not_found`, `server_error`) — never leak internal messages.

```ts
// src/pages/api/example.ts
import type { APIRoute } from "astro";
import { z } from "zod";

export const prerender = false;

const Body = z.object({
  email: z.string().email(),
  use_case: z.enum(["one_time_transfer", "business_migration"]),
}).strict();

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  let raw: unknown;
  try { raw = await request.json(); }
  catch { return json({ error: "invalid_input" }, 400); }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) return json({ error: "invalid_input" }, 400);

  // ... do work, return shape: { ok: true, ... } or { error: "..." }
  return json({ ok: true });
};
```

Server-only secrets (`SUPABASE_SERVICE_ROLE_KEY`, etc.) read via `import.meta.env.*` in `.ts` libs — never in `.astro` markup that hydrates.

## Content collections (Astro 5 Content Layer)

Use for blog posts, guides, use-case pages — anything authored as Markdown/MDX with frontmatter. Build-time = 5× faster than the legacy approach with type-safe frontmatter.

```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const guides = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/guides" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    locale: z.enum(["en", "pt-br"]),
  }),
});

export const collections = { guides };
```

```astro
---
// src/pages/guides/[slug].astro
import { getCollection, render } from "astro:content";
export async function getStaticPaths() {
  const entries = await getCollection("guides", (e) => e.data.locale === "en");
  return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}
const { entry } = Astro.props;
const { Content } = await render(entry);
---
<article><Content /></article>
```

Use **live content collections** only when data changes faster than build cadence (CMS, frequently-updated APIs). Otherwise keep it build-time.

## Images

Always use `<Image>` / `<Picture>` from `astro:assets` for local images. Auto-WebP, layout-shift protection, lazy by default.

```astro
---
import { Image, Picture } from "astro:assets";
import hero from "../assets/hero.png";
---
{/* above the fold: priority hints + eager */}
<Image src={hero} alt="Transfer planner" widths={[480, 800, 1200]}
       sizes="(min-width: 1024px) 1200px, 100vw" priority />

{/* below the fold: defaults are correct (lazy + async decoding) */}
<Picture src={hero} formats={["avif", "webp"]} alt="..." />
```

For remote URLs: add `image.domains` or `image.remotePatterns` in `astro.config.mjs`, then use `inferSize` if you don't know dimensions. Use `getImage()` only when you need a custom wrapper or non-HTML output.

## View transitions + prefetch

Site-wide transitions: add `<ClientRouter />` in your layout `<head>`. Prefetch is on by default with view transitions.

```astro
---
// src/components/layout/Layout.astro
import { ClientRouter } from "astro:transitions";
---
<head>
  <ClientRouter />
</head>
```

Prefetch tuning in `astro.config.mjs`:
```js
prefetch: { prefetchAll: true, defaultStrategy: "viewport" }
```

Strategies: `hover` (default), `tap`, `viewport`, `load`. Per-link: `<a href="/x" data-astro-prefetch="hover">`.

## i18n

Configure in `astro.config.mjs`:
```js
i18n: {
  locales: ["en", "pt-br"],
  defaultLocale: "en",
  routing: { prefixDefaultLocale: false },
}
```

Use the helpers — never hardcode prefixes:
```astro
---
import { getRelativeLocaleUrl } from "astro:i18n";
const ptUrl = getRelativeLocaleUrl("pt-br", "/pricing");
---
<a href={ptUrl}>Português</a>
```

`<link rel="alternate" hreflang>` lives once in the layout. Every user-facing string goes through the project's translation map (`src/i18n/*.json`), not literals in `.astro`.

## SEO essentials

- `site:` set in `astro.config.mjs` so `Astro.site` resolves.
- `@astrojs/sitemap` integration — auto sitemap from routes.
- `robots.txt` in `public/` pointing to `/sitemap-index.xml`.
- **Canonical** on every page: `<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />`.
- Open Graph + Twitter tags per page (use a `<SeoMeta />` component).
- JSON-LD where it adds value (Article, Product, FAQPage). Validate with Google's Rich Results Test.
- Per-page `<title>` and `<meta name="description">` — never reuse one across the site.

## Performance budget

- Lighthouse mobile **Performance ≥ 90** before merging a page change.
- Client JS ≤ 20KB gzipped per page.
- Images: `width`/`height` always set (CLS = 0). `loading="lazy"` below the fold (default for `<Image>`).
- One webfont family. `font-display: swap`. Subset if possible.
- No blocking third-party scripts; defer/async or move to `client:idle`.

## Common mistakes

| Mistake | Fix |
|---|---|
| `client:load` on a non-interactive component | Drop the directive — Astro components are zero-JS by default. |
| `process.env.X` in API route | Use `import.meta.env.X`. |
| Forgot `export const prerender = false;` | Endpoint becomes static at build, returns 404 in prod. Always export it. |
| `<img src={import("...")}>` | Use `<Image>` from `astro:assets` — get WebP + dimensions free. |
| Hardcoded `/pt-br/foo` link | `getRelativeLocaleUrl("pt-br", "/foo")`. |
| Loose `try/catch` around `request.json()` | Catch only the parse; return `invalid_input` 400. Don't swallow downstream errors. |
| Zod schema without `.strict()` | Unknown keys silently accepted — security/segmentation drift. Always `.strict()`. |
| Content in `public/` | Move to a content collection — get type-safe frontmatter and build optimization. |
| `client:visible` on the hero | First paint is interactive too late; use `client:load` (or no directive if it's not actually interactive). |
| New env var only in `.env.example` | Add to `import.meta.env`'s typed surface (`src/env.d.ts`) so TS catches typos. |

## Red flags — stop and reconsider

- About to add a React/Vue/Svelte runtime for a single button → use a `<script>` tag at the bottom of the `.astro` component.
- About to fetch data in a page's frontmatter on every request → it's prerendered; the fetch happens at build, not per-visitor. If you need per-visitor, that's an API route.
- About to put a secret in a `PUBLIC_*` var → it ships to the browser. Stop.
- About to add a new server endpoint outside the documented set → re-read `.claude/rules/architecture.md`. The list is intentionally exhaustive.

## Pre-merge checks

```
npm run lint    # astro check + tsc, zero errors
npm test        # vitest, all green
npm run build   # production build, clean
npm run dev     # manually verify in browser at target breakpoints
```

For API changes: hit the endpoint with `curl`, confirm contract and stable error codes.

## References

- [Astro Docs — Islands](https://docs.astro.build/en/concepts/islands/)
- [Astro Docs — Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro Docs — Images](https://docs.astro.build/en/guides/images/)
- [Astro Docs — View Transitions](https://docs.astro.build/en/guides/view-transitions/)
- [Astro Docs — Prefetch](https://docs.astro.build/en/guides/prefetch/)
- [Astro Docs — i18n Routing](https://docs.astro.build/en/guides/internationalization/)
- [Astro Docs — Routing Reference (`prerender`)](https://docs.astro.build/en/reference/routing-reference/)
- [Astro 5 — Content Layer announcement](https://astro.build/blog/astro-5/)
