import { NextResponse } from "next/server";
import { SESSION_COOKIE, ADMIN_COOKIE, sitePath } from "@/lib/cookies";

export async function POST(request, { params }) {
  const { site } = params;
  // crm.jsx делает обычный <form method="post" action="/api/<site>/logout">,
  // поэтому после выхода лучше сразу вернуть редирект, а не голый JSON.
  const referer = request.headers.get("referer") || `/${site}`;
  const res = NextResponse.redirect(new URL(referer, request.url));

  const path = sitePath(site);
  res.cookies.set(SESSION_COOKIE, "", { path, maxAge: 0 });
  res.cookies.set(ADMIN_COOKIE, "", { path, maxAge: 0 });
  return res;
}
