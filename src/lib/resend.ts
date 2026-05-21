import { Resend } from 'resend';
import type { Locale } from '../i18n/utils';
import { fakeResend } from './dev/fake-resend';

const apiKey = import.meta.env.RESEND_API_KEY;
const fromEmail = import.meta.env.RESEND_FROM_EMAIL || 'Syncologic <onboarding@resend.dev>';

function buildResend(): Resend {
  if (apiKey) return new Resend(apiKey);
  if (import.meta.env.DEV) {
    console.info('[dev] RESEND_API_KEY missing — emails will be written to .local/dev-emails/ instead of sent');
    return fakeResend as unknown as Resend;
  }
  throw new Error('RESEND_API_KEY is required');
}

export const resend = buildResend();

interface ConfirmationParams {
  to: string;
  locale: Locale;
  siteUrl: string;
  segmentationLink: string;
  unsubscribeLink: string;
}

interface Copy {
  preview: string;
  subject: string;
  greeting: string;
  intro: string;
  segPrompt: string;
  segCta: string;
  segNote: string;
  signoff: string;
  team: string;
  unsubPrompt: string;
  unsubCta: string;
  logoAlt: string;
}

const COPY: Record<Locale, Copy> = {
  en: {
    preview: "You're in. Welcome to Syncologic.",
    subject: "Welcome to Syncologic — you're on the waitlist 🎉",
    greeting: "You're in.",
    intro:
      "Thanks for joining the Syncologic waitlist. We're building the calmest way to move files between clouds — and we're genuinely happy you're here. We'll only email when there's something real to try. No noise in between.",
    segPrompt: 'If you have 30 seconds, help us build the right thing first:',
    segCta: 'Tell us what you want to move →',
    segNote:
      "This button takes you to the questions shown after you entered your email. If you already answered them on the page, you're good. If not, your answers help us build the best product for you.",
    signoff: 'Talk soon,',
    team: 'The Syncologic team',
    unsubPrompt: "Didn't sign up?",
    unsubCta: 'Remove your email',
    logoAlt: 'Syncologic',
  },
  'pt-br': {
    preview: 'Você está dentro. Bem-vindo à Syncologic.',
    subject: 'Bem-vindo à Syncologic — você está na lista 🎉',
    greeting: 'Você está dentro.',
    intro:
      'Obrigado por entrar na lista de espera da Syncologic. Estamos construindo o jeito mais tranquilo de mover arquivos entre nuvens — e ficamos felizes de verdade com você aqui. Só vamos te escrever quando tiver algo de verdade para experimentar. Nada de spam.',
    segPrompt: 'Se tiver 30 segundos, nos ajude a construir a coisa certa primeiro:',
    segCta: 'Conta o que você quer transferir →',
    segNote:
      'Este botão leva você às perguntas que aparecem depois que você digita seu e-mail. Se você já respondeu na página, está tudo certo. Se não, suas respostas ajudam a gente a construir o melhor produto para você.',
    signoff: 'Até breve,',
    team: 'A equipe da Syncologic',
    unsubPrompt: 'Não foi você?',
    unsubCta: 'Remover seu e-mail',
    logoAlt: 'Syncologic',
  },
};

const COLOR = {
  text: '#1B2230',
  body: '#3B4554',
  muted: '#7A8694',
  brand: '#1B6BD4',
  brandDark: '#0F4FA8',
  brandSoft: '#EAF2FC',
  divider: '#DDE7F2',
  paper: '#F1F6FC',
  card: '#FFFFFF',
} as const;

function htmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderEmail(p: ConfirmationParams, c: Copy): string {
  const logoUrl = htmlEscape(`${p.siteUrl}/assets/brand/icon_adaptive.svg`);
  const segHref = htmlEscape(p.segmentationLink);
  const unsubHref = htmlEscape(p.unsubscribeLink);
  const fontStack = `'Switzer','Inter','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,Helvetica,Arial,sans-serif`;
  return `<!doctype html>
<html lang="${p.locale}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${c.subject}</title>
  </head>
  <body style="margin:0;padding:0;background:${COLOR.paper};font-family:${fontStack};color:${COLOR.text};-webkit-font-smoothing:antialiased;">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;">${c.preview}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLOR.paper};">
      <tr>
        <td align="center" style="padding:48px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${COLOR.card};border:1px solid ${COLOR.divider};border-radius:24px;overflow:hidden;box-shadow:0 14px 28px -16px rgba(20,40,80,0.18),0 4px 10px -4px rgba(20,40,80,0.08);">
            <tr>
              <td style="background:linear-gradient(180deg,${COLOR.brandSoft} 0%,${COLOR.card} 100%);padding:36px 32px 12px 32px;text-align:center;">
                <img src="${logoUrl}" width="64" height="64" alt="${c.logoAlt}" style="display:block;width:64px;height:64px;border:0;outline:none;margin:0 auto;text-decoration:none;" />
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 0 32px;">
                <h1 style="margin:0 0 12px 0;font-size:28px;line-height:1.2;font-weight:700;color:${COLOR.text};text-align:center;letter-spacing:-0.01em;">${c.greeting}</h1>
                <p style="margin:0 0 24px 0;font-size:16px;line-height:1.65;color:${COLOR.body};text-align:center;">${c.intro}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 0 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLOR.brandSoft};border:1px solid ${COLOR.divider};border-radius:18px;">
                  <tr>
                    <td style="padding:22px 24px;">
                      <p style="margin:0 0 14px 0;font-size:15px;line-height:1.55;color:${COLOR.text};font-weight:600;">${c.segPrompt}</p>
                      <div style="text-align:center;">
                        <a href="${segHref}" style="display:inline-block;padding:13px 24px;background:${COLOR.brand};color:#FFFFFF;font-size:15px;font-weight:700;line-height:1;text-decoration:none;border-radius:999px;letter-spacing:0.01em;">${c.segCta}</a>
                      </div>
                      <p style="margin:14px 0 0 0;font-size:13px;line-height:1.55;color:${COLOR.muted};">${c.segNote}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px 32px;">
                <p style="margin:0;font-size:14px;line-height:1.6;color:${COLOR.body};">${c.signoff}<br/><span style="color:${COLOR.muted};">${c.team}</span></p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px 32px;">
                <hr style="border:none;border-top:1px solid ${COLOR.divider};margin:0 0 16px 0;" />
                <p style="margin:0;font-size:12px;line-height:1.55;color:${COLOR.muted};">${c.unsubPrompt} <a href="${unsubHref}" style="color:${COLOR.brand};text-decoration:underline;">${c.unsubCta}</a>.</p>
              </td>
            </tr>
          </table>
          <p style="margin:24px 0 0 0;font-size:12px;letter-spacing:0.04em;text-transform:uppercase;color:${COLOR.muted};font-weight:600;">Syncologic</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendWaitlistConfirmation(params: ConfirmationParams): Promise<void> {
  const copy = COPY[params.locale];
  await resend.emails.send({
    from: fromEmail,
    to: params.to,
    subject: copy.subject,
    html: renderEmail(params, copy),
    headers: {
      'List-Unsubscribe': `<${params.unsubscribeLink}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  });
}
