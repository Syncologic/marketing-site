import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { checkUnsubBudget, getClientIp, hashIp } from '../../../lib/ratelimit';

export const prerender = false;

type Locale = 'en' | 'pt-br';

const REMOVED_PAGE = (locale: Locale) => {
  const en = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>Removed</title>
    <style>body{font-family:Montserrat,sans-serif;color:#1C2B33;max-width:480px;margin:80px auto;padding:0 24px;line-height:1.5}</style>
    </head><body><h1 style="font-weight:500">You're removed from the list.</h1>
    <p>If this was a mistake, just join again from the homepage.</p></body></html>`;
  const pt = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"/><title>Removido</title>
    <style>body{font-family:Montserrat,sans-serif;color:#1C2B33;max-width:480px;margin:80px auto;padding:0 24px;line-height:1.5}</style>
    </head><body><h1 style="font-weight:500">Você foi removido da lista.</h1>
    <p>Se foi por engano, é só se inscrever de novo na página inicial.</p></body></html>`;
  return locale === 'pt-br' ? pt : en;
};

const CONFIRM_PAGE = (locale: Locale, token: string) => {
  const t = htmlEscape(token);
  const en = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>Confirm unsubscribe</title>
    <style>body{font-family:Montserrat,sans-serif;color:#1C2B33;max-width:480px;margin:80px auto;padding:0 24px;line-height:1.5}
    button{margin-top:16px;padding:12px 22px;background:#0064E0;color:#fff;font-size:15px;font-weight:500;line-height:1;border:0;border-radius:100px;cursor:pointer}</style>
    </head><body><h1 style="font-weight:500">Remove your email from the waitlist?</h1>
    <p>You won't get any more messages from us.</p>
    <form method="POST" action="/api/waitlist/unsubscribe"><input type="hidden" name="token" value="${t}"/>
    <button type="submit">Yes, remove me</button></form></body></html>`;
  const pt = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"/><title>Confirmar remoção</title>
    <style>body{font-family:Montserrat,sans-serif;color:#1C2B33;max-width:480px;margin:80px auto;padding:0 24px;line-height:1.5}
    button{margin-top:16px;padding:12px 22px;background:#0064E0;color:#fff;font-size:15px;font-weight:500;line-height:1;border:0;border-radius:100px;cursor:pointer}</style>
    </head><body><h1 style="font-weight:500">Remover seu e-mail da lista de espera?</h1>
    <p>Você não vai receber mais mensagens nossas.</p>
    <form method="POST" action="/api/waitlist/unsubscribe"><input type="hidden" name="token" value="${t}"/>
    <button type="submit">Sim, pode remover</button></form></body></html>`;
  return locale === 'pt-br' ? pt : en;
};

const TOO_MANY_PAGE = (locale: Locale) => {
  const en = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>Too many requests</title>
    <style>body{font-family:Montserrat,sans-serif;color:#1C2B33;max-width:480px;margin:80px auto;padding:0 24px;line-height:1.5}</style>
    </head><body><h1 style="font-weight:500">Too many requests.</h1>
    <p>Please wait a bit and try the link again.</p></body></html>`;
  const pt = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"/><title>Muitas tentativas</title>
    <style>body{font-family:Montserrat,sans-serif;color:#1C2B33;max-width:480px;margin:80px auto;padding:0 24px;line-height:1.5}</style>
    </head><body><h1 style="font-weight:500">Muitas tentativas.</h1>
    <p>Aguarde um momento e tente o link novamente.</p></body></html>`;
  return locale === 'pt-br' ? pt : en;
};

function htmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

function preferredLocale(request: Request): Locale {
  const al = request.headers.get('accept-language') ?? '';
  return /\bpt(-br)?\b/i.test(al) ? 'pt-br' : 'en';
}

function isValidToken(t: string): boolean {
  return /^[0-9a-f]{32}$/i.test(t);
}

async function lookupLocale(token: string): Promise<Locale> {
  const result = await supabase
    .from('waitlist')
    .select('locale')
    .eq('unsubscribe_token', token)
    .maybeSingle();
  return ((result.data?.locale as Locale | undefined) ?? 'en');
}

export const GET: APIRoute = async ({ request, url }) => {
  const ipHash = hashIp(getClientIp(request));
  const budget = await checkUnsubBudget(ipHash);
  if (!budget.ok) {
    return htmlResponse(TOO_MANY_PAGE(preferredLocale(request)), 429);
  }

  const token = url.searchParams.get('token') ?? '';
  if (!isValidToken(token)) {
    return htmlResponse(REMOVED_PAGE(preferredLocale(request)));
  }

  const locale = await lookupLocale(token);
  return htmlResponse(CONFIRM_PAGE(locale, token));
};

async function readToken(request: Request, url: URL): Promise<string> {
  const ct = request.headers.get('content-type') ?? '';
  if (ct.includes('application/x-www-form-urlencoded')) {
    const body = await request.text();
    const params = new URLSearchParams(body);
    if (params.get('List-Unsubscribe') === 'One-Click') {
      return url.searchParams.get('token') ?? '';
    }
    return params.get('token') ?? '';
  }
  return url.searchParams.get('token') ?? '';
}

export const POST: APIRoute = async ({ request, url }) => {
  const ipHash = hashIp(getClientIp(request));
  const budget = await checkUnsubBudget(ipHash);
  if (!budget.ok) {
    return htmlResponse(TOO_MANY_PAGE(preferredLocale(request)), 429);
  }

  const token = await readToken(request, url);
  if (!isValidToken(token)) {
    return htmlResponse(REMOVED_PAGE(preferredLocale(request)));
  }

  const result = await supabase
    .from('waitlist')
    .select('id, locale')
    .eq('unsubscribe_token', token)
    .is('removed_at', null)
    .maybeSingle();

  if (result.data) {
    await supabase
      .from('waitlist')
      .update({ removed_at: new Date().toISOString() })
      .eq('id', result.data.id)
      .is('removed_at', null);
    return htmlResponse(REMOVED_PAGE((result.data.locale as Locale) ?? 'en'));
  }

  return htmlResponse(REMOVED_PAGE(preferredLocale(request)));
};
