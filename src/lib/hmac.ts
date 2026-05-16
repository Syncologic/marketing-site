import { createHmac, timingSafeEqual } from 'node:crypto';

const DEV_FALLBACK_SECRET = 'dev-only-not-secret-' + 'd'.repeat(48);

export function getSecret(): string {
  const s = import.meta.env.WAITLIST_TOKEN_SECRET;
  if (s) return s;
  if (import.meta.env.DEV) return DEV_FALLBACK_SECRET;
  throw new Error('WAITLIST_TOKEN_SECRET is required');
}

export function signToken(rowId: string): string {
  return createHmac('sha256', getSecret()).update(rowId).digest('hex');
}

export function verifyToken(rowId: string, token: string): boolean {
  if (!/^[0-9a-f]{64}$/i.test(token)) return false;
  const expected = signToken(rowId);
  const a = Buffer.from(token, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
