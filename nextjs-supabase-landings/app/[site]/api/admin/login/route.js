import { NextResponse } from "next/server";
import { getSiteConfig } from "@/sites/registry";
import { checkAdminCredentials, signAdminToken } from "@/lib/adminAuth";
import { siteJwtSecret, ADMIN_COOKIE, sitePath } from "@/lib/cookies";

export async function POST(request, { params }) {
  const { site } = params;
  const config = getSiteConfig(site);
  if (!config) return NextResponse.json({ error: "Сайт не найден" }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const { email, password } = body ?? {};
  if (!email || !password) {
    return NextResponse.json({ error: "Укажите email и пароль" }, { status: 400 });
  }

  const prefix = config.envPrefix;
  if (!checkAdminCredentials(prefix, email, password)) {
    return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
  }

  const token = signAdminToken(site, siteJwtSecret(site, prefix));
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    path: sitePath(site),
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 12, // 12 часов, синхронно с signAdminToken
  });
  return res;
}
