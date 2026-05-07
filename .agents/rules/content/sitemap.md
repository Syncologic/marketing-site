# Sitemap and page-type discipline

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
