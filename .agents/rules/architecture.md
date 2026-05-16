# Architecture

## Repo boundaries

| Belongs here | Belongs elsewhere |
|---|---|
| Marketing pages, SEO guides, bilingual content | Auth, OAuth, workspaces, jobs, schedules → `syncologic/server` |
| Waitlist API (capture + segmentation + unsubscribe) | Transfer execution, provider adapters → `syncologic/runners` |
| Email confirmation (Resend) | Web/CLI/desktop apps, generated API client → `syncologic/clients` |
| Pricing language (no actual billing) | Billing, usage, webhooks → `syncologic/server` |

If a task pulls toward anything in column 2: **stop and ask.**

## Static-first, server-minimal

The site is **99% static**. The only server endpoints are:

| Route | Method | Purpose |
|---|---|---|
| `/api/waitlist` | POST | Create signup |
| `/api/waitlist/[id]` | PATCH | Progressive segmentation (HMAC-token gated) |
| `/api/waitlist/unsubscribe` | GET | Token-based removal |

Don't add new endpoints for non-waitlist concerns. Every API route must export `export const prerender = false;`.

## Runner data paths (context for marketing copy)

Files flow **source → runner → destination**. Files do **not** flow through the server — the server is metadata-only. Don't draw diagrams that contradict this.

| Runner | Data path | Best for |
|---|---|---|
| **Cloud Runner** | source → Syncologic infra → destination | Convenience, scheduled jobs, large migrations |
| **Browser Runner** | source → user's browser tab → destination | Free / manual; tab must stay open |
| **Private Runner** | source → user's runner → destination | Privacy, homelab, business, high volume |
| **Local Helper** | local/NAS → user's machine → destination | Local backup, NAS restore. Separate codebase from Private Runner. |

In pt-BR, **"control plane" → "camada de controle"**, **"data plane" → "camada de dados"**. Brand names (Syncologic, Cloud/Browser/Private Runner) stay English.

## Tech stack (don't substitute without explicit reason)

Astro 5 static (`output: 'static'`, `@astrojs/vercel`) · TypeScript strict · Tailwind (tokens from `DESIGN.md`) · MDX content collections · Supabase Postgres · Resend · Vercel KV / Upstash Redis · Vitest · Zod · Lucide-astro · Montserrat.

## Server-only secrets

Read via `import.meta.env.*` and **must never reach the browser**:
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `WAITLIST_TOKEN_SECRET`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`.

Only `PUBLIC_*` may be referenced from `.astro` markup that hydrates or any client-side `<script>`.

## Trust boundaries

- **HMAC-sign** anything the client hands back to a privileged endpoint (`src/lib/hmac.ts`).
- **Hash IPs** before storing or keying rate limits (`hashIp` in `src/lib/ratelimit.ts`). Never store raw.
- **Honeypot** on every public form. Filled = silent 200, no DB row.
- **Rate-limit** every endpoint. Per-IP minute / hour / day.
- **Validate** every body with `zod` in `.strict()` mode.
- **Stable error codes** only (`invalid_input`, `rate_limited`, `not_found`, `already_completed`, `server_error`). Never leak internals.

## i18n

Every page works at `/<path>` (en) and `/pt-br/<path>` (pt-BR). pt-BR pages are physical sibling files, not auto-mirrors — every structural change applies to both in the same PR.

In every `.astro`: `getLocaleFromUrl(Astro.url)` to detect, `getT(locale)` for translations, `localizedPath(locale, pathname)` for cross-locale links. `<link rel="alternate" hreflang>` is set once in `Layout.astro`.

## File layout

```
src/
├── pages/              index.astro, pt-br/..., api/waitlist*
├── components/         ui/, layout/, sections/, homepage/, visuals/
├── content/            MDX collections
├── i18n/               en.json, pt-br.json, utils.ts
├── lib/                supabase, resend, ratelimit, hmac, validation
└── styles/global.css
```

Tests live under `src/**/__tests__/`.
