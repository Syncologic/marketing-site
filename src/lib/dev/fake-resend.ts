import { mkdir, writeFile } from 'node:fs/promises';

const DIR = '.local/dev-emails';

interface SendParams {
  from: string;
  to: string;
  subject: string;
  html: string;
  headers?: Record<string, string>;
}

export const fakeResend = {
  emails: {
    async send(params: SendParams): Promise<{ data: { id: string }; error: null }> {
      const ts = Date.now();
      const safeTo = params.to.replace(/[^a-z0-9@._-]/gi, '_');
      const path = `${DIR}/${ts}-${safeTo}.html`;
      try {
        await mkdir(DIR, { recursive: true });
        await writeFile(path, params.html);
        console.info(`[fake-resend] wrote ${path}  to=${params.to}  subject="${params.subject}"`);
      } catch (err) {
        console.warn('[fake-resend] write failed', err);
      }
      return { data: { id: `fake_${ts}` }, error: null };
    },
  },
};
