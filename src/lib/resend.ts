import { Resend } from 'resend';
import type { Locale } from '../i18n/utils';

const apiKey = import.meta.env.RESEND_API_KEY;
const fromEmail = import.meta.env.RESEND_FROM_EMAIL || 'Syncologic <onboarding@resend.dev>';

if (!apiKey) {
  throw new Error('RESEND_API_KEY is required');
}

export const resend = new Resend(apiKey);

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
  text: '#1C2B33',
  body: '#5D6C7B',
  muted: '#8595A4',
  brand: '#0064E0',
  brandSoft: '#E8F3FF',
  divider: '#DEE3E9',
  paper: '#F7F8FA',
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
  const logoUrl = htmlEscape(`${p.siteUrl}/assets/brand/icon-black.png`);
  const segHref = htmlEscape(p.segmentationLink);
  const unsubHref = htmlEscape(p.unsubscribeLink);
  return `<!doctype html>
<html lang="${p.locale}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${c.subject}</title>
  </head>
  <body style="margin:0;padding:0;background:${COLOR.paper};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${COLOR.text};">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;">${c.preview}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLOR.paper};">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#FFFFFF;border:1px solid ${COLOR.divider};border-radius:20px;overflow:hidden;">
            <tr>
              <td align="center" style="padding:36px 32px 8px 32px;">
                <img src="${logoUrl}" width="64" height="64" alt="${c.logoAlt}" style="display:block;width:64px;height:64px;border:0;outline:none;text-decoration:none;" />
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 0 32px;">
                <h1 style="margin:0 0 12px 0;font-size:26px;line-height:1.25;font-weight:500;color:${COLOR.text};text-align:center;">${c.greeting}</h1>
                <p style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:${COLOR.body};text-align:center;">${c.intro}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 0 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLOR.brandSoft};border-radius:16px;">
                  <tr>
                    <td style="padding:20px 24px;">
                      <p style="margin:0 0 12px 0;font-size:15px;line-height:1.5;color:${COLOR.text};">${c.segPrompt}</p>
                      <div style="text-align:center;">
                        <a href="${segHref}" style="display:inline-block;padding:12px 22px;background:${COLOR.brand};color:#FFFFFF;font-size:15px;font-weight:500;line-height:1;text-decoration:none;border-radius:100px;">${c.segCta}</a>
                      </div>
                      <p style="margin:14px 0 0 0;font-size:13px;line-height:1.5;color:${COLOR.muted};">${c.segNote}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px 32px;">
                <p style="margin:0;font-size:14px;line-height:1.6;color:${COLOR.muted};">${c.signoff}<br/>${c.team}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px 32px;">
                <hr style="border:none;border-top:1px solid ${COLOR.divider};margin:0 0 16px 0;" />
                <p style="margin:0;font-size:12px;line-height:1.5;color:${COLOR.muted};">${c.unsubPrompt} <a href="${unsubHref}" style="color:${COLOR.body};text-decoration:underline;">${c.unsubCta}</a>.</p>
              </td>
            </tr>
          </table>
          <p style="margin:24px 0 0 0;font-size:12px;color:${COLOR.muted};">Syncologic</p>
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
