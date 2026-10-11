// lib/env.js
export function env(key, fallback = undefined) {
  const value = process.env[key];
  return value !== undefined && value !== "" ? value : fallback;
}

export function envNumber(key, fallback) {
  const raw = env(key, undefined);
  if (raw === undefined) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

/** Базовый URL сайта. PUBLIC_BASE_URL — корень приложения. */
export function baseUrl() {
  const explicit = env("BASE_URL", "");
  if (explicit) return explicit.replace(/\/$/, "");
  return (process.env.PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
}