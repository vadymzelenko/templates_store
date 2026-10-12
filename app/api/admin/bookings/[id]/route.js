import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/session';
import { updateBooking, deleteBooking } from '@/lib/bookings';

export async function PATCH(req, { params }) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { id } = await params;
  const { values, status } = await req.json().catch(() => ({}));
  const r = await updateBooking({ id, actor: s.email, values: values || {}, status, admin: true });
  if (r.error) return NextResponse.json({ error: r.error, errors: r.errors }, { status: r.http });
  return NextResponse.json({ booking: r.booking });
}

export async function DELETE(_req, { params }) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { id } = await params;
  const r = await deleteBooking({ id, actor: s.email, admin: true });
  if (r.error) return NextResponse.json({ error: r.error }, { status: r.http });
  return NextResponse.json({ ok: true });
}
