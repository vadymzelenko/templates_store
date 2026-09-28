"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const STATUS_LABEL = { PENDING: "Ожидает", CONFIRMED: "Подтверждена", CANCELLED: "Отменена" };

function fmt(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso || "—");
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function toLocalInput(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function parseData(raw) {
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw || {};
  } catch {
    return {};
  }
}

export default function DashboardClient({ siteId, email, theme }) {
  const t = theme || {};
  const params = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [editing, setEditing] = useState(null); // { id, value }
  const [message, setMessage] = useState(params.get("confirmed") ? "Запись подтверждена. Спасибо!" : "");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/${siteId}/api/dashboard`);
    if (res.status === 401) {
      window.location.href = `/${siteId}#booking`;
      return;
    }
    const data = await res.json().catch(() => ({}));
    setBookings((data.bookings || []).sort((a, b) => (a.startTime < b.startTime ? 1 : -1)));
    setLoading(false);
  }, [siteId]);

  useEffect(() => {
    load();
  }, [load]);

  async function cancel(id) {
    if (!confirm("Отменить запись?")) return;
    setBusy(id);
    setError("");
    const res = await fetch(`/${siteId}/api/dashboard?bookingId=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) setError((await res.json().catch(() => ({}))).error || "Не удалось отменить");
    await load();
    setBusy(null);
  }

  async function reschedule(b) {
    const start = new Date(editing.value);
    if (isNaN(start.getTime())) return setError("Укажите корректные дату и время");
    const duration = new Date(b.endTime).getTime() - new Date(b.startTime).getTime();
    const end = new Date(start.getTime() + duration);
    setBusy(b.id);
    setError("");
    const res = await fetch(`/${siteId}/api/dashboard`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: b.id, startTime: start.toISOString(), endTime: end.toISOString() }),
    });
    if (!res.ok) setError((await res.json().catch(() => ({}))).error || "Не удалось перенести");
    else {
      setMessage("Запись перенесена.");
      setEditing(null);
    }
    await load();
    setBusy(null);
  }

  const card = {
    border: `1px solid ${t.border || "rgba(255,255,255,0.1)"}`,
    background: t.bgAlt || "#141110",
    padding: 20,
    borderRadius: t.radius || 0,
  };
  const btn = (danger) => ({
    background: "transparent",
    border: `1px solid ${danger ? t.danger || "#e06555" : t.border || "rgba(255,255,255,0.1)"}`,
    color: danger ? t.danger || "#e06555" : t.fg || "#f5f0ea",
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: 13,
  });

  return (
    <main style={{ background: t.bg, color: t.fg, fontFamily: t.font, minHeight: "100vh" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: `1px solid ${t.border}` }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontFamily: t.displayFont }}>Личный кабинет</h1>
          <span style={{ color: t.muted, fontSize: 13 }}>{email}</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a href={`/${siteId}`} style={{ ...btn(false), textDecoration: "none" }}>← На сайт</a>
          <form method="post" action={`/${siteId}/api/logout`}>
            <button type="submit" style={btn(true)}>Выйти</button>
          </form>
        </div>
      </header>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        {message && <p style={{ color: t.success }}>{message}</p>}
        {error && <p style={{ color: t.danger }}>{error}</p>}
        {loading && <p style={{ color: t.muted }}>Загружаем…</p>}
        {!loading && bookings.length === 0 && <p style={{ color: t.muted }}>У вас пока нет записей.</p>}

        {bookings.map((b) => {
          const data = parseData(b.serviceData);
          const active = b.status !== "CANCELLED";
          return (
            <div key={b.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <strong style={{ fontSize: 17 }}>{fmt(b.startTime)}</strong>
                <span style={{ color: b.status === "CONFIRMED" ? t.success : b.status === "CANCELLED" ? t.danger : t.accent, fontWeight: 700, fontSize: 13 }}>
                  {STATUS_LABEL[b.status] || b.status}
                </span>
              </div>
              <div style={{ color: t.muted, fontSize: 14, marginTop: 6 }}>
                {[data.service, data.danceStyle, data.note].filter(Boolean).join(" · ") || "—"}
              </div>

              {active && editing?.id === b.id ? (
                <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                  <input
                    type="datetime-local"
                    value={editing.value}
                    onChange={(e) => setEditing({ id: b.id, value: e.target.value })}
                    style={{ background: t.bg, color: t.fg, border: `1px solid ${t.border}`, padding: 8 }}
                  />
                  <button type="button" disabled={busy === b.id} onClick={() => reschedule(b)} style={btn(false)}>Сохранить</button>
                  <button type="button" onClick={() => setEditing(null)} style={btn(false)}>Отмена</button>
                </div>
              ) : (
                active && (
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button type="button" disabled={busy === b.id} onClick={() => setEditing({ id: b.id, value: toLocalInput(b.startTime) })} style={btn(false)}>Перенести</button>
                    <button type="button" disabled={busy === b.id} onClick={() => cancel(b.id)} style={btn(true)}>Отменить</button>
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
