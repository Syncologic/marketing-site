import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

const UNSUB_PAGE = (locale: 'en' | 'pt-br') => {
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

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token') ?? '';
  if (token && /^[0-9a-f]{32}$/i.test(token)) {
    const result = await supabase
      .from('waitlist')
      .select('id, locale')
      .eq('unsubscribe_token', token)
      .maybeSingle();

    if (result.data) {
      await supabase
        .from('waitlist')
        .update({ removed_at: new Date().toISOString() })
        .eq('id', result.data.id);

      return new Response(UNSUB_PAGE((result.data.locale as 'en' | 'pt-br') ?? 'en'), {
        status: 200,
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    }
  }

  return new Response(UNSUB_PAGE('en'), {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
};
