import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/session';
import { listAll } from '@/lib/bookings';

export async function GET(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const status = new URL(req.url).searchParams.get('status') || '';
  return NextResponse.json({ bookings: await listAll({ status }) });
}
