"use client";

import { useEffect, useState } from "react";
import config from "./config.js";

const STATUS = { PENDING: "Ожидает", CONFIRMED: "Подтверждена", CANCELLED: "Отменена" };

const FONT_IMPORT =
    "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Manrope:wght@400;500;600;700&display=swap');";

export default function DanceCrm() {
    const siteId = config.id;
    const t = config.theme;
    const c = config.crm;

    const [tab, setTab] = useState("bookings");
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [resources, setResources] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(null);
    const [newResource, setNewResource] = useState("");
    const [notice, setNotice] = useState("");

    async function load() {
        const [b, u, r, l] = await Promise.all([
            fetch(`/${siteId}/api/admin/bookings`).then((x) => x.json()),
            fetch(`/${siteId}/api/admin/users`).then((x) => x.json()),
            fetch(`/${siteId}/api/admin/resources`).then((x) => x.json()),
            fetch(`/${siteId}/api/admin/logs`).then((x) => x.json()),
        ]);
        setBookings(b.bookings || []);
        setUsers(u.users || []);
        setResources(r.resources || []);
        setLogs(l.logs || []);
        setLoading(false);
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [siteId]);

    async function setStatus(id, status) {
        setBusy(id);
        await fetch(`/${siteId}/api/admin/bookings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        await load();
        setBusy(null);
    }

    async function removeBooking(id) {
        if (!confirm("Удалить запись?")) return;
        setBusy(id);
        await fetch(`/${siteId}/api/admin/bookings/${id}`, { method: "DELETE" });
        await load();
        setBusy(null);
    }

    async function addResource(e) {
        e.preventDefault();
        if (!newResource.trim()) return;
        await fetch(`/${siteId}/api/admin/resources`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newResource.trim() }),
        });
        setNewResource("");
        await load();
    }

    async function removeResource(id) {
        if (!confirm("Удалить специалиста?")) return;
        await fetch(`/${siteId}/api/admin/resources/${id}`, { method: "DELETE" });
        await load();
    }

    async function resetDemo() {
        const res = await fetch(`/${siteId}/api/admin/setup`, { method: "POST" });
        const data = await res.json().catch(() => ({}));
        setNotice(data.message || "Готово");
        await load();
    }

    const resourceName = (id) => resources.find((r) => r.id === id)?.name || id;
    const tabs = buildTabs(c);

    return (
        <main style={{ background: t.bg, color: t.fg, fontFamily: t.font, minHeight: "100vh" }}>
            <style dangerouslySetInnerHTML={{ __html: FONT_IMPORT }} />
            <header style={header(t)}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 26, fontFamily: t.displayFont, fontWeight: 600, letterSpacing: "-0.01em" }}>
                        {c.title}
                    </h1>
                    <a href={`/${siteId}`} style={{ color: t.accent, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>← На лендинг</a>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button type="button" onClick={resetDemo} style={btn(t, false)}>Сбросить демо</button>
                    <form method="post" action={`/${siteId}/api/logout`}>
                        <button type="submit" style={btn(t, true)}>Выйти</button>
                    </form>
                </div>
            </header>

            <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px" }}>
                {notice && <p style={{ color: t.success }}>{notice}</p>}

                <nav style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                    {tabs.map((x) => (
                        <button key={x.id} type="button" onClick={() => setTab(x.id)} style={tabBtn(t, tab === x.id)}>
                            {x.label}
                        </button>
                    ))}
                </nav>

                {loading ? (
                    <p style={{ color: t.muted }}>Загружаем…</p>
                ) : (
                    <>
                        {tab === "bookings" && <BookingsTable t={t} bookings={bookings} columns={c.bookingColumns || []} resourceLabel={c.resourceLabel || "Специалист"} resourceName={resourceName} busy={busy} onStatus={setStatus} onDelete={removeBooking} />}
                        {tab === "users" && <UsersTable t={t} users={users} />}
                        {tab === "resources" && <ResourcesPanel t={t} resources={resources} label={c.resourceLabel} newResource={newResource} setNewResource={setNewResource} onAdd={addResource} onDelete={removeResource} />}
                        {tab === "logs" && <LogsTable t={t} logs={logs} />}
                    </>
                )}
            </div>
        </main>
    );
}

function header(t) {
    return { borderBottom: `1px solid ${t.border}`, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 };
}

function btn(t, danger) {
    return { background: danger ? "transparent" : t.bgAlt, border: `1px solid ${danger ? t.danger : t.border}`, color: danger ? t.danger : t.fg, padding: "8px 16px", borderRadius: t.radius, cursor: "pointer", fontFamily: t.font, fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" };
}

function tabBtn(t, active) {
    return { background: active ? t.accent : t.bgAlt, border: `1px solid ${active ? t.accent : t.border}`, color: active ? t.accentText : t.muted, padding: "8px 16px", borderRadius: t.radius, cursor: "pointer", fontFamily: t.font, fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" };
}

function buildTabs(c) {
    const hide = c.hideTabs || [];
    return [
        { id: "bookings", label: "Записи" },
        { id: "users", label: "Клиенты" },
        { id: "resources", label: c.resourceLabel || "Специалисты" },
        { id: "logs", label: "Логи" },
    ].filter((x) => !hide.includes(x.id));
}

function tableStyle(t) {
    return { width: "100%", borderCollapse: "collapse", fontSize: 14 };
}

function th(t) {
    return { textAlign: "left", padding: "10px 12px", borderBottom: `1px solid ${t.border}`, color: t.muted, fontWeight: 600 };
}

function td(t) {
    return { padding: "10px 12px", borderBottom: `1px solid ${t.border}` };
}

function badge(t, status) {
    const color = status === "CONFIRMED" ? t.success : status === "CANCELLED" ? t.danger : t.accent;
    return { display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, color, background: `${color}22` };
}

function actionBtn(t, danger) {
    return { background: "transparent", border: `1px solid ${danger ? t.danger : t.border}`, color: danger ? t.danger : t.fg, padding: "6px 10px", borderRadius: t.radius, cursor: "pointer", fontSize: 13 };
}

function tableWrap(t) {
    return { overflowX: "auto", border: `1px solid ${t.border}`, borderRadius: t.radius };
}

function BookingsTable({ t, bookings, columns, resourceLabel, resourceName, busy, onStatus, onDelete }) {
    if (!bookings.length) return <p style={{ color: t.muted }}>Записей пока нет.</p>;
    return (
        <div style={tableWrap(t)}>
            <table style={tableStyle(t)}>
                <thead>
                <tr>
                    <th style={th(t)}>Клиент</th>
                    <th style={th(t)}>Дата и время</th>
                    <th style={th(t)}>{resourceLabel}</th>
                    {columns.map((col) => <th key={col.key} style={th(t)}>{col.label}</th>)}
                    <th style={th(t)}>Статус</th>
                    <th style={th(t)}></th>
                </tr>
                </thead>
                <tbody>
                {bookings.map((b) => {
                    const data = parseServiceData(b.serviceData);
                    return (
                        <tr key={b.id}>
                            <td style={td(t)}>
                                {b.userEmail}
                                {data.name && <div style={{ color: t.muted, fontSize: 12 }}>{data.name}{data.phone ? ` · ${data.phone}` : ""}</div>}
                            </td>
                            <td style={td(t)}>{formatDate(b.startTime)}</td>
                            <td style={td(t)}>{resourceName(b.resourceId)}</td>
                            {columns.map((col) => <td key={col.key} style={td(t)}>{data[col.key] || "—"}</td>)}
                            <td style={td(t)}><span style={badge(t, b.status)}>{STATUS[b.status] || b.status}</span></td>
                            <td style={{ ...td(t), display: "flex", gap: 6, whiteSpace: "nowrap" }}>
                                {b.status !== "CONFIRMED" && <button type="button" aria-label="Подтвердить запись" disabled={busy === b.id} onClick={() => onStatus(b.id, "CONFIRMED")} style={actionBtn(t)}>✓</button>}
                                {b.status !== "CANCELLED" && <button type="button" aria-label="Отменить запись" disabled={busy === b.id} onClick={() => onStatus(b.id, "CANCELLED")} style={actionBtn(t)}>✕</button>}
                                <button type="button" disabled={busy === b.id} onClick={() => onDelete(b.id)} style={actionBtn(t, true)}>Удалить</button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

function UsersTable({ t, users }) {
    if (!users.length) return <p style={{ color: t.muted }}>Клиентов пока нет.</p>;
    return (
        <div style={tableWrap(t)}>
            <table style={tableStyle(t)}>
                <thead><tr><th style={th(t)}>Email</th><th style={th(t)}>Имя</th><th style={th(t)}>Телефон</th></tr></thead>
                <tbody>
                {users.map((u) => (
                    <tr key={u.id}>
                        <td style={td(t)}>{u.email}</td>
                        <td style={td(t)}>{u.name || "—"}</td>
                        <td style={td(t)}>{u.phone || "—"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

function ResourcesPanel({ t, resources, label, newResource, setNewResource, onAdd, onDelete }) {
    return (
        <div>
            <form onSubmit={onAdd} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <input value={newResource} onChange={(e) => setNewResource(e.target.value)} placeholder={`Имя ${(label || "специалиста").toLowerCase()}`} style={{ flex: 1, background: t.bgAlt, border: `1px solid ${t.border}`, color: t.fg, padding: "10px 12px", borderRadius: t.radius, fontFamily: t.font }} />
                <button type="submit" style={{ background: t.accent, color: t.accentText, border: "none", padding: "10px 16px", borderRadius: t.ctaRadius, cursor: "pointer", fontFamily: t.font, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 13 }}>Добавить</button>
            </form>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {resources.map((r) => (
                    <li key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: t.bgAlt, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "10px 14px" }}>
                        <span>{r.name}</span>
                        <button type="button" onClick={() => onDelete(r.id)} style={actionBtn(t, true)}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function LogsTable({ t, logs }) {
    if (!logs.length) return <p style={{ color: t.muted }}>Логов пока нет.</p>;
    return (
        <div style={tableWrap(t)}>
            <table style={tableStyle(t)}>
                <thead><tr><th style={th(t)}>Время</th><th style={th(t)}>Действие</th><th style={th(t)}>Email</th><th style={th(t)}>Детали</th></tr></thead>
                <tbody>
                {logs.map((l, i) => (
                    <tr key={i}>
                        <td style={td(t)}>{formatDate(l.timestamp)}</td>
                        <td style={td(t)}>{l.action}</td>
                        <td style={td(t)}>{l.email}</td>
                        <td style={td(t)}>{l.details}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

function parseServiceData(raw) {
    if (!raw) return {};
    try {
        return typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
        return { service: String(raw) };
    }
}

function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}