import { describe, it, expect } from 'vitest';
import { waitlistPostSchema, waitlistPatchSchema } from '../validation';

describe('waitlistPostSchema', () => {
  it('accepts a valid signup', () => {
    const r = waitlistPostSchema.safeParse({ email: 'a@b.test', locale: 'en' });
    expect(r.success).toBe(true);
  });
  it('rejects bad email', () => {
    expect(waitlistPostSchema.safeParse({ email: 'not-an-email', locale: 'en' }).success).toBe(false);
  });
  it('rejects unknown locale', () => {
    expect(waitlistPostSchema.safeParse({ email: 'a@b.test', locale: 'fr' }).success).toBe(false);
  });
  it('rejects unknown fields', () => {
    const r = waitlistPostSchema.safeParse({ email: 'a@b.test', locale: 'en', evil: 'x' });
    expect(r.success).toBe(false);
  });
});

describe('waitlistPatchSchema', () => {
  it('accepts valid use_case', () => {
    expect(waitlistPatchSchema.safeParse({ use_case: 'business_migration' }).success).toBe(true);
  });
  it('rejects invalid use_case', () => {
    expect(waitlistPatchSchema.safeParse({ use_case: 'bogus' }).success).toBe(false);
  });
  it('accepts _complete flag', () => {
    expect(waitlistPatchSchema.safeParse({ _complete: true }).success).toBe(true);
  });
  it('rejects email field', () => {
    expect(waitlistPatchSchema.safeParse({ email: 'a@b.test' }).success).toBe(false);
  });
  it('accepts empty patch (heartbeat)', () => {
    expect(waitlistPatchSchema.safeParse({}).success).toBe(true);
  });
});
