# Waitlist segmentation, provider list, and i18n

## Waitlist segmentation

### Visitor → segment map

| Visitor answer | Send them to | Segment label |
|---|---|---|
| "I need to move files once" | `/use-cases/cloud-to-cloud-transfer` | `one_time_transfer` |
| "I am migrating a team" | `/use-cases/business-cloud-migration` | `business_migration` |
| "I want recurring backups" | `/use-cases/scheduled-cloud-backup` | `scheduled_backup` |
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
- **use_case:** `one_time_transfer`, `business_migration`, `scheduled_backup`, `local_backup`, `developer`, `self_hosted`
- **provider:** `google_drive`, `onedrive`, `dropbox`, `s3`, `sftp`, `your_server`, `nextcloud`, `other`
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
6. Your server
7. Nextcloud

`other` exists in the schema for waitlist signal but is not shown in marketing visuals.

---

## i18n copy rules

- pt-BR is **Brazilian Portuguese**, not European Portuguese. "Você", not "Tu". "Arquivo", not "Ficheiro".
- Plan 1 ships English copy in `pt-br.json` as a placeholder. Plan 3 replaces it with real translations — don't translate ad-hoc in Plan 1/2.
- Don't translate brand names ("Syncologic", "Cloud Runner", "Private Runner", "Browser Runner" stay English in pt-BR copy).
- Translate provider product names where Brazilian users actually use the translated form — they don't, so keep "Google Drive", "OneDrive", "Dropbox" verbatim.

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
