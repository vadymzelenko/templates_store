import { NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import { isAdminRequest } from "@/lib/adminAuth";

export async function PATCH(request, { params }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { id } = params;
  const body = await request.json().catch(() => ({}));
  const { status } = body ?? {};
  if (!["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
    return NextResponse.json({ error: "Некорректный статус" }, { status: 400 });
  }
  const engine = getEngine();
  await engine.setBookingStatus(id, status);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { id } = params;
  const engine = getEngine();
  await engine.deleteBooking(id);
  return NextResponse.json({ ok: true });
}