const ALLOWED_HOSTS = new Set<string>([
  'syncologic.com',
  'www.syncologic.com',
  'syncologic.com.br',
  'www.syncologic.com.br',
  'localhost',
  '127.0.0.1',
]);

function hostFromHeader(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function isAllowedOrigin(request: Request): boolean {
  const origin = hostFromHeader(request.headers.get('origin'));
  if (origin !== null) return ALLOWED_HOSTS.has(origin);
  const referer = hostFromHeader(request.headers.get('referer'));
  if (referer !== null) return ALLOWED_HOSTS.has(referer);
  return false;
}
