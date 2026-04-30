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
  segmentationLink: string;
  unsubscribeLink: string;
}

const TEMPLATES = {
  en: {
    subject: "You're on the Syncologic waitlist",
    body: (p: ConfirmationParams) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1C2B33; max-width: 560px; margin: 0 auto;">
        <h1 style="font-size: 20px; font-weight: 500; color: #1C2B33;">Thanks — you're on the waitlist.</h1>
        <p style="font-size: 16px; line-height: 1.5; color: #5D6C7B;">
          We'll email you when there's something real to try. No noise in between.
        </p>
        <p style="font-size: 16px; line-height: 1.5; color: #5D6C7B;">
          If you have 30 seconds, <a href="${p.segmentationLink}" style="color: #0064E0;">tell us what you want to move →</a>
        </p>
        <p style="font-size: 13px; line-height: 1.5; color: #8595A4; margin-top: 32px;">
          — The Syncologic team
        </p>
        <hr style="border: none; border-top: 1px solid #DEE3E9; margin: 32px 0;" />
        <p style="font-size: 12px; color: #8595A4;">
          Didn't sign up? <a href="${p.unsubscribeLink}" style="color: #5D6C7B;">Remove your email</a>.
        </p>
      </div>
    `,
  },
  'pt-br': {
    subject: 'Você está na lista de espera da Syncologic',
    body: (p: ConfirmationParams) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1C2B33; max-width: 560px; margin: 0 auto;">
        <h1 style="font-size: 20px; font-weight: 500; color: #1C2B33;">Obrigado — você está na lista.</h1>
        <p style="font-size: 16px; line-height: 1.5; color: #5D6C7B;">
          Vamos te mandar um e-mail quando tiver algo de verdade para experimentar. Nada de spam.
        </p>
        <p style="font-size: 16px; line-height: 1.5; color: #5D6C7B;">
          Se tiver 30 segundos, <a href="${p.segmentationLink}" style="color: #0064E0;">conta o que você quer transferir →</a>
        </p>
        <p style="font-size: 13px; line-height: 1.5; color: #8595A4; margin-top: 32px;">
          — A equipe da Syncologic
        </p>
        <hr style="border: none; border-top: 1px solid #DEE3E9; margin: 32px 0;" />
        <p style="font-size: 12px; color: #8595A4;">
          Não foi você? <a href="${p.unsubscribeLink}" style="color: #5D6C7B;">Remover seu e-mail</a>.
        </p>
      </div>
    `,
  },
} as const;

export async function sendWaitlistConfirmation(params: ConfirmationParams): Promise<void> {
  const tpl = TEMPLATES[params.locale];
  await resend.emails.send({
    from: fromEmail,
    to: params.to,
    subject: tpl.subject,
    html: tpl.body(params),
  });
}
