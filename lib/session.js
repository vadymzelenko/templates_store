import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE = 'be_session';
const key = () => new TextEncoder().encode(process.env.JWT_SECRET);

export function isAdmin(email) {
  const list = (process.env.ADMIN_EMAIL || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  return list.includes(String(email).toLowerCase());
}

export async function createSession(email) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(key());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    // роль перераховується з ADMIN_EMAIL при кожному запиті — прибрав email з env = доступ зник
    return { email: payload.email, role: isAdmin(payload.email) ? 'admin' : 'client' };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const s = await getSession();
  return s?.role === 'admin' ? s : null;
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}
