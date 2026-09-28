// lib/cookies.js
import { siteEnv } from "@/lib/env";

export const SESSION_COOKIE = "bs_session";
export const ADMIN_COOKIE = "bs_admin";

/** Тот же секрет, что и в BookingEngine (jwtSecret) — нужен вне engine для confirm/login роутов. */
export function siteJwtSecret(siteId, prefix) {
  return siteEnv(prefix, "JWT_SECRET", `dev-insecure-secret-${siteId}`);
}

/** Cookie нужно скоупить на путь сайта, чтобы разные тенанты не путали сессии друг друга. */
export function sitePath(siteId) {
  return `/${siteId}`;
}
