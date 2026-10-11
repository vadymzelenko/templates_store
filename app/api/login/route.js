import { NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import { SESSION_COOKIE } from "@/lib/cookies";
import { BookingEngineError } from "@vzbb-db-system/core";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  const email = (body?.email ?? "").trim();
  if (!email) return NextResponse.json({ error: "Укажите email" }, { status: 400 });

  try {
    const engine = getEngine();
    await engine.requestLogin(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/login POST]", err);
    return NextResponse.json({ error: "Не удалось отправить ссылку" }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL(`/?login=missing_token`, request.url));
  }

  try {
    const engine = getEngine();
    const { email, sessionToken, sessionTtlDays } = await engine.verifyLoginToken(token);

    const res = NextResponse.redirect(new URL(`/dashboard`, request.url));
    res.cookies.set(SESSION_COOKIE, sessionToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: sessionTtlDays * 24 * 60 * 60,
    });
    return res;
  } catch (err) {
    const code = err instanceof BookingEngineError ? err.code : "UNKNOWN";
    return NextResponse.redirect(new URL(`/?login=failed&reason=${code}`, request.url));
  }
}