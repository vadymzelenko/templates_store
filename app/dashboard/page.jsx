// app/dashboard/page.jsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getEngine } from "@/lib/engine";
import { SESSION_COOKIE } from "@/lib/cookies";
import DashboardClient from "./DashboardClient";
import config from "@/site/config.js";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Личный кабинет — ${config.meta?.title || "Запись"}`,
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  const engine = getEngine();
  const session = token ? engine.verifySession(token) : null;

  if (!session) redirect("/#booking");

  return <DashboardClient email={session.email} theme={config.theme} />;
}