import { NextResponse } from 'next/server';
import config from '@/engine.config';
import { canSend, issueToken } from '@/lib/auth';
import { sendMagicLink } from '@/lib/mailer';

const T = config.texts;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req) {
  const { email: raw } = await req.json().catch(() => ({}));
  const email = String(raw || '').trim().toLowerCase();
  if (!EMAIL.test(email)) return NextResponse.json({ error: T.invalidEmail }, { status: 400 });
  if (!(await canSend(email))) return NextResponse.json({ error: T.rateLimited }, { status: 429 });
  try {
    const token = await issueToken({ email, purpose: 'login' });
    await sendMagicLink({ to: email, token, purpose: 'login' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: T.mailFailed }, { status: 500 });
  }
  return NextResponse.json({ ok: true }); // не розкриваємо, чи є така пошта в базі
}
