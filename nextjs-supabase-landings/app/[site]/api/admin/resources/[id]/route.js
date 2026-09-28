import { NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import { getSiteConfig } from "@/sites/registry";
import { isAdminRequest } from "@/lib/adminAuth";

export async function DELETE(request, { params }) {
  const { site, id } = params;
  const config = getSiteConfig(site);
  if (!config) return NextResponse.json({ error: "Сайт не найден" }, { status: 404 });
  if (!isAdminRequest(request, site, config.envPrefix)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const engine = getEngine(site);
  await engine.deleteResource(id);
  return NextResponse.json({ ok: true });
}
