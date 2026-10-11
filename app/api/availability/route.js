import { NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import config from "@/site/config.js";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startTime = searchParams.get("startTime");
  const endTime = searchParams.get("endTime");
  const slotMinutes = Number(searchParams.get("slotMinutes")) || config.booking?.slotMinutes || 60;

  if (!startTime || !endTime) {
    return NextResponse.json({ error: "startTime и endTime обязательны" }, { status: 400 });
  }

  try {
    const engine = getEngine();
    const data = await engine.getAvailability(startTime, endTime, slotMinutes);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[api/availability]", err);
    return NextResponse.json({ error: "Не удалось получить расписание" }, { status: 500 });
  }
}