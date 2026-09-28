// lib/env.js
export function siteEnv(prefix, key, fallback = undefined) {
  const value = process.env[`${prefix}_${key}`];
  return value !== undefined && value !== "" ? value : fallback;
}

export function siteEnvNumber(prefix, key, fallback) {
  const raw = siteEnv(prefix, key, undefined);
  if (raw === undefined) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Базовый URL сайта. Если явно задан <PREFIX>_BASE_URL — берём его.
 * Иначе собираем из PUBLIC_BASE_URL + /<siteId>.
 * PUBLIC_BASE_URL — общая переменная, напр. https://mydomen.com
 */
export function siteBaseUrl(siteId, prefix) {
  const explicit = siteEnv(prefix, "BASE_URL", "");
  if (explicit) return explicit.replace(/\/$/, "");

  const root = (process.env.PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
  return `${root}/${siteId}`;
}