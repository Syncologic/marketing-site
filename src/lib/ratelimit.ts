import { Redis } from '@upstash/redis';
import { createHash } from 'node:crypto';
import { getSecret } from './hmac';

const kv = new Redis({
  url: import.meta.env.KV_REST_API_URL,
  token: import.meta.env.KV_REST_API_TOKEN,
});

export function hashIp(ip: string): string {
  return createHash('sha256').update(ip + getSecret()).digest('hex').slice(0, 32);
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    '0.0.0.0'
  );
}

interface BudgetCheck {
  ok: boolean;
  remaining: number;
}

export async function incrementCounter(key: string, ttlSeconds: number): Promise<number> {
  const count = (await kv.incr(key)) as number;
  if (count === 1) {
    await kv.expire(key, ttlSeconds);
  }
  return count;
}

export async function checkPostBudget(ipHash: string): Promise<BudgetCheck> {
  const day = new Date().toISOString().slice(0, 10);
  const minute = new Date().toISOString().slice(0, 16);
  const hour = new Date().toISOString().slice(0, 13);

  const [perMin, perHour, perDay] = await Promise.all([
    incrementCounter(`rl:post:m:${ipHash}:${minute}`, 65),
    incrementCounter(`rl:post:h:${ipHash}:${hour}`, 3700),
    incrementCounter(`rl:post:d:${ipHash}:${day}`, 86500),
  ]);

  if (perMin > 5) return { ok: false, remaining: 0 };
  if (perHour > 20) return { ok: false, remaining: 0 };
  if (perDay > 50) return { ok: false, remaining: 0 };

  return { ok: true, remaining: Math.min(5 - perMin, 20 - perHour, 50 - perDay) };
}

export async function checkPatchBudget(ipHash: string, rowId: string): Promise<BudgetCheck> {
  const day = new Date().toISOString().slice(0, 10);
  const minute = new Date().toISOString().slice(0, 16);
  const hour = new Date().toISOString().slice(0, 13);

  const [perMin, perHour, perDay] = await Promise.all([
    incrementCounter(`rl:patch:m:${ipHash}:${minute}`, 65),
    incrementCounter(`rl:patch:h:${ipHash}:${hour}`, 3700),
    incrementCounter(`rl:patch:d:${ipHash}:${day}`, 86500),
  ]);

  if (perMin > 60) return { ok: false, remaining: 0 };
  if (perHour > 200) return { ok: false, remaining: 0 };
  if (perDay > 500) return { ok: false, remaining: 0 };

  const rowsKey = `rl:rows:${ipHash}:${day}`;
  const added = (await kv.sadd(rowsKey, rowId)) as number;
  if (added === 1) {
    await kv.expire(rowsKey, 86500);
  }
  const distinctCount = (await kv.scard(rowsKey)) as number;
  if (distinctCount > 5) {
    return { ok: false, remaining: 0 };
  }

  return { ok: true, remaining: Math.min(60 - perMin, 200 - perHour, 500 - perDay) };
}

export async function checkUnsubBudget(ipHash: string): Promise<BudgetCheck> {
  const hour = new Date().toISOString().slice(0, 13);
  const perHour = await incrementCounter(`rl:unsub:h:${ipHash}:${hour}`, 3700);

  if (perHour > 5) return { ok: false, remaining: 0 };
  return { ok: true, remaining: 5 - perHour };
}
