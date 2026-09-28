import { NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import { getSiteConfig } from "@/sites/registry";
import { isAdminRequest } from "@/lib/adminAuth";

export async function PATCH(request, { params }) {
  const { site, id } = params;
  const config = getSiteConfig(site);
  if (!config) return NextResponse.json({ error: "Сайт не найден" }, { status: 404 });
  if (!isAdminRequest(request, site, config.envPrefix)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { status } = body ?? {};
  if (!["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
    return NextResponse.json({ error: "Некорректный статус" }, { status: 400 });
  }

  const engine = getEngine(site);
  await engine.setBookingStatus(id, status);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { site, id } = params;
  const config = getSiteConfig(site);
  if (!config) return NextResponse.json({ error: "Сайт не найден" }, { status: 404 });
  if (!isAdminRequest(request, site, config.envPrefix)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const engine = getEngine(site);
  await engine.deleteBooking(id);
  return NextResponse.json({ ok: true });
}
