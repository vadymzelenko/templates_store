// lib/adminAuth.js
import jwt from "jsonwebtoken";
import { env } from "@/lib/env";
import { ADMIN_COOKIE, jwtSecret } from "@/lib/cookies";

const ADMIN_TOKEN_TTL = "12h";

export function checkAdminCredentials(email, password) {
  const envEmail = env("ADMIN_EMAIL", "");
  const envPassword = env("ADMIN_PASSWORD", "");
  if (!envEmail || !envPassword) return false;
  return email === envEmail && password === envPassword;
}

export function signAdminToken() {
  return jwt.sign({ admin: true }, jwtSecret(), { expiresIn: ADMIN_TOKEN_TTL });
}

export function verifyAdminToken(token) {
  if (!token) return false;
  try {
    const payload = jwt.verify(token, jwtSecret());
    return Boolean(payload && payload.admin === true);
  } catch {
    return false;
  }
}

export function isAdminRequest(request) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
}