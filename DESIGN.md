# Syncologic Design System

## 1. Visual Theme & Atmosphere

The Syncologic design system is product-forward and content-first. Cinematic product visuals sit against expansive white canvas to create a gallery-like sense of clarity. Generous negative space frames key elements like museum pieces, while alternating light and dark surface sections create a visual rhythm that guides the visitor through the page.

The system favors humanist sans-serif typography that brings warmth and approachability to a technical product. The surface strategy is binary: pure white for browsing and information, rich dark for immersive product moments.

The visual hierarchy is ruthlessly simple. Visuals do the heavy lifting, supported by short, punchy headlines in medium-weight type and body text that stays brief and scannable. Calls to action are pill-shaped, unmistakable, and always the primary brand blue. There is no visual noise, no decoration for decoration's sake — every element either communicates or navigates.

**Key Characteristics:**
- Visual-first design where product imagery and UI mockups are the heroes
- Binary surface strategy: pure white for information, deep dark for immersive product moments
- Pill-shaped CTAs in saturated blue create unmistakable action points
- Humanist sans-serif typeface (Montserrat) brings geometric warmth
- Generous whitespace frames content like gallery exhibits
- 8px spacing grid with disciplined vertical rhythm
- Alternating light/dark sections create a "walkthrough" cadence

## 2. Color Palette & Roles

### Primary

- **Brand Blue** (`#0064E0`): Primary CTA background, interactive links, action-driving elements throughout the site
- **Brand Blue Hover** (`#0143B5`): Darkened blue for hover states on primary buttons
- **Brand Blue Pressed** (`#004BB9`): Deepest blue for active/pressed button states
- **Brand Blue Light** (`#47A5FA`): Lighter blue variant used on dark backgrounds for CTAs

### Surface & Background

- **White** (`#FFFFFF`): Primary page canvas, nav bar background, card surfaces
- **Soft Gray** (`#F1F4F7`): Secondary background for content sections
- **Warm Gray** (`#F7F8FA`): Flat card background, subtle surface differentiation
- **Reading Paper** (`#F6F5F1`): Long-form reading surface (guide articles). Near-neutral off-white — distinct from pure white, eases eye strain on extended reading. Used **only** for guide article wrappers.
- **Baby Blue** (`#E8F3FF`): Highlight background, subtle blue tint for informational areas
- **Near Black** (`#1C1E21`): Dark section backgrounds, immersive product showcase areas
- **Overlay** (`rgba(0, 0, 0, 0.6)`): Modal/lightbox backdrop

### Neutrals & Text

- **Dark Charcoal** (`#1C2B33`): Primary text on light surfaces, slightly warmer than pure black
- **Slate Gray** (`#5D6C7B`): Secondary text, body copy, descriptions
- **Disabled Text** (`#BCC0C4`): Inactive button labels, placeholder text
- **CTA Disabled Text** (`#8595A4`): Muted blue-gray for disabled interactive labels
- **Divider Gray** (`#DEE3E9`): Lighter dividers, section separators
- **CTA Gray Border** (`#CBD2D9`): Outline button borders

### Semantic

- **Success Green** (`#007D1E`): Confirmations, completion states, positive indicators
- **Error Red** (`#C80A28`): Validation errors, critical states
- **Warning Amber** (`#F7B928`): Attention badges, caution indicators
- **Positive BG** (`rgba(0, 125, 30, 0.08)`): Subtle success background tint
- **Error BG** (`rgba(200, 10, 40, 0.08)`): Subtle error background tint
- **Info BG** (`rgba(0, 100, 224, 0.08)`): Subtle informational blue tint

### Gradient System

- **Dark Overlay Gradient**: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6))` — applied over dark imagery for text legibility
- **Shadow Alpha Scale**: 0.05, 0.10, 0.15, 0.20, 0.30, 0.40 — black alpha ramp for layered shadows

## 3. Typography Rules

### Font Family

**Primary:** Montserrat (Google Fonts)
- Fallbacks: Helvetica, Arial, sans-serif
- Weights used: 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold)

### Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|--------|-------------|----------------|-------|
| Display 1 | 64px | 500 (Medium) | 1.16 | — | Hero headlines on desktop |
| Display 2 | 48px | 500 (Medium) | 1.17 | — | Section heroes |
| Heading 1 | 36px | 500 (Medium) | 1.28 | — | Major section headings |
| Heading 2 | 28px | 300 (Light) | 1.21 | — | Subheadings, lighter feel |
| Heading 3 | 18px | 700 (Bold) | 1.44 | — | Card titles, bold callouts |
| Body | 18px | 400 (Regular) | 1.44 | — | Body copy |
| Body Compact | 16px | 500 (Medium) | 1.50 | -0.16px | Navigation links, UI labels |
| Caption Bold | 14px | 700 (Bold) | 1.43 | — | Emphasized labels |
| Caption | 14px | 400 (Regular) | 1.43 | -0.14px | Secondary labels, metadata |
| Small | 12px | 400 (Regular) | 1.33 | — | Footer links, legal text, timestamps |
| Button | 14px | 500 (Medium) | 1.43 | -0.14px | Button label text |

### Principles

Montserrat is the cornerstone of Syncologic's typographic identity — a humanist sans-serif with geometric underpinnings that strikes a balance between technical precision and approachable warmth. Weight 500 (Medium) dominates headlines, creating a presence that commands without shouting, while the unexpected use of weight 300 (Light) at 28px adds an airy, editorial quality to subheadings. Negative letter-spacing at smaller sizes (-0.14px to -0.16px) tightens the optical rhythm for UI elements, keeping the reading experience crisp and efficient.

## 4. Component Stylings

### Buttons

**Primary (Pill)**
- Background: Brand Blue (`#0064E0`)
- Text: White (`#FFFFFF`)
- Border: none
- Border radius: fully rounded pill (100px)
- Padding: 10px 22px
- Font: Montserrat, 14px, medium (500), -0.14px tracking
- Hover: darkens to `#0143B5`, scale(1.1) transform
- Pressed: `#004BB9`, scale(0.9), opacity 0.5
- Focus: 3px ring in accent color, outline auto 2px
- Transition: background 200ms ease, transform 150ms ease

**Secondary (Outlined Pill)**
- Background: transparent
- Text: Dark Charcoal (`#1C2B33`) at 50% opacity
- Border: 2px solid `rgba(10, 19, 23, 0.12)`
- Border radius: fully rounded pill (100px)
- Padding: 10px 22px
- Hover: background shifts to `rgba(70, 90, 105, 0.7)`, text to white

**Ghost/Link Button**
- Background: transparent / `rgba(255, 255, 255, 0)`
- Text: Link Blue (`#385898`)
- Border radius: 24px
- Padding: 4px 12px

**Disabled**
- Background: `#DEE3E9`
- Text: `#8595A4`
- Cursor: not-allowed, no hover effects

### Cards & Containers

- Background: White (`#FFFFFF`) or Flat Gray (`#F7F8FA`)
- Corner radius: 20px (--card-corner-radius) for standard cards, 24px for product feature cards
- Padding: 10px horizontal, 20px vertical (--card-padding)
- Shadow: `0 12px 28px 0 rgba(0,0,0,0.2), 0 2px 4px 0 rgba(0,0,0,0.1)` (elevated cards)
- Hover: subtle lift via translateY(-2px) and shadow intensification
- Transition: transform 300ms ease, box-shadow 300ms ease
- Product cards use full-bleed imagery with text overlay on dark gradient

### Inputs & Forms

- Background: White (`#FFFFFF`)
- Border: 1px solid `#CED0D4` (--input-border-color)
- Border radius: 8px
- Font: Montserrat, 16px
- Focus: border color shifts to brand blue (`#0064E0`), 3px outer ring
- Error: border and label color shift to error red (`#C80A28`)
- Placeholder: `#5D6C7B`
- Transition: border-color 200ms ease, box-shadow 200ms ease

### Navigation

- Background: White (`#FFFFFF`), sticky at top
- Frosted glass effect: `rgba(241, 244, 247, 0.8)` with backdrop-filter blur
- Logo: Syncologic icon + wordmark, left-aligned
- Links: Montserrat, 16px/500, Dark Charcoal (`#1C2B33`)
- Hover: underline decoration
- CTA: Blue pill button, right-aligned
- Mobile: hamburger collapse, full-screen overlay nav
- Height: approximately 56px desktop, 48px mobile
- Border-bottom: subtle `rgba(0,0,0,0.1)` separator

### Image Treatment

- Product hero: full-width, cinematic aspect ratio (~21:9 on desktop, ~4:3 on mobile)
- Product cards: 1:1 or 4:3, edge-to-edge within card radius
- Feature images: rounded corners matching card radius (20-24px)
- Dark text-over-image: gradient overlay `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6))`
- Lazy loading: native loading="lazy" on below-fold images
- WebP format with JPEG fallback

## 5. Layout Principles

### Spacing System

Base unit: 8px

| Token | Value | Use |
|-------|-------|-----|
| space-1 | 1px | Hairline borders |
| space-2 | 4px | Tight internal padding |
| space-3 | 8px | Base unit, icon gaps |
| space-4 | 10px | Card horizontal padding |
| space-5 | 12px | Button icon spacing, tight margins |
| space-6 | 14px | Caption line height spacing |
| space-7 | 16px | Standard paragraph spacing, nav padding |
| space-8 | 18px | Body text vertical rhythm |
| space-9 | 24px | Card section spacing, grid gaps |
| space-10 | 32px | Section content padding |
| space-11 | 40px | Major content block spacing |
| space-12 | 48px | Section vertical padding (compact) |
| space-13 | 64px | Section vertical padding (standard) |
| space-14 | 80px | Hero section padding, large section gaps |

### Grid & Container

- Max container width: ~1440px, centered with auto margins
- Product grid: 3-column on desktop, 2-column on tablet, 1-column on mobile
- Feature grid: 2-column split (image + content), stacks on mobile
- Grid gap: 24px between cards, 16px on mobile
- Page horizontal padding: 24-40px depending on breakpoint

### Whitespace Philosophy

Whitespace is the system's primary signifier of quality. Sections breathe with 64-80px vertical padding, creating a sense of unhurried reading. Visuals float in generous negative space rather than being crammed edge-to-edge. This restrained spacing communicates premium positioning — the visual equivalent of wide aisles rather than cluttered shelves.

### Border Radius Scale

| Value | Context |
|-------|---------|
| 8px | Inputs, small UI elements, glimmer placeholders |
| 20px | Cards (--card-corner-radius) |
| 24px | Feature cards, product highlight areas, ghost buttons |
| 100px | Pill buttons, tags, badges (fully rounded) |

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow, background differentiation only | Default cards, sections |
| Level 1 | `0 2px 4px 0 rgba(0,0,0,0.1)` | Subtle lift for interactive cards |
| Level 2 | `0 12px 28px 0 rgba(0,0,0,0.2), 0 2px 4px 0 rgba(0,0,0,0.1)` | Elevated cards, dropdowns |
| Overlay | `rgba(0,0,0,0.6)` full-screen | Modal/lightbox backdrop |
| Inset | `rgba(255,255,255,0.5)` inset | Inner glow on glass-effect surfaces |

The system favors a primarily flat elevation model. Most surface differentiation comes from background color shifts (white → soft gray → dark) rather than shadows. When shadows appear, they are soft, diffused, and use the dual-shadow pattern (a large blurred shadow for ambient light + a small sharp shadow for direct light). This creates a physically plausible depth feel without heavy visual weight.

### Decorative Depth

- **Frosted glass nav**: `rgba(241, 244, 247, 0.8)` background with backdrop-filter blur, creating a translucent navigation bar
- **Dark section gradient**: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6))` overlay on product photography for text legibility
- **Glimmer loading states**: Pulsating opacity animation (0.25 → 1.0) on `#979A9F` base color with 8px radius, 1000ms steps timing — used for skeleton screens during product image loading

## 7. Do's and Don'ts

### Do

- Use pill-shaped (100px radius) buttons for all primary and secondary CTAs
- Let product visuals dominate — make imagery the visual hero of every section
- Alternate between light and dark surface sections to create visual rhythm
- Use Montserrat consistently across the site
- Keep body copy brief and scannable
- Use the dual-shadow pattern (ambient + direct) when elevation is needed
- Apply Brand Blue (`#0064E0`) exclusively for actionable elements
- Use generous whitespace (64-80px section padding) to convey quality
- Apply gradient overlays on dark imagery when placing text over images
- Use the semantic color tokens (success, error, warning) consistently for status communication

### Don't

- Don't use sharp corners (< 8px radius) — the system is built on smooth curves
- Don't add decorative borders or ornamental dividers — dividers are functional only
- Don't place important text directly on imagery without a gradient scrim
- Don't use weight 300 for anything smaller than 28px — it becomes too thin
- Don't crowd visuals — maintain generous padding around all imagery
- Don't use more than 2 levels of text hierarchy in a single card
- Don't add drop shadows to cards in dark sections — rely on border and color separation
- Don't use long paragraphs — limit to 2-3 lines of body copy per block

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <768px | Single column, hamburger nav, hero text shrinks to 36px, full-width cards, 48px section padding |
| Tablet | 768-1024px | 2-column grid, compact nav, hero text at 48px |
| Desktop | 1024-1440px | 3-column grid, full horizontal nav, hero text at 64px, 80px section padding |
| Large Desktop | >1440px | Max-width container (1440px) centered, increased horizontal margins |

### Touch Targets

- Minimum touch target: 44x44px (WCAG AAA compliant)
- Mobile button height: minimum 44px with 10px vertical padding
- Nav hamburger icon: 48x48px touch area
- Card tappable area: full card surface

### Collapsing Strategy

- **Navigation**: Horizontal links collapse to hamburger menu below 768px; CTA button remains visible
- **Grids**: 3-col → 2-col at 1024px → 1-col at 768px
- **Hero sections**: Display text scales from 64px → 48px → 36px; CTA buttons stack vertically on mobile
- **Feature sections**: 2-column (image + text) → full-width stacked below 768px, image on top
- **Section padding**: 80px → 64px → 48px → 32px as viewport narrows
- **Card radius**: Remains consistent at 20-24px across all breakpoints

### Image Behavior

- Responsive images via srcset with multiple resolutions
- WebP format with progressive JPEG fallback
- Hero images: full-bleed on mobile, contained on desktop
- Grid images: maintain aspect ratio, scale proportionally
- Lazy loading with glimmer skeleton (pulsating gray placeholder) during load

## 9. Agent Prompt Guide

### Quick Color Reference

- Primary CTA: Brand Blue (`#0064E0`)
- Background: White (`#FFFFFF`)
- Heading text: Dark Charcoal (`#1C2B33`)
- Body text: Slate Gray (`#5D6C7B`)
- Border/divider: Divider Gray (`#DEE3E9`)
- Secondary surface: Soft Gray (`#F1F4F7`)
- Dark sections: Near Black (`#1C1E21`)

### Example Component Prompts

- "Create a hero section with a full-width cinematic image, `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6))` text overlay, Montserrat 64px/500 white headline, and a Brand Blue (`#0064E0`) pill button (100px radius, 10px 22px padding)"
- "Design a 3-column card grid with 20px rounded corners, white backgrounds, edge-to-edge images at top, 18px/400 body text in Slate Gray (`#5D6C7B`), and 24px grid gap"
- "Build a sticky navigation bar with white background, `rgba(241, 244, 247, 0.8)` frosted glass effect, 16px/500 dark text links, and a right-aligned Brand Blue pill CTA"
- "Create a dark showcase section with `#1C1E21` background, white 48px/500 headline, `#5D6C7B` body text, and a secondary outlined pill button with `rgba(10, 19, 23, 0.12)` border"
- "Design a feature comparison grid with Soft Gray (`#F1F4F7`) background, 24px rounded cards, Brand Blue checkmark icons, and 14px/700 bold labels"

### Iteration Guide

When refining existing screens generated with this design system:
1. Focus on ONE component at a time
2. Reference specific color names and hex codes from this document
3. Use natural language descriptions, not CSS values — "pill-shaped Brand Blue button" not "border-radius: 100px; background: #0064E0"
4. Describe the desired "feel" alongside specific measurements — "generous whitespace" means 64-80px section padding
5. Always specify the Montserrat weight explicitly (300, 400, 500, or 700) — each creates a dramatically different feel
