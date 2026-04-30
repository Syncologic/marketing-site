# Architecture Rules

This file is the **authoritative source** for repo strategy, boundaries, and runtime architecture. The original `syncologic_repository_architecture_proposal.md` was distilled into this document and removed.

## What this repo is — and isn't

`syncologic/marketing-site` is the **first public surface** for Syncologic. It exists to:
- Validate positioning ("Move files between clouds without downloading them first").
- Capture **segmented waitlist signups**.
- Host SEO content that routes visitors to the right use case.

It is **not**:
- The product.
- The control plane.
- A runner.
- A client app.
- A design-system package.
- An SDK.

## Org-level repo strategy

The team is small (1–2 maintainers). Splitting too early is the failure mode. The rule:

> Split a repo only when it has a different release cycle, different security boundary, or different maintainer audience.

Don't split because code *could* be categorized separately.

### The four product repos (target structure)

| Repository | Start? | Owns | Why this repo exists |
|---|---|---|---|
| `syncologic/marketing-site` | **Now (this repo)** | Homepage, waitlist, pricing language, SEO pages | First business priority. Deploys independently from app/server. |
| `syncologic/server` | Phase 2 | Auth, workspaces, provider connections, jobs, runs, schedules, logs, billing, runner registration, OpenAPI contracts | Control plane. Owns product state and orchestration. Does NOT move file bytes. |
| `syncologic/runners` | Phase 3 | Cloud Runner, Private Runner, Browser Runner, transfer core, provider adapters, conformance tests | Data plane. All transfer execution. Source-visible for trust. |
| `syncologic/clients` | Phase 4 | Web app first; CLI later; desktop shell only if validated. Generated API client. | User-facing surfaces. Together until one client outgrows the others. |

Plus optionally `syncologic/.github` for org profile and templates.

### Repos explicitly NOT to create now

| Avoid | Reason |
|---|---|
| `api-contracts` | Keep OpenAPI inside `server/contracts/` until external consumers need versioned specs. |
| `sdk-js`, `sdk-go` | SDKs add support promises. Use generated internal clients first. |
| `browser-runner-sdk` | Browser runner is an internal engine, not a public SDK. Belongs in `runners`. |
| `desktop-agent` | Reuse the Private Runner binary. Add a desktop shell only when local-folder demand is real. |
| `provider-kit` | Start as a package inside `runners`. Split only if external provider authors appear. |
| `design-system` | Use local components inside `marketing-site` and `clients/web` for now. |
| `docs` | Early docs live in `marketing-site` or near code. Split only when docs are a product surface. |
| `self-host` | Start under `server/deploy/self-host/`. Split when self-host releases need independent versioning. |
| `examples`, `secrets`, `customer-data`, `backend-private`, `runner-private` | Wrong tool. Secrets go in a secret manager, not Git. Core code stays public for the source-visible trust story. |

### Greenfield build order

| Phase | Goal | Repos |
|---|---|---|
| 1 (now) | Validate positioning + capture segmented waitlist | `marketing-site` |
| 2 | Define source of truth for product state | `server` (auth, workspaces, OpenAPI, schema, runner registration) |
| 3 | Prove data plane can move bytes reliably | `runners` (transfer core, first provider pair, Cloud + Private Runner paths, conformance tests) |
| 4 | Let users run real transfers | `clients/apps/web` + `clients/packages/api-client` |
| 5 | Add only what demand proves | CLI, Local Runner Mode, Browser Runner, self-host assets, docs |

Don't create SDK / desktop / provider-kit / design-system / api-contracts repos until usage justifies them.

## Repo boundaries (non-negotiable while in this repo)

| Belongs here | Belongs in `server` | Belongs in `runners` | Belongs in `clients` |
|---|---|---|---|
| Marketing pages | Auth | Transfer execution | Web app |
| Waitlist API (capture + segmentation + unsubscribe) | OAuth / provider connections | Provider adapters | CLI |
| SEO guides | Workspaces / membership | Capability metadata | Desktop shell |
| Bilingual content (en + pt-BR) | Jobs / schedules / runs | Cloud Runner | Generated API client |
| Email confirmation (Resend) | Runner registration / leases | Browser Runner | Shared UI package |
| Pricing language (no actual billing) | Billing / usage / metering | Private Runner | |
| | Webhook delivery | Local Runner Mode | |
| | Audit logs | Conformance tests | |

If a task pulls toward anything in columns 2–4: **stop and ask.** The split is intentional.

## Runtime architecture (so we know the world we're marketing)

```
Marketing Site
  └─ waitlist, pricing, SEO, positioning

Clients
  └─ web app  → CLI later  → desktop shell only if validated

Server (control plane)
  └─ auth, workspaces, provider connections, jobs, schedules, run dispatch,
     logs, reports, usage, billing, webhooks

Runners (data plane)
  └─ Cloud Runner, Private Runner, Browser Runner, Local Runner Mode

Storage Providers
  └─ Google Drive, OneDrive, Dropbox, S3-compatible, SFTP, WebDAV, Nextcloud
```

### Runtime flow (for context when writing copy or visuals)

```
User creates job in client
  → client calls server API
  → server validates workspace, connections, quota, schedule, permissions
  → server writes job + run intent to Postgres
  → server selects runner type
  → runner receives short-lived run lease
  → runner transfers files DIRECTLY between source and destination providers
  → runner emits progress events to server
  → server stores normalized logs, reports, usage
  → server sends webhooks / email / UI updates
```

**Critical point for marketing visuals:** files flow source → runner → destination. Files do **not** flow through the server. The server is metadata-only. Don't draw diagrams that contradict this.

### Runner data paths (for "Three ways to run a transfer" sections)

| Runner | Data path | Best for | Notes |
|---|---|---|---|
| **Cloud Runner** | source provider → Syncologic infra → destination provider | Convenience, scheduled jobs, large migrations | Paid feature. Strict isolation, short-lived credentials, log redaction. |
| **Browser Runner** ("This Device") | source provider → user's browser tab → destination provider | Free / manual, trust story | Tab must stay open. No long-lived token storage. |
| **Private Runner** (self-hosted runner) | source provider → user's runner → destination provider | Privacy, homelab, business, high volume | Outbound connection to control plane. User controls where bytes flow. |
| **Local Runner Mode** | local path / NAS → user's machine → destination | Local backup, NAS restore | Reuses Private Runner binary. |

## Static-first, server-minimal

The site is **99% static**. The only server endpoints in this repo are:

| Route | Method | Purpose |
|---|---|---|
| `/api/waitlist` | POST | Create signup |
| `/api/waitlist/[id]` | PATCH | Progressive segmentation (HMAC-token gated) |
| `/api/waitlist/unsubscribe` | GET | Token-based removal |

Don't add new server endpoints for non-waitlist concerns. If a feature needs more server logic, it belongs in `syncologic/server`, not here.

Every API route must export `export const prerender = false;`.

## Tech stack (don't substitute without explicit reason)

- **Astro 4+** static-first, `output: 'static'`, `@astrojs/vercel` adapter
- **TypeScript** strict (`astro/tsconfigs/strict`), no `any`
- **Tailwind** with tokens from `DESIGN.md`
- **MDX** via Astro content collections (use-cases + guides)
- **Supabase** Postgres, server-only via secret/service-role key
- **Resend** for transactional email
- **Vercel KV / Upstash Redis** for IP-keyed rate limiting
- **Vitest** for `src/lib/*` and `src/i18n/utils.ts`
- **Zod** for boundary validation
- **Lucide-astro** for icons
- **Montserrat** via Google Fonts

## Server-only secrets

These are read via `import.meta.env.*` and **must never reach the browser**:
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `WAITLIST_TOKEN_SECRET`
- `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`

Only `PUBLIC_*`-prefixed variables may be referenced from `.astro` markup that hydrates or any client-side `<script>`.

## Trust boundaries

- **HMAC-sign anything the client will hand back** to a privileged endpoint. The waitlist row token is the canonical example (`src/lib/hmac.ts`).
- **Hash IPs** before storing or keying rate limits (`hashIp` in `src/lib/ratelimit.ts`). Never store raw IPs.
- **Honeypot** field on every public form. Silent success on fill (no DB row).
- **Rate-limit every server endpoint.** Per-IP minute / hour / day budgets.
- **Validate every body** with `zod`, `.strict()` mode (reject unknown keys).
- **Stable error codes** (`invalid_input`, `rate_limited`, `not_found`, `already_completed`, `server_error`). Never leak internal messages.

## File layout

```
src/
├── pages/
│   ├── index.astro
│   ├── pt-br/...               # mirrors English structure
│   └── api/waitlist*           # only server endpoints
├── components/
│   ├── ui/                     # primitives (Button, Card, Input, Section, ProviderLogo)
│   ├── layout/                 # Layout, Nav, Footer
│   ├── sections/               # composable page sections
│   └── homepage/               # homepage-only components
├── content/                    # MDX collections (Plan 2)
├── i18n/                       # en.json, pt-br.json, utils.ts
├── lib/                        # supabase, resend, ratelimit, hmac, validation
└── styles/global.css
```

Tests live next to the code under `src/**/__tests__/`.

## i18n is mandatory

Every page must work at `/<path>` (en) and `/pt-br/<path>` (pt-BR). 10 pages × 2 locales = 20 routes at full launch.

In every `.astro`:
- `getLocaleFromUrl(Astro.url)` to detect.
- `getT(locale)` for translations — never hardcode user-facing strings.
- `localizedPath(locale, pathname)` for cross-locale links.
- `<link rel="alternate" hreflang>` is set in `Layout.astro` — don't reimplement.

When adding a key to `en.json`, add it to `pt-br.json` in the same commit. Plan 3 will replace placeholder pt-BR with real translations.

## When to revisit splits (future-only)

These are decision criteria for **future** repo splits — not invitations to split now.

- **`api-contracts`** — split when external developers depend on versioned schemas, or webhooks need public compatibility guarantees, or SDK generation becomes a release process.
- **`self-host`** — split when self-host releases need pinned versions across server/runners/clients or community fixes pile up.
- **`docs`** — split when docs are a product surface with frequent non-code edits.
- **`provider-kit`** — split when external provider contributors arrive or browser+Go runners need shared generated metadata.
- **`clients`** — split when CLI or desktop has a mature standalone release cadence.
- **`runners`** — split when browser and Go runners have different teams or release cycles.

## Private repos (org-level, for context)

Private repos exist for **operations and business material**, not to hide product code. The trust story is source-visible.

- `syncologic/ops-private` — production runbooks, infra-as-code state, alert routing, incident checklists.
- `syncologic/security-private` — embargoed vulnerabilities, raw pentest reports.
- `syncologic/business-private` — pricing experiments, financial models, investor material.

Never private: core server code, runner code, public install docs, secrets (use a secret manager), customer data.

## When in doubt

- **"Should this live here?"** → check the boundary table above.
- **"What server endpoint do I need?"** → probably none. The list above is exhaustive for now.
- **"Can I add a new dependency?"** → ask. The stack is intentionally small.
- **"Should we split this into a new repo?"** → almost certainly no. Re-read the split criteria above.
