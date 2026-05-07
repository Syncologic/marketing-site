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
  it('rejects dropped segment_hint private_runner', () => {
    const r = waitlistPostSchema.safeParse({ email: 'a@b.test', locale: 'en', segment_hint: 'private_runner' });
    expect(r.success).toBe(false);
  });
  it('rejects dropped segment_hint browser_runner', () => {
    const r = waitlistPostSchema.safeParse({ email: 'a@b.test', locale: 'en', segment_hint: 'browser_runner' });
    expect(r.success).toBe(false);
  });
  it('accepts a single-character honeypot so the handler can silently 200', () => {
    const r = waitlistPostSchema.safeParse({
      email: 'a@b.test',
      locale: 'en',
      website: 'x',
    });
    expect(r.success).toBe(true);
  });

  it('rejects a multi-character honeypot value (length cap)', () => {
    const r = waitlistPostSchema.safeParse({
      email: 'a@b.test',
      locale: 'en',
      website: 'http://spam.example',
    });
    expect(r.success).toBe(false);
  });

  it('accepts a path-shaped source_page', () => {
    const r = waitlistPostSchema.safeParse({
      email: 'a@b.test',
      locale: 'en',
      source_page: '/use-cases/cloud-to-cloud-transfer',
    });
    expect(r.success).toBe(true);
  });

  it('rejects a javascript: pseudo-protocol in source_page', () => {
    const r = waitlistPostSchema.safeParse({
      email: 'a@b.test',
      locale: 'en',
      source_page: 'javascript:alert(1)',
    });
    expect(r.success).toBe(false);
  });

  it('rejects an HTML-injection payload in source_page', () => {
    const r = waitlistPostSchema.safeParse({
      email: 'a@b.test',
      locale: 'en',
      source_page: '"><img src=x onerror=alert(1)>',
    });
    expect(r.success).toBe(false);
  });

  it('rejects a source_page that does not start with /', () => {
    const r = waitlistPostSchema.safeParse({
      email: 'a@b.test',
      locale: 'en',
      source_page: 'evil.com/path',
    });
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
  it('rejects dropped use_case private_runner', () => {
    expect(waitlistPatchSchema.safeParse({ use_case: 'private_runner' }).success).toBe(false);
  });
  it('rejects dropped use_case browser_runner', () => {
    expect(waitlistPatchSchema.safeParse({ use_case: 'browser_runner' }).success).toBe(false);
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
  it('accepts your_server provider', () => {
    expect(waitlistPatchSchema.safeParse({ source_provider: 'your_server', dest_provider: 'your_server' }).success).toBe(true);
  });
  it('rejects dropped provider webdav', () => {
    expect(waitlistPatchSchema.safeParse({ source_provider: 'webdav' }).success).toBe(false);
    expect(waitlistPatchSchema.safeParse({ dest_provider: 'webdav' }).success).toBe(false);
  });
});
