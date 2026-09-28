import { NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import { getSiteConfig } from "@/sites/registry";

export async function GET(request, { params }) {
  const { site } = params;
  const config = getSiteConfig(site);
  if (!config) return NextResponse.json({ error: "Сайт не найден" }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const startTime = searchParams.get("startTime");
  const endTime = searchParams.get("endTime");
  const slotMinutes = Number(searchParams.get("slotMinutes")) || config.booking?.slotMinutes || 60;

  if (!startTime || !endTime) {
    return NextResponse.json({ error: "startTime и endTime обязательны" }, { status: 400 });
  }

  try {
    const engine = getEngine(site);
    const data = await engine.getAvailability(startTime, endTime, slotMinutes);
    return NextResponse.json(data);
  } catch (err) {
    console.error(`[api/${site}/availability]`, err);
    return NextResponse.json({ error: "Не удалось получить расписание" }, { status: 500 });
  }
}
