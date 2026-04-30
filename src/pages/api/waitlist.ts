import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { sendWaitlistConfirmation } from '../../lib/resend';
import { waitlistPostSchema } from '../../lib/validation';
import { signToken } from '../../lib/hmac';
import { hashIp, getClientIp, checkPostBudget } from '../../lib/ratelimit';

export const prerender = false;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const parsed = waitlistPostSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ error: 'invalid_input', issues: parsed.error.flatten() }, 400);
  }

  if (parsed.data.website && parsed.data.website.length > 0) {
    return json({ status: 'ok' }, 200);
  }

  const ip = getClientIp(request);
  const ipHash = hashIp(ip);

  const budget = await checkPostBudget(ipHash);
  if (!budget.ok) {
    return json({ error: 'rate_limited' }, 429);
  }

  const { email, locale, source_page, segment_hint } = parsed.data;
  const userAgent = request.headers.get('user-agent') ?? null;
  const referrer = request.headers.get('referer') ?? null;

  const existing = await supabase
    .from('waitlist')
    .select('id, unsubscribe_token')
    .eq('email', email)
    .maybeSingle();

  let id: string;
  let unsubscribeToken: string;

  if (existing.data) {
    id = existing.data.id as string;
    unsubscribeToken = existing.data.unsubscribe_token as string;
  } else {
    const inserted = await supabase
      .from('waitlist')
      .insert({
        email,
        locale,
        source_page: source_page ?? null,
        segment_hint: segment_hint ?? null,
        user_agent: userAgent,
        referrer,
        ip_hash: ipHash,
      })
      .select('id, unsubscribe_token')
      .single();

    if (inserted.error || !inserted.data) {
      console.error('waitlist insert failed', inserted.error);
      return json({ error: 'server_error' }, 500);
    }
    id = inserted.data.id as string;
    unsubscribeToken = inserted.data.unsubscribe_token as string;
  }

  const token = signToken(id);
  const siteUrl = import.meta.env.PUBLIC_SITE_URL || new URL(request.url).origin;
  const segmentationLink = `${siteUrl}${source_page ?? '/'}#waitlist?id=${id}&t=${token}`;
  const unsubscribeLink = `${siteUrl}/api/waitlist/unsubscribe?token=${unsubscribeToken}`;

  sendWaitlistConfirmation({ to: email, locale, segmentationLink, unsubscribeLink }).catch((err) =>
    console.error('confirmation email failed', err),
  );

  return json({ id, token, status: existing.data ? 'existed' : 'created' }, 200);
};
