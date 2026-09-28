// app/[site]/dashboard/page.jsx
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getSite } from "@/sites/registry";
import { getEngine } from "@/lib/engine";
import { SESSION_COOKIE, siteJwtSecret } from "@/lib/cookies";
import DashboardClient from "./DashboardClient";

// Временно: подробные логи. Уберите после отладки.
const DEBUG = true;
function log(...args) {
  if (DEBUG) console.log("[dashboard]", ...args);
}

export default async function DashboardPage({ params }) {
  const { site: siteId } = params;
  const site = getSite(siteId);
  if (!site) notFound();

  // Next.js 15: cookies() асинхронна. Next.js 14: синхронна.
  // await на объекте в 14 — no-op, так что код совместим с обеими версиями.
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  log("site:", siteId);
  log("cookies present:", allCookies.map((c) => c.name));
  log("session token:", token ? token.slice(0, 20) + "…" : "(missing)");

  const secret = siteJwtSecret(siteId, site.config.envPrefix);
  log("JWT secret fingerprint:", secret.slice(0, 8) + "… (len " + secret.length + ")");

  const engine = getEngine(siteId);
  const session = token ? engine.verifySession(token) : null;
  log("verifySession →", session);

  if (!session) {
    log("no session → redirect to landing#booking");
    redirect(`/${siteId}#booking`);
  }

  log("session OK for", session.email, "→ rendering DashboardClient");
  return <DashboardClient siteId={siteId} email={session.email} theme={site.config.theme} />;
}