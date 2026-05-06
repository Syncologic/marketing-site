import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  isAllowedOriginMock,
  checkPostBudgetMock,
  getClientIpMock,
  hashIpMock,
  signTokenMock,
  sendWaitlistConfirmationMock,
  maybeSingleMock,
  insertSingleMock,
  updateEqMock,
} = vi.hoisted(() => ({
  isAllowedOriginMock: vi.fn(),
  checkPostBudgetMock: vi.fn(),
  getClientIpMock: vi.fn(),
  hashIpMock: vi.fn(),
  signTokenMock: vi.fn(),
  sendWaitlistConfirmationMock: vi.fn(),
  maybeSingleMock: vi.fn(),
  insertSingleMock: vi.fn(),
  updateEqMock: vi.fn(),
}));

vi.mock('../../../lib/origin', () => ({
  isAllowedOrigin: isAllowedOriginMock,
}));

vi.mock('../../../lib/ratelimit', () => ({
  checkPostBudget: checkPostBudgetMock,
  getClientIp: getClientIpMock,
  hashIp: hashIpMock,
}));

vi.mock('../../../lib/hmac', () => ({
  signToken: signTokenMock,
}));

vi.mock('../../../lib/resend', () => ({
  sendWaitlistConfirmation: sendWaitlistConfirmationMock,
}));

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: maybeSingleMock,
        }),
      }),
      insert: () => ({
        select: () => ({
          single: insertSingleMock,
        }),
      }),
      update: () => ({
        eq: updateEqMock,
      }),
    }),
  },
}));

import { POST } from '../waitlist';

function makeRequest(body: unknown, init: RequestInit = {}): Request {
  return new Request('http://localhost:4321/api/waitlist', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'http://localhost:4321', ...(init.headers as Record<string, string>) },
    body: typeof body === 'string' ? body : JSON.stringify(body),
    ...init,
  });
}

async function callPost(req: Request): Promise<{ status: number; body: Record<string, unknown> }> {
  const res = (await POST({ request: req } as Parameters<typeof POST>[0])) as Response;
  const text = await res.text();
  return { status: res.status, body: text ? (JSON.parse(text) as Record<string, unknown>) : {} };
}

beforeEach(() => {
  vi.clearAllMocks();
  isAllowedOriginMock.mockReturnValue(true);
  checkPostBudgetMock.mockResolvedValue({ ok: true });
  getClientIpMock.mockReturnValue('127.0.0.1');
  hashIpMock.mockReturnValue('hashed-ip');
  signTokenMock.mockReturnValue('signed-token');
  sendWaitlistConfirmationMock.mockResolvedValue(undefined);
  maybeSingleMock.mockResolvedValue({ data: null, error: null });
  insertSingleMock.mockResolvedValue({
    data: { id: 'row-id', unsubscribe_token: 'unsub-token' },
    error: null,
  });
  updateEqMock.mockResolvedValue({ error: null });
});

describe('POST /api/waitlist', () => {
  it('rejects a disallowed origin with 403', async () => {
    isAllowedOriginMock.mockReturnValue(false);
    const { status, body } = await callPost(makeRequest({ email: 'a@b.test', locale: 'en' }));
    expect(status).toBe(403);
    expect(body.error).toBe('forbidden_origin');
    expect(insertSingleMock).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON with 400 invalid_json', async () => {
    const { status, body } = await callPost(makeRequest('{not-json'));
    expect(status).toBe(400);
    expect(body.error).toBe('invalid_json');
  });

  it('rejects an invalid email with 400 invalid_input', async () => {
    const { status, body } = await callPost(makeRequest({ email: 'not-an-email', locale: 'en' }));
    expect(status).toBe(400);
    expect(body.error).toBe('invalid_input');
    expect(insertSingleMock).not.toHaveBeenCalled();
  });

  it('silently 200s when the honeypot is filled and never touches the DB', async () => {
    const { status, body } = await callPost(
      makeRequest({ email: 'a@b.test', locale: 'en', website: 'http://spam.example' }),
    );
    expect(status).toBe(200);
    expect(body).toEqual({ status: 'ok' });
    expect(checkPostBudgetMock).not.toHaveBeenCalled();
    expect(insertSingleMock).not.toHaveBeenCalled();
    expect(sendWaitlistConfirmationMock).not.toHaveBeenCalled();
  });

  it('returns 429 rate_limited when the per-IP budget is exhausted', async () => {
    checkPostBudgetMock.mockResolvedValue({ ok: false });
    const { status, body } = await callPost(makeRequest({ email: 'a@b.test', locale: 'en' }));
    expect(status).toBe(429);
    expect(body.error).toBe('rate_limited');
    expect(insertSingleMock).not.toHaveBeenCalled();
  });

  it('inserts a new signup and returns 200 with id + token', async () => {
    const { status, body } = await callPost(makeRequest({ email: 'a@b.test', locale: 'en' }));
    expect(status).toBe(200);
    expect(body).toEqual({ id: 'row-id', token: 'signed-token' });
    expect(insertSingleMock).toHaveBeenCalledTimes(1);
    expect(updateEqMock).not.toHaveBeenCalled();
    expect(signTokenMock).toHaveBeenCalledWith('row-id');
    expect(sendWaitlistConfirmationMock).toHaveBeenCalledTimes(1);
    expect(sendWaitlistConfirmationMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'a@b.test', locale: 'en' }),
    );
  });

  it('rejoins a previously removed signup (rejoin_count=0) and re-sends the welcome', async () => {
    maybeSingleMock.mockResolvedValue({
      data: {
        id: 'row-id',
        unsubscribe_token: 'unsub-token',
        removed_at: '2026-01-01T00:00:00Z',
        rejoin_count: 0,
      },
      error: null,
    });
    const { status, body } = await callPost(makeRequest({ email: 'a@b.test', locale: 'en' }));
    expect(status).toBe(200);
    expect(body).toEqual({ id: 'row-id', token: 'signed-token' });
    expect(updateEqMock).toHaveBeenCalledTimes(1);
    expect(insertSingleMock).not.toHaveBeenCalled();
    expect(sendWaitlistConfirmationMock).toHaveBeenCalledTimes(1);
  });

  it('refuses a second rejoin and returns 409 already_removed', async () => {
    maybeSingleMock.mockResolvedValue({
      data: {
        id: 'row-id',
        unsubscribe_token: 'unsub-token',
        removed_at: '2026-01-01T00:00:00Z',
        rejoin_count: 1,
      },
      error: null,
    });
    const { status, body } = await callPost(makeRequest({ email: 'a@b.test', locale: 'en' }));
    expect(status).toBe(409);
    expect(body.error).toBe('already_removed');
    expect(updateEqMock).not.toHaveBeenCalled();
    expect(insertSingleMock).not.toHaveBeenCalled();
    expect(sendWaitlistConfirmationMock).not.toHaveBeenCalled();
  });

  it('does not re-send the welcome to an active existing signup', async () => {
    maybeSingleMock.mockResolvedValue({
      data: {
        id: 'row-id',
        unsubscribe_token: 'unsub-token',
        removed_at: null,
        rejoin_count: 0,
      },
      error: null,
    });
    const { status, body } = await callPost(makeRequest({ email: 'a@b.test', locale: 'en' }));
    expect(status).toBe(200);
    expect(body).toEqual({ id: 'row-id', token: 'signed-token' });
    expect(insertSingleMock).not.toHaveBeenCalled();
    expect(updateEqMock).not.toHaveBeenCalled();
    expect(sendWaitlistConfirmationMock).not.toHaveBeenCalled();
  });

  it('returns 500 server_error when the insert fails', async () => {
    insertSingleMock.mockResolvedValue({ data: null, error: { message: 'db down' } });
    const { status, body } = await callPost(makeRequest({ email: 'a@b.test', locale: 'en' }));
    expect(status).toBe(500);
    expect(body.error).toBe('server_error');
    expect(sendWaitlistConfirmationMock).not.toHaveBeenCalled();
  });
});
