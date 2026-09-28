import { NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import { getSiteConfig } from "@/sites/registry";
import { SESSION_COOKIE } from "@/lib/cookies";
import { BookingEngineError } from "@vzbb-db-system/core";

function getSessionEmail(request, engine) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = engine.verifySession(token);
  return session?.email ?? null;
}

export async function GET(request, { params }) {
  const { site } = params;
  if (!getSiteConfig(site)) return NextResponse.json({ error: "Сайт не найден" }, { status: 404 });

  const engine = getEngine(site);
  const email = getSessionEmail(request, engine);
  if (!email) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const bookings = await engine.listUserBookings(email);
  return NextResponse.json({ email, bookings });
}

export async function PATCH(request, { params }) {
  const { site } = params;
  if (!getSiteConfig(site)) return NextResponse.json({ error: "Сайт не найден" }, { status: 404 });

  const engine = getEngine(site);
  const email = getSessionEmail(request, engine);
  if (!email) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const { bookingId, startTime, endTime } = body ?? {};
  if (!bookingId || !startTime || !endTime) {
    return NextResponse.json(
      { error: "Обязательные поля: bookingId, startTime, endTime" },
      { status: 400 }
    );
  }

  try {
    const booking = await engine.rescheduleBooking(bookingId, email, startTime, endTime);
    return NextResponse.json({ booking });
  } catch (err) {
    if (err instanceof BookingEngineError) {
      const status = err.code === "FORBIDDEN" ? 403 : err.code === "NOT_FOUND" ? 404 : 409;
      return NextResponse.json({ error: err.message, code: err.code }, { status });
    }
    console.error(`[api/${site}/dashboard PATCH]`, err);
    return NextResponse.json({ error: "Не удалось перенести запись" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { site } = params;
  if (!getSiteConfig(site)) return NextResponse.json({ error: "Сайт не найден" }, { status: 404 });

  const engine = getEngine(site);
  const email = getSessionEmail(request, engine);
  if (!email) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("bookingId");
  if (!bookingId) return NextResponse.json({ error: "Укажите bookingId" }, { status: 400 });

  try {
    await engine.cancelBooking(bookingId, email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof BookingEngineError) {
      const status = err.code === "FORBIDDEN" ? 403 : err.code === "NOT_FOUND" ? 404 : 400;
      return NextResponse.json({ error: err.message, code: err.code }, { status });
    }
    console.error(`[api/${site}/dashboard DELETE]`, err);
    return NextResponse.json({ error: "Не удалось отменить запись" }, { status: 500 });
  }
}
