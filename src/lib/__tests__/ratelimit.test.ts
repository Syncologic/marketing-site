import { describe, it, expect, beforeEach, vi } from 'vitest';

const { kvState, kvMock } = vi.hoisted(() => {
  process.env.KV_REST_API_URL = 'http://test.local';
  process.env.KV_REST_API_TOKEN = 'test-token';
  const kvState = {
    counters: new Map<string, number>(),
    expirations: new Map<string, number>(),
    sets: new Map<string, Set<string>>(),
  };
  const kvMock = {
    incr: vi.fn(async (key: string) => {
      const next = (kvState.counters.get(key) ?? 0) + 1;
      kvState.counters.set(key, next);
      return next;
    }),
    expire: vi.fn(async (key: string, seconds: number) => {
      kvState.expirations.set(key, seconds);
      return 1;
    }),
    sadd: vi.fn(async (key: string, member: string) => {
      const set = kvState.sets.get(key) ?? new Set<string>();
      const had = set.has(member);
      set.add(member);
      kvState.sets.set(key, set);
      return had ? 0 : 1;
    }),
    scard: vi.fn(async (key: string) => kvState.sets.get(key)?.size ?? 0),
  };
  return { kvState, kvMock };
});

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn(function Redis(this: unknown) {
    return kvMock;
  }),
}));

import {
  hashIp,
  getClientIp,
  incrementCounter,
  checkPostBudget,
  checkPatchBudget,
  checkUnsubBudget,
} from '../ratelimit';

beforeEach(() => {
  kvState.counters.clear();
  kvState.expirations.clear();
  kvState.sets.clear();
});

describe('hashIp', () => {
  it('returns a 32-char hex string', () => {
    const h = hashIp('1.2.3.4');
    expect(h).toMatch(/^[0-9a-f]{32}$/);
  });
  it('is deterministic for the same input', () => {
    expect(hashIp('1.2.3.4')).toBe(hashIp('1.2.3.4'));
  });
  it('produces different hashes for different IPs', () => {
    expect(hashIp('1.2.3.4')).not.toBe(hashIp('5.6.7.8'));
  });
});

function req(headers: Record<string, string>): Request {
  return new Request('http://x.test/', { headers });
}

describe('getClientIp', () => {
  it('prefers x-real-ip', () => {
    expect(getClientIp(req({ 'x-real-ip': '9.9.9.9', 'x-forwarded-for': '1.1.1.1' }))).toBe(
      '9.9.9.9'
    );
  });
  it('falls back to first x-forwarded-for entry, trimmed', () => {
    expect(getClientIp(req({ 'x-forwarded-for': ' 1.1.1.1 , 2.2.2.2' }))).toBe('1.1.1.1');
  });
  it('returns 0.0.0.0 when neither header is set', () => {
    expect(getClientIp(req({}))).toBe('0.0.0.0');
  });
});

describe('incrementCounter', () => {
  it('returns the running count and sets TTL on first increment only', async () => {
    kvMock.expire.mockClear();

    expect(await incrementCounter('k', 60)).toBe(1);
    expect(kvMock.expire).toHaveBeenCalledWith('k', 60);

    expect(await incrementCounter('k', 60)).toBe(2);
    expect(kvMock.expire).toHaveBeenCalledTimes(1);
  });
});

describe('checkPostBudget', () => {
  it('allows up to 5 requests per minute, then blocks', async () => {
    const ip = hashIp('1.1.1.1');
    for (let i = 0; i < 5; i++) {
      const r = await checkPostBudget(ip);
      expect(r.ok).toBe(true);
    }
    const blocked = await checkPostBudget(ip);
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('returns decreasing remaining as quota is consumed', async () => {
    const ip = hashIp('2.2.2.2');
    const first = await checkPostBudget(ip);
    const second = await checkPostBudget(ip);
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(second.remaining).toBeLessThan(first.remaining);
  });
});

describe('checkPatchBudget', () => {
  it('allows the same row to be patched repeatedly under the per-minute cap', async () => {
    const ip = hashIp('3.3.3.3');
    const row = 'row-a';
    for (let i = 0; i < 10; i++) {
      const r = await checkPatchBudget(ip, row);
      expect(r.ok).toBe(true);
    }
  });

  it('blocks once a 6th distinct row is touched in a day', async () => {
    const ip = hashIp('4.4.4.4');
    for (let i = 0; i < 5; i++) {
      const r = await checkPatchBudget(ip, `row-${i}`);
      expect(r.ok).toBe(true);
    }
    const blocked = await checkPatchBudget(ip, 'row-6th');
    expect(blocked.ok).toBe(false);
  });

  it('blocks after 60 requests in the same minute', async () => {
    const ip = hashIp('5.5.5.5');
    const row = 'row-z';
    for (let i = 0; i < 60; i++) {
      const r = await checkPatchBudget(ip, row);
      expect(r.ok).toBe(true);
    }
    const blocked = await checkPatchBudget(ip, row);
    expect(blocked.ok).toBe(false);
  });
});

describe('checkUnsubBudget', () => {
  it('allows up to 5 requests per hour, then blocks', async () => {
    const ip = hashIp('6.6.6.6');
    for (let i = 0; i < 5; i++) {
      const r = await checkUnsubBudget(ip);
      expect(r.ok).toBe(true);
    }
    const blocked = await checkUnsubBudget(ip);
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('returns decreasing remaining as quota is consumed', async () => {
    const ip = hashIp('7.7.7.7');
    const first = await checkUnsubBudget(ip);
    const second = await checkUnsubBudget(ip);
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(second.remaining).toBeLessThan(first.remaining);
  });

  it('keeps separate IP buckets independent', async () => {
    const ipA = hashIp('8.8.8.8');
    const ipB = hashIp('9.9.9.9');
    for (let i = 0; i < 5; i++) {
      expect((await checkUnsubBudget(ipA)).ok).toBe(true);
    }
    expect((await checkUnsubBudget(ipA)).ok).toBe(false);
    expect((await checkUnsubBudget(ipB)).ok).toBe(true);
  });

  it('uses one INCR + one EXPIRE on first hit, INCR-only thereafter', async () => {
    kvMock.incr.mockClear();
    kvMock.expire.mockClear();
    const ip = hashIp('10.10.10.10');
    await checkUnsubBudget(ip);
    expect(kvMock.incr).toHaveBeenCalledTimes(1);
    expect(kvMock.expire).toHaveBeenCalledTimes(1);
    await checkUnsubBudget(ip);
    expect(kvMock.incr).toHaveBeenCalledTimes(2);
    expect(kvMock.expire).toHaveBeenCalledTimes(1);
  });
});
