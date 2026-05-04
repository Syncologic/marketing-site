## Goal
<one sentence — what success looks like>

## Why
<motivation, constraint, deadline, link to spec if any>

## Out of scope
- <explicitly NOT covered>

## Tasks

> Default to a flat checklist. Use **tracks** only when the work splits
> into 2+ independent chunks of ≥30 min each, with non-overlapping
> scopes. Don't fragment small sequential work into micro-tracks.

<!-- MODE 1: flat (default). Delete the "tracks" block if using this. -->

**Scope:** <files / glob / free-form — omit if obvious from Goal>

- [ ] T1 — <description>
- [ ] T2 — <description>
- [ ] T3 — <description>

<!-- MODE 2: tracks (rare). Delete the "flat" block if using this. -->

### Track A — <short name>
**Scope:** <files / glob / free-form>
- [ ] A1 — <description>
- [ ] A2 — <description> [depends: A1]

### Track B — <short name>
**Depends on:** <Track A complete | nothing>
**Scope:** <files / glob / free-form>
- [ ] B1 — <description>

## Verification
- [ ] `npm run lint`
- [ ] `npm test` (or scoped: `npm test -- <pattern>`)
- [ ] `npm run build` (if relevant)
- [ ] <task-specific check>

## Notes
<deps changed, audit delta summary, anything reviewer should know>
