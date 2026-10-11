import { NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import { BookingEngineError } from "@vzbb-db-system/core";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  const { userEmail, name, phone, resourceId, startTime, endTime, serviceData } = body ?? {};
  if (!userEmail || !startTime || !endTime) {
    return NextResponse.json(
        { error: "Обязательные поля: userEmail, startTime, endTime" },
        { status: 400 }
    );
  }

  try {
    const engine = getEngine();
    const booking = await engine.requestBooking({
      userEmail, name, phone, resourceId, startTime, endTime, serviceData,
    });
    return NextResponse.json({ bookingId: booking.id, status: booking.status, emailSent: true });
  } catch (err) {
    if (err instanceof BookingEngineError) {
      const status = err.code === "SLOT_TAKEN" || err.code === "LOCK_BUSY" ? 409 : 400;
      return NextResponse.json({ error: err.message, code: err.code }, { status });
    }
    console.error("[api/book]", err);
    return NextResponse.json({ error: "Не удалось создать запись" }, { status: 500 });
  }
}