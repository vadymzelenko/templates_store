// lib/adminAuth.js
// Проверка Email/Password админа из .env (<PREFIX>_ADMIN_EMAIL/<PREFIX>_ADMIN_PASSWORD —
// см. README) и подпись/проверка отдельного admin-токена. Не переиспользует
// signToken/verifyToken из src/core/jwt.ts, т.к. их TokenPurpose ограничен
// значениями "confirm_booking"|"login"|"session" — админская сессия не входит
// в контракт публичной библиотеки и остаётся на уровне приложения.

import jwt from "jsonwebtoken";
import { siteEnv } from "@/lib/env";
import { ADMIN_COOKIE, siteJwtSecret } from "@/lib/cookies";

const ADMIN_TOKEN_TTL = "12h";

export function checkAdminCredentials(prefix, email, password) {
  const envEmail = siteEnv(prefix, "ADMIN_EMAIL", "");
  const envPassword = siteEnv(prefix, "ADMIN_PASSWORD", "");
  if (!envEmail || !envPassword) return false;
  return email === envEmail && password === envPassword;
}

export function signAdminToken(siteId, jwtSecret) {
  return jwt.sign({ admin: true, site: siteId }, jwtSecret, { expiresIn: ADMIN_TOKEN_TTL });
}

export function verifyAdminToken(token, jwtSecret, siteId) {
  if (!token) return false;
  try {
    const payload = jwt.verify(token, jwtSecret);
    return Boolean(payload && payload.admin === true && payload.site === siteId);
  } catch {
    return false;
  }
}

/** Удобный шорткат для route-хендлеров: читает admin-cookie прямо из NextRequest. */
export function isAdminRequest(request, siteId, prefix) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token, siteJwtSecret(siteId, prefix), siteId);
}
