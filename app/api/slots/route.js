import { NextResponse } from 'next/server';
import { busySlots } from '@/lib/bookings';

export async function GET(req) {
  const p = new URL(req.url).searchParams;
  const date = p.get('date') || '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ busy: [] });
  const busy = await busySlots({ date, resource: p.get('resource') || '', excludeId: p.get('exclude') || null });
  return NextResponse.json({ busy });
}
