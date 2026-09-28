import { NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import { getSiteConfig } from "@/sites/registry";
import { SESSION_COOKIE, sitePath } from "@/lib/cookies";
import { BookingEngineError } from "@vzbb-db-system/core";

// Путь этого роута — /<site>/api/confirm, а не /api/<site>/confirm — потому что
// именно так BookingEngine строит ссылку в письме: `${baseUrl}/api/confirm`,
// а baseUrl (<PREFIX>_BASE_URL) уже включает "/<site>" (см. .env).
export async function GET(request, { params }) {
  const { site } = params;
  const config = getSiteConfig(site);
  if (!config) return NextResponse.json({ error: "Сайт не найден" }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL(`/${site}?confirm=missing_token`, request.url));
  }

  try {
    const engine = getEngine(site);
    const booking = await engine.confirmBooking(token);
    const { sessionToken, sessionTtlDays } = engine.createSession(booking.userEmail);

    const res = NextResponse.redirect(new URL(`/${site}/dashboard?confirmed=1`, request.url));
    res.cookies.set(SESSION_COOKIE, sessionToken, {
      path: sitePath(site),
      httpOnly: true,
      sameSite: "lax",
      maxAge: sessionTtlDays * 24 * 60 * 60,
    });
    return res;
  } catch (err) {
    const code = err instanceof BookingEngineError ? err.code : "UNKNOWN";
    return NextResponse.redirect(new URL(`/${site}?confirm=failed&reason=${code}`, request.url));
  }
}
