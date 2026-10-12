import { NextResponse } from 'next/server';
import config from '@/engine.config';
import { consumeToken } from '@/lib/auth';
import { confirmBooking } from '@/lib/bookings';
import { createSession, isAdmin } from '@/lib/session';

const T = config.texts;

export async function POST(req) {
  const { token } = await req.json().catch(() => ({}));
  const t = await consumeToken(token);
  if (!t) return NextResponse.json({ error: T.tokenInvalid }, { status: 400 });

  if (t.purpose === 'confirm' && t.booking_id) {
    const r = await confirmBooking(t.booking_id);
    if (r.error) return NextResponse.json({ error: r.error }, { status: r.http });
  }

  await createSession(t.email);
  const redirect = t.purpose === 'login' && isAdmin(t.email) ? '/admin' : '/profile';
  return NextResponse.json({ ok: true, redirect });
}
