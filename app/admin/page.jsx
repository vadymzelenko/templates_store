// app/admin/page.jsx
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/adminAuth";
import { ADMIN_COOKIE } from "@/lib/cookies";
import AdminLoginForm from "./AdminLoginForm";
import Crm from "@/site/crm.jsx";
import config from "@/site/config.js";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `${config.crm?.title || "CRM"} — ${config.meta?.title || ""}`.trim(),
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const isAdmin = verifyAdminToken(token);

  if (!isAdmin) {
    return (
        <AdminLoginForm
            theme={config.theme}
            title={config.crm?.title || config.meta?.title}
        />
    );
  }

  return <Crm />;
}