import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/session';
import { listLogs } from '@/lib/bookings';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  return NextResponse.json({ logs: await listLogs() });
}
