import { describe, it, expect } from 'vitest';
import { readingTimeMinutes } from '../reading-time';

describe('readingTimeMinutes', () => {
  it('returns 1 for empty input', () => {
    expect(readingTimeMinutes('')).toBe(1);
  });

  it('returns 1 for very short input', () => {
    expect(readingTimeMinutes('one two three')).toBe(1);
  });

  it('rounds up partial minutes', () => {
    const words = Array.from({ length: 201 }, (_, i) => `w${i}`).join(' ');
    expect(readingTimeMinutes(words)).toBe(2);
  });

  it('treats exactly 200 words as 1 minute', () => {
    const words = Array.from({ length: 200 }, (_, i) => `w${i}`).join(' ');
    expect(readingTimeMinutes(words)).toBe(1);
  });

  it('treats 400 words as 2 minutes', () => {
    const words = Array.from({ length: 400 }, (_, i) => `w${i}`).join(' ');
    expect(readingTimeMinutes(words)).toBe(2);
  });

  it('treats 401 words as 3 minutes', () => {
    const words = Array.from({ length: 401 }, (_, i) => `w${i}`).join(' ');
    expect(readingTimeMinutes(words)).toBe(3);
  });

  it('strips MDX frontmatter before counting', () => {
    const body = '---\ntitle: foo\nlocale: en\n---\n\n' + Array.from({ length: 250 }, () => 'word').join(' ');
    expect(readingTimeMinutes(body)).toBe(2);
  });

  it('strips fenced code blocks before counting', () => {
    const body =
      Array.from({ length: 100 }, () => 'word').join(' ') +
      '\n\n```ts\n' +
      Array.from({ length: 1000 }, () => 'noise').join(' ') +
      '\n```\n';
    expect(readingTimeMinutes(body)).toBe(1);
  });

  it('treats markdown punctuation as separators', () => {
    expect(readingTimeMinutes('one,two.three;four')).toBe(1);
  });

  it('ignores HTML/JSX tags when counting', () => {
    const body = '<Caption>note here</Caption> ' + Array.from({ length: 198 }, () => 'word').join(' ');
    expect(readingTimeMinutes(body)).toBe(1);
  });
});
