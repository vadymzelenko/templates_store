// lib/engine.js
import {
  BookingEngine,
  MemoryLockAdapter,
  ResendAdapter,
  NodemailerAdapter,
  ConsoleEmailAdapter,
  SupabaseAdapter,
} from "@vzbb-db-system/core";

import { env, envNumber, baseUrl } from "@/lib/env";
import { DemoMemoryStorage } from "@/lib/demoStorage";
import config from "@/site/config.js";

let engineCache = null;
let demoStorageCache = null;

function buildEmailProvider() {
  const provider = env("EMAIL_PROVIDER", config.email?.provider || "console");

  if (provider === "resend") {
    return new ResendAdapter({
      apiKey: env("RESEND_API_KEY", ""),
      fromEmail: env("RESEND_FROM_EMAIL", "Booking <booking@example.com>"),
    });
  }

  if (provider === "nodemailer") {
    return new NodemailerAdapter({
      gmailUser: env("GMAIL_USER", ""),
      gmailAppPassword: env("GMAIL_APP_PASSWORD", ""),
      fromName: env("EMAIL_FROM_NAME", config.meta?.title),
    });
  }

  return new ConsoleEmailAdapter();
}

function buildStorage() {
  const supabaseUrl = env("SUPABASE_URL", "");
  const supabaseKey = env("SUPABASE_SERVICE_ROLE_KEY", "");

  if (supabaseUrl && supabaseKey) {
    return new SupabaseAdapter({
      url: supabaseUrl,
      serviceRoleKey: supabaseKey,
      // В БД остаётся колонка site_id — теперь она всегда равна config.id.
      siteId: config.id,
    });
  }

  if (!demoStorageCache) {
    console.warn(
        "[booking-engine] Не заданы SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY — " +
        "использую demo-хранилище в памяти (данные пропадут при перезапуске)."
    );
    demoStorageCache = new DemoMemoryStorage(config.storage?.seed);
  }
  return demoStorageCache;
}

export function getEngine() {
  if (engineCache) return engineCache;

  engineCache = new BookingEngine({
    storage: buildStorage(),
    emailProvider: buildEmailProvider(),
    lockProvider: new MemoryLockAdapter(),
    jwtSecret: env("JWT_SECRET", "dev-insecure-secret"),
    baseUrl: baseUrl(),
    pendingTtlMinutes: envNumber("PENDING_TTL_MINUTES", 15),
    confirmTokenTtlMinutes: envNumber("CONFIRM_TOKEN_TTL_MINUTES", 30),
    loginTokenTtlMinutes: envNumber("LOGIN_TOKEN_TTL_MINUTES", 15),
    sessionTtlDays: envNumber("SESSION_TTL_DAYS", 30),
  });

  return engineCache;
}