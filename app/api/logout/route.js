import { NextResponse } from "next/server";
import { SESSION_COOKIE, ADMIN_COOKIE } from "@/lib/cookies";

export async function POST(request) {
  const referer = request.headers.get("referer") || "/";
  const res = NextResponse.redirect(new URL(referer, request.url));
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}