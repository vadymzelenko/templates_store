import nodemailer from 'nodemailer';
import config from '@/engine.config';
import { renderEmail } from '@/styles/message_email';

let tr;
// EMAIL_PROVIDER=nodemailer -> реальна відправка через Gmail (GMAIL_USER + GMAIL_APP_PASSWORD)
// EMAIL_PROVIDER=console    -> лист не шлемо, посилання друкується в консоль (dev)
function transport() {
  if ((process.env.EMAIL_PROVIDER || 'nodemailer') !== 'nodemailer') return null;
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null;
  if (!tr) {
    tr = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });
  }
  return tr;
}

export async function sendMagicLink({ to, token, purpose }) {
  const link = `${process.env.PUBLIC_BASE_URL}/auth/verify?token=${token}`;
  const m = config.emails[purpose];
  const t = transport();

  if (!t) {
    console.log(`\n[magic-link:${purpose}] ${to}\n${link}\n`);
    return;
  }

  await t.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || config.brand.name}" <${process.env.GMAIL_USER}>`,
    to,
    subject: `${m.subject} — ${config.brand.name}`,
    text: `${m.text}\n\n${link}\n\n${config.emails.footer}`,
    html: renderEmail({ purpose, link }),
  });
}
