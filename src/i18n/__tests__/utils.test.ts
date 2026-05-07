import { describe, it, expect } from 'vitest';
import { getLocaleFromUrl, pathWithoutLocale, localizedPath, getT } from '../utils';

describe('getLocaleFromUrl', () => {
  it('returns en for /', () => {
    expect(getLocaleFromUrl(new URL('http://x.test/'))).toBe('en');
  });
  it('returns en for /plans', () => {
    expect(getLocaleFromUrl(new URL('http://x.test/plans'))).toBe('en');
  });
  it('returns pt-br for /pt-br/', () => {
    expect(getLocaleFromUrl(new URL('http://x.test/pt-br/'))).toBe('pt-br');
  });
  it('returns pt-br for /pt-br/plans', () => {
    expect(getLocaleFromUrl(new URL('http://x.test/pt-br/plans'))).toBe('pt-br');
  });
});

describe('pathWithoutLocale', () => {
  it('returns / for /', () => {
    expect(pathWithoutLocale('/')).toBe('/');
  });
  it('returns / for /pt-br', () => {
    expect(pathWithoutLocale('/pt-br')).toBe('/');
  });
  it('returns /plans for /pt-br/plans', () => {
    expect(pathWithoutLocale('/pt-br/plans')).toBe('/plans');
  });
  it('leaves /plans alone', () => {
    expect(pathWithoutLocale('/plans')).toBe('/plans');
  });
});

describe('localizedPath', () => {
  it('keeps en root', () => {
    expect(localizedPath('en', '/')).toBe('/');
  });
  it('strips pt-br prefix when going to en', () => {
    expect(localizedPath('en', '/pt-br/plans')).toBe('/plans');
  });
  it('adds pt-br prefix when going to pt-br from /', () => {
    expect(localizedPath('pt-br', '/')).toBe('/pt-br/');
  });
  it('adds pt-br prefix when going to pt-br from /plans', () => {
    expect(localizedPath('pt-br', '/plans')).toBe('/pt-br/plans');
  });
});

describe('getT', () => {
  it('returns nested key', () => {
    const t = getT('en');
    expect(t('nav.pricing')).toBe('Plans');
  });
  it('interpolates vars', () => {
    const t = getT('en');
    expect(t('footer.copyright', { year: 2026 })).toBe('© 2026 Syncologic');
  });
  it('returns key on miss', () => {
    const t = getT('en');
    expect(t('not.a.real.key')).toBe('not.a.real.key');
  });
});
