// Magic link: у БД лежить тільки sha256 токена, токен одноразовий і живе config.emails.ttlMinutes.
import crypto from 'crypto';
import config from '@/engine.config';
import { db } from './supabase';

const hash = (t) => crypto.createHash('sha256').update(t).digest('hex');

// не частіше 1 листа на хвилину на пошту
export async function canSend(email) {
  const since = new Date(Date.now() - 60_000).toISOString();
  const { count } = await db()
    .from('auth_tokens')
    .select('id', { count: 'exact', head: true })
    .eq('email', email)
    .gt('created_at', since);
  return !count;
}

export async function issueToken({ email, purpose, bookingId = null }) {
  const token = crypto.randomBytes(32).toString('hex');
  const { error } = await db().from('auth_tokens').insert({
    email,
    purpose,
    booking_id: bookingId,
    token_hash: hash(token),
    expires_at: new Date(Date.now() + config.emails.ttlMinutes * 60_000).toISOString(),
  });
  if (error) throw error;
  return token;
}

// атомарно "спалює" токен; повертає { email, purpose, booking_id } або null
export async function consumeToken(token) {
  if (!token || typeof token !== 'string') return null;
  const now = new Date().toISOString();
  const { data } = await db()
    .from('auth_tokens')
    .update({ used_at: now })
    .eq('token_hash', hash(token))
    .is('used_at', null)
    .gt('expires_at', now)
    .select('email, purpose, booking_id')
    .maybeSingle();
  return data || null;
}
