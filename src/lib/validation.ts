import { z } from 'zod';

export const USE_CASES = [
  'one_time_transfer',
  'business_migration',
  'scheduled_backup',
  'local_backup',
  'developer',
  'self_hosted',
] as const;

export const PROVIDERS = [
  'google_drive',
  'onedrive',
  'dropbox',
  's3',
  'sftp',
  'your_server',
  'nextcloud',
  'other',
] as const;

export const SIZES = ['lt_10gb', '10_to_100gb', '100gb_to_1tb', 'gt_1tb'] as const;
export const FREQUENCIES = ['one_time', 'weekly', 'daily', 'continuous'] as const;
export const RUNNERS = ['cloud', 'browser', 'private', 'not_sure'] as const;
export const ROLES = ['consumer', 'business', 'it', 'developer', 'homelab'] as const;
export const LOCALES = ['en', 'pt-br'] as const;

export const waitlistPostSchema = z
  .object({
    email: z.string().email().max(254),
    locale: z.enum(LOCALES).default('en'),
    source_page: z
      .string()
      .regex(/^\/[a-zA-Z0-9/_-]*$/)
      .max(255)
      .optional(),
    segment_hint: z.enum(USE_CASES).nullable().optional(),
    website: z.string().max(1).optional(),
  })
  .strict();

export const waitlistPatchSchema = z
  .object({
    use_case: z.enum(USE_CASES).optional(),
    source_provider: z.enum(PROVIDERS).optional(),
    dest_provider: z.enum(PROVIDERS).optional(),
    est_size: z.enum(SIZES).optional(),
    frequency: z.enum(FREQUENCIES).optional(),
    preferred_runner: z.enum(RUNNERS).optional(),
    role: z.enum(ROLES).optional(),
    _complete: z.boolean().optional(),
  })
  .strict();

export type WaitlistPost = z.infer<typeof waitlistPostSchema>;
export type WaitlistPatch = z.infer<typeof waitlistPatchSchema>;
