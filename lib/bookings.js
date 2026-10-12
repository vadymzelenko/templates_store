// ВСЯ бізнес-логіка записів в одному файлі. Від ніші не залежить — читає config.fields.
import config from '@/engine.config';
import { db } from './supabase';
import { fieldByColumn, splitValues, flatten } from './fields';
import { validate } from './validate';

const T = config.texts;
const hasResource = !!fieldByColumn('resource');
const nowIso = () => new Date().toISOString();
const holdCutoff = () => new Date(Date.now() - config.pendingHoldMinutes * 60_000).toISOString();
const slotOf = (b) => ({ date: b.slot_date, time: b.slot_time, resource: b.resource });

export async function logAction(bookingId, actor, action, details = {}) {
  await db().from('booking_logs').insert({ booking_id: bookingId, actor, action, details });
}

// Чи зайнятий слот. Рахуються confirmed + свіжі pending (які ще "тримають" слот).
async function isTaken({ date, time, resource }, { excludeId = null, includePending = true } = {}) {
  if (!config.uniqueSlot || !date || !time) return false;
  let q = db().from('bookings').select('id').eq('slot_date', date).eq('slot_time', time);
  if (hasResource && resource) q = q.eq('resource', resource);
  q = includePending
    ? q.or(`status.eq.confirmed,and(status.eq.pending,created_at.gt.${holdCutoff()})`)
    : q.eq('status', 'confirmed');
  if (excludeId) q = q.neq('id', excludeId);
  const { data } = await q.limit(1);
  return !!data?.length;
}

export async function busySlots({ date, resource = '', excludeId = null }) {
  if (!config.uniqueSlot) return [];
  let q = db().from('bookings').select('slot_time').eq('slot_date', date)
    .or(`status.eq.confirmed,and(status.eq.pending,created_at.gt.${holdCutoff()})`);
  if (hasResource && resource) q = q.eq('resource', resource);
  if (excludeId) q = q.neq('id', excludeId);
  const { data } = await q;
  return (data || []).map((r) => r.slot_time);
}

export async function createPending(clean) {
  const { row, data } = splitValues(clean);
  if (await isTaken({ date: row.slot_date, time: row.slot_time, resource: row.resource })) {
    return { error: T.slotTaken, http: 409 };
  }
  const { data: b, error } = await db().from('bookings').insert({ ...row, data, status: 'pending' }).select().single();
  if (error) { console.error(error); return { error: T.error, http: 500 }; }
  await logAction(b.id, row.client_email, 'created', flatten(b));
  return { booking: b };
}

export async function confirmBooking(id) {
  const { data: b } = await db().from('bookings').select('*').eq('id', id).maybeSingle();
  if (!b) return { error: T.tokenInvalid, http: 404 };
  if (b.status !== 'pending') return { booking: b };

  if (await isTaken(slotOf(b), { excludeId: id, includePending: false })) {
    await db().from('bookings').update({ status: 'cancelled', updated_at: nowIso() }).eq('id', id);
    await logAction(id, b.client_email, 'confirm_failed_slot_taken');
    return { error: T.slotTaken, http: 409 };
  }
  const { data: upd } = await db().from('bookings')
    .update({ status: 'confirmed', updated_at: nowIso() }).eq('id', id).select().single();
  await logAction(id, b.client_email, 'confirmed');
  return { booking: upd };
}

export async function listForEmail(email) {
  const { data } = await db().from('bookings').select('*')
    .eq('client_email', email).neq('status', 'pending')
    .order('slot_date', { ascending: true }).order('slot_time', { ascending: true });
  return (data || []).map(flatten);
}

export async function listAll({ status = '' } = {}) {
  let q = db().from('bookings').select('*')
    .order('slot_date', { ascending: false }).order('slot_time', { ascending: true }).limit(500);
  if (status) q = q.eq('status', status);
  const { data } = await q;
  return (data || []).map(flatten);
}

export async function listLogs() {
  const { data } = await db().from('booking_logs').select('*').order('created_at', { ascending: false }).limit(200);
  return data || [];
}

// Одна функція для клієнта (admin=false) і власника (admin=true)
export async function updateBooking({ id, actor, email = null, values = {}, status, admin = false }) {
  let q = db().from('bookings').select('*').eq('id', id);
  if (!admin) q = q.eq('client_email', email);
  const { data: b } = await q.maybeSingle();
  if (!b) return { error: T.notFound, http: 404 };
  if (!admin && !config.clientEditable.includes(b.status)) return { error: T.notEditable, http: 403 };

  const before = flatten(b);
  const patch = { updated_at: nowIso() };
  const changes = {};

  if (Object.keys(values).length) {
    const merged = { ...before, ...values };
    const emailKey = fieldByColumn('email')?.key;
    if (!admin && emailKey) merged[emailKey] = before[emailKey]; // клієнт не міняє свою пошту
    const { ok, errors, clean } = validate(merged, { admin });
    if (!ok) return { error: T.checkFields, errors, http: 400 };

    const { row, data } = splitValues(clean);
    if (await isTaken({ date: row.slot_date, time: row.slot_time, resource: row.resource }, { excludeId: id })) {
      return { error: T.slotTaken, http: 409 };
    }
    Object.assign(patch, row, { data });
    for (const k of Object.keys(clean)) {
      if (clean[k] !== before[k]) changes[k] = { from: before[k], to: clean[k] };
    }
  }

  if (admin && status && status !== b.status) {
    if (!config.statuses[status]) return { error: T.error, http: 400 };
    patch.status = status;
    changes.status = { from: b.status, to: status };
  }

  if (!Object.keys(changes).length) return { booking: before };

  const { data: upd, error } = await db().from('bookings').update(patch).eq('id', id).select().single();
  if (error) { console.error(error); return { error: T.error, http: 500 }; }
  await logAction(id, actor, admin ? 'admin_updated' : 'client_updated', changes);
  return { booking: flatten(upd) };
}

export async function deleteBooking({ id, actor, email = null, admin = false }) {
  let q = db().from('bookings').select('*').eq('id', id);
  if (!admin) q = q.eq('client_email', email);
  const { data: b } = await q.maybeSingle();
  if (!b) return { error: T.notFound, http: 404 };
  if (!admin && !config.clientEditable.includes(b.status)) return { error: T.notEditable, http: 403 };

  const { error } = await db().from('bookings').delete().eq('id', id);
  if (error) { console.error(error); return { error: T.error, http: 500 }; }
  await logAction(id, actor, admin ? 'admin_deleted' : 'client_deleted', flatten(b));
  return { ok: true };
}
