import { NextResponse } from 'next/server';
import config from '@/engine.config';
import { validate } from '@/lib/validate';
import { fieldByColumn } from '@/lib/fields';
import { createPending } from '@/lib/bookings';
import { canSend, issueToken } from '@/lib/auth';
import { sendMagicLink } from '@/lib/mailer';
import { engineReady } from '@/lib/ready';

const T = config.texts;

export async function POST(req) {
  if (!engineReady()) return NextResponse.json({ error: T.unavailable }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  const { ok, errors, clean } = validate(body);
  if (!ok) return NextResponse.json({ error: T.checkFields, errors }, { status: 400 });

  const email = clean[fieldByColumn('email').key];
  if (!(await canSend(email))) return NextResponse.json({ error: T.rateLimited }, { status: 429 });

  let res;
  try { res = await createPending(clean); } catch (e) {
    console.error(e);
    return NextResponse.json({ error: T.unavailable }, { status: 503 });
  }
  if (res.error) return NextResponse.json({ error: res.error }, { status: res.http });

  try {
    const token = await issueToken({ email, purpose: 'confirm', bookingId: res.booking.id });
    await sendMagicLink({ to: email, token, purpose: 'confirm' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: T.mailFailed }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
