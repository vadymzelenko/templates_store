import { NextResponse } from "next/server";
import { getEngine } from "@/lib/engine";
import { isAdminRequest } from "@/lib/adminAuth";

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const engine = getEngine();
  const logs = await engine.listLogs();
  return NextResponse.json({ logs });
}