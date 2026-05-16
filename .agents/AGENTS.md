# AGENTS.md

The public marketing surface for **Syncologic** — a pre-launch product that moves files between clouds without downloading them first. Validates positioning, captures segmented waitlist signups. **NOT** the product, control plane, runner, client, or SDK.

## Where the rules live

- [`DESIGN.md`](../DESIGN.md) — visual source of truth (tokens, type scale, components, Always/Never).
- [`.agents/rules/architecture.md`](rules/architecture.md) — repo boundaries, runtime, endpoints, secrets, trust.
- [`.agents/rules/engineering.md`](rules/engineering.md) — code style, API discipline, db, testing, a11y, performance.

## Hard rules

- Server-only secrets (`SUPABASE_*`, `RESEND_*`, `WAITLIST_TOKEN_SECRET`, `KV_*`) must never reach the browser. Access via `import.meta.env.*` in `.ts` libs only.
- All user-facing strings go through i18n. Add to `en.json` + `pt-br.json` in the same commit.
- pt-BR pages under `src/pages/pt-br/` are physical sibling files, not auto-mirrors — every structural change to `/<page>.astro` must be applied to `/pt-br/<page>.astro` in the same change.
- Don't add server endpoints beyond the three documented in `architecture.md`.
- The stack is intentionally small — ask before adding a dependency.
- On Windows: use WSL. Native Windows is not supported.

## When in doubt — ask before guessing.
