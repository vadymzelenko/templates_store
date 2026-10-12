import { NextResponse } from 'next/server';
import config from '@/engine.config';
import { getSession } from '@/lib/session';
import { updateBooking, deleteBooking } from '@/lib/bookings';

const unauth = () => NextResponse.json({ error: config.texts.error }, { status: 401 });

export async function PATCH(req, { params }) {
  const s = await getSession();
  if (!s) return unauth();
  const { id } = await params;
  const { values } = await req.json().catch(() => ({}));
  const r = await updateBooking({ id, actor: s.email, email: s.email, values: values || {} });
  if (r.error) return NextResponse.json({ error: r.error, errors: r.errors }, { status: r.http });
  return NextResponse.json({ booking: r.booking });
}

export async function DELETE(_req, { params }) {
  const s = await getSession();
  if (!s) return unauth();
  const { id } = await params;
  const r = await deleteBooking({ id, actor: s.email, email: s.email });
  if (r.error) return NextResponse.json({ error: r.error }, { status: r.http });
  return NextResponse.json({ ok: true });
}
