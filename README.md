# Syncologic Marketing Site

Public marketing site for **Syncologic** — move files between clouds without downloading them first.

This repository contains the homepage, use-case landing pages, pricing page, and SEO guides that drive waitlist signups ahead of the product launch.

## Stack

- **[Astro](https://astro.build/)** — static-first site framework with content collections
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling, extended with the design tokens defined in [`DESIGN.md`](./DESIGN.md)
- **MDX** — content authoring for use-case pages and guides
- **[Supabase](https://supabase.com/)** — Postgres-backed waitlist storage
- **[Resend](https://resend.com/)** — transactional email
- **Vercel** — hosting (with `@astrojs/vercel` adapter), Vercel Analytics, and Vercel KV for rate limiting
- **i18n** — English (default) and Brazilian Portuguese (`/pt-br/`)

## Local development

Requires Node 20+ and Docker.

```bash
npm install
cp .env.example .env       # ships pre-filled — no edits needed
npm run db:start           # boots local Supabase (Postgres + PostgREST + Studio)
npm run dev                # http://localhost:4321
```

Supabase runs for real (Docker). KV rate-limiting uses an in-memory store; Resend is faked — sent emails land in `.local/dev-emails/*.html`.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full workflow and per-service commands.

## Project structure

```
src/
├── pages/                  # routes (English at root, Portuguese under /pt-br/)
├── content/                # MDX content collections for use-case pages and guides
├── components/             # layout, UI primitives, marketing sections, hero
├── i18n/                   # UI string dictionaries
├── lib/                    # Supabase + Resend + rate-limit clients
└── styles/                 # global CSS and Tailwind entry
```

## Documentation

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — setup, branch model, PR workflow
- [`DESIGN.md`](./DESIGN.md) — visual design system: colors, typography, components, layout principles
- [`AGENTS.md`](./AGENTS.md) — standing brief for AI agents working on this repo
- [`.agents/rules/`](./.agents/rules/) — architecture + engineering rules

## License

[MIT](./LICENSE) © 2026 Gabriel Café.

This MIT license applies ONLY to the contents of the `syncologic/marketing-site` repository (marketing pages, content, and the waitlist API). Other Syncologic repositories — including `server`, `runners`, and `clients` — are licensed separately under their own terms.

The **Syncologic** name, logo, and brand assets are not covered by this license and remain reserved. They may not be used to identify or promote any product, service, or fork without prior written permission. For brand-use requests, contact [hello@syncologic.com](mailto:hello@syncologic.com).
