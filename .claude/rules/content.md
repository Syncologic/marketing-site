# Content & Copy Rules

This file is the **authoritative source** for site structure, page playbooks, voice, and waitlist segmentation. The original `syncologic_marketing_site_ideas.md` was distilled into this document and removed.

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

## Landing pages vs SEO pages

These are different jobs. Don't conflate them.

| Area | Landing page | SEO page (`/guides/*`, `/compare/*`) |
|---|---|---|
| Primary job | Convert a defined audience | Capture search traffic |
| Visitor mindset | "This product may solve my problem" | "I am researching how to solve this" |
| Page style | Direct, specific, persuasive | Helpful, explanatory, query-focused |
| CTA strength | Strong waitlist CTA | Softer waitlist CTA after useful content |
| Structure | Pain → promise → proof → workflow → waitlist | Search answer → methods → caveats → product mention |
| Success metric | Waitlist conversion rate | Search impressions, clicks, assisted signups |

Landing pages convert defined publics. SEO pages bring in people who don't know Syncologic exists.

## Page-type discipline

### Landing pages (homepage + use-case pages)

Every landing page must:
1. **Name its public** near the top. ("For founders migrating a team", "For homelab operators…")
2. Have **one primary CTA** — the waitlist. Secondary CTAs allowed (anchor link to "see how it works"), but only one *primary*.
3. Ask **one segmentation question** that reveals demand (per-page list below).
4. Show product-like visuals (transfer planner mockup), not abstract clouds.
5. Surface the **runner choice** (Cloud / Browser / Private) where relevant.

### SEO guide pages (`/guides/*`)

Every guide must:
1. **Answer the search query before pitching the product.** Helpful first, marketing second.
2. Explain the problem and trade-offs honestly.
3. Mention Syncologic only after providing real value.
4. Use a **softer waitlist CTA** at the end, segmented by guide intent.

### Comparison pages (`/compare/*` — deferred to Plan 2+)

Comparison pages should be **fair**:
- Explain who each alternative is good for.
- State where Syncologic aims to be different — more product-guided than command-line tools, more transparent about runner choices, more flexible than hosted-only tools, more approachable for non-developers.
- Don't trash the competition. Trust suffers.

## Naming consistency

| Where | Term |
|---|---|
| User-facing copy | **Private Runner** |
| Technical / architectural docs | **self-hosted runner** |
| User-facing | **Cloud Runner** |
| User-facing | **Browser Runner** or **This Device** |
| User-facing local mode | **Local Runner Mode** (or "your machine") |

Don't mix them in the same paragraph. Pick the register, stick with it.

---

## Sitemap

```
/                                       ← homepage
/plans                                ← bespoke
/self-hosted                            ← bespoke
/developers                             ← bespoke

/use-cases/                             ← single template + content collection
  cloud-to-cloud-transfer
  business-cloud-migration
  scheduled-cloud-backup
  private-runner
  browser-transfer            (Plan 2+)
  local-nas-backup            (Plan 2+)
  developer-automation        (Plan 2+)

/guides/                                ← single template + content collection
  move-files-between-clouds-without-downloading
  transfer-google-drive-to-onedrive
  transfer-onedrive-to-google-drive     (Plan 2+)
  transfer-dropbox-to-google-drive      (Plan 2+)
  backup-google-drive-to-s3             (Plan 2+)
  sync-google-drive-to-nextcloud        (Plan 2+)

/compare/                               ← deferred until first waitlist data
  multcloud-alternative
  mover-io-alternative
  rclone-alternative
```

Every page exists at `/<path>` (English) and `/pt-br/<path>` (Brazilian Portuguese). Plan 1 ships the homepage only; Plan 2 fills the bespoke + use-case + first two guides; Plan 3 ships pt-BR translations + analytics + sitemap.xml.

There is **no `/waitlist` page** — the form lives inline on every page.

---

## Suggested homepage flow

1. Hero with **product-like transfer planner** (animated, source → destination → runner → progress → completion).
2. Short broad promise.
3. **Provider row:** Google Drive, OneDrive, Dropbox, S3-compatible, SFTP, WebDAV, Nextcloud.
4. **Runner choice cards:** Cloud Runner, Browser Runner, Private Runner.
5. **Use-case router:** migration, backup, private transfer, local NAS, developer automation.
6. **Trust story:** preview, scoped access, progress, reports, runner transparency.
7. **Waitlist form** with use-case segmentation.

The homepage routes visitors to the right path quickly. It doesn't try to explain every technical detail.

---

## Landing page playbooks

### 1. Homepage (`/`)

| Field | Value |
|---|---|
| Public | People who already understand the pain of moving files between cloud providers but don't yet know which Syncologic mode they need |
| Primary promise | Move files between clouds without downloading them first |
| Best fit | Switching providers, consolidating storage, moving large folders, gave up on manual download/upload |
| Primary CTA | Join the waitlist |
| Secondary CTA | Choose your transfer type |
| Hero | Product-like transfer planner showing source, destination, transfer mode, runner choice, progress, completion |
| Sections | Transfer planner visual · Three runner choices · Common provider pairs · Preview before running · Completion report · Waitlist segmentation |
| Segmentation question | "What are you trying to transfer first?" |

### 2. Cloud-to-Cloud Transfer (`/use-cases/cloud-to-cloud-transfer`)

| Field | Value |
|---|---|
| Public | Individuals and small teams moving files directly from one cloud provider to another |
| Primary promise | Transfer folders between cloud drives without pulling everything through your laptop |
| Best fit | Drive→OneDrive, OneDrive→Drive, Dropbox→Drive, Drive→Dropbox, cloud drive→S3 |
| Pain | Manual download/upload is slow, fragile, often fails on large folders |
| Primary CTA | Join the cloud-to-cloud waitlist |
| Sections | Provider-to-provider workflow · Why browser downloads fail · Large folder handling · Transfer preview · Waitlist form |
| Segmentation question | "Which two clouds do you want to connect?" |

### 3. Business Cloud Migration (`/use-cases/business-cloud-migration`)

| Field | Value |
|---|---|
| Public | Founders, ops leads, IT generalists, small-business owners moving company files between workspace providers |
| Primary promise | Move team files to a new cloud workspace with a preview, progress tracking, and a final report |
| Best fit | Google Workspace → Microsoft 365, Dropbox Business → Workspace, OneDrive → Drive, archives → S3 |
| Pain | Business migrations need visibility and accountability — failures create missing files, duplicates, permission confusion |
| Primary CTA | Join the business migration waitlist |
| Sections | Migration checklist · Preview / dry-run language · Run reports · Scheduling · Private Runner option · Waitlist form |
| Segmentation question | "Are you migrating a team, company, or personal account?" |

### 4. Scheduled Cloud Backup (`/use-cases/scheduled-cloud-backup`)

| Field | Value |
|---|---|
| Public | Users and small teams who want recurring copies of important cloud folders |
| Primary promise | Back up important cloud folders on a schedule without babysitting manual exports |
| Best fit | Drive→S3, Drive→Dropbox, OneDrive→S3, Dropbox→S3, Nextcloud→S3 |
| Pain | Cloud storage is not the same as a backup plan; manual exports are easy to forget |
| Primary CTA | Join the backup waitlist |
| Sections | Scheduled jobs · Change detection · Backup reports · Destination options · Pricing signal · Waitlist form |
| Segmentation question | "How often would you want backups to run?" |

### 5. Private Runner (`/use-cases/private-runner`)

| Field | Value |
|---|---|
| Public | Privacy-conscious users, businesses, homelab users, technical operators who want bytes and credentials in their own infrastructure |
| Primary promise | Run transfers through your own machine, server, NAS, or VPS |
| Best fit | Privacy users, sensitive data, homelab always-on servers, high-volume users on their own bandwidth |
| Pain | Like the convenience of a hosted control plane, don't want the data path through someone else's infra |
| Primary CTA | Join the Private Runner waitlist |
| Sections | Data path diagram (source → private runner → destination) · Outbound connection model · Credential handling · NAS / VPS examples · Cloud Runner comparison · Waitlist form |
| Segmentation question | "Where would you run your private runner?" |

### 6. Browser Transfer (`/use-cases/browser-transfer`) — Plan 2+

| Field | Value |
|---|---|
| Public | Cautious first-time users who want a simple, transparent transfer path before trusting hosted or private infra |
| Primary promise | Move files through your browser when you want a simple, transparent transfer path |
| Best fit | Small-to-medium transfers, one-time moves, skeptics, free / low-friction entry |
| Pain | Want to try without installing software or trusting hosted data planes |
| Primary CTA | Join the Browser Runner waitlist |
| Sections | Browser transfer flow (tab must stay open) · Best-use boundaries · Upgrade path · Trust story · Waitlist form |
| Segmentation question | "Would you keep a browser tab open for a manual transfer?" |

### 7. Local NAS Backup (`/use-cases/local-nas-backup`) — Plan 2+

| Field | Value |
|---|---|
| Public | Homelab users, NAS owners, photographers, video editors, technical users wanting local folders or NAS data copied to cloud |
| Primary promise | Back up local folders or NAS storage to cloud destinations using a local runner mode |
| Best fit | NAS→S3, NAS→Drive, photo archive→Backblaze B2 / S3, workstation folder→cloud backup |
| Pain | Local data and NAS folders live outside normal cloud-drive tools; users want automation without enterprise heaviness |
| Primary CTA | Join the local backup waitlist |
| Sections | Local runner concept (reuses Private Runner) · NAS examples · Backup schedule · Restore language · Waitlist form |
| Segmentation question | "What local source do you want to back up?" |

### 8. Developer Automation (`/use-cases/developer-automation`) — Plan 2+

| Field | Value |
|---|---|
| Public | Developers, platform engineers, agencies, technical teams wanting APIs, CLI, webhooks, scripted transfer jobs |
| Primary promise | Automate cloud file transfers with an API, CLI, webhooks, and runners |
| Best fit | Agencies moving client assets, SaaS importing/exporting customer files, internal tools, scheduled transfer jobs |
| Pain | Provider differences, retries, rate limits, OAuth, reporting, resume — too much glue to maintain |
| Primary CTA | Join the developer waitlist |
| Sections | Future API shape · CLI story · Runner model · Webhook use cases · No premature SDK promise · Waitlist form |
| Segmentation question | "Which developer surface matters most: API, CLI, webhooks, or self-hosting?" |

### 9. Self-Hosted Future (`/self-hosted`)

| Field | Value |
|---|---|
| Public | Open-source-oriented users, businesses evaluating long-term control, technical buyers caring about source-visible / self-hostable architecture |
| Primary promise | Syncologic is being designed with a path toward source-visible, self-hostable infrastructure |
| Best fit | Privacy-sensitive users, technical buyers, homelab operators, businesses wanting an exit path from hosted SaaS |
| Pain | Don't want to build workflows around a black box that may disappear, lock them in, or hide the data path |
| Primary CTA | Join the self-hosting waitlist |
| Sections | Architecture principles (control plane vs data plane) · Private Runner first · Future self-host model · Public source trust · Waitlist form |
| Segmentation question | "Do you want a private runner, full self-hosting, or both?" |

### 10. Plans (`/plans`)

| Field | Value |
|---|---|
| Public | Visitors who understand the product and want to know whether it'll be affordable |
| Primary promise | Choose the transfer mode that matches your volume, schedule, and trust needs |
| Best fit | People comparing free/manual tools vs paid convenience, businesses budgeting migration, high-volume users evaluating private runner economics |
| Pain | Hesitate to join waitlists when they suspect the future product will be too expensive or mismatched |
| Primary CTA | Join the waitlist and help shape pricing |
| Sections | Pricing hypotheses (Free, Pro, Business, Private Runner) · What affects cost · Cloud vs private runner economics · Early access note · Waitlist form |
| Segmentation question | "Which pricing model would fit you best?" |

---

## SEO page playbooks

### Provider transfer guides

| Slug | Search intent | Routes to |
|---|---|---|
| `/guides/transfer-google-drive-to-onedrive` | How to move Google Drive files into OneDrive | Cloud-to-cloud or business migration |
| `/guides/transfer-onedrive-to-google-drive` | How to move OneDrive files into Google Drive | Cloud-to-cloud |
| `/guides/transfer-dropbox-to-google-drive` | How to leave Dropbox for Google Drive | Cloud-to-cloud |
| `/guides/backup-google-drive-to-s3` | How to back up Drive to object storage | Scheduled backup |
| `/guides/sync-google-drive-to-nextcloud` | How to keep Google Drive and Nextcloud aligned | Private Runner / scheduled backup |
| `/guides/move-files-between-clouds-without-downloading` | Broad problem query | Homepage / cloud-to-cloud |

### Comparison pages (deferred until first waitlist data)

| Slug | Search intent | Routes to |
|---|---|---|
| `/compare/multcloud-alternative` | Comparing cloud transfer tools | Cloud-to-cloud |
| `/compare/mover-io-alternative` | Discontinued migration option | Business migration |
| `/compare/rclone-alternative` | rclone is too technical for them | Private Runner / local backup / developer |

### Educational SEO pages

| Slug | Search intent | Routes to |
|---|---|---|
| `/guides/cloud-to-cloud-transfer` | Learn what cloud-to-cloud transfer means | Cloud-to-cloud |
| `/guides/cloud-storage-backup-vs-sync` | Understand backup vs sync | Scheduled backup |
| `/guides/private-runner-file-transfer` | Understand private runner architecture | Private Runner |
| `/guides/browser-based-file-transfer` | Understand browser transfer limits | Browser Runner |
| `/guides/self-hosted-cloud-transfer` | Understand self-hosted transfer options | Self-hosting |

---

## Waitlist segmentation

### Visitor → segment map

| Visitor answer | Send them to | Segment label |
|---|---|---|
| "I need to move files once" | `/use-cases/cloud-to-cloud-transfer` | `one_time_transfer` |
| "I am migrating a team" | `/use-cases/business-cloud-migration` | `business_migration` |
| "I want recurring backups" | `/use-cases/scheduled-cloud-backup` | `scheduled_backup` |
| "I want to use my own server" | `/use-cases/private-runner` | `private_runner` |
| "I want to try it in the browser" | `/use-cases/browser-transfer` | `browser_runner` |
| "I want to back up local/NAS files" | `/use-cases/local-nas-backup` | `local_backup` |
| "I want API or CLI automation" | `/use-cases/developer-automation` | `developer` |
| "I want self-hosting" | `/self-hosted` | `self_hosted` |

### Recommended waitlist fields

| Field | Why it matters |
|---|---|
| Email | Required for launch updates |
| Main use case | Segments visitors by landing page promise |
| Source provider | Validates provider demand |
| Destination provider | Validates provider pairs |
| Estimated data size | Separates consumer from business / high-volume |
| Transfer frequency | Distinguishes one-time migration from backup/sync |
| Preferred runner | Validates Cloud, Browser, Private demand |
| Role | Identifies consumer / business / IT / developer / homelab |

Form is short on the page; uses progressive steps after the email is captured.

### Schema (canonical, lives in `src/lib/validation.ts`)

**Never invent enum values.** Updating one means updating all of:

- `src/lib/validation.ts` — zod enums
- `supabase/migrations/*` — text columns (no DB enum, but the validation layer is the gatekeeper)
- `src/components/sections/WaitlistForm.astro` — Step-2 question options
- `src/i18n/en.json` + `src/i18n/pt-br.json` — labels
- `.claude/rules/architecture.md` and `CLAUDE.md` — taxonomy section

Current enums:
- **use_case:** `one_time_transfer`, `business_migration`, `scheduled_backup`, `private_runner`, `browser_runner`, `local_backup`, `developer`, `self_hosted`
- **provider:** `google_drive`, `onedrive`, `dropbox`, `s3`, `sftp`, `webdav`, `nextcloud`, `other`
- **est_size:** `lt_10gb`, `10_to_100gb`, `100gb_to_1tb`, `gt_1tb`
- **frequency:** `one_time`, `weekly`, `daily`, `continuous`
- **preferred_runner:** `cloud`, `browser`, `private`, `not_sure`
- **role:** `consumer`, `business`, `it`, `developer`, `homelab`
- **locale:** `en`, `pt-br`

---

## Provider list (canonical)

Always in this order when shown together:
1. Google Drive
2. OneDrive
3. Dropbox
4. S3-compatible storage
5. SFTP
6. WebDAV
7. Nextcloud

`other` exists in the schema for waitlist signal but is not shown in marketing visuals.

---

## i18n copy rules

- pt-BR is **Brazilian Portuguese**, not European Portuguese. "Você", not "Tu". "Arquivo", not "Ficheiro".
- Plan 1 ships English copy in `pt-br.json` as a placeholder. Plan 3 replaces it with real translations — don't translate ad-hoc in Plan 1/2.
- Don't translate brand names ("Syncologic", "Cloud Runner", "Private Runner", "Browser Runner" stay English in pt-BR copy).
- Translate provider product names where Brazilian users actually use the translated form — they don't, so keep "Google Drive", "OneDrive", "Dropbox" verbatim.

## Forbidden phrases

- "Coming soon" without a concrete signal of substance.
- "Lightning fast" / "blazing fast" — show numbers or stay quiet.
- "Enterprise-grade" — meaningless.
- "Revolutionary" — meaningless.
- "All your files in one place" — that's not what we do.
- Any superlative without a measurement.

## First-build priority

The first eight pages to ship (per spec scope and the original ideas doc):

1. `/`
2. `/use-cases/cloud-to-cloud-transfer`
3. `/use-cases/business-cloud-migration`
4. `/use-cases/scheduled-cloud-backup`
5. `/use-cases/private-runner`
6. `/plans`
7. `/guides/move-files-between-clouds-without-downloading`
8. `/guides/transfer-google-drive-to-onedrive`

That's one broad homepage, four audience-specific landings, one pricing validation page, two SEO entry points. After that, expand based on **waitlist data**, not guessing.
