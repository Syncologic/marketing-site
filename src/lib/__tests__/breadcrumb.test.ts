import { describe, it, expect } from 'vitest';
import { buildBreadcrumb } from '../breadcrumb';

describe('buildBreadcrumb', () => {
  it('produces a single-step BreadcrumbList for Home → leaf', () => {
    const schema = buildBreadcrumb('en', [
      { name: 'Home', url: 'https://syncologic.com/' },
      { name: 'Plans', url: 'https://syncologic.com/plans' },
    ]);
    expect(schema).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      inLanguage: 'en',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://syncologic.com/' },
        { '@type': 'ListItem', position: 2, name: 'Plans', item: 'https://syncologic.com/plans' },
      ],
    });
  });

  it('uses pt-BR for the pt-br locale', () => {
    const schema = buildBreadcrumb('pt-br', [
      { name: 'Início', url: 'https://syncologic.com/pt-br/' },
      { name: 'Planos', url: 'https://syncologic.com/pt-br/plans' },
    ]);
    expect(schema).toMatchObject({
      inLanguage: 'pt-BR',
      itemListElement: [
        { position: 1 },
        { position: 2 },
      ],
    });
  });

  it('preserves order and assigns sequential positions', () => {
    const schema = buildBreadcrumb('en', [
      { name: 'Home', url: 'https://syncologic.com/' },
      { name: 'Guides', url: 'https://syncologic.com/guides' },
      { name: 'Move files', url: 'https://syncologic.com/guides/move' },
    ]);
    expect(schema).toMatchObject({
      itemListElement: [
        { position: 1, name: 'Home' },
        { position: 2, name: 'Guides' },
        { position: 3, name: 'Move files', item: 'https://syncologic.com/guides/move' },
      ],
    });
  });

  it('throws when given an empty list', () => {
    expect(() => buildBreadcrumb('en', [])).toThrow();
  });
});
