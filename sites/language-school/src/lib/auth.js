import 'server-only';
import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE = 'vylet_admin';
const TTL = 60 * 60 * 24 * 7; // неделя

// В разработке без .env.local можно войти паролем «admin». В продакшене пароль обязателен.
function password() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === 'production' ? null : 'admin';
}

function secret() {
  return process.env.ADMIN_SECRET || `vylet:${password()}`;
}

function sign(payload) {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

function same(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

export function adminConfigured() {
  return Boolean(password());
}

export function checkPassword(input) {
  const p = password();
  return Boolean(p) && same(input, p);
}

export async function startSession() {
  const exp = Math.floor(Date.now() / 1000) + TTL;
  const payload = `admin.${exp}`;
  const jar = await cookies();
  jar.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TTL,
  });
}

export async function endSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAdmin() {
  if (!password()) return false;
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return false;
  const i = raw.lastIndexOf('.');
  const payload = raw.slice(0, i);
  const sig = raw.slice(i + 1);
  const exp = Number(payload.split('.')[1]);
  return same(sig, sign(payload)) && exp > Date.now() / 1000;
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error('Нет доступа');
}
