// app/[site]/api/login/route.js
//
// Два режима на одном URL:
//   POST — запрос magic-link'а с лендинга (email в теле → письмо со ссылкой).
//   GET  — клик по ссылке из письма (?token=… → session-cookie → redirect в dashboard).

import { NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import { getSiteConfig } from "@/sites/registry";
import { SESSION_COOKIE, sitePath } from "@/lib/cookies";
import { BookingEngineError } from "@vzbb-db-system/core";

// ---------- POST: запрос ссылки для входа ----------
export async function POST(request, { params }) {
  const { site } = params;
  const config = getSiteConfig(site);
  if (!config) return NextResponse.json({ error: "Сайт не найден" }, { status: 404 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  const email = (body?.email ?? "").trim();
  if (!email) return NextResponse.json({ error: "Укажите email" }, { status: 400 });

  try {
    const engine = getEngine(site);
    // Намеренно не сообщаем, найден email или нет — чтобы не палить базу.
    await engine.requestLogin(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[api/${site}/login POST]`, err);
    return NextResponse.json({ error: "Не удалось отправить ссылку" }, { status: 500 });
  }
}

// ---------- GET: клик по ссылке из письма ----------
export async function GET(request, { params }) {
  const { site } = params;
  const config = getSiteConfig(site);
  if (!config) return NextResponse.json({ error: "Сайт не найден" }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL(`/${site}?login=missing_token`, request.url));
  }

  try {
    const engine = getEngine(site);
    const { email, sessionToken, sessionTtlDays } = await engine.verifyLoginToken(token);

    const res = NextResponse.redirect(new URL(`/${site}/dashboard`, request.url));
    res.cookies.set(SESSION_COOKIE, sessionToken, {
      path: sitePath(site),  // = "/dance-studio"
      httpOnly: true,
      sameSite: "lax",
      maxAge: sessionTtlDays * 24 * 60 * 60,
    });
    return res;
  } catch (err) {
    const code = err instanceof BookingEngineError ? err.code : "UNKNOWN";
    return NextResponse.redirect(new URL(`/${site}?login=failed&reason=${code}`, request.url));
  }
}