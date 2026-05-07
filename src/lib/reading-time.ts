const WORDS_PER_MINUTE = 200;

export function readingTimeMinutes(source: string): number {
  const stripped = source
    .replace(/^---\n[\s\S]*?\n---\n?/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, ' ');

  const words = stripped.split(/[\s.,;:!?()[\]{}'"`–—]+/).filter(Boolean);
  if (words.length === 0) return 1;
  return Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE));
}
