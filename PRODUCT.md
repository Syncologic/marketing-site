# Product

## Register

brand

## Users

**Primary: the non-technical power user.** Creators, freelancers, solo operators, and small-business owners whose files have accumulated across Google Drive, Dropbox, iCloud, OneDrive, and a NAS. They want consolidation, migration, or backup without learning `rclone`, mounting buckets, or babysitting a transfer overnight. They are comfortable in software but not in infrastructure. They read marketing pages to decide whether a tool is *for them*, not to skim a feature matrix.

**Secondary: the technical evaluator.** Developers, sysadmins, homelabbers, and data-ops people who will eventually run the Private Runner or Cloud Runner. They arrive via guides and pricing, not the homepage hero. They need depth one click away, never on top of it.

The site has to answer the leigo+ question ("can this move my stuff?") in the first viewport and the technical question ("how does it actually work?") within one scroll or one click — without making either audience feel talked-down-to or shut-out.

## Product Purpose

Syncologic moves files between clouds without downloading them first. The marketing site exists to convert that promise into waitlist signups before the product launches publicly. Success is signups — but signups from people who will still be happy six months later, which means the site has to self-qualify, not just convert.

Pre-launch, the site also carries a second job: prove this is a real, considered engineering effort. There is no product to demo yet, so the *site itself* is the first artifact of craft a prospect encounters. If the marketing feels generic, the assumption is the product will too.

## Brand Personality

**Engineered. Candid. Calm.**

- **Engineered** — the page reads like it was built by someone who cares about the thing they're shipping. Real visuals, exact numbers, no hand-waving. Closer to Stripe / Linear / Resend than to consumer SaaS.
- **Candid** — plain words for hard things. Trade-offs named out loud (Browser Runner is free *and* needs the tab open). No "revolutionary," no "seamless," no urgency theater.
- **Calm** — no exclamation marks, no countdown timers, no "limited beta spots." Confidence shows through restraint, not volume. The reader should feel they have time to read.

Emotional goal: a non-technical visitor finishes the homepage and feels *capable*, not overwhelmed. A technical visitor finishes the pricing page and feels *respected*, not marketed at.

## Anti-references

The site must not look or feel like any of these. All four are explicit category-reflex rejects:

1. **Generic SaaS landing** — gradient hero, three identical icon-headline-blurb feature cards, "Loved by teams at" logo bar, testimonial carousel. The AI-slop default. If a section starts to resemble this template, redesign the section.
2. **Crypto / AI-startup neon-on-black** — glowing accents, dark-by-default, sci-fi grid backgrounds, "the future of X." Wrong audience, wrong tone.
3. **Heavy enterprise** — navy + gold, stock photography of people in suits pointing at laptops, "trusted by Fortune 500." Trust theater that signals slow and bloated.
4. **Indie-hacker brutalist / Notion-clone minimalism** — Helvetica + 1px black borders + Tailwind defaults + "I built this in a weekend" energy. Looks unfinished rather than restrained.

The current site leans cinematic-product-gallery (Apple/Vercel lane). The redesign should preserve that lane while adding more written argument and more demonstration-first sections — not slide toward any of the four above under pressure to "look more like a startup."

## Design Principles

1. **Demonstrate, then explain.** Every section pairs with a visual that *shows* the claim before the prose names it. A pure-text section needs a justification. Reuse existing visual primitives or sketch new ones; never fall back to icon-headline-blurb cards as the default.

2. **Plain language carries the load.** The leigo+ audience is primary, so headlines and lead paragraphs use everyday words. Technical depth (data paths, runner architecture, control vs. data plane) lives in the second layer — progressive disclosure, a guide link, a footnote — never in the hero. When a technical term *must* appear, it gets one inline gloss, not a parenthetical apology.

3. **Quiet confidence over urgency.** No exclamation marks, no "limited spots," no scarcity timers, no manipulative CTAs. The waitlist asks for an email because the product isn't ready yet, and we say so. Conversion comes from clarity, not pressure.

4. **Both locales are equal citizens.** English and pt-BR pages ship in the same PR. A copy change in one is a copy change in both. "Control plane / data plane" become "camada de controle / camada de dados"; only `Syncologic` and the Runner names stay English. pt-BR is not a translation of en — it's a sibling.

5. **Refuse the category reflex.** Before shipping any section, ask: could someone guess this section's layout from the category alone ("waitlist landing → hero + email field")? If yes, the section is doing the obvious thing. Find a less obvious way to make the same point, or justify why the obvious way is genuinely best here.

## Accessibility & Inclusion

**Floor: WCAG AA, with `prefers-reduced-motion` respected on every animation.**

- Every interactive element keyboard-reachable with a visible 3px brand-blue focus ring at 2px offset (the global default).
- Every input paired with a `<label>` or `aria-label`.
- Color contrast verified against validated DESIGN.md token pairs before shipping; never eyeball it.
- Animations that move, scale, or parallax check `prefers-reduced-motion: reduce` and fall back to a static state — not just a faster animation.
- Touch targets ≥ 44×44 px on mobile.
- Copy written so a screen reader hits headings, lead paragraphs, and CTAs in a sensible order without relying on visual layout to disambiguate.

These are floors, not ceilings. AAA contrast on body copy is welcome where it doesn't force the palette into a corner.
