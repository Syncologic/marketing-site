import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.SUPABASE_URL;
const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  if (import.meta.env.DEV) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are missing.\n' +
        'Local dev: `cp .env.example .env` then `npm run dev:up` then `npm run dev`.\n' +
        'See CONTRIBUTING.md → "Setup" for details.',
    );
  }
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export type WaitlistRow = {
  id: string;
  email: string;
  source_page: string | null;
  segment_hint: string | null;
  locale: string;
  use_case: string | null;
  source_provider: string | null;
  dest_provider: string | null;
  est_size: string | null;
  frequency: string | null;
  preferred_runner: string | null;
  role: string | null;
  user_agent: string | null;
  referrer: string | null;
  ip_hash: string | null;
  unsubscribe_token: string;
  segmentation_completed_at: string | null;
  removed_at: string | null;
  confirmed_at: string | null;
  rejoin_count: number;
  created_at: string;
  updated_at: string;
};
