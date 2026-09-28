"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm({ siteId, theme, title }) {
  const router = useRouter();
  const t = theme || {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
        const res = await fetch(`/${siteId}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Не удалось войти");
      router.refresh();
    } catch (err) {
      setError(err.message || "Ошибка подключения");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: t.bg || "#0c0a09",
        color: t.fg || "#f5f0ea",
        fontFamily: t.font || "system-ui, sans-serif",
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: 340,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          border: `1px solid ${t.border || "rgba(255,255,255,0.1)"}`,
          background: t.bgAlt || "#141110",
          padding: 28,
          borderRadius: t.radius || 8,
        }}
      >
        <h1 style={{ fontSize: 18, margin: "0 0 8px", fontFamily: t.displayFont }}>
          {title || "Админ-панель"}
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle(t)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle(t)}
        />
        {error && <p style={{ color: t.danger || "#e06555", fontSize: 13, margin: 0 }}>{error}</p>}
        <button
          type="submit"
          disabled={busy}
          style={{
            background: t.accent || "#c9a05a",
            color: t.accentText || "#0c0a09",
            border: "none",
            padding: "10px 16px",
            borderRadius: t.ctaRadius || 6,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {busy ? "Входим…" : "Войти"}
        </button>
      </form>
    </main>
  );
}

function inputStyle(t) {
  return {
    background: t.bg || "#0c0a09",
    border: `1px solid ${t.border || "rgba(255,255,255,0.1)"}`,
    color: t.fg || "#f5f0ea",
    padding: "10px 12px",
    borderRadius: t.radius || 6,
    fontFamily: t.font,
  };
}
