import { NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import { isAdminRequest } from "@/lib/adminAuth";

export async function DELETE(request, { params }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { id } = params;
  const engine = getEngine();
  await engine.deleteResource(id);
  return NextResponse.json({ ok: true });
}