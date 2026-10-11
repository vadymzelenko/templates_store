import { NextResponse } from "next/server";
import { checkAdminCredentials, signAdminToken } from "@/lib/adminAuth";
import { ADMIN_COOKIE } from "@/lib/cookies";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { email, password } = body ?? {};
  if (!email || !password) {
    return NextResponse.json({ error: "Укажите email и пароль" }, { status: 400 });
  }

  if (!checkAdminCredentials(email, password)) {
    return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
  }

  const token = signAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 12,
  });
  return res;
}