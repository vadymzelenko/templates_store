import { NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import { isAdminRequest } from "@/lib/adminAuth";
import config from "@/site/config.js";

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const engine = getEngine();
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

  await engine.rebuildReport().catch(() => {});

  return NextResponse.json({
    message: `Готово: добавлено ${createdResources} специалист(ов). Данные обновлены.`,
  });
}