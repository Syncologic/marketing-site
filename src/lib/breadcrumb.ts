import type { Locale } from '../i18n/utils';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumb(
  locale: Locale,
  items: BreadcrumbItem[],
): Record<string, unknown> {
  if (items.length === 0) {
    throw new Error('buildBreadcrumb requires at least one item');
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    inLanguage: locale === 'pt-br' ? 'pt-BR' : 'en',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
