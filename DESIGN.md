---
name: Syncologic Marketing Site
description: Move files between clouds without downloading them first.
register: brand
strategy: committed
theme: dual (day default, night auto via prefers-color-scheme, explicit override via data-theme)
fonts:
  display: "Schibsted Grotesk, Switzer, system-ui, sans-serif"
  sans: "Switzer, system-ui, -apple-system, Helvetica, Arial, sans-serif"
  mono: "ui-monospace, SF Mono, Menlo, monospace"
colors:
  sky-zenith-day: "oklch(0.92 0.04 230)"
  sky-mid-day: "oklch(0.86 0.06 235)"
  sky-horizon-day: "oklch(0.96 0.025 80)"
  sky-zenith-night: "oklch(0.16 0.05 265)"
  sky-mid-night: "oklch(0.22 0.06 255)"
  sky-horizon-night: "oklch(0.32 0.07 260)"
  ink-day: "oklch(0.20 0.03 255)"
  ink-soft-day: "oklch(0.42 0.02 255)"
  ink-night: "oklch(0.96 0.005 250)"
  ink-soft-night: "oklch(0.78 0.01 250)"
  sky-action-day: "oklch(0.48 0.19 252)"
  sky-action-hover-day: "oklch(0.40 0.20 252)"
  sky-action-night: "#1C6BCC"
  sky-action-hover-night: "#1557AA"
  sun-glow-day: "oklch(0.95 0.08 80)"
  sun-glow-night: "oklch(0.82 0.10 280)"
  brand-text-day: "#0045AD"
  brand-text-night: "#1C6BCC"
  error-day: "#C80A28"
  error-night: "#FF8A95"
  legacy-brand-blue: "#0064E0"
  legacy-dark-charcoal: "#1C2B33"
  legacy-near-black: "#1C1E21"
glass:
  bg-day: "rgb(255 255 255 / 0.32)"
  bg-strong-day: "rgb(255 255 255 / 0.48)"
  border-day: "rgb(255 255 255 / 0.85)"
  border-soft-day: "rgb(255 255 255 / 0.45)"
  bg-night: "rgb(20 27 46 / 0.45)"
  bg-strong-night: "rgb(20 27 46 / 0.68)"
  border-night: "rgb(255 255 255 / 0.14)"
  border-soft-night: "rgb(255 255 255 / 0.08)"
  tint-day: "rgb(20 60 120 / 0.04)"
  tint-night: "rgb(120 160 220 / 0.06)"
  highlight-day: "rgb(255 255 255 / 0.75)"
  highlight-night: "rgb(255 255 255 / 0.10)"
typography:
  display-1:    { fontSize: "64px", fontWeight: 500, lineHeight: 1.16, font: "display" }
  display-2:    { fontSize: "48px", fontWeight: 500, lineHeight: 1.17, font: "display" }
  h1:           { fontSize: "36px", fontWeight: 500, lineHeight: 1.28, font: "display" }
  h2:           { fontSize: "28px", fontWeight: 300, lineHeight: 1.21, font: "display" }
  h3:           { fontSize: "18px", fontWeight: 700, lineHeight: 1.44, font: "sans" }
  body:         { fontSize: "18px", fontWeight: 400, lineHeight: 1.44, font: "sans" }
  compact:      { fontSize: "16px", fontWeight: 500, lineHeight: 1.50, font: "sans", letterSpacing: "-0.01em" }
  caption:      { fontSize: "14px", fontWeight: 400, lineHeight: 1.43, font: "sans", letterSpacing: "-0.01em" }
  small:        { fontSize: "12px", fontWeight: 400, lineHeight: 1.33, font: "sans" }
rounded:
  input: "12px"
  card: "24px"
  feature: "32px"
  glass: "32px"
  pill: "100px"
shapes:
  squircle-card: "data-squircle data-squircle-radius=24 (mapped to border-radius via CSS attribute selector)"
  squircle-feature: "data-squircle data-squircle-radius=32"
  squircle-input: "data-squircle data-squircle-radius=12"
spacing:
  section-sm: "52px"
  section: "72px"
  section-lg: "88px"
  container-wide: "1440px"
  container-padding-mobile: "24px"
  container-padding-desktop: "40px"
motion:
  theme-transition: "View Transitions API crossfade, 520ms (instant snap on Firefox / reduced-motion)"
  snap-ease: "cubic-bezier(0.22, 1, 0.36, 1)"
  reveal-ease: "cubic-bezier(0.16, 1, 0.3, 1)"
  cloud-drift: "55s / 80s / 110s linear infinite"
  celestial-swap: "translateY ±140% + opacity, 520ms"
shadows:
  glass-day: "inset 0 1px 0 rgba(255,255,255,0.55), 0 12px 36px -8px rgba(20,40,80,0.22), 0 2px 6px -2px rgba(20,40,80,0.10)"
  glass-night: "inset 0 1px 0 rgba(255,255,255,0.06), 0 14px 40px -8px rgba(0,0,0,0.55), 0 2px 8px -2px rgba(0,0,0,0.40)"
  squircle-elevation: "box-shadow on direct child: var(--shadow-sky-md)"
components:
  glass-pane:    { background: "{glass.bg-strong}", border: "1px {glass.border-soft}", backdrop: "blur(12px) saturate(140%)", radius: "{rounded.glass}", shadow: "inset highlight only" }
  glass:         { background: "{glass.bg}",        border: "1px {glass.border}",      backdrop: "blur(12px) saturate(140%)", radius: "{rounded.glass}", shadow: "{shadows.glass}" }
  glass-strong:  { background: "{glass.bg-strong}", border: "1px {glass.border}",      backdrop: "blur(12px) saturate(140%)", radius: "{rounded.glass}", shadow: "{shadows.glass}" }
  btn-primary-glass: { background: "{colors.sky-action}", border: "0", text: "#ffffff", radius: "{rounded.pill}", padding: "14px 26px", shadow: "0 12px 28px -10px color-mix(sky-action 60%, transparent), 0 2px 6px -2px color-mix(sky-action 35%, transparent)", hover: "{colors.sky-action-hover} + translateY(-1px)" }
  btn-secondary:     { background: "{glass.bg-strong}", border: "1px {glass.border}", text: "{colors.ink}", radius: "{rounded.pill}" }
  btn-ghost:         { background: "transparent", text: "{colors.sky-action}", hover: "underline" }
  btn-icon:          { size: "40px", radius: "{rounded.input}", text: "{colors.ink-soft}", hover-bg: "{glass.tint}" }
  modal-nav-chip:    { size: "36px", radius: "{rounded.pill}", background: "sky-tinted glass", text: "{colors.sky-action}", hover: "{colors.sky-action} fill + white icon, close icon rotates 90deg" }
  input-glass:       { background-day: "color-mix(white 78%, transparent)", background-night: "color-mix(white 8%, transparent)", border: "1px color-mix(ink 22%, transparent)", focus-ring: "3px color-mix(sky-action 28%, transparent)", error-ring: "3px color-mix(error 22%, transparent)", radius: "{rounded.input}", padding: "12px 16px" }
  option-chip:       { background: "135deg diagonal sky-action-tinted glass", border: "1px color-mix(white 55%, sky-action 25%)", backdrop: "blur(12px) saturate(140%)", selected: "180deg sky-action gradient + white text" }
  faq-row:           { container: "{glass.bg-strong}", radius: "{rounded.card}", trigger: "h3 font-extrabold", chevron: "32px sky-tinted pill chip, fills sky-action + rotates 180 on open", open-bg: "color-mix(sky-action 6%, glass-bg-strong)", divider: "1px sky-tinted gradient hairline above answer", animation: "grid-template-rows 0fr↔1fr + padding 320ms" }
  runner-tabs:       { row: "{glass} pill with sliding sky-action highlight, 640px max-width", panel: "{glass} squircle, 560px min-height, abs-positioned panes that slide horizontally on switch by direction" }
---

# Design System: Syncologic Marketing Site

## 1. Overview

**Creative North Star: "Standing at the Horizon"**

The site reads like the moment the sky tilts over a hill: a single continuous gradient from zenith to horizon, soft drifting clouds, one sun or one moon depending on the hour. Surfaces are translucent panes of glass that sit *on* the sky rather than punching holes through it. The page is the weather. Brand Blue is the painted handle on the one thing you can hold.

The system is atmospheric, calm, technical-when-it-needs-to-be. It commits to a Committed color strategy: the sky carries 60%+ of the surface, glass panes carry the content, one saturated blue carries action. It rejects four neighbouring lanes by name: the generic-SaaS landing template (gradient hero, icon-headline-blurb trio, logo bar); the crypto / AI-startup neon-on-black aesthetic; heavy-enterprise navy-and-gold with stock photography; and "Apple-clone glassmorphism as decoration" (glass on top of glass on top of a stock photo).

Glass is materials science here, not garnish. Every translucent surface earns its blur by separating *content from sky*, never *content from content*. Squircles replace circular border-radius on hero surfaces because the silhouette is part of the brand. Day/night isn't a toggle — it's the same composition under different ambient light, smooth-interpolated across colour tokens so the transition reads as time passing rather than a theme switch.

**Key Characteristics:**
- Sky-as-surface: a fixed radial-gradient sky on `body::before`, never repeated per-section
- Three glass tiers (`.glass-pane` static, `.glass` interactive, `.glass-strong` chrome)
- Squircles on hero cards and inputs (via `data-squircle data-squircle-radius="N"` attributes → CSS attribute selectors that apply `border-radius: Npx`); standard radii elsewhere
- Day / night cascade snaps under a View Transitions API crossfade (520ms; falls back to instant on Firefox / reduced-motion)
- Sun + moon swap (translateY ±140% + opacity); stars stagger-fade in night
- Schibsted Grotesk display (variable opsz) + Switzer body (variable wght)
- Restrained motion: one easing curve (`cubic-bezier(0.22, 1, 0.36, 1)`) carries reveals and snap-in interactions; the theme transition rides on the browser's native View Transitions crossfade

## 2. Colors: The Sky Palette

The palette is built around the sky. Six base tokens (zenith / mid / horizon × day / night) generate everything; everything else is derived (`color-mix`) or semantic (`--sky-action`, `--ink`, `--text-error`).

### Sky (the canvas)

- **`--sky-zenith`** — overhead. Day: `oklch(0.92 0.04 230)` (pale powder). Night: `oklch(0.16 0.05 265)` (deep navy).
- **`--sky-mid`** — between. Day: `oklch(0.86 0.06 235)`. Night: `oklch(0.22 0.06 255)`.
- **`--sky-horizon`** — where light pools. Day: `oklch(0.96 0.025 80)` (warm amber). Night: `oklch(0.32 0.07 260)` (cool blue-violet).
- **`--sky-bloom`** — derived: `color-mix(in srgb, white 45%, --sky-mid)` (day) / `white 10%` (night). Drives the central bloom on `body::before`.

### Ink (text on sky)

- **`--ink`** — primary text. Day: `oklch(0.20 0.03 255)`. Night: `oklch(0.96 0.005 250)`.
- **`--ink-soft`** — secondary, captions. Day: `oklch(0.42 0.02 255)`. Night: `oklch(0.78 0.01 250)`.

### Action

- **`--sky-action`** — the only color allowed on interactive primaries. Day: `oklch(0.48 0.19 252)` (saturated brand blue). Night: `#1C6BCC` (toned down so it doesn't burn on dark sky).
- **`--sky-action-hover`** — Day: `oklch(0.40 0.20 252)`. Night: `#1557AA`.
- **`--brand-text`** — Day: `#0045AD`. Night: `#1C6BCC`. For the wordmark.

### Glass (the material)

Glass tokens are alpha-blended. Day glass is white-tinted (sky shows through warm). Night glass is dark-blue-tinted (sky shows through cold).

- **`--glass-bg`** / **`--glass-bg-strong`** — pane fill. Strong is +50% opacity.
- **`--glass-border`** / **`--glass-border-soft`** — hairline. Soft drops on `.glass-pane`.
- **`--glass-highlight`** — inset top-edge gloss (1px white line).
- **`--glass-tint`** — diagonal-bottom-right interior tint that gives glass its *colour temperature* without losing transparency.

### Celestial

- **`--sun-glow`** — Day: `oklch(0.95 0.08 80)` (warm amber). Night: `oklch(0.82 0.10 280)` (cool periwinkle, for the moon).
- **`--cloud-light`** / **`--cloud-shadow`** / **`--cloud-stroke`** — drive the cumulus / puff / wisp SVG gradients in `SkyBackdrop`.

### Semantic

- **`--text-error`** — Day: `#C80A28`. Night: `#FF8A95` (lifted L for legibility on dark glass).
- Success / warning still use the legacy `--color-success` / `--color-warning` tokens.

### Legacy palette (still loaded)

`--color-brand-blue` (#0064E0), `--color-dark-charcoal` (#1C2B33), `--color-near-black` (#1C1E21), and the rest of the original system are kept under `@theme` for components that haven't been redesigned (guides prose, footer, some illustrations). Don't reach for these on the landing page — use the sky tokens.

### Named Rules

- **The One Handle Rule.** `--sky-action` is the only color on interactive primaries. Links, buttons, focus rings, current-page indicator. Nothing else is blue.
- **The Tint-First Rule.** When a surface needs separation, change *opacity / blur* before reaching for a hue. Glass tiers do the work neutrals used to do.
- **The Time-of-Day Rule.** Never hand-author light / dark colours per component. Read the semantic tokens (`--ink`, `--glass-bg`, etc.); the cascade handles the rest.

## 3. Typography

Two-family system: a newsroom-grotesk for display, a neo-grotesque for body.

- **Schibsted Grotesk** (display): hero, section heroes, large headings. Weights 400–900 (Google Fonts). Designed by A2-Type for the Schibsted Nordic news group; architectural, calm-confident at hero sizes, consistent across the scale.
- **Switzer** (body / UI): everything else. Weights 300–700 (Fontshare). Helvetica-derived neo-grotesque with a warmer cut than Inter or Hanken; reads clean at small sizes.
- **Mono** (system stack): `ui-monospace, SF Mono, Menlo, monospace`. No webfont; code blocks are fine in system mono.

### Hierarchy

- **Display 1** (Schibsted 600 / 64px / 1.16): hero headlines. Often clamp(34px, 5vw, 60px) responsive. One per page.
- **Display 2** (Schibsted 600 / 48px / 1.17): section heroes.
- **H1** (Schibsted 600 / 36px / 1.28): major section headings.
- **H2** (Schibsted 400 / 28px / 1.21): editorial subheads.
- **H3** (Switzer 700 / 18px / 1.44): card titles, callouts.
- **Body** (Switzer 400 / 18px / 1.44): default copy. Cap at 65–75ch.
- **Compact** (Switzer 500 / 16px / 1.5, -0.01em): nav links, dense UI.
- **Caption** (Switzer 400 / 14px / 1.43, -0.01em): metadata, secondary labels.
- **Small** (Switzer 400 / 12px / 1.33): footer, legal.

### Named Rules

- **The Display / Body Split.** Schibsted for ≥28px headings; Switzer for everything functional. Don't mix.
- **The 65–75ch Body Rule.** Body never exceeds 75ch. Constrain the column.
- **The Ink-Soft = Subtitle Rule.** `--ink-soft` (`text-ink-soft`) is reserved for section subtitles, eyebrows, footer column headers, form hints, and captions/metadata that sit *next to* a primary heading. **Body copy, card descriptions, list items, FAQ answers, and anything users actually read for content always use `--ink`.** Grey body text is a defect — replace `text-body text-ink-soft` with `text-body text-ink` on sight.

## 4. Surface & Elevation

The page has four material tiers, in order of physical weight.

### Tier 0 — The sky (always)

`body::before` paints a fixed radial-gradient sky behind everything. Never repeat it per-section. Sky tokens snap on theme toggle; the View Transitions API crossfade (520ms) covers the snap so it reads as a smooth time-of-day shift instead of a flicker.

### Tier 1 — `.glass-pane`

Static, lightest material. No drop shadow, inset highlight only. Reads as *"this is just holding content for you to read."* Use for: plan cards, joined-state confirmation, modal panels, FAQ rows.

```
background: var(--glass-bg-strong);
border: 1px solid var(--glass-border-soft);
backdrop-filter: blur(12px) saturate(140%);
border-radius: var(--radius-glass);   /* 32px */
box-shadow: inset 0 1px 0 var(--glass-highlight);
```

### Tier 2 — `.glass`

Interactive / picked-up surface. Diagonal 135° interior tint (via `::before`), drop shadow. Use for: the hero form wrapper, runner cards, anything that wants to read as a *thing*.

```
background: var(--glass-bg);
backdrop-filter: blur(12px) saturate(140%);
border: 1px solid var(--glass-border);
box-shadow: var(--glass-shadow), inset 0 1px 0 var(--glass-highlight);
```

### Tier 3 — `.glass-strong`

Same construction as `.glass`, denser fill (`--glass-bg-strong`). Use for chrome that needs to stay legible while sky moves underneath: nav bar, dropdown menus, waitlist modal panel.

### Squircle treatment

Hero surfaces carry `data-squircle data-squircle-radius="N"` attributes. The attribute value drives a CSS attribute selector in `global.css` that applies `border-radius: Npx`:

```css
[data-squircle-radius="6"]  { border-radius: 6px  !important; }
[data-squircle-radius="22"] { border-radius: 22px !important; }
[data-squircle-radius="24"] { border-radius: 24px !important; }
/* …and so on for 8, 10, 12, 14, 16, 18, 20, 26, 32 */
[data-squircle]:not([data-squircle-radius]) { border-radius: 22px !important; }
[data-squircle] { border: 0 !important; }
```

`!important` wins over `.glass-pane`'s default `border-radius: var(--radius-glass)` so each squircle element renders at its declared radius; `border: 0 !important` keeps `.glass-pane`'s 1px hairline from showing through as a ghost edge.

Elevation lives on a wrapper:

```html
<div class="squircle-elevation">
  <div class="glass" data-squircle data-squircle-radius="24">...</div>
</div>
```

`.squircle-elevation > *` applies `box-shadow: var(--shadow-sky-md)` to its direct child. `box-shadow` respects `border-radius` natively, so the shadow follows the rounded corners through the child's `backdrop-filter` stacking context.

Standard CSS radii (`--radius-card` 24px, `--radius-feature` 32px) apply where the `data-squircle` attribute is overkill (e.g. small chips, inputs, or any element whose radius is hardcoded in component CSS).

### Shadow vocabulary

- `--shadow-glass-day` / `--shadow-glass-night`: drive `.glass` and `.glass-strong`. Inset white highlight + tinted drop.
- `.squircle-elevation`: applies `box-shadow: var(--shadow-sky-md)` to its direct child. The shadow follows the rounded silhouette set by `data-squircle-radius`.
- `--shadow-card` / `--shadow-card-elevated`: legacy, only used on guides and footer chrome.

### Named Rules

- **The Pane-Before-Card Rule.** Default to `.glass-pane`. Only upgrade to `.glass` when the surface needs to read as interactive.
- **The No Nested Glass Rule.** Two glass panes touching = visual mud. Use a sibling layout, not nesting.
- **The Squircle = Wrapper-Shadow Rule.** Any `[data-squircle]` element gets elevation via a `.squircle-elevation` wrapper. The wrapper applies `box-shadow: var(--shadow-sky-md)` to its direct child so the shadow follows the rounded silhouette.
- **The Primary-Card-Has-Shadow Rule.** A *primary card* is any glass-pane / glass surface that sits **directly on the page background** (plan cards, runner-tab panel, trust bento, FAQ rows, phase/reason cards, joined-state confirmation, etc.). Primary cards always carry a resting shadow — `.squircle-elevation` (which applies `box-shadow: var(--shadow-sky-md)` to its child) for squircle surfaces, or an explicit `box-shadow: var(--shadow-sky-md)` on the element itself for plain CSS-radius surfaces (see `.nav-glass` in `Nav.astro`). No naked card on the sky.
- **The Decoration-Inside-Primary-Card Rule.** Anything nested *inside* a primary card — provider chips in the runner tabs, source/destination chips in a visual, slot rows in the rack illustration, the URL pill in the browser-window mock — uses the **transparent decoration style**: no own shadow, no opaque glass background, no border. Typically `background: color-mix(in srgb, var(--sky-action) 6–14%, transparent)` plus an inset 1px sky ring (`box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--sky-action) 22%, transparent)`). The chip should read as a *tint* of the card it lives on, never a second card. (Reference: scoped chip overrides in `RunnerCards.astro`.)

## 5. Components

### Buttons

- **`.btn-primary-glass`** — primary. **Solid `--sky-action` pill, no border, white text, soft sky-tinted dual drop shadow, 14/26 padding, 16px font.** Hover lifts 1px and shifts to `--sky-action-hover`. This is the single canonical primary across the site — hero CTA, modal submit, joined-state CTA, thanks-screen close, guides CTA, 404 CTA all share it.
- **Secondary** — `.glass-strong` fill, `--ink` text, pill radius. For non-destructive secondary actions.
- **Ghost** — transparent, `--sky-action` text, underline on hover. Tertiary inline actions.
- **Icon-only** (theme toggle, lang switcher, mobile menu) — 40×40, `--radius-input`, `--ink-soft` icon, `--glass-tint` hover background. Same construction across all three so they read as one family.
- **`.waitlist-modal-nav`** — 36px pill glass chip for the modal's back / close buttons. Sky-tinted idle, fills with solid `--sky-action` on hover with white icon; close icon rotates 90° on hover.
- **Sizes** — `sm` (px-4 py-2 caption), `md` (px-[22px] py-[10px] caption), `lg` (px-7 py-3 compact).
- **Focus** — global 3px `--sky-action` ring at 2px offset. Never overridden.

### Inputs

- **`.input-glass`** — white-ish fill in day, tinted glass in night. `--radius-input` (12px), squircle-hydrated when used in hero form. Focus: white bg + 3px `--sky-action` ring. Error (`[aria-invalid='true']`): error-mixed bg + 3px error ring. Error text animates in / out via `data-visible` toggle, uses `--text-error` (`#C80A28` day / `#FF8A95` night).

### Option chips (waitlist form)

The signature interactive element on the page. Each chip is a glass surface with a 135° diagonal gradient base, `--sky-action`-tinted bottom-right, white shimmer on top-left via `::before`. Selected state inverts: solid `--sky-action` 180° gradient, white text. Day version reads light and colorful; night version drops to a darker base with reduced sky-action mix.

```
background: linear-gradient(135deg, ...glass + --sky-action tint...);
backdrop-filter: blur(12px) saturate(140%);
border: 1px solid color-mix(in srgb, white 55%, --sky-action 25%);
```

### Navigation

- Sticky top bar, `.glass-strong` material with `24px` left/right gutter at ≥1024px (`lg:left-6 lg:right-6`).
- Logo (`text-h2`), menu links (`text-compact`), language switcher (Lucide `Languages` icon → click-to-open dropdown), theme toggle (sun / moon icon, animates the celestial swap when clicked).
- Mobile (≤767px): hamburger, panel slides down. Mobile menu toggle uses the same `theme-toggle` class as the theme button so the chrome reads as one family.
- Night theme adds a bottom-left moonlight reflection (`radial-gradient(ellipse 70% 180% at 6% 115%, ...)` on the bar background-image). Hidden on mobile.

### Cards

- **Card primitive** (`src/components/ui/Card.astro`): wraps content in `.glass-pane` + `.squircle-elevation` + `data-squircle data-squircle-radius=24`. Two-prop API: `radius` (card / feature) and `interactive` (upgrades to `.glass`).
- **Runner tabs** (`RunnerCards`): a glass pill segmented control (cloud / browser / private) over a glass squircle panel. The pill uses a sliding `--sky-action` highlight (transform + width via JS, recomputed on resize and after `document.fonts.ready`). Panes are absolutely positioned inside the panel and slide horizontally on tab change by direction — clicking a tab to the right slides the new pane in from the right; clicking left mirrors. Pointer-events gated to the active pane. Each pane shows the plain title, a small sky-action runner name beneath, a description, and an illustration column on the right. The Private pane carries a "Planned" badge inline next to its title (sky-action tint pill).

### FAQ row

`.faq-item` is a `.glass-pane` row. Trigger is an `h3 font-extrabold` button with a 32px chevron chip on the right — sky-tinted idle, fills with solid `--sky-action` and a white chevron rotated 180° when open. Open state lifts the row with a sky-tinted box-shadow and a 6%-sky-mixed background. The panel animates via `grid-template-rows: 0fr ↔ 1fr` and `padding 320ms` together so closed rows collapse cleanly to button height with no residual strip. A 1px gradient hairline (sky-tinted) sits between trigger and answer on open. **No side-stripe accent bar.**

### Section

`<Section>` wraps with one of three vertical rhythms (`section-sm` 48px / `section` 64px / `section-lg` 80px). The cadence of sections is the page's rhythm; treat it deliberately.

## 6. Theme system

Three-way cascade, in order of specificity:

1. **`:root` (default)** — day tokens.
2. **`@media (prefers-color-scheme: dark) :root:not([data-theme='day'])`** — respects OS preference unless the user has explicitly chosen day.
3. **`[data-theme='night']`** / **`[data-theme='day']`** — explicit override, persisted in `localStorage` by `Nav.astro`. Wins over OS preference.

All sky / ink / glass / sun / cloud tokens **snap instantly** on theme toggle. The smooth transition is delegated to the browser's native **View Transitions API** — `Nav.astro`'s toggle handler calls `document.startViewTransition(() => { /* swap data-theme */ })`. The browser snapshots the old and new pages and crossfades between them at the compositor level over 520ms — no per-frame repaints, no `backdrop-filter` recomputation.

```ts
// Nav.astro (simplified)
if (typeof document.startViewTransition === 'function' && !reduced.matches) {
  document.startViewTransition(commit);
} else {
  commit(); // Firefox / reduced-motion: instant snap
}
```

```css
/* global.css: stretch the default crossfade */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 520ms;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  mix-blend-mode: normal;
}
```

**Celestial indicator.** `[data-celestial='sun'|'moon']` on `:root`, set inline by `Layout.astro` on page load, updated by `Nav.astro` on toggle. Drives `SkyBackdrop`: sun visible / moon hidden (or vice versa, translateY ±140%), stars stagger-fade with `--star-i: i * 55ms` delay. Hidden on mobile.

**Asset swap.** Logos / icons that need a different SVG per theme use `.theme-asset-day` / `.theme-asset-night`; the CSS toggles `display` along the same cascade.

## 7. Motion

One easing curve: **`cubic-bezier(0.22, 1, 0.36, 1)`** for theme transitions and snap-in interactions. **`cubic-bezier(0.16, 1, 0.3, 1)`** for fade-up reveals.

- **Theme transition** — View Transitions API crossfade, 520ms. Falls back to instant snap on Firefox and `prefers-reduced-motion`.
- **Celestial swap** — sun ↔ moon translateY ±140% + opacity, 520ms.
- **Stars** — stagger fade-in on night (`--star-i` × 55ms each).
- **Cloud drift** — three speed layers (slow 110s / mid 80s / fast 55s) translating `-40vw → 140vw` linearly. The `.sky-cloud-field` wrapper masks both edges (`mask-image: linear-gradient(90deg, transparent 0% / black 10% / black 90% / transparent 100%)`) so clouds fade in and out instead of popping.
- **Hero fade-in** — `.hero-fade-in` 600ms opacity + `translateY(8px)`.
- **Reveal on scroll** — `[data-reveal]` IntersectionObserver hook, 700ms opacity + translateY.
- **Waitlist modal** — logo scale + rotate-in (640ms), halo radial grow (1.2s), content stagger fade-up (320–820ms).
- **Option chip** — 200ms ease on background / border / box-shadow; per-chip stagger 25ms when the question paints.

**Reduced motion.** `@media (prefers-reduced-motion: reduce)` zeroes all animations and transitions globally. Sun / moon stop swapping. Clouds stop drifting. The theme toggle snaps instantly (View Transitions skipped). Never override per-component.

## 8. Signature visuals

- **`SkyBackdrop`** — fixed, `z-index: -1`. Sun (upper-right, warm amber radial glow + core) and moon (upper-left, cool periwinkle, textured surface with crater detail) swap on celestial state. Stars fade in on night. Three cloud layers (cumulus / puff / wisp) drift across, each a single bezier path filled with `sky-cloud-grad` linear-gradient and softened by `feGaussianBlur` (3.2px / 4.5px stdDev).
- **`ProviderArc`** — source → destination provider arc with a dashed-then-solid animated stroke (`stroke-dasharray` 1.6s flow). File pills travel the path on `offset-path` with a per-pill `--pill-delay` stagger.
- **`ProviderConstellation`** — the cloud-runner signature. SVG radial sky bloom + four dashed cardinal arcs (N/E/S/W) flowing from a central glass-pane squircle "core" (Syncologic mark) to four floating glass-pane provider chips (Google Drive, Dropbox, S3, OneDrive). Two pulse rings expand around the core; three file packets travel the arcs on `offset-path` at staggered durations / phases. Chips and core float independently. Used inside the Cloud Runner tab of `RunnerCards` (scoped overrides shrink chips, add a faint sky tint, drop chip borders, and strip the provider-logo background tile so the marks sit directly on the chip).
- **`ProviderRow`** — "Supported at early access" lockup. Up to four 96px provider logos with medium-weight labels under each, in a `grid grid-cols-2 sm:grid-cols-4` layout up to `max-w-4xl`. Replaces the older "Today → The future" section on the landing page.
- **`ProviderLogo`** — inline SVG provider marks. Always *pure brand colour* on a neutral surface, never recoloured to match `--sky-action`. Each logo ships with a white `rect` + `#DEE3E9` stroke as its own tile background — that tile can be transparented inside a tinted container (see runner-tabs scoped overrides) but stays by default elsewhere. The logos retain their identity; the system bends around them.

## 9. Do's and Don'ts

### Do
- **Do** read semantic tokens (`--ink`, `--sky-action`, `--glass-bg`) and let the cascade handle day / night.
- **Do** default to `.glass-pane`; upgrade to `.glass` only when the surface is interactive.
- **Do** wrap squircle-hydrated elements in `.squircle-elevation` for shadow.
- **Do** cap body line length at 65–75ch.
- **Do** pair every section with a visual (cloud field, ProviderArc, RunnerCardIllustration, etc.). Pure-text sections need a justification.
- **Do** mirror every structural change to both `/<page>.astro` and `/pt-br/<page>.astro` in the same PR.
- **Do** translate "control plane" → "camada de controle" and "data plane" → "camada de dados". Syncologic + Runner names stay English.

### Don't
- **Don't** ship the generic-SaaS landing template: gradient hero, three identical icon-headline-blurb cards, "Loved by teams at" logo bar, testimonial carousel.
- **Don't** drift toward crypto / AI-startup neon-on-black, glowing accents, sci-fi grid backgrounds.
- **Don't** drift toward heavy-enterprise navy-and-gold with stock photography.
- **Don't** drift toward Apple-clone glassmorphism: glass-on-glass-on-stock-photo. Glass earns its blur by separating content from *sky*, not content from content.
- **Don't** nest glass panes. Two touching glass surfaces = mud.
- **Don't** apply `box-shadow` ad-hoc on a `[data-squircle]` element. Wrap it in `.squircle-elevation` so the shadow rule lives in one place.
- **Don't** put `border` on a `[data-squircle]` element. The global `[data-squircle] { border: 0 !important }` rule in `global.css` exists so `.glass-pane`'s 1px hairline doesn't show through as a ghost edge.
- **Don't** hand-author day or night colours per component. Use the tokens.
- **Don't** reach for legacy palette (`--color-brand-blue`, `--color-near-black`) on the landing page. Use `--sky-action`, `--ink`, etc.
- **Don't** use weight 300 below 28px. It vanishes against translucent glass.
- **Don't** add a colored `border-left` / `border-right` stripe to a card or callout. Side-stripe borders are forbidden.
- **Don't** clip a gradient to text (`background-clip: text`). Use weight or size for emphasis.
- **Don't** use em dashes in prose copy. Commas, colons, semicolons, periods, parentheses.
- **Don't** put a shadow on a card in night mode that was tuned for day; use `--glass-shadow` (it swaps with the theme).
- **Don't** localize Syncologic or the Runner names (Cloud, On Browser, Private Runner).
