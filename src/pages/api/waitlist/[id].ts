import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { waitlistPatchSchema } from '../../../lib/validation';
import { verifyToken } from '../../../lib/hmac';
import { hashIp, getClientIp, checkPatchBudget } from '../../../lib/ratelimit';
import { isAllowedOrigin } from '../../../lib/origin';

export const prerender = false;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const PATCH: APIRoute = async ({ request, params }) => {
  if (!isAllowedOrigin(request)) {
    return json({ error: 'forbidden_origin' }, 403);
  }

  const id = params.id;
  if (!id || !/^[0-9a-f-]{36}$/.test(id)) {
    return json({ error: 'invalid_id' }, 400);
  }

  const token = request.headers.get('x-waitlist-token') ?? '';
  if (!verifyToken(id, token)) {
    return json({ error: 'invalid_token' }, 401);
  }

  const ip = getClientIp(request);
  const ipHash = hashIp(ip);
  const budget = await checkPatchBudget(ipHash, id);
  if (!budget.ok) {
    return json({ error: 'rate_limited' }, 429);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }
  const parsed = waitlistPatchSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ error: 'invalid_input' }, 400);
  }

  const row = await supabase
    .from('waitlist')
    .select('id, segmentation_completed_at')
    .eq('id', id)
    .maybeSingle();

  if (!row.data) {
    return json({ error: 'not_found' }, 404);
  }
  if (row.data.segmentation_completed_at) {
    return json({ error: 'already_completed' }, 409);
  }

  const { _complete, ...fields } = parsed.data;
  const update: Record<string, unknown> = { ...fields };
  if (_complete) {
    update.segmentation_completed_at = new Date().toISOString();
  }

  if (Object.keys(update).length === 0) {
    return json({ status: 'ok' }, 200);
  }

  const result = await supabase.from('waitlist').update(update).eq('id', id);
  if (result.error) {
    console.error('waitlist patch failed', result.error);
    return json({ error: 'server_error' }, 500);
  }

  return json({ status: 'ok' }, 200);
};
