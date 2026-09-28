// lib/engine.js
import {
  BookingEngine,
  MemoryLockAdapter,
  ResendAdapter,
  NodemailerAdapter,
  ConsoleEmailAdapter,
  SupabaseAdapter,     // ← новое
} from "@vzbb-db-system/core";
import { waitUntil } from "@vercel/functions";

import { siteEnv, siteEnvNumber, siteBaseUrl } from "@/lib/env";

import { DemoMemoryStorage } from "@/lib/demoStorage";
import { getSiteConfig } from "@/sites/registry";

const engineCache = new Map();
const demoStorageCache = new Map();

function buildEmailProvider(prefix, config) {
  const provider = siteEnv(prefix, "EMAIL_PROVIDER", config.email?.provider || "console");

  if (provider === "resend") {
    return new ResendAdapter({
      apiKey:
          siteEnv(prefix, "RESEND_API_KEY", "") ||
          process.env.RESEND_API_KEY ||
          "",
      fromEmail:
          siteEnv(prefix, "RESEND_FROM_EMAIL", "") ||
          process.env.RESEND_FROM_EMAIL ||
          "Booking <booking@example.com>",
    });
  }

  if (provider === "nodemailer") {
    return new NodemailerAdapter({
      gmailUser:
          siteEnv(prefix, "GMAIL_USER", "") ||
          process.env.GMAIL_USER ||
          "",
      gmailAppPassword:
          siteEnv(prefix, "GMAIL_APP_PASSWORD", "") ||
          process.env.GMAIL_APP_PASSWORD ||
          "",
      fromName: siteEnv(prefix, "EMAIL_FROM_NAME", config.meta?.title),
    });
  }

  return new ConsoleEmailAdapter();
}

function buildStorage(siteId, prefix, config) {
  // Один Supabase-проект на всё приложение. Отдельный "раздел" для сайта
  // обеспечивается колонкой site_id во всех таблицах (см. supabase/schema.sql).
  const supabaseUrl =
      siteEnv(prefix, "SUPABASE_URL", "") || process.env.SUPABASE_URL || "";
  const supabaseKey =
      siteEnv(prefix, "SUPABASE_SERVICE_ROLE_KEY", "") ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      "";

  if (supabaseUrl && supabaseKey) {
    return new SupabaseAdapter({
      url: supabaseUrl,
      serviceRoleKey: supabaseKey,
      siteId, // сайт сам себя "отделяет" от других
    });
  }

  // Фолбэк — демо-хранилище в памяти (как было).
  if (!demoStorageCache.has(siteId)) {
    console.warn(
        `[booking-engine] Сайт "${siteId}": не заданы ${prefix}_SUPABASE_URL / ${prefix}_SUPABASE_SERVICE_ROLE_KEY — ` +
        `использую demo-хранилище в памяти (данные пропадут при перезапуске сервера).`
    );
    demoStorageCache.set(siteId, new DemoMemoryStorage(config.storage?.seed));
  }
  return demoStorageCache.get(siteId);
}

export function getEngine(siteId) {
  if (engineCache.has(siteId)) return engineCache.get(siteId);

  const config = getSiteConfig(siteId);
  if (!config) throw new Error(`Сайт "${siteId}" не найден в sites/registry.js`);

  const prefix = config.envPrefix;
  const storage = buildStorage(siteId, prefix, config);
  const emailProvider = buildEmailProvider(prefix, config);

  const engine = new BookingEngine({
  storage,
  emailProvider,
  lockProvider: new MemoryLockAdapter(),
  jwtSecret: siteJwtSecret(siteId, prefix),
  baseUrl: siteBaseUrl(siteId, prefix),
  pendingTtlMinutes: siteEnvNumber(prefix, "PENDING_TTL_MINUTES", 15),
  confirmTokenTtlMinutes: siteEnvNumber(prefix, "CONFIRM_TOKEN_TTL_MINUTES", 30),
  loginTokenTtlMinutes: siteEnvNumber(prefix, "LOGIN_TOKEN_TTL_MINUTES", 15),
  sessionTtlDays: siteEnvNumber(prefix, "SESSION_TTL_DAYS", 30),
  waitUntil,
});

  engineCache.set(siteId, engine);
  return engine;
}
