# Design System Rules

**Source of truth:** `./DESIGN.md` — if these rules ever conflict with DESIGN.md, DESIGN.md wins.

## Tokens (Tailwind classes only — no inline hex)

### Colors
- `text-dark-charcoal` (#1C2B33) — primary text on light surfaces
- `text-slate-gray` (#5D6C7B) — secondary/body text
- `text-brand-blue` (#0064E0) — links, action labels **only**
- `bg-white` — primary canvas
- `bg-soft-gray` (#F1F4F7) — secondary section background
- `bg-warm-gray` (#F7F8FA) — flat card surface
- `bg-reading-paper` (#F6F5F1) — long-form reading surface (guide articles only); near-neutral off-white
- `bg-baby-blue` (#E8F3FF) — info highlight
- `bg-near-black` (#1C1E21) — dark immersive sections
- `bg-brand-blue` / `hover:bg-brand-blue-hover` / `active:bg-brand-blue-pressed` — primary CTA only
- `border-divider` (#DEE3E9) — functional dividers only
- `text-success` / `bg-success-bg` — confirmations
- `text-error` / `bg-error-bg` — validation errors
- `text-warning` — caution

**Brand Blue is a permission, not a paint.** Use it only on elements that respond to interaction.

### Type scale
| Class | Size / weight | Use |
|---|---|---|
| `text-display-1` | 64 / 500 | Hero (desktop) |
| `text-display-2` | 48 / 500 | Section heroes |
| `text-h1` | 36 / 500 | Section heads |
| `text-h2` | 28 / 300 | Subheads (≥28px only) |
| `text-h3` | 18 / 700 | Card titles |
| `text-body` | 18 / 400 | Body copy |
| `text-compact` | 16 / 500 / -0.01em | Nav, UI labels |
| `text-caption` | 14 / 400 / -0.01em | Metadata, secondary labels |
| `text-small` | 12 / 400 | Footer, legal |

Weight 300 only at ≥28px. Weight 500 dominates display + h1.

### Radii
| Class | Px | Use |
|---|---|---|
| `rounded-input` | 8 | Inputs, small UI |
| `rounded-card` | 20 | Standard cards |
| `rounded-feature` | 24 | Feature/product cards, ghost buttons |
| `rounded-pill` | 100 | All buttons, tags, badges |

Anything outside this list is a violation.

### Spacing
- 8px base grid.
- Section padding: `py-section-lg` (80) / `py-section` (64) / `py-section-sm` (48).
- Container: `container-wide` utility (max-width 1440px, 24px / 40px horizontal padding).
- Grid gap: 24px desktop, 16px mobile.

### Elevation
- `shadow-card` — Level 1, subtle interactive lift.
- `shadow-card-elevated` — Level 2, dropdowns and elevated cards.
- Default: flat (background-color differentiation only).
- **No shadows on cards in dark sections.**

## Components

Reach for primitives before custom markup:
- `<Button variant="primary|secondary|ghost" size="sm|md|lg">`
- `<Card radius="card|feature" elevation="flat|card|elevated">`
- `<Input type="email|text|tel">`
- `<Section surface="white|soft|dark" padding="sm|md|lg">`
- `<ProviderLogo provider="...">`

If you reach for the same custom snippet twice, it becomes a primitive in `src/components/ui/`.

## Always

- Pill-shaped CTAs (100px radius) for every primary/secondary action.
- Alternate surfaces vertically (white → soft → white → dark) for rhythm.
- Generous whitespace — sections breathe at 64–80px vertical padding.
- Body copy ≤ 2–3 lines per block.
- Gradient scrim under text-on-image: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6))`.
- Touch targets ≥ 44×44px on mobile.
- Honor `prefers-reduced-motion` (handled site-wide in `global.css`).
- Visible focus ring (3px brand-blue, 2px offset — global default).

## Never

- Sharp corners (< 8px radius).
- Decorative borders or ornamental dividers.
- Drop shadows on cards in dark sections.
- More than 2 levels of text hierarchy in a single card.
- Hex codes inline (`style="color:#..."` or arbitrary `text-[#...]`). Use the token.
- Brand Blue on non-interactive surfaces.
- Long paragraphs (> 3 lines).
- Cramming visuals — imagery floats with breathing room.
- Webfonts beyond Montserrat.

## Responsive

| Breakpoint | Width | Behavior |
|---|---|---|
| Mobile | < 768px | 1-column, hamburger nav, hero 36px, 48px section padding |
| Tablet | 768–1024px | 2-column grid, hero 48px |
| Desktop | 1024–1440px | 3-column grid, full nav, hero 64px, 80px section padding |
| Large | > 1440px | Container caps at 1440px, increased side margins |

## Iteration discipline

1. One component at a time.
2. Reference token names (`text-brand-blue`), not hex.
3. Specify Montserrat weight explicitly when prompting.
4. Describe feel + measurement: "generous whitespace" = 64–80px, not vague.
