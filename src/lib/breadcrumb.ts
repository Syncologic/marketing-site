import type { Locale } from '../i18n/utils';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface BreadcrumbListItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}

export interface BreadcrumbSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  inLanguage: 'en' | 'pt-BR';
  itemListElement: BreadcrumbListItem[];
}

export function buildBreadcrumb(locale: Locale, items: BreadcrumbItem[]): BreadcrumbSchema {
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
