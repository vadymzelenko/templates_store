import { NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import { SESSION_COOKIE } from "@/lib/cookies";
import { BookingEngineError } from "@vzbb-db-system/core";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL(`/?confirm=missing_token`, request.url));
  }

  try {
    const engine = getEngine();
    const booking = await engine.confirmBooking(token);
    const { sessionToken, sessionTtlDays } = engine.createSession(booking.userEmail);

    const res = NextResponse.redirect(new URL(`/dashboard?confirmed=1`, request.url));
    res.cookies.set(SESSION_COOKIE, sessionToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: sessionTtlDays * 24 * 60 * 60,
    });
    return res;
  } catch (err) {
    const code = err instanceof BookingEngineError ? err.code : "UNKNOWN";
    return NextResponse.redirect(new URL(`/?confirm=failed&reason=${code}`, request.url));
  }
}