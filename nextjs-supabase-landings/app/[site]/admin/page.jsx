import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getSite } from "@/sites/registry";
import { verifyAdminToken } from "@/lib/adminAuth";
import { siteJwtSecret, ADMIN_COOKIE } from "@/lib/cookies";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminPage({ params }) {
  const { site: siteId } = params;
  const site = getSite(siteId);
  if (!site) notFound();

  const { config, Crm } = site;
  const token = cookies().get(ADMIN_COOKIE)?.value;
  const isAdmin = verifyAdminToken(token, siteJwtSecret(siteId, config.envPrefix), siteId);

  if (!isAdmin) {
    return <AdminLoginForm siteId={siteId} theme={config.theme} title={config.crm?.title || config.meta?.title} />;
  }

  return <Crm />;
}
