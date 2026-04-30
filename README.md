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

> Setup instructions will be filled in once `package.json` and the initial scaffolding land. Until then this section is a placeholder.

```bash
npm install
cp .env.example .env       # add your Supabase / Resend / KV credentials
npm run dev                # start the dev server at http://localhost:4321
```

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

- [`DESIGN.md`](./DESIGN.md) — visual design system: colors, typography, components, layout principles
- [`docs/superpowers/specs/`](./docs/superpowers/specs/) — design specs for major features

## License

Not yet licensed. License terms will be added before the repository is opened to public contribution.
