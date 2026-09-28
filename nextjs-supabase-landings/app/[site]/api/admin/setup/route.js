import { NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import { getSiteConfig } from "@/sites/registry";
import { isAdminRequest } from "@/lib/adminAuth";

export async function POST(request, { params }) {
  const { site } = params;
  const config = getSiteConfig(site);
  if (!config) return NextResponse.json({ error: "Сайт не найден" }, { status: 404 });
  if (!isAdminRequest(request, site, config.envPrefix)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const engine = getEngine(site);
  const seed = config.storage?.seed ?? {};

  const existingResources = await engine.listResources();
  const existingIds = new Set(existingResources.map((r) => r.id));
  let createdResources = 0;
  for (const r of seed.resources ?? []) {
    if (!existingIds.has(r.id)) {
      await engine.createResource(r);
      createdResources++;
    }
  }

  // Пользователей library не даёт создавать напрямую по id (только через
  // storage.createUser нет в BookingEngine) — сиды пользователей носят
  // демонстрационный характер и создаются только для demo-хранилища при
  // первой инициализации (см. lib/demoStorage.js). Для Google Sheets реальные
  // пользователи появляются через обычный флоу бронирования/подтверждения.

  await engine.rebuildReport().catch(() => {});

  return NextResponse.json({
    message: `Готово: добавлено ${createdResources} специалист(ов). Данные обновлены.`,
  });
}
