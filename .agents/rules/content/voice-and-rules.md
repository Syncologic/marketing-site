# Voice and copy rules

## Voice

- Calm, technical, confident — Stripe / Linear / Vercel voice family.
- Concrete over abstract. Show the workflow; don't explain the platform.
- Short sentences. No marketing fluff.
- "We" sparingly. "You" frequently.
- Never overpromise: no firm launch dates, no "all providers supported", no "coming soon" without a token of substance.

## The single broad message

> **Move files between clouds without downloading them first.**

This is the only sentence everyone needs to remember. Variants for sub-pages are fine, but the homepage and meta-description should anchor on this exact line (or its pt-BR equivalent).

Support message:

> Connect a source and destination, preview what will change, run the transfer in the cloud or on your own machine, and get a clear completion report.

## Naming consistency

| Where | Term |
|---|---|
| User-facing copy | **Private Runner** |
| Technical / architectural docs | **self-hosted runner** |
| User-facing | **Cloud Runner** |
| User-facing | **Browser Runner** or **This Device** |
| User-facing local mode | **Local Helper** (or "your machine") |

Don't mix them in the same paragraph. Pick the register, stick with it.

---

## Brand terms come after plain-language descriptions

Brand terms — "Cloud Runner", "Browser Runner", "Private Runner",
"control plane", "data plane", "self-hosted runner", "source-visible" —
only appear *after* a plain-language description, and as a parenthetical
alias rather than a standalone term.

Wrong: "Cloud Runner — Hosted convenience"
Right: "On our servers (Cloud Runner) — we handle the work…"

A non-technical reader has no concept of "runner". Naming the thing
before describing it forces them to either skip the section or look up
the term. Putting the description first lets them anchor in familiar
language; the brand term then attaches to something they already
understood.

This applies to every public surface (homepage, use-case pages,
`/plans`). The only exceptions are pages explicitly addressed to a
technical audience — `/developers` and `/self-hosted` — where the
visitor is assumed to already know the vocabulary, so the brand term can
lead.

---

## Pair every section with a visual

Every page section must pair with a visual that *demonstrates the
outcome*, not just decorates the slide. The text supports what the
visual shows. Pure-text sections need an explicit justification (FAQ
rows, footer, legal copy, dense tables of trade-offs).

Reuse the existing visual primitives before commissioning new ones:

| Component | Demonstrates |
|---|---|
| `TransferPlanner` | A transfer running, count progressing, completion |
| `ProviderArc` | Files moving directly from one cloud provider to another |
| `MigrationChecklist` | Workspace migration dashboard with files, errors, progress |
| `PrivateRunnerPath` | A file packet passing through the user's network without touching Syncologic |
| `ScheduleClock` | A calendar where scheduled days run a backup automatically |
| `PricingCurves` | Cloud Runner cost rising with usage versus Private Runner cost staying flat |
| `ControlDataPlanes` | Metadata layer (control plane) above; data layer (runner with source→destination arrow) below |
| `DeveloperTerminal` | API client showing POST /v1/jobs, the 201 response, and a webhook event |
| `RunnerCardIllustrations` | Per-runner micro-icons for the homepage runner cards |
| `TrustMicroVisuals` | Per-pillar trust badges (preview, scoped permissions, progress, reports, transparency) |

Components live in `src/components/visuals/` (or
`src/components/homepage/` for visuals tied to the homepage hero). When
a section needs a new visual, name it and describe what it should
*demonstrate* before drawing it. New visuals ship with translatable
`alt` strings under `visuals.<name>.alt` in both `src/i18n/en.json` and
`src/i18n/pt-br.json`. Decorative micro-icons placed next to descriptive
text may be `aria-hidden` instead — the title and body carry the
meaning.

---

## Forbidden phrases

- "Coming soon" without a concrete signal of substance.
- "Lightning fast" / "blazing fast" — show numbers or stay quiet.
- "Enterprise-grade" — meaningless.
- "Revolutionary" — meaningless.
- "All your files in one place" — that's not what we do.
- Any superlative without a measurement.
