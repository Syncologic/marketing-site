import { describe, it, expect, beforeAll } from 'vitest';
import { signToken, verifyToken } from '../hmac';

beforeAll(() => {
  if (!import.meta.env.WAITLIST_TOKEN_SECRET) {
    process.env.WAITLIST_TOKEN_SECRET = 'a'.repeat(64);
  }
});

describe('hmac', () => {
  it('signs and verifies a valid token', () => {
    const token = signToken('row-123');
    expect(verifyToken('row-123', token)).toBe(true);
  });

  it('rejects a token for a different id', () => {
    const token = signToken('row-123');
    expect(verifyToken('row-456', token)).toBe(false);
  });

  it('rejects a tampered token', () => {
    const token = signToken('row-123');
    const tampered = token.slice(0, -2) + 'XX';
    expect(verifyToken('row-123', tampered)).toBe(false);
  });

  it('signs same id deterministically', () => {
    expect(signToken('row-1')).toBe(signToken('row-1'));
  });
});
