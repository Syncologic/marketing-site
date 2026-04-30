import en from './en.json';
import ptBr from './pt-br.json';

export type Locale = 'en' | 'pt-br';
export const LOCALES: Locale[] = ['en', 'pt-br'];
export const DEFAULT_LOCALE: Locale = 'en';

const dictionaries: Record<Locale, unknown> = { en, 'pt-br': ptBr };

export function getLocaleFromUrl(url: URL): Locale {
  const segments = url.pathname.split('/').filter(Boolean);
  if (segments[0] === 'pt-br') return 'pt-br';
  return 'en';
}

export function pathWithoutLocale(pathname: string): string {
  if (pathname.startsWith('/pt-br/')) return pathname.slice('/pt-br'.length);
  if (pathname === '/pt-br') return '/';
  return pathname;
}

export function localizedPath(locale: Locale, pathname: string): string {
  const stripped = pathWithoutLocale(pathname);
  if (locale === 'en') return stripped;
  return stripped === '/' ? '/pt-br/' : `/pt-br${stripped}`;
}

function lookup(dict: unknown, key: string): string {
  return (
    (key.split('.').reduce<unknown>((acc, segment) => {
      if (acc && typeof acc === 'object' && segment in (acc as Record<string, unknown>)) {
        return (acc as Record<string, unknown>)[segment];
      }
      return undefined;
    }, dict) as string | undefined) ?? key
  );
}

function interpolate(value: string, vars: Record<string, string | number>): string {
  return value.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`));
}

export function getT(locale: Locale) {
  const dict = dictionaries[locale];
  return (key: string, vars?: Record<string, string | number>): string => {
    const value = lookup(dict, key);
    return vars ? interpolate(value, vars) : value;
  };
}
