// lib/cookies.js
import { env } from "@/lib/env";

export const SESSION_COOKIE = "bs_session";
export const ADMIN_COOKIE = "bs_admin";

export function jwtSecret() {
  return env("JWT_SECRET", "dev-insecure-secret");
}