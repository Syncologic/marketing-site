# Foundation & Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a functional Syncologic marketing-site homepage at `/` with a working waitlist backend (Supabase + Resend), the animated transfer-planner hero, and the full design system in place — ready to receive real signups.

**Architecture:** Astro 4 static-first site deployed on Vercel using `@astrojs/vercel`. Tailwind extends `DESIGN.md` design tokens. Single server endpoint for waitlist (`POST /api/waitlist`), with progressive segmentation via `PATCH /api/waitlist/:id` and unsubscribe via `GET /api/waitlist/unsubscribe`. Postgres via Supabase (server-only access through service-role key). Resend sends transactional confirmation emails. Vercel KV provides per-IP rate limiting. i18n routing wired but only English content shipped in this plan.

**Tech Stack:** Astro 4+, TypeScript, Tailwind CSS, MDX, Vitest, `@astrojs/vercel`, `@astrojs/tailwind`, `@astrojs/sitemap`, `@supabase/supabase-js`, `@vercel/kv`, `resend`, `zod`, Lucide icons.

---

## Prerequisites (engineer-side, before Task 1)

- [ ] Node.js 20+ installed locally.
- [ ] Vercel account with project linked to this repo (Vercel CLI logged in: `vercel login`).
- [ ] Supabase project created (`syncologic-marketing`) with project URL and service-role key in hand.
- [ ] Resend account created with a verified sender domain (or use Resend's default `onboarding@resend.dev` for development). API key in hand.
- [ ] Vercel KV database created in the Vercel dashboard, with REST URL and tokens in hand.
- [ ] Generate a 32-byte hex secret for HMAC: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Save it.

After scaffolding (Task 1) the engineer creates `.env` from `.env.example` and fills in:

```
PUBLIC_SITE_URL=http://localhost:4321
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Syncologic <hi@syncologic.com>
WAITLIST_TOKEN_SECRET=<32-byte hex from above>
KV_REST_API_URL=https://...vercel-storage.com
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

## File Structure (created by this plan)

```
marketing-site/
├── astro.config.mjs                              # Task 2
├── tailwind.config.mjs                           # Task 3
├── tsconfig.json                                 # Task 1
├── package.json                                  # Task 1
├── vitest.config.ts                              # Task 7
├── .env.example                                  # Task 1
├── public/
│   └── assets/brand/                             # Task 1 (copied from /assets)
├── supabase/
│   └── migrations/
│       └── 20260429000000_waitlist.sql           # Task 13
├── src/
│   ├── env.d.ts                                  # Task 1
│   ├── pages/
│   │   ├── index.astro                           # Task 28
│   │   └── api/
│   │       ├── waitlist.ts                       # Task 19
│   │       ├── waitlist/[id].ts                  # Task 20
│   │       └── waitlist/unsubscribe.ts           # Task 21
│   ├── content/
│   │   └── config.ts                             # placeholder (empty config) — Task 1
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.astro                      # Task 11
│   │   │   ├── Nav.astro                         # Task 12
│   │   │   └── Footer.astro                      # Task 13b
│   │   ├── ui/
│   │   │   ├── Button.astro                      # Task 5
│   │   │   ├── Card.astro                        # Task 6
│   │   │   ├── Input.astro                       # Task 7
│   │   │   ├── Section.astro                     # Task 8
│   │   │   └── ProviderLogo.astro                # Task 9
│   │   ├── sections/
│   │   │   ├── ProviderRow.astro                 # Task 25
│   │   │   ├── RunnerCards.astro                 # Task 25
│   │   │   ├── UseCaseRouter.astro               # Task 25
│   │   │   ├── TrustStory.astro                  # Task 25
│   │   │   └── WaitlistForm.astro                # Tasks 22–24
│   │   └── homepage/
│   │       └── TransferPlanner.astro             # Task 26
│   ├── i18n/
│   │   ├── en.json                               # Task 4
│   │   ├── pt-br.json                            # Task 4 (English copy as placeholder; Plan 3 fills in)
│   │   └── utils.ts                              # Task 4
│   ├── lib/
│   │   ├── supabase.ts                           # Task 14
│   │   ├── resend.ts                             # Task 15
│   │   ├── ratelimit.ts                          # Task 16
│   │   ├── hmac.ts                               # Task 17
│   │   └── validation.ts                         # Task 18
│   ├── lib/
│   │   ├── __tests__/hmac.test.ts                # Task 17
│   │   └── __tests__/validation.test.ts          # Task 18
│   └── styles/
│       └── global.css                            # Task 3
└── docs/superpowers/plans/                       # this file (already exists)
```

---

## Task 1: Initialize Astro project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs` (initial)
- Create: `tsconfig.json`
- Create: `src/env.d.ts`
- Create: `src/content/config.ts`
- Create: `.env.example`
- Modify: `public/assets/brand/` (copy from `/assets`)

- [ ] **Step 1: Run the Astro init command (non-interactive, manual config)**

```bash
npm create astro@latest -- . --template minimal --typescript strict --install --no-git --skip-houston
```

If the command refuses because the directory is non-empty (it has `DESIGN.md`, `assets/`, `docs/`, `README.md`), instead create files manually using the steps below.

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "syncologic-marketing-site",
  "type": "module",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "astro check",
    "format": "prettier --write \"**/*.{astro,ts,tsx,js,jsx,md,mdx,json}\""
  },
  "dependencies": {
    "@astrojs/check": "^0.9.4",
    "@astrojs/mdx": "^4.0.0",
    "@astrojs/sitemap": "^3.2.0",
    "@astrojs/tailwind": "^6.0.0",
    "@astrojs/vercel": "^8.0.0",
    "@supabase/supabase-js": "^2.45.0",
    "@vercel/kv": "^3.0.0",
    "astro": "^5.0.0",
    "lucide-astro": "^0.460.0",
    "resend": "^4.0.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.6.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "prettier": "^3.3.0",
    "prettier-plugin-astro": "^0.14.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create `src/env.d.ts`**

```ts
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
  readonly SUPABASE_URL: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly RESEND_API_KEY: string;
  readonly RESEND_FROM_EMAIL: string;
  readonly WAITLIST_TOKEN_SECRET: string;
  readonly KV_REST_API_URL: string;
  readonly KV_REST_API_TOKEN: string;
  readonly KV_REST_API_READ_ONLY_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

- [ ] **Step 5: Create empty `src/content/config.ts` placeholder**

```ts
import { defineCollection } from 'astro:content';

// Collections will be added in Plan 2 (use-cases, guides).
export const collections = {};
```

- [ ] **Step 6: Create `.env.example`**

```
# Public — exposed to the browser
PUBLIC_SITE_URL=http://localhost:4321

# Supabase — server-only
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Resend — server-only
RESEND_API_KEY=
RESEND_FROM_EMAIL=Syncologic <hi@syncologic.com>

# HMAC secret for waitlist PATCH auth — server-only
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
WAITLIST_TOKEN_SECRET=

# Vercel KV — server-only
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
```

- [ ] **Step 7: Copy brand assets to public**

```bash
mkdir -p public/assets/brand
cp assets/transparent_icon_for_black.png public/assets/brand/icon-black.png
cp assets/transparent_icon_for_white.png public/assets/brand/icon-white.png
cp assets/logo_for_black.png public/assets/brand/logo-black.png
cp assets/logo_for_white.png public/assets/brand/logo-white.png
```

- [ ] **Step 8: Install dependencies**

Run: `npm install`
Expected: completes with no critical errors. Warnings about peer deps are OK.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json tsconfig.json src/env.d.ts src/content/config.ts .env.example public/assets/
git commit -m "chore: scaffold Astro project + copy brand assets"
```

---

## Task 2: Configure Astro (i18n + Vercel adapter + integrations)

**Files:**
- Create: `astro.config.mjs`

- [ ] **Step 1: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'http://localhost:4321',
  output: 'static',
  adapter: vercel({ webAnalytics: { enabled: true } }),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt-br'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
      fallbackType: 'redirect',
    },
    fallback: { 'pt-br': 'en' },
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', 'pt-br': 'pt-BR' },
      },
    }),
  ],
});
```

- [ ] **Step 2: Verify config parses**

Run: `npx astro check`
Expected: no errors. (Project has no source pages yet, so check should be clean.)

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "chore: configure Astro with i18n, Tailwind, MDX, Vercel adapter"
```

---

## Task 3: Configure Tailwind with DESIGN.md tokens

**Files:**
- Create: `tailwind.config.mjs`
- Create: `src/styles/global.css`

- [ ] **Step 1: Write `tailwind.config.mjs`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'brand-blue': {
          DEFAULT: '#0064E0',
          hover: '#0143B5',
          pressed: '#004BB9',
          light: '#47A5FA',
        },
        'dark-charcoal': '#1C2B33',
        'slate-gray': '#5D6C7B',
        'soft-gray': '#F1F4F7',
        'warm-gray': '#F7F8FA',
        'baby-blue': '#E8F3FF',
        'near-black': '#1C1E21',
        'divider': '#DEE3E9',
        'cta-disabled': '#DEE3E9',
        'cta-disabled-text': '#8595A4',
        'success': '#007D1E',
        'success-bg': 'rgba(0,125,30,0.08)',
        'error': '#C80A28',
        'error-bg': 'rgba(200,10,40,0.08)',
        'warning': '#F7B928',
      },
      fontFamily: {
        sans: ['Montserrat', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['64px', { lineHeight: '1.16', fontWeight: '500' }],
        'display-2': ['48px', { lineHeight: '1.17', fontWeight: '500' }],
        'h1':        ['36px', { lineHeight: '1.28', fontWeight: '500' }],
        'h2':        ['28px', { lineHeight: '1.21', fontWeight: '300' }],
        'h3':        ['18px', { lineHeight: '1.44', fontWeight: '700' }],
        'body':      ['18px', { lineHeight: '1.44', fontWeight: '400' }],
        'compact':   ['16px', { lineHeight: '1.50', fontWeight: '500', letterSpacing: '-0.01em' }],
        'caption':   ['14px', { lineHeight: '1.43', fontWeight: '400', letterSpacing: '-0.01em' }],
        'small':     ['12px', { lineHeight: '1.33', fontWeight: '400' }],
      },
      borderRadius: {
        'input': '8px',
        'card': '20px',
        'feature': '24px',
        'pill': '100px',
      },
      spacing: {
        'section-sm': '48px',
        'section': '64px',
        'section-lg': '80px',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0,0,0,0.10)',
        'card-elevated': '0 12px 28px rgba(0,0,0,0.20), 0 2px 4px rgba(0,0,0,0.10)',
      },
      maxWidth: {
        container: '1440px',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Write `src/styles/global.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: theme('fontFamily.sans');
    color: theme('colors.dark-charcoal');
    background: theme('colors.white');
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    margin: 0;
  }

  *:focus-visible {
    outline: 3px solid theme('colors.brand-blue.DEFAULT');
    outline-offset: 2px;
    border-radius: 4px;
  }
}

@layer utilities {
  .container-wide {
    max-width: theme('maxWidth.container');
    margin-inline: auto;
    padding-inline: 24px;
  }

  @media (min-width: 1024px) {
    .container-wide {
      padding-inline: 40px;
    }
  }
}

/* Site-wide reduced motion: disables non-essential animation */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.mjs src/styles/global.css
git commit -m "chore: configure Tailwind with DESIGN.md tokens + global styles"
```

---

## Task 4: Set up i18n infrastructure

**Files:**
- Create: `src/i18n/en.json`
- Create: `src/i18n/pt-br.json`
- Create: `src/i18n/utils.ts`

- [ ] **Step 1: Write `src/i18n/en.json`**

```json
{
  "site": {
    "name": "Syncologic",
    "tagline": "Move files between clouds without downloading them first."
  },
  "nav": {
    "useCases": "Use cases",
    "pricing": "Pricing",
    "selfHosted": "Self-hosted",
    "developers": "Developers",
    "joinWaitlist": "Join the waitlist",
    "menu": "Menu",
    "close": "Close"
  },
  "footer": {
    "product": "Product",
    "resources": "Resources",
    "company": "Company",
    "copyright": "© {year} Syncologic"
  },
  "language": {
    "label": "Language",
    "en": "English",
    "pt-br": "Português (Brasil)"
  },
  "waitlist": {
    "emailLabel": "Email",
    "emailPlaceholder": "you@example.com",
    "submit": "Join the waitlist",
    "submitting": "Joining…",
    "success": "✓ You're on the list",
    "errorNetwork": "Couldn't reach the server. Try again?",
    "errorRate": "Slow down — try again in a minute.",
    "step2Title": "Help us build this for you",
    "step2Skip": "Skip — finish later",
    "step2Done": "Done",
    "questionUseCase": "What are you trying to move?",
    "questionSourceProvider": "Where do the files live now?",
    "questionDestProvider": "Where do they need to go?",
    "questionSize": "How much data?",
    "questionFrequency": "How often?",
    "questionRunner": "Where should the transfer run?",
    "questionRole": "Which best describes you?"
  },
  "providers": {
    "googleDrive": "Google Drive",
    "oneDrive": "OneDrive",
    "dropbox": "Dropbox",
    "s3": "S3-compatible storage",
    "sftp": "SFTP",
    "webdav": "WebDAV",
    "nextcloud": "Nextcloud",
    "other": "Other"
  },
  "runners": {
    "cloud": { "name": "Cloud Runner", "tagline": "Hosted convenience" },
    "browser": { "name": "Browser Runner", "tagline": "Run it in a tab" },
    "private": { "name": "Private Runner", "tagline": "Your machine, your bandwidth" }
  }
}
```

- [ ] **Step 2: Write `src/i18n/pt-br.json` (English copy as placeholder)**

```json
{
  "site": {
    "name": "Syncologic",
    "tagline": "Move files between clouds without downloading them first."
  },
  "nav": {
    "useCases": "Use cases",
    "pricing": "Pricing",
    "selfHosted": "Self-hosted",
    "developers": "Developers",
    "joinWaitlist": "Join the waitlist",
    "menu": "Menu",
    "close": "Close"
  },
  "footer": {
    "product": "Product",
    "resources": "Resources",
    "company": "Company",
    "copyright": "© {year} Syncologic"
  },
  "language": {
    "label": "Language",
    "en": "English",
    "pt-br": "Português (Brasil)"
  },
  "waitlist": {
    "emailLabel": "Email",
    "emailPlaceholder": "you@example.com",
    "submit": "Join the waitlist",
    "submitting": "Joining…",
    "success": "✓ You're on the list",
    "errorNetwork": "Couldn't reach the server. Try again?",
    "errorRate": "Slow down — try again in a minute.",
    "step2Title": "Help us build this for you",
    "step2Skip": "Skip — finish later",
    "step2Done": "Done",
    "questionUseCase": "What are you trying to move?",
    "questionSourceProvider": "Where do the files live now?",
    "questionDestProvider": "Where do they need to go?",
    "questionSize": "How much data?",
    "questionFrequency": "How often?",
    "questionRunner": "Where should the transfer run?",
    "questionRole": "Which best describes you?"
  },
  "providers": {
    "googleDrive": "Google Drive",
    "oneDrive": "OneDrive",
    "dropbox": "Dropbox",
    "s3": "S3-compatible storage",
    "sftp": "SFTP",
    "webdav": "WebDAV",
    "nextcloud": "Nextcloud",
    "other": "Other"
  },
  "runners": {
    "cloud": { "name": "Cloud Runner", "tagline": "Hosted convenience" },
    "browser": { "name": "Browser Runner", "tagline": "Run it in a tab" },
    "private": { "name": "Private Runner", "tagline": "Your machine, your bandwidth" }
  }
}
```

(Plan 3 will replace this with proper Brazilian Portuguese translations.)

- [ ] **Step 3: Write `src/i18n/utils.ts`**

```ts
import en from './en.json';
import ptBr from './pt-br.json';

export type Locale = 'en' | 'pt-br';
export const LOCALES: Locale[] = ['en', 'pt-br'];
export const DEFAULT_LOCALE: Locale = 'en';

const dictionaries: Record<Locale, unknown> = { en, 'pt-br': ptBr };

export function getLocaleFromUrl(url: URL): Locale {
  const segments = url.pathname.split('/').filter(Boolean);
  if (segments[0] === 'pt-br') return 'pt-br';
  return 'en';
}

export function pathWithoutLocale(pathname: string): string {
  if (pathname.startsWith('/pt-br/')) return pathname.slice('/pt-br'.length);
  if (pathname === '/pt-br') return '/';
  return pathname;
}

export function localizedPath(locale: Locale, pathname: string): string {
  const stripped = pathWithoutLocale(pathname);
  if (locale === 'en') return stripped;
  return stripped === '/' ? '/pt-br/' : `/pt-br${stripped}`;
}

function lookup(dict: unknown, key: string): string {
  return key.split('.').reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === 'object' && segment in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, dict) as string | undefined ?? key;
}

function interpolate(value: string, vars: Record<string, string | number>): string {
  return value.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`));
}

export function getT(locale: Locale) {
  const dict = dictionaries[locale];
  return (key: string, vars?: Record<string, string | number>): string => {
    const value = lookup(dict, key);
    return vars ? interpolate(value, vars) : value;
  };
}
```

- [ ] **Step 4: Commit**

```bash
git add src/i18n/
git commit -m "feat(i18n): add string dictionaries and t() helper"
```

---

## Task 5: UI primitive — Button

**Files:**
- Create: `src/components/ui/Button.astro`

- [ ] **Step 1: Write `src/components/ui/Button.astro`**

```astro
---
type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  variant?: Variant;
  size?: Size;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  class?: string;
  ariaLabel?: string;
}

const {
  variant = 'primary',
  size = 'md',
  href,
  type = 'button',
  disabled = false,
  class: extra = '',
  ariaLabel,
} = Astro.props;

const base = 'inline-flex items-center justify-center rounded-pill font-medium transition-all duration-200 focus-visible:outline-none disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-blue text-white hover:bg-brand-blue-hover active:bg-brand-blue-pressed disabled:bg-cta-disabled disabled:text-cta-disabled-text',
  secondary: 'bg-transparent text-dark-charcoal border-2 border-[rgba(10,19,23,0.12)] hover:bg-[rgba(70,90,105,0.08)]',
  ghost: 'bg-transparent text-brand-blue hover:underline',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-caption',
  md: 'px-[22px] py-[10px] text-caption',
  lg: 'px-7 py-3 text-compact',
};

const classes = [base, variants[variant], sizes[size], extra].join(' ');
const Tag = href ? 'a' : 'button';
---

<Tag
  class={classes}
  href={href}
  type={!href ? type : undefined}
  disabled={!href ? disabled : undefined}
  aria-label={ariaLabel}
  aria-disabled={disabled ? 'true' : undefined}
>
  <slot />
</Tag>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Button.astro
git commit -m "feat(ui): add Button primitive with primary/secondary/ghost variants"
```

---

## Task 6: UI primitive — Card

**Files:**
- Create: `src/components/ui/Card.astro`

- [ ] **Step 1: Write `src/components/ui/Card.astro`**

```astro
---
type Radius = 'card' | 'feature';
type Elevation = 'flat' | 'card' | 'elevated';

interface Props {
  radius?: Radius;
  elevation?: Elevation;
  class?: string;
  as?: 'div' | 'article' | 'section';
}

const { radius = 'card', elevation = 'flat', class: extra = '', as = 'div' } = Astro.props;

const radii: Record<Radius, string> = {
  card: 'rounded-card',
  feature: 'rounded-feature',
};

const elevations: Record<Elevation, string> = {
  flat: '',
  card: 'shadow-card',
  elevated: 'shadow-card-elevated',
};

const classes = ['bg-white border border-divider', radii[radius], elevations[elevation], extra].join(' ');
const Tag = as;
---

<Tag class={classes}><slot /></Tag>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Card.astro
git commit -m "feat(ui): add Card primitive with elevation variants"
```

---

## Task 7: UI primitive — Input + Vitest config

**Files:**
- Create: `src/components/ui/Input.astro`
- Create: `vitest.config.ts`

- [ ] **Step 1: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.ts'],
    globals: false,
  },
  resolve: {
    alias: { '@': '/src' },
  },
});
```

- [ ] **Step 2: Write `src/components/ui/Input.astro`**

```astro
---
interface Props {
  type?: 'text' | 'email' | 'tel';
  name: string;
  id?: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  autocomplete?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  class?: string;
}

const {
  type = 'text',
  name,
  id,
  placeholder,
  value,
  required,
  autocomplete,
  ariaLabel,
  ariaDescribedBy,
  ariaInvalid,
  class: extra = '',
} = Astro.props;

const classes = [
  'w-full px-4 py-3 bg-white border border-divider rounded-input text-compact text-dark-charcoal',
  'placeholder:text-slate-gray',
  'focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 focus:outline-none',
  'aria-[invalid=true]:border-error aria-[invalid=true]:ring-error/30',
  'transition-colors duration-200',
  extra,
].join(' ');
---

<input
  type={type}
  name={name}
  id={id ?? name}
  placeholder={placeholder}
  value={value}
  required={required}
  autocomplete={autocomplete}
  aria-label={ariaLabel}
  aria-describedby={ariaDescribedBy}
  aria-invalid={ariaInvalid ? 'true' : undefined}
  class={classes}
/>
```

- [ ] **Step 3: Run vitest sanity check**

Run: `npm test`
Expected: "No test files found, exiting with code 0" (no tests yet — that's fine for now).

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts src/components/ui/Input.astro
git commit -m "feat(ui): add Input primitive + vitest config"
```

---

## Task 8: UI primitive — Section (surface-aware wrapper)

**Files:**
- Create: `src/components/ui/Section.astro`

- [ ] **Step 1: Write `src/components/ui/Section.astro`**

```astro
---
type Surface = 'white' | 'soft' | 'dark';
type Padding = 'sm' | 'md' | 'lg';

interface Props {
  surface?: Surface;
  padding?: Padding;
  class?: string;
  id?: string;
  as?: 'section' | 'div' | 'header' | 'footer';
}

const { surface = 'white', padding = 'lg', class: extra = '', id, as = 'section' } = Astro.props;

const surfaces: Record<Surface, string> = {
  white: 'bg-white text-dark-charcoal',
  soft: 'bg-soft-gray text-dark-charcoal',
  dark: 'bg-near-black text-white',
};

const paddings: Record<Padding, string> = {
  sm: 'py-section-sm',
  md: 'py-section',
  lg: 'py-section-lg',
};

const classes = [surfaces[surface], paddings[padding], extra].join(' ');
const Tag = as;
---

<Tag id={id} class={classes} data-surface={surface}>
  <div class="container-wide">
    <slot />
  </div>
</Tag>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Section.astro
git commit -m "feat(ui): add surface-aware Section wrapper"
```

---

## Task 9: ProviderLogo component

**Files:**
- Create: `src/components/ui/ProviderLogo.astro`

- [ ] **Step 1: Write `src/components/ui/ProviderLogo.astro`**

```astro
---
type ProviderId = 'google-drive' | 'onedrive' | 'dropbox' | 's3' | 'sftp' | 'webdav' | 'nextcloud';

interface Props {
  provider: ProviderId;
  size?: number;
  class?: string;
}

const { provider, size = 24, class: extra = '' } = Astro.props;
const dim = `${size}px`;
---

{provider === 'google-drive' && (
  <svg width={dim} height={dim} viewBox="0 0 24 24" class={extra} role="img" aria-label="Google Drive">
    <path fill="#0066DA" d="M2.5 16.5L4 19l3 1.5h10l3-1.5 1.5-2.5h-19z" />
    <path fill="#00AC47" d="M7 4.5L2.5 12.5l2.5 4 5-9z" />
    <path fill="#EA4335" d="M17 4.5h-5l5 9 4-7z" />
    <path fill="#FFBA00" d="M12 4.5L7 13l5 9 5-9z" opacity="0" />
  </svg>
)}

{provider === 'onedrive' && (
  <svg width={dim} height={dim} viewBox="0 0 24 24" class={extra} role="img" aria-label="OneDrive">
    <path fill="#0078D4" d="M14 8a5 5 0 0 0-9.6 1.7A4 4 0 0 0 5 17h13a3 3 0 0 0 .4-6 5 5 0 0 0-4.4-3z" />
  </svg>
)}

{provider === 'dropbox' && (
  <svg width={dim} height={dim} viewBox="0 0 24 24" class={extra} role="img" aria-label="Dropbox">
    <path fill="#0061FF" d="M6 4l6 4-6 4-6-4zm12 0l6 4-6 4-6-4zm-12 9l6 4-6 4-6-4zm12 0l6 4-6 4-6-4zM6 18l6-4 6 4-6 4z" transform="scale(0.5) translate(12 4)" />
    <path fill="#0061FF" d="M3 6l4.5 3-4.5 3-4.5-3zm9 0l4.5 3-4.5 3-4.5-3zm-9 6l4.5 3-4.5 3-4.5-3zm9 0l4.5 3-4.5 3-4.5-3zm-4.5 6l4.5-3 4.5 3-4.5 3z" transform="translate(4.5)" />
  </svg>
)}

{provider === 's3' && (
  <svg width={dim} height={dim} viewBox="0 0 24 24" class={extra} role="img" aria-label="S3-compatible storage">
    <rect width="24" height="24" rx="6" fill="#FF9900" />
    <text x="12" y="16" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="700" font-size="11">S3</text>
  </svg>
)}

{provider === 'sftp' && (
  <svg width={dim} height={dim} viewBox="0 0 24 24" class={extra} role="img" aria-label="SFTP">
    <rect width="24" height="24" rx="6" fill="#5D6C7B" />
    <path fill="white" d="M7 9h10v2H7zM7 13h10v2H7z" />
  </svg>
)}

{provider === 'webdav' && (
  <svg width={dim} height={dim} viewBox="0 0 24 24" class={extra} role="img" aria-label="WebDAV">
    <rect width="24" height="24" rx="6" fill="#1C2B33" />
    <text x="12" y="15.5" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="700" font-size="9">DAV</text>
  </svg>
)}

{provider === 'nextcloud' && (
  <svg width={dim} height={dim} viewBox="0 0 24 24" class={extra} role="img" aria-label="Nextcloud">
    <rect width="24" height="24" rx="6" fill="#0082C9" />
    <path fill="white" d="M9 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm6 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" opacity="0.9" />
  </svg>
)}
```

(These are simplified placeholder logos. They can be replaced with the providers' official SVG marks during polish — for now they communicate which provider is which.)

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/ProviderLogo.astro
git commit -m "feat(ui): add ProviderLogo with 7 providers"
```

---

## Task 10: i18n utils — unit tests

**Files:**
- Create: `src/i18n/__tests__/utils.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { getLocaleFromUrl, pathWithoutLocale, localizedPath, getT } from '../utils';

describe('getLocaleFromUrl', () => {
  it('returns en for /', () => {
    expect(getLocaleFromUrl(new URL('http://x.test/'))).toBe('en');
  });
  it('returns en for /pricing', () => {
    expect(getLocaleFromUrl(new URL('http://x.test/pricing'))).toBe('en');
  });
  it('returns pt-br for /pt-br/', () => {
    expect(getLocaleFromUrl(new URL('http://x.test/pt-br/'))).toBe('pt-br');
  });
  it('returns pt-br for /pt-br/pricing', () => {
    expect(getLocaleFromUrl(new URL('http://x.test/pt-br/pricing'))).toBe('pt-br');
  });
});

describe('pathWithoutLocale', () => {
  it('returns / for /', () => {
    expect(pathWithoutLocale('/')).toBe('/');
  });
  it('returns / for /pt-br', () => {
    expect(pathWithoutLocale('/pt-br')).toBe('/');
  });
  it('returns /pricing for /pt-br/pricing', () => {
    expect(pathWithoutLocale('/pt-br/pricing')).toBe('/pricing');
  });
  it('leaves /pricing alone', () => {
    expect(pathWithoutLocale('/pricing')).toBe('/pricing');
  });
});

describe('localizedPath', () => {
  it('keeps en root', () => {
    expect(localizedPath('en', '/')).toBe('/');
  });
  it('strips pt-br prefix when going to en', () => {
    expect(localizedPath('en', '/pt-br/pricing')).toBe('/pricing');
  });
  it('adds pt-br prefix when going to pt-br from /', () => {
    expect(localizedPath('pt-br', '/')).toBe('/pt-br/');
  });
  it('adds pt-br prefix when going to pt-br from /pricing', () => {
    expect(localizedPath('pt-br', '/pricing')).toBe('/pt-br/pricing');
  });
});

describe('getT', () => {
  it('returns nested key', () => {
    const t = getT('en');
    expect(t('nav.pricing')).toBe('Pricing');
  });
  it('interpolates vars', () => {
    const t = getT('en');
    expect(t('footer.copyright', { year: 2026 })).toBe('© 2026 Syncologic');
  });
  it('returns key on miss', () => {
    const t = getT('en');
    expect(t('not.a.real.key')).toBe('not.a.real.key');
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npm test -- src/i18n`
Expected: all 13 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/i18n/__tests__/
git commit -m "test(i18n): cover locale routing and t() helper"
```

---

## Task 11: Layout shell

**Files:**
- Create: `src/components/layout/Layout.astro`

- [ ] **Step 1: Write `src/components/layout/Layout.astro`**

```astro
---
import '../../styles/global.css';
import { getLocaleFromUrl, pathWithoutLocale, localizedPath, getT } from '../../i18n/utils';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
}

const { title, description, ogImage } = Astro.props;
const locale = getLocaleFromUrl(Astro.url);
const t = getT(locale);
const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321';
const pathSansLocale = pathWithoutLocale(Astro.url.pathname);
const canonical = `${siteUrl}${localizedPath(locale, pathSansLocale)}`;
const altEn = `${siteUrl}${localizedPath('en', pathSansLocale)}`;
const altPt = `${siteUrl}${localizedPath('pt-br', pathSansLocale)}`;
const og = ogImage ?? `${siteUrl}/og-default.png`;
---

<!DOCTYPE html>
<html lang={locale === 'pt-br' ? 'pt-BR' : 'en'}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="alternate" hreflang="en" href={altEn} />
    <link rel="alternate" hreflang="pt-br" href={altPt} />
    <link rel="alternate" hreflang="x-default" href={altEn} />
    <link rel="icon" href="/assets/brand/icon-black.png" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={og} />
    <meta property="og:site_name" content={t('site.name')} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={og} />
  </head>
  <body>
    <slot name="nav" />
    <main id="main">
      <slot />
    </main>
    <slot name="footer" />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Layout.astro
git commit -m "feat(layout): add Layout shell with hreflang and OG meta"
```

---

## Task 12: Nav component

**Files:**
- Create: `src/components/layout/Nav.astro`

- [ ] **Step 1: Write `src/components/layout/Nav.astro`**

```astro
---
import Button from '../ui/Button.astro';
import { getLocaleFromUrl, getT, localizedPath, pathWithoutLocale } from '../../i18n/utils';

const locale = getLocaleFromUrl(Astro.url);
const t = getT(locale);
const path = pathWithoutLocale(Astro.url.pathname);

const useCases = [
  { slug: 'cloud-to-cloud-transfer', label: 'Cloud-to-cloud transfer' },
  { slug: 'business-cloud-migration', label: 'Business migration' },
  { slug: 'scheduled-cloud-backup', label: 'Scheduled backup' },
  { slug: 'private-runner', label: 'Private Runner' },
];

const otherLocale = locale === 'en' ? 'pt-br' : 'en';
const otherLocalePath = localizedPath(otherLocale, path);
---

<header
  class="sticky top-0 z-50 w-full bg-white/80 backdrop-blur border-b border-[rgba(0,0,0,0.06)]"
  data-locale={locale}
>
  <nav class="container-wide flex items-center justify-between h-14">
    <a href={localizedPath(locale, '/')} class="flex items-center gap-2 text-compact font-medium text-dark-charcoal">
      <img src="/assets/brand/icon-black.png" alt="" width="28" height="28" class="rounded-input" />
      <span>{t('site.name').toLowerCase()}</span>
    </a>

    <ul class="hidden lg:flex items-center gap-7 text-compact text-dark-charcoal">
      <li class="relative group">
        <button class="flex items-center gap-1 hover:underline" type="button" aria-haspopup="true" aria-expanded="false">
          {t('nav.useCases')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <ul class="hidden group-hover:block absolute top-full left-0 mt-2 w-64 bg-white border border-divider rounded-card shadow-card-elevated p-2">
          {useCases.map((u) => (
            <li>
              <a
                href={localizedPath(locale, `/use-cases/${u.slug}`)}
                class="block px-3 py-2 text-caption rounded-input hover:bg-soft-gray"
              >{u.label}</a>
            </li>
          ))}
        </ul>
      </li>
      <li><a href={localizedPath(locale, '/pricing')} class="hover:underline">{t('nav.pricing')}</a></li>
      <li><a href={localizedPath(locale, '/self-hosted')} class="hover:underline">{t('nav.selfHosted')}</a></li>
      <li><a href={localizedPath(locale, '/developers')} class="hover:underline">{t('nav.developers')}</a></li>
    </ul>

    <div class="flex items-center gap-3">
      <a
        href={otherLocalePath}
        class="hidden lg:inline-block text-caption text-slate-gray hover:text-dark-charcoal"
        aria-label={`${t('language.label')}: ${t(`language.${otherLocale}`)}`}
      >
        {otherLocale === 'pt-br' ? 'PT' : 'EN'}
      </a>
      <Button href="#waitlist" variant="primary" size="sm">{t('nav.joinWaitlist')}</Button>
    </div>
  </nav>
</header>
```

(Mobile hamburger menu is deferred to Plan 2's polish task. Desktop nav works above 1024px; below that, only the logo + waitlist CTA show.)

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Nav.astro
git commit -m "feat(layout): add Nav with use-cases dropdown and language switch"
```

---

## Task 13: Footer + Supabase migration

**Files:**
- Create: `src/components/layout/Footer.astro`
- Create: `supabase/migrations/20260429000000_waitlist.sql`

- [ ] **Step 1: Write `src/components/layout/Footer.astro`**

```astro
---
import { getLocaleFromUrl, getT, localizedPath } from '../../i18n/utils';

const locale = getLocaleFromUrl(Astro.url);
const t = getT(locale);
const year = new Date().getFullYear();
const otherLocale = locale === 'en' ? 'pt-br' : 'en';
---

<footer class="bg-soft-gray border-t border-divider">
  <div class="container-wide py-section">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
      <div class="col-span-2 md:col-span-1">
        <a href={localizedPath(locale, '/')} class="flex items-center gap-2 mb-4">
          <img src="/assets/brand/icon-black.png" alt={t('site.name')} width="32" height="32" class="rounded-input" />
          <span class="text-compact font-medium">{t('site.name').toLowerCase()}</span>
        </a>
        <p class="text-caption text-slate-gray max-w-xs">{t('site.tagline')}</p>
      </div>

      <div>
        <h3 class="text-caption font-medium uppercase tracking-wide text-slate-gray mb-3">{t('footer.product')}</h3>
        <ul class="space-y-2 text-caption">
          <li><a href={localizedPath(locale, '/pricing')} class="hover:underline">{t('nav.pricing')}</a></li>
          <li><a href={localizedPath(locale, '/self-hosted')} class="hover:underline">{t('nav.selfHosted')}</a></li>
          <li><a href={localizedPath(locale, '/developers')} class="hover:underline">{t('nav.developers')}</a></li>
        </ul>
      </div>

      <div>
        <h3 class="text-caption font-medium uppercase tracking-wide text-slate-gray mb-3">{t('footer.resources')}</h3>
        <ul class="space-y-2 text-caption">
          <li><a href={localizedPath(locale, '/use-cases/cloud-to-cloud-transfer')} class="hover:underline">Use cases</a></li>
        </ul>
      </div>

      <div>
        <h3 class="text-caption font-medium uppercase tracking-wide text-slate-gray mb-3">{t('language.label')}</h3>
        <ul class="space-y-2 text-caption">
          <li><a href={localizedPath('en', new URL(Astro.url).pathname)} class="hover:underline" hreflang="en">{t('language.en')}</a></li>
          <li><a href={localizedPath('pt-br', new URL(Astro.url).pathname)} class="hover:underline" hreflang="pt-br">{t('language.pt-br')}</a></li>
        </ul>
      </div>
    </div>

    <p class="text-small text-slate-gray mt-12">{t('footer.copyright', { year })}</p>
  </div>
</footer>
```

- [ ] **Step 2: Write `supabase/migrations/20260429000000_waitlist.sql`**

```sql
create extension if not exists "pgcrypto";

create table if not exists waitlist (
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

create index if not exists waitlist_use_case_idx on waitlist(use_case);
create index if not exists waitlist_locale_idx   on waitlist(locale);
create index if not exists waitlist_created_idx  on waitlist(created_at desc);
create index if not exists waitlist_unsub_idx    on waitlist(unsubscribe_token);

create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists waitlist_updated_at on waitlist;
create trigger waitlist_updated_at
  before update on waitlist
  for each row execute function set_updated_at();

alter table waitlist enable row level security;

drop policy if exists waitlist_insert_anon on waitlist;
create policy waitlist_insert_anon on waitlist
  for insert with check (false);

drop policy if exists waitlist_service_all on waitlist;
create policy waitlist_service_all on waitlist
  for all to service_role using (true) with check (true);
```

- [ ] **Step 3: Apply the migration to Supabase**

Either:
- Open the Supabase dashboard → SQL Editor → paste the contents of the migration file → click "Run". Verify the `waitlist` table appears under the Tables list.
- Or with Supabase CLI installed: `supabase db push` (after running `supabase link --project-ref <ref>`).

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Footer.astro supabase/migrations/
git commit -m "feat(layout): add Footer + Supabase waitlist migration"
```

---

## Task 14: Supabase client lib

**Files:**
- Create: `src/lib/supabase.ts`

- [ ] **Step 1: Write `src/lib/supabase.ts`**

```ts
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.SUPABASE_URL;
const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export type WaitlistRow = {
  id: string;
  email: string;
  source_page: string | null;
  segment_hint: string | null;
  locale: string;
  use_case: string | null;
  source_provider: string | null;
  dest_provider: string | null;
  est_size: string | null;
  frequency: string | null;
  preferred_runner: string | null;
  role: string | null;
  user_agent: string | null;
  referrer: string | null;
  ip_hash: string | null;
  unsubscribe_token: string;
  segmentation_completed_at: string | null;
  removed_at: string | null;
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
};
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/supabase.ts
git commit -m "feat(lib): add Supabase service-role client + WaitlistRow type"
```

---

## Task 15: Resend client + confirmation email template

**Files:**
- Create: `src/lib/resend.ts`

- [ ] **Step 1: Write `src/lib/resend.ts`**

```ts
import { Resend } from 'resend';
import type { Locale } from '../i18n/utils';

const apiKey = import.meta.env.RESEND_API_KEY;
const fromEmail = import.meta.env.RESEND_FROM_EMAIL || 'Syncologic <onboarding@resend.dev>';

if (!apiKey) {
  throw new Error('RESEND_API_KEY is required');
}

export const resend = new Resend(apiKey);

interface ConfirmationParams {
  to: string;
  locale: Locale;
  segmentationLink: string;
  unsubscribeLink: string;
}

const TEMPLATES = {
  en: {
    subject: "You're on the Syncologic waitlist",
    body: (p: ConfirmationParams) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1C2B33; max-width: 560px; margin: 0 auto;">
        <h1 style="font-size: 20px; font-weight: 500; color: #1C2B33;">Thanks — you're on the waitlist.</h1>
        <p style="font-size: 16px; line-height: 1.5; color: #5D6C7B;">
          We'll email you when there's something real to try. No noise in between.
        </p>
        <p style="font-size: 16px; line-height: 1.5; color: #5D6C7B;">
          If you have 30 seconds, <a href="${p.segmentationLink}" style="color: #0064E0;">tell us what you want to move →</a>
        </p>
        <p style="font-size: 13px; line-height: 1.5; color: #8595A4; margin-top: 32px;">
          — The Syncologic team
        </p>
        <hr style="border: none; border-top: 1px solid #DEE3E9; margin: 32px 0;" />
        <p style="font-size: 12px; color: #8595A4;">
          Didn't sign up? <a href="${p.unsubscribeLink}" style="color: #5D6C7B;">Remove your email</a>.
        </p>
      </div>
    `,
  },
  'pt-br': {
    subject: 'Você está na lista de espera da Syncologic',
    body: (p: ConfirmationParams) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1C2B33; max-width: 560px; margin: 0 auto;">
        <h1 style="font-size: 20px; font-weight: 500; color: #1C2B33;">Obrigado — você está na lista.</h1>
        <p style="font-size: 16px; line-height: 1.5; color: #5D6C7B;">
          Vamos te mandar um e-mail quando tiver algo de verdade para experimentar. Nada de spam.
        </p>
        <p style="font-size: 16px; line-height: 1.5; color: #5D6C7B;">
          Se tiver 30 segundos, <a href="${p.segmentationLink}" style="color: #0064E0;">conta o que você quer transferir →</a>
        </p>
        <p style="font-size: 13px; line-height: 1.5; color: #8595A4; margin-top: 32px;">
          — A equipe da Syncologic
        </p>
        <hr style="border: none; border-top: 1px solid #DEE3E9; margin: 32px 0;" />
        <p style="font-size: 12px; color: #8595A4;">
          Não foi você? <a href="${p.unsubscribeLink}" style="color: #5D6C7B;">Remover seu e-mail</a>.
        </p>
      </div>
    `,
  },
} as const;

export async function sendWaitlistConfirmation(params: ConfirmationParams): Promise<void> {
  const tpl = TEMPLATES[params.locale];
  await resend.emails.send({
    from: fromEmail,
    to: params.to,
    subject: tpl.subject,
    html: tpl.body(params),
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/resend.ts
git commit -m "feat(lib): add Resend client + bilingual confirmation email"
```

---

## Task 16: Rate limiter (Vercel KV wrapper)

**Files:**
- Create: `src/lib/ratelimit.ts`

- [ ] **Step 1: Write `src/lib/ratelimit.ts`**

```ts
import { kv } from '@vercel/kv';
import { createHash } from 'node:crypto';

export function hashIp(ip: string): string {
  return createHash('sha256').update(ip + import.meta.env.WAITLIST_TOKEN_SECRET).digest('hex').slice(0, 32);
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    '0.0.0.0'
  );
}

interface BudgetCheck {
  ok: boolean;
  remaining: number;
}

export async function incrementCounter(key: string, ttlSeconds: number): Promise<number> {
  const count = (await kv.incr(key)) as number;
  if (count === 1) {
    await kv.expire(key, ttlSeconds);
  }
  return count;
}

export async function checkPostBudget(ipHash: string): Promise<BudgetCheck> {
  const day = new Date().toISOString().slice(0, 10);
  const minute = new Date().toISOString().slice(0, 16);
  const hour = new Date().toISOString().slice(0, 13);

  const [perMin, perHour, perDay] = await Promise.all([
    incrementCounter(`rl:post:m:${ipHash}:${minute}`, 65),
    incrementCounter(`rl:post:h:${ipHash}:${hour}`, 3700),
    incrementCounter(`rl:post:d:${ipHash}:${day}`, 86500),
  ]);

  if (perMin > 5)  return { ok: false, remaining: 0 };
  if (perHour > 20) return { ok: false, remaining: 0 };
  if (perDay > 50)  return { ok: false, remaining: 0 };

  return { ok: true, remaining: Math.min(5 - perMin, 20 - perHour, 50 - perDay) };
}

export async function checkPatchBudget(ipHash: string, rowId: string): Promise<BudgetCheck> {
  const day = new Date().toISOString().slice(0, 10);
  const minute = new Date().toISOString().slice(0, 16);
  const hour = new Date().toISOString().slice(0, 13);

  const [perMin, perHour, perDay] = await Promise.all([
    incrementCounter(`rl:patch:m:${ipHash}:${minute}`, 65),
    incrementCounter(`rl:patch:h:${ipHash}:${hour}`, 3700),
    incrementCounter(`rl:patch:d:${ipHash}:${day}`, 86500),
  ]);

  if (perMin > 60)  return { ok: false, remaining: 0 };
  if (perHour > 200) return { ok: false, remaining: 0 };
  if (perDay > 500)  return { ok: false, remaining: 0 };

  // Track distinct rows touched per IP per day; max 5
  const rowsKey = `rl:rows:${ipHash}:${day}`;
  const added = (await kv.sadd(rowsKey, rowId)) as number;
  if (added === 1) {
    await kv.expire(rowsKey, 86500);
  }
  const distinctCount = (await kv.scard(rowsKey)) as number;
  if (distinctCount > 5) {
    return { ok: false, remaining: 0 };
  }

  return { ok: true, remaining: Math.min(60 - perMin, 200 - perHour, 500 - perDay) };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/ratelimit.ts
git commit -m "feat(lib): add IP-keyed rate limiter (POST + PATCH + distinct rows)"
```

---

## Task 17: HMAC token helper + tests

**Files:**
- Create: `src/lib/hmac.ts`
- Create: `src/lib/__tests__/hmac.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, beforeAll } from 'vitest';
import { signToken, verifyToken } from '../hmac';

beforeAll(() => {
  // vitest reads import.meta.env from the .env file at startup; ensure it's set
  if (!import.meta.env.WAITLIST_TOKEN_SECRET) {
    process.env.WAITLIST_TOKEN_SECRET = 'a'.repeat(64);
  }
});

describe('hmac', () => {
  it('signs and verifies a valid token', () => {
    const token = signToken('row-123');
    expect(verifyToken('row-123', token)).toBe(true);
  });

  it('rejects a token for a different id', () => {
    const token = signToken('row-123');
    expect(verifyToken('row-456', token)).toBe(false);
  });

  it('rejects a tampered token', () => {
    const token = signToken('row-123');
    const tampered = token.slice(0, -2) + 'XX';
    expect(verifyToken('row-123', tampered)).toBe(false);
  });

  it('signs same id deterministically', () => {
    expect(signToken('row-1')).toBe(signToken('row-1'));
  });
});
```

- [ ] **Step 2: Run the test — expect failure**

Run: `npm test -- src/lib/__tests__/hmac`
Expected: fails with "Cannot find module '../hmac'".

- [ ] **Step 3: Write `src/lib/hmac.ts`**

```ts
import { createHmac, timingSafeEqual } from 'node:crypto';

function getSecret(): string {
  const s = import.meta.env.WAITLIST_TOKEN_SECRET ?? process.env.WAITLIST_TOKEN_SECRET;
  if (!s) throw new Error('WAITLIST_TOKEN_SECRET is required');
  return s;
}

export function signToken(rowId: string): string {
  return createHmac('sha256', getSecret()).update(rowId).digest('hex');
}

export function verifyToken(rowId: string, token: string): boolean {
  if (!/^[0-9a-f]{64}$/i.test(token)) return false;
  const expected = signToken(rowId);
  const a = Buffer.from(token, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
```

- [ ] **Step 4: Run tests — expect pass**

Run: `npm test -- src/lib/__tests__/hmac`
Expected: 4 passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/hmac.ts src/lib/__tests__/hmac.test.ts
git commit -m "feat(lib): add HMAC sign/verify for waitlist row tokens"
```

---

## Task 18: Validation schemas + tests

**Files:**
- Create: `src/lib/validation.ts`
- Create: `src/lib/__tests__/validation.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { waitlistPostSchema, waitlistPatchSchema } from '../validation';

describe('waitlistPostSchema', () => {
  it('accepts a valid signup', () => {
    const r = waitlistPostSchema.safeParse({ email: 'a@b.test', locale: 'en' });
    expect(r.success).toBe(true);
  });
  it('rejects bad email', () => {
    expect(waitlistPostSchema.safeParse({ email: 'not-an-email', locale: 'en' }).success).toBe(false);
  });
  it('rejects unknown locale', () => {
    expect(waitlistPostSchema.safeParse({ email: 'a@b.test', locale: 'fr' }).success).toBe(false);
  });
  it('strips unknown fields', () => {
    const r = waitlistPostSchema.safeParse({ email: 'a@b.test', locale: 'en', evil: 'x' });
    expect(r.success).toBe(true);
    if (r.success) expect((r.data as Record<string, unknown>).evil).toBeUndefined();
  });
});

describe('waitlistPatchSchema', () => {
  it('accepts valid use_case', () => {
    expect(waitlistPatchSchema.safeParse({ use_case: 'business_migration' }).success).toBe(true);
  });
  it('rejects invalid use_case', () => {
    expect(waitlistPatchSchema.safeParse({ use_case: 'bogus' }).success).toBe(false);
  });
  it('accepts _complete flag', () => {
    expect(waitlistPatchSchema.safeParse({ _complete: true }).success).toBe(true);
  });
  it('rejects email field', () => {
    expect(waitlistPatchSchema.safeParse({ email: 'a@b.test' }).success).toBe(false);
  });
  it('accepts empty patch (heartbeat)', () => {
    expect(waitlistPatchSchema.safeParse({}).success).toBe(true);
  });
});
```

- [ ] **Step 2: Run test — expect failure**

Run: `npm test -- src/lib/__tests__/validation`
Expected: fails with "Cannot find module '../validation'".

- [ ] **Step 3: Write `src/lib/validation.ts`**

```ts
import { z } from 'zod';

export const USE_CASES = [
  'one_time_transfer','business_migration','scheduled_backup','private_runner',
  'browser_runner','local_backup','developer','self_hosted',
] as const;

export const PROVIDERS = [
  'google_drive','onedrive','dropbox','s3','sftp','webdav','nextcloud','other',
] as const;

export const SIZES = ['lt_10gb','10_to_100gb','100gb_to_1tb','gt_1tb'] as const;
export const FREQUENCIES = ['one_time','weekly','daily','continuous'] as const;
export const RUNNERS = ['cloud','browser','private','not_sure'] as const;
export const ROLES = ['consumer','business','it','developer','homelab'] as const;
export const LOCALES = ['en','pt-br'] as const;

export const waitlistPostSchema = z.object({
  email: z.string().email().max(254),
  locale: z.enum(LOCALES).default('en'),
  source_page: z.string().max(255).optional(),
  segment_hint: z.enum(USE_CASES).nullable().optional(),
  // honeypot
  website: z.string().max(0).optional(),
}).strict();

export const waitlistPatchSchema = z.object({
  use_case: z.enum(USE_CASES).optional(),
  source_provider: z.enum(PROVIDERS).optional(),
  dest_provider: z.enum(PROVIDERS).optional(),
  est_size: z.enum(SIZES).optional(),
  frequency: z.enum(FREQUENCIES).optional(),
  preferred_runner: z.enum(RUNNERS).optional(),
  role: z.enum(ROLES).optional(),
  _complete: z.boolean().optional(),
}).strict();

export type WaitlistPost = z.infer<typeof waitlistPostSchema>;
export type WaitlistPatch = z.infer<typeof waitlistPatchSchema>;
```

(Note: `.strict()` makes zod *reject* unknown keys rather than strip; the test for "strips unknown fields" needs to check that submitting unknown keys fails. Update test in step 4.)

- [ ] **Step 4: Update test for strict mode**

Replace the "strips unknown fields" test in `src/lib/__tests__/validation.test.ts`:

```ts
  it('rejects unknown fields', () => {
    const r = waitlistPostSchema.safeParse({ email: 'a@b.test', locale: 'en', evil: 'x' });
    expect(r.success).toBe(false);
  });
```

- [ ] **Step 5: Run tests — expect all pass**

Run: `npm test -- src/lib/__tests__/validation`
Expected: 9 passing.

- [ ] **Step 6: Commit**

```bash
git add src/lib/validation.ts src/lib/__tests__/validation.test.ts
git commit -m "feat(lib): add zod validation schemas for waitlist POST/PATCH"
```

---

## Task 19: POST `/api/waitlist` endpoint

**Files:**
- Create: `src/pages/api/waitlist.ts`

- [ ] **Step 1: Write `src/pages/api/waitlist.ts`**

```ts
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { sendWaitlistConfirmation } from '../../lib/resend';
import { waitlistPostSchema } from '../../lib/validation';
import { signToken } from '../../lib/hmac';
import { hashIp, getClientIp, checkPostBudget } from '../../lib/ratelimit';

export const prerender = false;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const parsed = waitlistPostSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ error: 'invalid_input', issues: parsed.error.flatten() }, 400);
  }

  // Honeypot — silent success, no insert
  if (parsed.data.website && parsed.data.website.length > 0) {
    return json({ status: 'ok' }, 200);
  }

  const ip = getClientIp(request);
  const ipHash = hashIp(ip);

  const budget = await checkPostBudget(ipHash);
  if (!budget.ok) {
    return json({ error: 'rate_limited' }, 429);
  }

  const { email, locale, source_page, segment_hint } = parsed.data;
  const userAgent = request.headers.get('user-agent') ?? null;
  const referrer = request.headers.get('referer') ?? null;

  // Upsert by email — idempotent
  const existing = await supabase
    .from('waitlist')
    .select('id, unsubscribe_token')
    .eq('email', email)
    .maybeSingle();

  let id: string;
  let unsubscribeToken: string;

  if (existing.data) {
    id = existing.data.id as string;
    unsubscribeToken = existing.data.unsubscribe_token as string;
  } else {
    const inserted = await supabase
      .from('waitlist')
      .insert({
        email,
        locale,
        source_page: source_page ?? null,
        segment_hint: segment_hint ?? null,
        user_agent: userAgent,
        referrer,
        ip_hash: ipHash,
      })
      .select('id, unsubscribe_token')
      .single();

    if (inserted.error || !inserted.data) {
      console.error('waitlist insert failed', inserted.error);
      return json({ error: 'server_error' }, 500);
    }
    id = inserted.data.id as string;
    unsubscribeToken = inserted.data.unsubscribe_token as string;
  }

  const token = signToken(id);
  const siteUrl = import.meta.env.PUBLIC_SITE_URL || new URL(request.url).origin;
  const segmentationLink = `${siteUrl}${source_page ?? '/'}#waitlist?id=${id}&t=${token}`;
  const unsubscribeLink = `${siteUrl}/api/waitlist/unsubscribe?token=${unsubscribeToken}`;

  // Fire-and-forget; do not block on email
  sendWaitlistConfirmation({ to: email, locale, segmentationLink, unsubscribeLink })
    .catch((err) => console.error('confirmation email failed', err));

  return json({ id, token, status: existing.data ? 'existed' : 'created' }, 200);
};
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/api/waitlist.ts
git commit -m "feat(api): POST /api/waitlist with rate-limit and email confirmation"
```

---

## Task 20: PATCH `/api/waitlist/[id]` endpoint

**Files:**
- Create: `src/pages/api/waitlist/[id].ts`

- [ ] **Step 1: Write `src/pages/api/waitlist/[id].ts`**

```ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { waitlistPatchSchema } from '../../../lib/validation';
import { verifyToken } from '../../../lib/hmac';
import { hashIp, getClientIp, checkPatchBudget } from '../../../lib/ratelimit';

export const prerender = false;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const PATCH: APIRoute = async ({ request, params }) => {
  const id = params.id;
  if (!id || !/^[0-9a-f-]{36}$/.test(id)) {
    return json({ error: 'invalid_id' }, 400);
  }

  const token = request.headers.get('x-waitlist-token') ?? '';
  if (!verifyToken(id, token)) {
    return json({ error: 'invalid_token' }, 401);
  }

  const ip = getClientIp(request);
  const ipHash = hashIp(ip);
  const budget = await checkPatchBudget(ipHash, id);
  if (!budget.ok) {
    return json({ error: 'rate_limited' }, 429);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }
  const parsed = waitlistPatchSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ error: 'invalid_input', issues: parsed.error.flatten() }, 400);
  }

  const row = await supabase
    .from('waitlist')
    .select('id, segmentation_completed_at')
    .eq('id', id)
    .maybeSingle();

  if (!row.data) {
    return json({ error: 'not_found' }, 404);
  }
  if (row.data.segmentation_completed_at) {
    return json({ error: 'already_completed' }, 409);
  }

  const { _complete, ...fields } = parsed.data;
  const update: Record<string, unknown> = { ...fields };
  if (_complete) {
    update.segmentation_completed_at = new Date().toISOString();
  }

  if (Object.keys(update).length === 0) {
    return json({ status: 'ok' }, 200);
  }

  const result = await supabase.from('waitlist').update(update).eq('id', id);
  if (result.error) {
    console.error('waitlist patch failed', result.error);
    return json({ error: 'server_error' }, 500);
  }

  return json({ status: 'ok' }, 200);
};
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/api/waitlist/[id].ts
git commit -m "feat(api): PATCH /api/waitlist/:id with row locking + last-write-wins"
```

---

## Task 21: Unsubscribe endpoint

**Files:**
- Create: `src/pages/api/waitlist/unsubscribe.ts`

- [ ] **Step 1: Write `src/pages/api/waitlist/unsubscribe.ts`**

```ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

const UNSUB_PAGE = (locale: 'en' | 'pt-br') => {
  const en = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>Removed</title>
    <style>body{font-family:Montserrat,sans-serif;color:#1C2B33;max-width:480px;margin:80px auto;padding:0 24px;line-height:1.5}</style>
    </head><body><h1 style="font-weight:500">You're removed from the list.</h1>
    <p>If this was a mistake, just join again from the homepage.</p></body></html>`;
  const pt = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"/><title>Removido</title>
    <style>body{font-family:Montserrat,sans-serif;color:#1C2B33;max-width:480px;margin:80px auto;padding:0 24px;line-height:1.5}</style>
    </head><body><h1 style="font-weight:500">Você foi removido da lista.</h1>
    <p>Se foi por engano, é só se inscrever de novo na página inicial.</p></body></html>`;
  return locale === 'pt-br' ? pt : en;
};

export const GET: APIRoute = async ({ request, url }) => {
  const token = url.searchParams.get('token') ?? '';
  if (token && /^[0-9a-f]{32}$/i.test(token)) {
    const result = await supabase
      .from('waitlist')
      .select('id, locale')
      .eq('unsubscribe_token', token)
      .maybeSingle();

    if (result.data) {
      await supabase
        .from('waitlist')
        .update({ removed_at: new Date().toISOString() })
        .eq('id', result.data.id);

      return new Response(UNSUB_PAGE((result.data.locale as 'en' | 'pt-br') ?? 'en'), {
        status: 200,
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    }
  }

  // Generic page even when token is bad/missing — don't leak existence
  return new Response(UNSUB_PAGE('en'), {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
};
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/api/waitlist/unsubscribe.ts
git commit -m "feat(api): GET /api/waitlist/unsubscribe with bilingual confirmation page"
```

---

## Task 22: WaitlistForm — Step 1 (email capture)

**Files:**
- Create: `src/components/sections/WaitlistForm.astro`

- [ ] **Step 1: Write `src/components/sections/WaitlistForm.astro`**

```astro
---
import Button from '../ui/Button.astro';
import Input from '../ui/Input.astro';
import { getLocaleFromUrl, getT } from '../../i18n/utils';
import type { WaitlistPost } from '../../lib/validation';

interface Props {
  segmentHint?: WaitlistPost['segment_hint'];
  id?: string;
}

const { segmentHint = null, id = 'waitlist' } = Astro.props;
const locale = getLocaleFromUrl(Astro.url);
const t = getT(locale);
const sourcePage = Astro.url.pathname;
---

<section id={id} data-locale={locale} class="bg-white py-section">
  <div class="container-wide max-w-2xl text-center">
    <h2 class="text-h1 font-medium text-dark-charcoal mb-4">{t('nav.joinWaitlist')}</h2>
    <p class="text-body text-slate-gray mb-8">{t('site.tagline')}</p>

    <form
      class="waitlist-form-step1 flex flex-col sm:flex-row gap-3 justify-center"
      data-source-page={sourcePage}
      data-locale={locale}
      data-segment-hint={segmentHint}
      novalidate
    >
      <input type="text" name="website" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />
      <Input type="email" name="email" required placeholder={t('waitlist.emailPlaceholder')} ariaLabel={t('waitlist.emailLabel')} class="sm:max-w-xs" />
      <Button type="submit" variant="primary">
        <span class="btn-label-default">{t('waitlist.submit')}</span>
        <span class="btn-label-loading hidden">{t('waitlist.submitting')}</span>
      </Button>
    </form>
    <p class="waitlist-msg mt-3 text-caption text-slate-gray min-h-[20px]" role="status" aria-live="polite"></p>

    <div class="waitlist-step2 hidden mt-8" data-row-id="" data-token="">
      <!-- Step 2 content rendered by Task 23 -->
    </div>
  </div>
</section>

<script>
  type Locale = 'en' | 'pt-br';
  type Stage1Result = { id: string; token: string; status: 'created' | 'existed' };

  const I18N = {
    en: {
      success: "✓ You're on the list",
      errorNetwork: "Couldn't reach the server. Try again?",
      errorRate: "Slow down — try again in a minute.",
    },
    'pt-br': {
      success: '✓ Você está na lista',
      errorNetwork: 'Não consegui falar com o servidor. Tentar de novo?',
      errorRate: 'Mais devagar — tente daqui a um minuto.',
    },
  } as const;

  document.querySelectorAll<HTMLFormElement>('.waitlist-form-step1').forEach((form) => {
    const msg = form.parentElement!.querySelector<HTMLElement>('.waitlist-msg')!;
    const step2 = form.parentElement!.querySelector<HTMLElement>('.waitlist-step2')!;
    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const labelDefault = submitBtn.querySelector<HTMLElement>('.btn-label-default')!;
    const labelLoading = submitBtn.querySelector<HTMLElement>('.btn-label-loading')!;
    const locale = (form.dataset.locale ?? 'en') as Locale;
    const sourcePage = form.dataset.sourcePage ?? '/';
    const segmentHint = form.dataset.segmentHint || null;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const email = String(fd.get('email') ?? '').trim();
      const honeypot = String(fd.get('website') ?? '');
      if (!email || honeypot) return;

      msg.textContent = '';
      labelDefault.classList.add('hidden');
      labelLoading.classList.remove('hidden');
      submitBtn.disabled = true;

      try {
        const res = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email, locale, source_page: sourcePage, segment_hint: segmentHint }),
        });

        if (res.status === 429) {
          msg.textContent = I18N[locale].errorRate;
          return;
        }
        if (!res.ok) {
          msg.textContent = I18N[locale].errorNetwork;
          return;
        }

        const data = (await res.json()) as Stage1Result;
        msg.textContent = I18N[locale].success;
        // Reveal step 2
        step2.dataset.rowId = data.id;
        step2.dataset.token = data.token;
        step2.classList.remove('hidden');
        form.classList.add('hidden');
        // Cache locally so a refresh resumes
        try {
          localStorage.setItem(`waitlist:${data.id}`, JSON.stringify({ token: data.token, email }));
        } catch {}
      } catch {
        msg.textContent = I18N[locale].errorNetwork;
      } finally {
        labelDefault.classList.remove('hidden');
        labelLoading.classList.add('hidden');
        submitBtn.disabled = false;
      }
    });
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/WaitlistForm.astro
git commit -m "feat(waitlist): Step 1 email capture with optimistic UI"
```

---

## Task 23: WaitlistForm — Step 2 (progressive segmentation)

**Files:**
- Modify: `src/components/sections/WaitlistForm.astro`

- [ ] **Step 1: Replace the empty `<div class="waitlist-step2 …">` block in `WaitlistForm.astro`**

Find this block:

```astro
    <div class="waitlist-step2 hidden mt-8" data-row-id="" data-token="">
      <!-- Step 2 content rendered by Task 23 -->
    </div>
```

Replace with:

```astro
    <div class="waitlist-step2 hidden mt-8 text-left" data-row-id="" data-token="" data-segment-hint={segmentHint ?? ''}>
      <h3 class="text-h3 font-bold text-dark-charcoal mb-2">{t('waitlist.step2Title')}</h3>
      <p class="text-caption text-slate-gray mb-6">7 quick questions. <button type="button" class="step2-skip underline">{t('waitlist.step2Skip')}</button></p>

      <div class="step2-questions space-y-4"></div>

      <div class="step2-controls hidden mt-6 flex justify-end">
        <button type="button" class="step2-done bg-brand-blue text-white rounded-pill px-6 py-2 text-caption font-medium">{t('waitlist.step2Done')}</button>
      </div>
    </div>
```

- [ ] **Step 2: Replace the entire `<script>` block at the bottom of the file**

Replace the existing `<script>` (the Step 1 handler) with:

```astro
<script>
  type Locale = 'en' | 'pt-br';
  type Stage1Result = { id: string; token: string; status: 'created' | 'existed' };

  const I18N = {
    en: {
      success: "✓ You're on the list",
      errorNetwork: "Couldn't reach the server. Try again?",
      errorRate: "Slow down — try again in a minute.",
      questionUseCase: 'What are you trying to move?',
      questionSourceProvider: 'Where do the files live now?',
      questionDestProvider: 'Where do they need to go?',
      questionSize: 'How much data?',
      questionFrequency: 'How often?',
      questionRunner: 'Where should the transfer run?',
      questionRole: 'Which best describes you?',
      done: '✓ Thanks — that helps a lot.',
    },
    'pt-br': {
      success: '✓ Você está na lista',
      errorNetwork: 'Não consegui falar com o servidor. Tentar de novo?',
      errorRate: 'Mais devagar — tente daqui a um minuto.',
      questionUseCase: 'O que você quer transferir?',
      questionSourceProvider: 'Onde os arquivos estão hoje?',
      questionDestProvider: 'Para onde eles precisam ir?',
      questionSize: 'Quanto de dados?',
      questionFrequency: 'Com que frequência?',
      questionRunner: 'Onde a transferência deve rodar?',
      questionRole: 'O que descreve você melhor?',
      done: '✓ Valeu — isso ajuda muito.',
    },
  } as const;

  const QUESTIONS: Array<{ field: string; key: keyof typeof I18N.en; options: Array<{ value: string; label: { en: string; 'pt-br': string } }> }> = [
    {
      field: 'use_case', key: 'questionUseCase',
      options: [
        { value: 'one_time_transfer', label: { en: 'One-time transfer', 'pt-br': 'Transferência única' } },
        { value: 'business_migration', label: { en: 'Business migration', 'pt-br': 'Migração de empresa' } },
        { value: 'scheduled_backup', label: { en: 'Scheduled backup', 'pt-br': 'Backup agendado' } },
        { value: 'private_runner', label: { en: 'Private runner', 'pt-br': 'Runner privado' } },
        { value: 'browser_runner', label: { en: 'Browser transfer', 'pt-br': 'Transferência no navegador' } },
        { value: 'local_backup', label: { en: 'Local / NAS backup', 'pt-br': 'Backup local / NAS' } },
        { value: 'developer', label: { en: 'API / automation', 'pt-br': 'API / automação' } },
        { value: 'self_hosted', label: { en: 'Self-hosting', 'pt-br': 'Auto-hospedagem' } },
      ],
    },
    {
      field: 'source_provider', key: 'questionSourceProvider',
      options: [
        { value: 'google_drive', label: { en: 'Google Drive', 'pt-br': 'Google Drive' } },
        { value: 'onedrive', label: { en: 'OneDrive', 'pt-br': 'OneDrive' } },
        { value: 'dropbox', label: { en: 'Dropbox', 'pt-br': 'Dropbox' } },
        { value: 's3', label: { en: 'S3 / S3-compatible', 'pt-br': 'S3 / compatível com S3' } },
        { value: 'sftp', label: { en: 'SFTP', 'pt-br': 'SFTP' } },
        { value: 'webdav', label: { en: 'WebDAV', 'pt-br': 'WebDAV' } },
        { value: 'nextcloud', label: { en: 'Nextcloud', 'pt-br': 'Nextcloud' } },
        { value: 'other', label: { en: 'Other', 'pt-br': 'Outro' } },
      ],
    },
    {
      field: 'dest_provider', key: 'questionDestProvider',
      options: [
        { value: 'google_drive', label: { en: 'Google Drive', 'pt-br': 'Google Drive' } },
        { value: 'onedrive', label: { en: 'OneDrive', 'pt-br': 'OneDrive' } },
        { value: 'dropbox', label: { en: 'Dropbox', 'pt-br': 'Dropbox' } },
        { value: 's3', label: { en: 'S3 / S3-compatible', 'pt-br': 'S3 / compatível com S3' } },
        { value: 'sftp', label: { en: 'SFTP', 'pt-br': 'SFTP' } },
        { value: 'webdav', label: { en: 'WebDAV', 'pt-br': 'WebDAV' } },
        { value: 'nextcloud', label: { en: 'Nextcloud', 'pt-br': 'Nextcloud' } },
        { value: 'other', label: { en: 'Other', 'pt-br': 'Outro' } },
      ],
    },
    {
      field: 'est_size', key: 'questionSize',
      options: [
        { value: 'lt_10gb', label: { en: 'Less than 10 GB', 'pt-br': 'Menos de 10 GB' } },
        { value: '10_to_100gb', label: { en: '10–100 GB', 'pt-br': '10–100 GB' } },
        { value: '100gb_to_1tb', label: { en: '100 GB – 1 TB', 'pt-br': '100 GB – 1 TB' } },
        { value: 'gt_1tb', label: { en: 'More than 1 TB', 'pt-br': 'Mais de 1 TB' } },
      ],
    },
    {
      field: 'frequency', key: 'questionFrequency',
      options: [
        { value: 'one_time', label: { en: 'One time', 'pt-br': 'Uma vez' } },
        { value: 'weekly', label: { en: 'Weekly', 'pt-br': 'Semanalmente' } },
        { value: 'daily', label: { en: 'Daily', 'pt-br': 'Diariamente' } },
        { value: 'continuous', label: { en: 'Continuous sync', 'pt-br': 'Sincronização contínua' } },
      ],
    },
    {
      field: 'preferred_runner', key: 'questionRunner',
      options: [
        { value: 'cloud', label: { en: 'Syncologic cloud', 'pt-br': 'Nuvem da Syncologic' } },
        { value: 'browser', label: { en: 'My browser', 'pt-br': 'Meu navegador' } },
        { value: 'private', label: { en: 'My own server / NAS', 'pt-br': 'Meu próprio servidor / NAS' } },
        { value: 'not_sure', label: { en: 'Not sure yet', 'pt-br': 'Ainda não sei' } },
      ],
    },
    {
      field: 'role', key: 'questionRole',
      options: [
        { value: 'consumer', label: { en: 'Personal user', 'pt-br': 'Usuário pessoal' } },
        { value: 'business', label: { en: 'Small business / founder', 'pt-br': 'Pequena empresa / fundador' } },
        { value: 'it', label: { en: 'IT / sysadmin', 'pt-br': 'TI / sysadmin' } },
        { value: 'developer', label: { en: 'Developer', 'pt-br': 'Desenvolvedor' } },
        { value: 'homelab', label: { en: 'Homelab / hobbyist', 'pt-br': 'Homelab / hobbyista' } },
      ],
    },
  ];

  // STEP 1
  document.querySelectorAll<HTMLFormElement>('.waitlist-form-step1').forEach((form) => {
    const root = form.parentElement!;
    const msg = root.querySelector<HTMLElement>('.waitlist-msg')!;
    const step2 = root.querySelector<HTMLElement>('.waitlist-step2')!;
    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const labelDefault = submitBtn.querySelector<HTMLElement>('.btn-label-default')!;
    const labelLoading = submitBtn.querySelector<HTMLElement>('.btn-label-loading')!;
    const locale = (form.dataset.locale ?? 'en') as Locale;
    const sourcePage = form.dataset.sourcePage ?? '/';
    const segmentHint = form.dataset.segmentHint || null;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const email = String(fd.get('email') ?? '').trim();
      const honeypot = String(fd.get('website') ?? '');
      if (!email || honeypot) return;

      msg.textContent = '';
      labelDefault.classList.add('hidden');
      labelLoading.classList.remove('hidden');
      submitBtn.disabled = true;

      try {
        const res = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email, locale, source_page: sourcePage, segment_hint: segmentHint }),
        });

        if (res.status === 429) {
          msg.textContent = I18N[locale].errorRate;
          return;
        }
        if (!res.ok) {
          msg.textContent = I18N[locale].errorNetwork;
          return;
        }

        const data = (await res.json()) as Stage1Result;
        msg.textContent = I18N[locale].success;
        step2.dataset.rowId = data.id;
        step2.dataset.token = data.token;
        step2.classList.remove('hidden');
        form.classList.add('hidden');
        try {
          localStorage.setItem(`waitlist:${data.id}`, JSON.stringify({ token: data.token, email }));
        } catch {}
        renderStep2(step2, locale);
      } catch {
        msg.textContent = I18N[locale].errorNetwork;
      } finally {
        labelDefault.classList.remove('hidden');
        labelLoading.classList.add('hidden');
        submitBtn.disabled = false;
      }
    });
  });

  function renderStep2(step2: HTMLElement, locale: Locale) {
    const id = step2.dataset.rowId!;
    const token = step2.dataset.token!;
    const hint = step2.dataset.segmentHint || null;
    const container = step2.querySelector<HTMLElement>('.step2-questions')!;
    const controls = step2.querySelector<HTMLElement>('.step2-controls')!;
    const doneBtn = step2.querySelector<HTMLButtonElement>('.step2-done')!;
    const skipBtn = step2.parentElement!.querySelector<HTMLButtonElement>('.step2-skip')!;

    const answers: Record<string, string | undefined> = {};
    if (hint) answers.use_case = hint;

    container.innerHTML = '';
    QUESTIONS.forEach((q) => {
      const wrapper = document.createElement('fieldset');
      wrapper.className = 'border border-divider rounded-card p-4';
      const legend = document.createElement('legend');
      legend.className = 'text-caption font-medium text-slate-gray px-2';
      legend.textContent = I18N[locale][q.key];
      wrapper.appendChild(legend);

      const grid = document.createElement('div');
      grid.className = 'flex flex-wrap gap-2 mt-3';
      q.options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.field = q.field;
        btn.dataset.value = opt.value;
        btn.className = 'px-3 py-1.5 text-caption border border-divider rounded-pill hover:bg-soft-gray data-[selected=true]:bg-brand-blue data-[selected=true]:border-brand-blue data-[selected=true]:text-white';
        btn.textContent = opt.label[locale];
        if (answers[q.field] === opt.value) btn.dataset.selected = 'true';
        btn.addEventListener('click', () => {
          answers[q.field] = opt.value;
          wrapper.querySelectorAll<HTMLButtonElement>('button[data-field]').forEach((b) => {
            b.dataset.selected = b.dataset.value === opt.value ? 'true' : 'false';
          });
          patch({ [q.field]: opt.value });
          if (Object.keys(answers).length === QUESTIONS.length) controls.classList.remove('hidden');
        });
        grid.appendChild(btn);
      });
      wrapper.appendChild(grid);
      container.appendChild(wrapper);
    });

    async function patch(body: Record<string, unknown>) {
      try {
        await fetch(`/api/waitlist/${id}`, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json', 'x-waitlist-token': token },
          body: JSON.stringify(body),
        });
      } catch {
        // Silent — answers are also held in local memory
      }
    }

    async function complete() {
      await patch({ ...answers, _complete: true });
      step2.innerHTML = `<p class="text-caption text-success">${I18N[locale].done}</p>`;
    }

    doneBtn.addEventListener('click', complete);
    skipBtn?.addEventListener('click', complete);
  }
</script>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/WaitlistForm.astro
git commit -m "feat(waitlist): Step 2 progressive segmentation with PATCH per answer"
```

---

## Task 24: Manual end-to-end waitlist test (dev server)

**Files:**
- (none — verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: Astro starts at `http://localhost:4321`. Press `Ctrl+C` to stop later.

- [ ] **Step 2: Test POST happy path**

In a separate terminal:

```bash
curl -i -X POST http://localhost:4321/api/waitlist \
  -H 'content-type: application/json' \
  -d '{"email":"test@example.com","locale":"en","source_page":"/"}'
```

Expected: `200 OK` with `{"id":"<uuid>","token":"<hex>","status":"created"}`. A row appears in the Supabase `waitlist` table.

- [ ] **Step 3: Test POST idempotency**

Re-run the same curl. Expected: `200 OK` with `"status":"existed"` and the same `id`.

- [ ] **Step 4: Test PATCH happy path**

```bash
ID=<id from step 2>
TOKEN=<token from step 2>
curl -i -X PATCH http://localhost:4321/api/waitlist/$ID \
  -H 'content-type: application/json' \
  -H "x-waitlist-token: $TOKEN" \
  -d '{"use_case":"business_migration"}'
```

Expected: `200 OK`. Supabase row's `use_case` column is now `business_migration`.

- [ ] **Step 5: Test PATCH last-write-wins**

```bash
curl -i -X PATCH http://localhost:4321/api/waitlist/$ID \
  -H 'content-type: application/json' \
  -H "x-waitlist-token: $TOKEN" \
  -d '{"use_case":"private_runner"}'
```

Expected: `200 OK`. Supabase row's `use_case` is now `private_runner`.

- [ ] **Step 6: Test PATCH `_complete` lock**

```bash
curl -i -X PATCH http://localhost:4321/api/waitlist/$ID \
  -H 'content-type: application/json' \
  -H "x-waitlist-token: $TOKEN" \
  -d '{"_complete":true}'
```

Expected: `200 OK`. Supabase row's `segmentation_completed_at` is set.

- [ ] **Step 7: Test PATCH after lock returns 409**

```bash
curl -i -X PATCH http://localhost:4321/api/waitlist/$ID \
  -H 'content-type: application/json' \
  -H "x-waitlist-token: $TOKEN" \
  -d '{"use_case":"developer"}'
```

Expected: `409 Conflict` with `{"error":"already_completed"}`.

- [ ] **Step 8: Test PATCH with bad token returns 401**

```bash
curl -i -X PATCH http://localhost:4321/api/waitlist/$ID \
  -H 'content-type: application/json' \
  -H "x-waitlist-token: 00000000000000000000000000000000000000000000000000000000000000ff" \
  -d '{"use_case":"developer"}'
```

Expected: `401 Unauthorized`.

- [ ] **Step 9: Test honeypot silent success**

```bash
curl -i -X POST http://localhost:4321/api/waitlist \
  -H 'content-type: application/json' \
  -d '{"email":"spam@example.com","locale":"en","website":"http://spam"}'
```

Expected: `200 OK` with `{"status":"ok"}`. **No row created** in Supabase (verify in dashboard).

- [ ] **Step 10: Verify confirmation email arrived**

Check the inbox for `test@example.com` (or Resend's test-mode inbox). Expected: an email titled "You're on the Syncologic waitlist" with the segmentation link.

- [ ] **Step 11: Commit a verification log**

If anything failed in steps 2–10, fix it and commit the fix. Otherwise, no commit needed for this task.

---

## Task 25: Marketing sections — ProviderRow, RunnerCards, UseCaseRouter, TrustStory

**Files:**
- Create: `src/components/sections/ProviderRow.astro`
- Create: `src/components/sections/RunnerCards.astro`
- Create: `src/components/sections/UseCaseRouter.astro`
- Create: `src/components/sections/TrustStory.astro`

- [ ] **Step 1: Write `src/components/sections/ProviderRow.astro`**

```astro
---
import ProviderLogo from '../ui/ProviderLogo.astro';
import { getLocaleFromUrl, getT } from '../../i18n/utils';

const locale = getLocaleFromUrl(Astro.url);
const t = getT(locale);

const providers = [
  { id: 'google-drive' as const, key: 'googleDrive' },
  { id: 'onedrive' as const, key: 'oneDrive' },
  { id: 'dropbox' as const, key: 'dropbox' },
  { id: 's3' as const, key: 's3' },
  { id: 'sftp' as const, key: 'sftp' },
  { id: 'webdav' as const, key: 'webdav' },
  { id: 'nextcloud' as const, key: 'nextcloud' },
];
---

<div class="overflow-x-auto">
  <ul class="flex items-center gap-8 min-w-max px-4 py-6 justify-center">
    {providers.map((p) => (
      <li class="flex items-center gap-2 text-caption text-slate-gray whitespace-nowrap">
        <ProviderLogo provider={p.id} size={28} />
        <span>{t(`providers.${p.key}`)}</span>
      </li>
    ))}
  </ul>
</div>
```

- [ ] **Step 2: Write `src/components/sections/RunnerCards.astro`**

```astro
---
import Card from '../ui/Card.astro';
import { getLocaleFromUrl, getT } from '../../i18n/utils';

const locale = getLocaleFromUrl(Astro.url);
const t = getT(locale);

const runners = ['cloud', 'browser', 'private'] as const;
---

<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  {runners.map((r) => (
    <Card class="p-8">
      <h3 class="text-h3 font-bold text-dark-charcoal mb-2">{t(`runners.${r}.name`)}</h3>
      <p class="text-caption text-slate-gray">{t(`runners.${r}.tagline`)}</p>
    </Card>
  ))}
</div>
```

- [ ] **Step 3: Write `src/components/sections/UseCaseRouter.astro`**

```astro
---
import Card from '../ui/Card.astro';
import { getLocaleFromUrl, localizedPath } from '../../i18n/utils';

const locale = getLocaleFromUrl(Astro.url);

const useCases = [
  { slug: 'cloud-to-cloud-transfer', title: 'Move files between clouds', desc: 'Direct provider-to-provider transfers without local download.' },
  { slug: 'business-cloud-migration', title: 'Migrate a team', desc: 'Move a Workspace or Microsoft 365 tenant with reports and previews.' },
  { slug: 'scheduled-cloud-backup', title: 'Schedule recurring backups', desc: 'Cloud-to-cloud or cloud-to-S3 on a schedule.' },
  { slug: 'private-runner', title: 'Run it on your own machine', desc: 'Keep credentials and bytes on your infrastructure.' },
];
---

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  {useCases.map((u) => (
    <a href={localizedPath(locale, `/use-cases/${u.slug}`)} class="block group">
      <Card class="p-6 transition-transform group-hover:-translate-y-0.5 group-hover:shadow-card">
        <h3 class="text-h3 font-bold text-dark-charcoal mb-2">{u.title}</h3>
        <p class="text-caption text-slate-gray">{u.desc}</p>
      </Card>
    </a>
  ))}
</div>
```

- [ ] **Step 4: Write `src/components/sections/TrustStory.astro`**

```astro
---
const points = [
  { title: 'Preview before running', desc: 'See exactly what will be added, modified, or skipped — before you commit.' },
  { title: 'Scoped access', desc: 'Provider connections request only the permissions the transfer needs.' },
  { title: 'Live progress', desc: 'File counts, bytes transferred, and estimated time remaining.' },
  { title: 'Completion reports', desc: 'Per-run audit trail you can share with your team.' },
  { title: 'Runner transparency', desc: 'You see and choose where your bytes flow — cloud, browser, or your own machine.' },
];
---

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {points.map((p) => (
    <div>
      <h3 class="text-h3 font-bold text-dark-charcoal mb-2">{p.title}</h3>
      <p class="text-caption text-slate-gray leading-relaxed">{p.desc}</p>
    </div>
  ))}
</div>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ProviderRow.astro src/components/sections/RunnerCards.astro src/components/sections/UseCaseRouter.astro src/components/sections/TrustStory.astro
git commit -m "feat(sections): add ProviderRow, RunnerCards, UseCaseRouter, TrustStory"
```

---

## Task 26: Homepage hero — TransferPlanner

**Files:**
- Create: `src/components/homepage/TransferPlanner.astro`

- [ ] **Step 1: Write `src/components/homepage/TransferPlanner.astro`**

This component is a near-direct port of `.superpowers/brainstorm/<session>/content/hero-A-v5.html`. Copy the full HTML/CSS/animation from that reference file into the component below; the wrapper Astro front-matter is shown here:

```astro
---
import ProviderLogo from '../ui/ProviderLogo.astro';
---

<div
  class="visual"
  role="img"
  aria-label="Demonstration: 2,341 files transferring from Google Drive to OneDrive via the Cloud Runner. Transfer complete."
>
  <div class="window-chrome" aria-hidden="true">
    <div class="window-dots"><span></span><span></span><span></span></div>
    <div class="window-title">Transfer · /Photos 2024</div>
    <div class="view-toggle">
      <span class="on">Compact</span>
      <span>Detailed</span>
    </div>
  </div>

  <div class="card-body">
    <div class="field-row">
      <span class="field-label">Source</span>
      <div class="field-value">
        <span class="pchip">
          <ProviderLogo provider="google-drive" size={18} />
          Google Drive · /Photos 2024
        </span>
        <span class="meta-group">
          <span class="files">2,341 files</span>
          <span class="meta-divider"></span>
          <span class="delta-source">1.80 GB</span>
        </span>
      </div>
    </div>

    <div class="field-row">
      <span class="field-label">Destination</span>
      <div class="field-value">
        <span class="pchip">
          <ProviderLogo provider="onedrive" size={18} />
          OneDrive · /Backup
        </span>
        <span class="meta-group">
          <span class="files">empty</span>
          <span class="meta-divider"></span>
          <span class="delta-dest">+1.80 GB</span>
        </span>
      </div>
    </div>

    <div class="field-row">
      <span class="field-label">Runner</span>
      <div class="runner-row">
        <div class="runner active">Cloud</div>
        <div class="runner">Browser</div>
        <div class="runner">Private</div>
      </div>
    </div>

    <div class="field-row">
      <span class="field-label">Status</span>
      <div class="status-block">
        <div class="status progress">
          <div class="step-row">
            <div class="progress-line step-1">
              <span class="count">Transferring · 0 / 2,341 files · 0.00 / 1.80 GB</span>
              <span class="pct">0%</span>
            </div>
            <div class="progress-line step-2">
              <span class="count">Transferring · 585 / 2,341 files · 0.45 / 1.80 GB</span>
              <span class="pct">25%</span>
            </div>
            <div class="progress-line step-3">
              <span class="count">Transferring · 1,170 / 2,341 files · 0.90 / 1.80 GB</span>
              <span class="pct">50%</span>
            </div>
            <div class="progress-line step-4">
              <span class="count">Transferring · 1,756 / 2,341 files · 1.35 / 1.80 GB</span>
              <span class="pct">75%</span>
            </div>
            <div class="progress-line step-5">
              <span class="count">Transferring · 2,341 / 2,341 files · 1.80 / 1.80 GB</span>
              <span class="pct">100%</span>
            </div>
          </div>
          <div class="progress-track"><div class="progress-fill"></div></div>
        </div>
        <div class="status done">
          <div class="done-card">
            <div class="done-icon" aria-hidden="true">✓</div>
            <div class="done-text">
              <strong>Transfer complete</strong>
              <span class="meta">2,341 files · 1.80 GB · 4 min 12 s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .visual {
    background: #FFFFFF;
    border: 1px solid theme('colors.divider');
    border-radius: theme('borderRadius.card');
    overflow: hidden;
    box-shadow: theme('boxShadow.card-elevated');
    position: relative;
  }
  .window-chrome {
    display: flex; align-items: center; padding: 10px 14px;
    background: theme('colors.warm-gray');
    border-bottom: 1px solid theme('colors.divider');
    gap: 10px;
  }
  .window-dots { display: flex; gap: 6px; }
  .window-dots span { width: 10px; height: 10px; border-radius: 100px; }
  .window-dots span:nth-child(1) { background: #FF5F57; }
  .window-dots span:nth-child(2) { background: #FEBC2E; }
  .window-dots span:nth-child(3) { background: #28C840; }
  .window-title { flex: 1; text-align: center; font-size: 11px; color: theme('colors.slate-gray'); font-weight: 500; }
  .view-toggle { display: flex; background: #FFFFFF; border: 1px solid theme('colors.divider'); border-radius: 100px; padding: 2px; font-size: 10px; font-weight: 500; }
  .view-toggle span { padding: 3px 9px; border-radius: 100px; color: theme('colors.slate-gray'); }
  .view-toggle span.on { background: theme('colors.brand-blue.DEFAULT'); color: white; }
  .card-body { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
  .field-row { display: flex; flex-direction: column; gap: 6px; }
  .field-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: theme('colors.slate-gray'); }
  .field-value {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 14px; background: theme('colors.warm-gray');
    border: 1px solid theme('colors.divider'); border-radius: 8px;
    font-size: 13px; font-weight: 500; gap: 12px;
  }
  .pchip { display: inline-flex; align-items: center; gap: 8px; }
  .meta-group { display: flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 400; }
  .files { color: theme('colors.slate-gray'); }
  .delta-source { color: theme('colors.slate-gray'); font-weight: 500; }
  .delta-dest   { color: theme('colors.success'); font-weight: 600; }
  .meta-divider { width: 3px; height: 3px; border-radius: 100px; background: theme('colors.divider'); }
  .runner-row { display: flex; gap: 6px; }
  .runner {
    flex: 1; padding: 9px 6px; text-align: center;
    border: 1px solid theme('colors.divider'); background: theme('colors.warm-gray');
    border-radius: 8px; font-size: 12px; font-weight: 500; color: theme('colors.slate-gray');
  }
  .runner.active { border-color: theme('colors.brand-blue.DEFAULT'); background: theme('colors.baby-blue'); color: theme('colors.brand-blue.DEFAULT'); }

  .status-block { position: relative; min-height: 64px; }
  .status { position: absolute; inset: 0; display: flex; flex-direction: column; gap: 10px; opacity: 0; }
  .status.progress { animation: phaseProgress 14s infinite; }
  .status.done     { animation: phaseDone 14s infinite; }

  @keyframes phaseProgress {
    0%, 3%      { opacity: 0; transform: translateY(4px); }
    7%, 43%     { opacity: 1; transform: translateY(0); }
    46%, 100%   { opacity: 0; transform: translateY(-4px); }
  }
  @keyframes phaseDone {
    0%, 46%     { opacity: 0; transform: translateY(4px); }
    50%, 93%    { opacity: 1; transform: translateY(0); }
    97%, 100%   { opacity: 0; transform: translateY(-4px); }
  }

  .step-row { position: relative; height: 18px; }
  .progress-line {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: space-between;
    font-size: 12px; font-weight: 500; gap: 8px;
    font-variant-numeric: tabular-nums;
    opacity: 0;
  }
  .progress-line .count { color: theme('colors.dark-charcoal'); }
  .progress-line .pct   { color: theme('colors.brand-blue.DEFAULT'); font-weight: 600; flex-shrink: 0; }

  .step-1 { animation: step1 14s infinite; }
  .step-2 { animation: step2 14s infinite; }
  .step-3 { animation: step3 14s infinite; }
  .step-4 { animation: step4 14s infinite; }
  .step-5 { animation: step5 14s infinite; }

  @keyframes step1 { 0%, 6.5% { opacity: 0; } 7%, 14.5% { opacity: 1; } 15%, 100% { opacity: 0; } }
  @keyframes step2 { 0%, 14.5% { opacity: 0; } 15%, 22.5% { opacity: 1; } 23%, 100% { opacity: 0; } }
  @keyframes step3 { 0%, 22.5% { opacity: 0; } 23%, 30.5% { opacity: 1; } 31%, 100% { opacity: 0; } }
  @keyframes step4 { 0%, 30.5% { opacity: 0; } 31%, 38% { opacity: 1; } 38.5%, 100% { opacity: 0; } }
  @keyframes step5 { 0%, 38% { opacity: 0; } 38.5%, 42.5% { opacity: 1; } 43%, 100% { opacity: 0; } }

  .progress-track { width: 100%; height: 6px; background: theme('colors.divider'); border-radius: 100px; overflow: hidden; }
  .progress-fill {
    height: 100%; background: theme('colors.brand-blue.DEFAULT'); border-radius: 100px;
    width: 0%; animation: forwardOnly 14s infinite linear;
  }
  @keyframes forwardOnly {
    0%, 7% { width: 0%; }
    38.5%  { width: 100%; }
    43%    { width: 100%; }
    43.01% { width: 0%; }
    100%   { width: 0%; }
  }

  .done-card {
    display: flex; align-items: center; gap: 10px; padding: 12px 14px;
    background: theme('colors.success-bg');
    border: 1px solid rgba(0,125,30,0.18); border-radius: 10px;
  }
  .done-icon {
    width: 26px; height: 26px; border-radius: 100px;
    background: theme('colors.success'); color: white;
    display: grid; place-items: center; font-size: 14px; font-weight: 700; flex-shrink: 0;
  }
  .done-text { font-size: 13px; line-height: 1.4; }
  .done-text strong { color: theme('colors.success'); font-weight: 600; }
  .done-text .meta { color: theme('colors.slate-gray'); font-size: 11px; display: block; margin-top: 2px; }

  /* Reduced motion: show success state statically, skip cycling */
  @media (prefers-reduced-motion: reduce) {
    .status.progress { display: none; }
    .status.done { opacity: 1 !important; transform: none !important; animation: none !important; }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/homepage/TransferPlanner.astro
git commit -m "feat(homepage): TransferPlanner animated hero (14s loop, 5-step counter)"
```

---

## Task 27: Mobile sticky waitlist bar

**Files:**
- Create: `src/components/sections/StickyWaitlistBar.astro`

- [ ] **Step 1: Write `src/components/sections/StickyWaitlistBar.astro`**

```astro
---
import Button from '../ui/Button.astro';
import { getLocaleFromUrl, getT } from '../../i18n/utils';

const locale = getLocaleFromUrl(Astro.url);
const t = getT(locale);
---

<div
  id="sticky-waitlist-bar"
  class="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-divider px-4 py-3 transform translate-y-full transition-transform duration-300"
  data-state="hidden"
>
  <Button href="#waitlist" variant="primary" class="w-full">{t('nav.joinWaitlist')}</Button>
</div>

<script>
  const bar = document.getElementById('sticky-waitlist-bar');
  if (bar) {
    const observer = new IntersectionObserver((entries) => {
      const heroVisible = entries[0]?.isIntersecting;
      if (heroVisible) {
        bar.classList.add('translate-y-full');
        bar.classList.remove('translate-y-0');
      } else {
        bar.classList.remove('translate-y-full');
        bar.classList.add('translate-y-0');
      }
    }, { threshold: 0 });

    const hero = document.querySelector<HTMLElement>('[data-hero]');
    if (hero) observer.observe(hero);
  }
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/StickyWaitlistBar.astro
git commit -m "feat(sections): mobile sticky waitlist bar (reveals after hero)"
```

---

## Task 28: Homepage assembly

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Write `src/pages/index.astro`**

```astro
---
import Layout from '../components/layout/Layout.astro';
import Nav from '../components/layout/Nav.astro';
import Footer from '../components/layout/Footer.astro';
import Section from '../components/ui/Section.astro';
import Button from '../components/ui/Button.astro';
import TransferPlanner from '../components/homepage/TransferPlanner.astro';
import ProviderRow from '../components/sections/ProviderRow.astro';
import RunnerCards from '../components/sections/RunnerCards.astro';
import UseCaseRouter from '../components/sections/UseCaseRouter.astro';
import TrustStory from '../components/sections/TrustStory.astro';
import WaitlistForm from '../components/sections/WaitlistForm.astro';
import StickyWaitlistBar from '../components/sections/StickyWaitlistBar.astro';
import { getT } from '../i18n/utils';

const t = getT('en');
const title = `${t('site.name')} — ${t('site.tagline')}`;
const description = 'Connect a source and destination, preview what changes, then run the transfer in the cloud or on your own machine.';
---

<Layout title={title} description={description}>
  <Nav slot="nav" />

  <Section surface="white" padding="lg" class="!py-12 lg:!py-section-lg" data-hero>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <span class="text-caption font-medium uppercase tracking-wide text-brand-blue mb-5 block">Cloud-to-cloud transfer</span>
        <h1 class="text-display-2 lg:text-display-1 font-medium text-dark-charcoal mb-5 leading-[1.14] tracking-tight">
          Move files between clouds without downloading them first.
        </h1>
        <p class="text-body text-slate-gray mb-8 max-w-lg">
          Connect a source and destination, preview what changes, then run the transfer in the cloud or on your own machine.
        </p>
        <div class="flex gap-3 flex-wrap">
          <Button href="#waitlist" variant="primary" size="lg">{t('nav.joinWaitlist')}</Button>
          <Button href="#how-it-works" variant="secondary" size="lg">See how it works</Button>
        </div>
      </div>
      <div>
        <TransferPlanner />
      </div>
    </div>
  </Section>

  <Section surface="soft" padding="md">
    <p class="text-caption text-center text-slate-gray uppercase tracking-wide mb-2">Connects to</p>
    <ProviderRow />
  </Section>

  <Section surface="white" padding="lg" id="how-it-works">
    <div class="text-center mb-12">
      <h2 class="text-h1 font-medium mb-3">Three ways to run a transfer</h2>
      <p class="text-body text-slate-gray max-w-xl mx-auto">Pick the runner that matches your trust and convenience needs.</p>
    </div>
    <RunnerCards />
  </Section>

  <Section surface="soft" padding="lg">
    <div class="text-center mb-12">
      <h2 class="text-h1 font-medium mb-3">Find your use case</h2>
      <p class="text-body text-slate-gray max-w-xl mx-auto">We're building for several different audiences — start with the one that fits.</p>
    </div>
    <UseCaseRouter />
  </Section>

  <Section surface="white" padding="lg">
    <div class="text-center mb-12">
      <h2 class="text-h1 font-medium mb-3">Built around your trust</h2>
      <p class="text-body text-slate-gray max-w-xl mx-auto">No surprises. No silent changes. You see what runs, where, and what changed.</p>
    </div>
    <TrustStory />
  </Section>

  <WaitlistForm />

  <Footer slot="footer" />
  <StickyWaitlistBar />
</Layout>
```

- [ ] **Step 2: Run dev server and visually verify**

Run: `npm run dev`
Open: `http://localhost:4321/`

Verify:
- Hero displays with the headline, copy, two CTAs, and the animated TransferPlanner card on the right (stacked vertically on mobile).
- Animation cycles every 14 seconds: 5 progress steps → success card.
- Provider row scrolls horizontally on mobile.
- Runner cards display 3 cards.
- Use case router shows 4 cards.
- Trust story shows 5 points.
- Waitlist form at bottom accepts email and reveals Step 2 on success.
- Mobile: scroll past hero — sticky bar appears at bottom.
- Resize to 320px wide — no horizontal overflow.
- Open DevTools → Lighthouse mobile audit — Performance ≥ 90.

If any of the above fails, fix it before continuing.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(homepage): assemble English homepage with hero + sections + waitlist"
```

---

## Task 29: Verify TypeScript + build

**Files:**
- (none — verification only)

- [ ] **Step 1: Run type check**

Run: `npm run lint`
Expected: 0 errors. (Astro check + TypeScript). Fix any errors that appear.

- [ ] **Step 2: Run unit tests**

Run: `npm test`
Expected: all tests pass (i18n + hmac + validation, 22 tests total).

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: build completes successfully. `dist/` directory created. No build-time errors.

- [ ] **Step 4: Commit any fixes**

If steps 1–3 produced fixes, commit them with a message like:

```bash
git add -u
git commit -m "fix: address type-check and build errors"
```

---

## Task 30: Vercel deploy

**Files:**
- (none — deploy verification)

- [ ] **Step 1: Link the project to Vercel**

Run: `npx vercel link`
Expected: prompts you through linking. Choose existing project or create `syncologic-marketing-site`.

- [ ] **Step 2: Push environment variables to Vercel**

For each variable in `.env`, run:

```bash
npx vercel env add SUPABASE_URL production
npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
npx vercel env add RESEND_API_KEY production
npx vercel env add RESEND_FROM_EMAIL production
npx vercel env add WAITLIST_TOKEN_SECRET production
npx vercel env add KV_REST_API_URL production
npx vercel env add KV_REST_API_TOKEN production
npx vercel env add KV_REST_API_READ_ONLY_TOKEN production
npx vercel env add PUBLIC_SITE_URL production
```

For `PUBLIC_SITE_URL`, use the production URL (e.g., `https://syncologic.com` or the Vercel-assigned `https://syncologic-marketing-site.vercel.app`).

Repeat for `preview` environment if you want preview deploys to also work end-to-end.

- [ ] **Step 3: Trigger deploy**

Run: `npx vercel --prod`
Expected: deploys, prints the production URL.

- [ ] **Step 4: Smoke test production**

Open the production URL. Verify:
- Homepage loads.
- Hero animation runs.
- Submit a real email (your own) to `/api/waitlist`.
- Receive the confirmation email from Resend.
- Open the email's segmentation link, complete the segmentation form.
- Check Supabase dashboard — row exists with all answers.

- [ ] **Step 5: Commit Vercel project file (if generated)**

```bash
git add .vercel/ 2>/dev/null || true
git status --short
# If .vercel/ shows up and isn't in .gitignore, add it to .gitignore.
echo ".vercel/" >> .gitignore
git add .gitignore
git commit -m "chore: ignore .vercel/ project metadata"
```

---

## Self-review checklist (run after writing the plan)

- [x] Spec coverage:
  - Tech stack ✓ (Tasks 1–3)
  - i18n routing & helpers ✓ (Task 4, 10)
  - Design tokens → Tailwind ✓ (Task 3)
  - UI primitives Button/Card/Input/Section/ProviderLogo ✓ (Tasks 5–9)
  - Layout, Nav, Footer ✓ (Tasks 11–13)
  - Supabase schema ✓ (Task 13)
  - Resend bilingual confirmation ✓ (Task 15)
  - Rate limiting (POST + PATCH + distinct rows) ✓ (Task 16)
  - HMAC tokens ✓ (Task 17)
  - Validation schemas ✓ (Task 18)
  - POST endpoint with honeypot ✓ (Task 19)
  - PATCH with row locking + last-write-wins ✓ (Task 20)
  - Unsubscribe ✓ (Task 21)
  - WaitlistForm two-step ✓ (Tasks 22–23)
  - End-to-end test ✓ (Task 24)
  - Marketing sections ✓ (Task 25)
  - Animated TransferPlanner with reduced-motion ✓ (Task 26)
  - Mobile sticky waitlist bar ✓ (Task 27)
  - Homepage assembly ✓ (Task 28)
  - TypeScript + build verification ✓ (Task 29)
  - Vercel deploy ✓ (Task 30)
- Pricing/self-hosted/developers/use-case/guides pages — **deferred to Plan 2** ✓ (consistent with scope decision)
- Brazilian Portuguese page content + analytics + sitemap — **deferred to Plan 3** ✓
- Mobile hamburger menu — **deferred to Plan 2 polish** ✓ (noted in Task 12)

- [x] No placeholders: all tasks include exact code or commands.
- [x] Type consistency: WaitlistRow, validation enums, `signToken`/`verifyToken`, `getT` signatures all match across tasks.
- [x] Each task ends in a commit.
