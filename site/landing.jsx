"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import config from "./config.js";

/* ============================================================
   STYLES
   ============================================================ */
const INLINE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,500&family=Manrope:wght@300;400;500;600;700&display=swap');

html, body {
  background: #0c0a09;
  color: #f5f0ea;
  font-family: 'Manrope', -apple-system, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

*, *::before, *::after { box-sizing: border-box; }

.display {
  font-family: 'Playfair Display', 'Times New Roman', Georgia, serif;
  font-weight: 500;
  letter-spacing: -0.02em;
}

.appear { animation: appearUp 0.5s ease both; }
@keyframes appearUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .appear { animation: none !important; }
}
`;

/* ============================================================
   UTILS
   ============================================================ */

function dayKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function groupDays(slots) {
    const map = {};
    for (const s of slots) {
        const d = new Date(s.startTime);
        const key = dayKey(d);
        if (!map[key]) map[key] = { key, date: d, slots: [] };
        map[key].slots.push(s);
    }
    return Object.values(map).sort((a, b) =>
        a.key < b.key ? -1 : a.key > b.key ? 1 : 0
    );
}

function dayParts(isoDate) {
    const d = new Date(isoDate);
    const weekday = d.toLocaleDateString("ru-RU", { weekday: "short" });
    const month = d.toLocaleDateString("ru-RU", { month: "short" });
    return {
        weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1).replace(".", ""),
        day: d.getDate(),
        month: month.replace(".", ""),
        monthLong: d.toLocaleDateString("ru-RU", { month: "long" }),
    };
}

function timeOf(iso) {
    return new Date(iso).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function daysFromToday(fromDate, count = 45) {
    const out = [];
    const y = fromDate.getFullYear();
    const m = fromDate.getMonth();
    const d = fromDate.getDate();
    for (let i = 0; i < count; i++) {
        const day = new Date(y, m, d + i, 0, 0, 0, 0);
        out.push({ key: dayKey(day), date: day });
    }
    return out;
}

/* ============================================================
   HEADER
   ============================================================ */

function Header() {
    return (
        <header className="border-b border-white/[0.06] bg-[#0c0a09]">
            <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:h-20 sm:px-10">
                <a href="/" className="flex items-baseline gap-3">
                    <span className="display text-2xl font-medium tracking-tight text-[#f5f0ea] sm:text-[26px]">
                        Élan
                    </span>
                    <span className="hidden text-[11px] font-medium uppercase tracking-[0.22em] text-[#a8a099] sm:inline">
                        студия танца
                    </span>
                </a>
                <a
                    href="/admin"
                    className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a8a099] transition-colors hover:text-[#c9a05a] sm:text-[12px]"
                >
                    CRM
                </a>
            </div>
        </header>
    );
}

/* ============================================================
   DATE PICKER
   ============================================================ */

function DatePicker({ days, selectedKey, onSelect, slotsByDay }) {
    const [perPage, setPerPage] = useState(7);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            let n = 7;
            if (w < 380) n = 3;
            else if (w < 560) n = 4;
            else if (w < 860) n = 5;
            else if (w < 1200) n = 6;
            setPerPage(n);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const totalPages = Math.max(1, Math.ceil(days.length / perPage));
    const safePage = Math.min(page, totalPages - 1);
    const start = safePage * perPage;
    const visible = days.slice(start, start + perPage);

    const monthLabel = useMemo(() => {
        if (visible.length === 0) return "";
        const first = dayParts(visible[0].date);
        const last = dayParts(visible[visible.length - 1].date);
        return first.monthLong === last.monthLong
            ? first.monthLong
            : `${first.monthLong} — ${last.monthLong}`;
    }, [visible]);

    const goPrev = () => setPage((p) => Math.max(0, p - 1));
    const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

    const goToday = () => {
        const todayK = dayKey(new Date());
        let idx = days.findIndex((d) => d.key === todayK && slotsByDay[d.key]?.length > 0);
        if (idx < 0) idx = days.findIndex((d) => slotsByDay[d.key]?.length > 0);
        if (idx < 0) idx = 0;
        setPage(Math.min(Math.floor(idx / perPage), totalPages - 1));
    };

    return (
        <div className="border border-white/[0.10] bg-white/[0.02]">
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-3 sm:px-5">
                <div className="flex min-w-0 items-baseline gap-3">
                    <span className="truncate text-[13px] font-medium capitalize text-[#f5f0ea] sm:text-[14px]">
                        {monthLabel}
                    </span>
                    <span className="hidden whitespace-nowrap font-mono text-[11px] tabular-nums text-[#a8a099] sm:inline">
                        {safePage + 1} / {totalPages}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={goToday}
                        className="hidden border border-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#f5f0ea] transition-colors hover:border-[#c9a05a] hover:text-[#c9a05a] sm:inline-block"
                    >
                        Сегодня
                    </button>
                    <button
                        type="button"
                        onClick={goPrev}
                        disabled={safePage === 0}
                        aria-label="Предыдущая страница"
                        className="flex h-9 w-9 items-center justify-center border border-white/15 text-[#f5f0ea] transition-colors hover:border-[#c9a05a] hover:text-[#c9a05a] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        disabled={safePage >= totalPages - 1}
                        aria-label="Следующая страница"
                        className="flex h-9 w-9 items-center justify-center border border-white/15 text-[#f5f0ea] transition-colors hover:border-[#c9a05a] hover:text-[#c9a05a] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div
                className="grid gap-2 p-3 sm:gap-3 sm:p-4"
                style={{ gridTemplateColumns: `repeat(${perPage}, minmax(0, 1fr))` }}
            >
                {visible.map((d) => {
                    const hasSlots = slotsByDay[d.key]?.length > 0;
                    const active = selectedKey === d.key;
                    const p = dayParts(d.date);
                    return (
                        <button
                            type="button"
                            key={d.key}
                            disabled={!hasSlots}
                            onClick={() => onSelect(d.key)}
                            className={`flex min-w-0 flex-col items-center gap-0.5 border px-1 py-2.5 transition-colors sm:py-3 ${
                                active
                                    ? "border-[#c9a05a] bg-[#c9a05a] text-[#0c0a09]"
                                    : hasSlots
                                        ? "border-white/15 text-[#f5f0ea] hover:border-[#c9a05a]"
                                        : "cursor-not-allowed border-white/[0.05] text-[#a8a099]/40"
                            }`}
                        >
                            <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                                {p.weekday}
                            </span>
                            <span className="display text-xl font-medium leading-none sm:text-2xl">
                                {p.day}
                            </span>
                            <span className="text-[9px] font-medium uppercase tracking-[0.12em] sm:text-[10px]">
                                {p.month}
                            </span>
                        </button>
                    );
                })}
            </div>

            {totalPages > 1 && totalPages <= 20 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 border-t border-white/[0.06] px-4 py-3">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setPage(i)}
                            aria-label={`Страница ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all ${
                                i === safePage
                                    ? "w-6 bg-[#c9a05a]"
                                    : "w-1.5 bg-white/20 hover:bg-white/40"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

/* ============================================================
   BOOKING
   ============================================================ */

function Booking() {
    const b = config.booking;
    const daysAhead = b.daysAhead > 0 ? b.daysAhead : 45;

    const [flow, setFlow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [slots, setSlots] = useState([]);
    const [resources, setResources] = useState([]);

    const [serviceId, setServiceId] = useState(b.services[0]?.id || "");
    const [danceStyle, setDanceStyle] = useState(
        b.extraFields[0]?.options[0] || "Контемпорари"
    );
    const [selectedDayKey, setSelectedDayKey] = useState("");
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedResourceId, setSelectedResourceId] = useState("");

    const [form, setForm] = useState({ name: "", email: "", phone: "", note: "" });
    const [consent, setConsent] = useState(false);
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [emailSent, setEmailSent] = useState(true);

    useEffect(() => {
        if (flow !== "new") return;

        const now = new Date();
        const start = new Date(now);
        start.setMinutes(0, 0, 0);
        start.setHours(start.getHours() + 1);
        const end = new Date(start.getTime() + daysAhead * 86400000);

        const applyAvailability = (data) => {
            const fetched = data.resources?.length
                ? data.resources
                : config.storage?.seed?.resources || [];
            setResources(fetched);
            if (fetched[0]) setSelectedResourceId(fetched[0].id);

            // Слот считается свободным, если freeResourceIds отсутствует
            // (сервер не размечает) ИЛИ это непустой массив.
            // Занят — только если массив пустой.
            const isFree = (s) => {
                if (!Array.isArray(s.freeResourceIds)) return true;
                return s.freeResourceIds.length > 0;
            };

            const hasRealSlots = Array.isArray(data.slots) && data.slots.length > 0;

            let free;
            if (hasRealSlots) {
                free = data.slots.filter(isFree);
            } else {
                // Демо-сетка: только для полностью пустого ответа сервера
                free = [];
                const seed = new Date(start);
                seed.setHours(0, 0, 0, 0);
                const y0 = seed.getFullYear();
                const m0 = seed.getMonth();
                const d0 = seed.getDate();

                for (let d = 0; d < daysAhead; d++) {
                    const dayDate = new Date(y0, m0, d0 + d, 0, 0, 0, 0);
                    if (dayDate.getDay() === 0) continue;

                    [11, 13, 15, 17, 18, 19, 20].forEach((h) => {
                        const s = new Date(
                            dayDate.getFullYear(),
                            dayDate.getMonth(),
                            dayDate.getDate(),
                            h, 0, 0, 0
                        );
                        const e = new Date(s.getTime() + 3600000);
                        free.push({
                            startTime: s.toISOString(),
                            endTime: e.toISOString(),
                            freeResourceIds: fetched.map((r) => r.id),
                        });
                    });
                }
            }

            setSlots(free);

            const g = groupDays(free);
            if (g[0]) setSelectedDayKey(g[0].key);
        };

        const params = new URLSearchParams({
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            slotMinutes: String(b.slotMinutes),
        });

        setLoading(true);
        fetch(`/api/availability?${params.toString()}`)
            .then((r) => r.json())
            .then(applyAvailability)
            .catch(() => setErrorMessage("Не удалось загрузить расписание"))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flow, b.slotMinutes, daysAhead]);

    const days = useMemo(() => groupDays(slots), [slots]);

    const slotsByDay = useMemo(() => {
        const map = {};
        for (const s of slots) {
            const d = new Date(s.startTime);
            const key = dayKey(d);
            (map[key] = map[key] || []).push(s);
        }
        if (selectedResourceId) {
            for (const k of Object.keys(map)) {
                map[k] = map[k].filter((s) => {
                    if (!Array.isArray(s.freeResourceIds)) return true;
                    return s.freeResourceIds.includes(selectedResourceId);
                });
            }
        }
        return map;
    }, [slots, selectedResourceId]);

    const allDays = useMemo(() => {
        const base = daysFromToday(new Date(), daysAhead);
        const baseKeys = new Set(base.map((x) => x.key));
        const extra = days
            .filter((d) => !baseKeys.has(d.key))
            .map((d) => ({ key: d.key, date: d.date }));
        return [...base, ...extra].sort((a, b) =>
            a.key < b.key ? -1 : a.key > b.key ? 1 : 0
        );
    }, [days, daysAhead]);

    const activeDaySlots = slotsByDay[selectedDayKey] || [];
    const selectedService = b.services.find((s) => s.id === serviceId);
    const selectedCoach = resources.find((r) => r.id === selectedResourceId);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            if (!selectedSlot) return setErrorMessage("Выберите дату и время.");
            if (!selectedResourceId)
                return setErrorMessage("Не удалось определить педагога, обновите страницу.");
            if (!consent)
                return setErrorMessage("Нужно согласие на обработку данных.");

            setStatus("submitting");
            setErrorMessage("");
            try {
                const res = await fetch("/api/book", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userEmail: form.email,
                        name: form.name,
                        phone: form.phone,
                        resourceId: selectedResourceId,
                        startTime: selectedSlot.startTime,
                        endTime: selectedSlot.endTime,
                        serviceData: {
                            serviceId,
                            service: selectedService?.label,
                            danceStyle,
                            note: form.note,
                        },
                    }),
                });
                const body = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(body.error || "Не удалось отправить заявку");
                setEmailSent(body.emailSent !== false);
                setStatus("sent");
            } catch (err) {
                setStatus("error");
                setErrorMessage(err.message || "Ошибка подключения");
            }
        },
        [
            selectedSlot,
            consent,
            form,
            selectedResourceId,
            serviceId,
            selectedService,
            danceStyle,
        ]
    );

    const [loginEmail, setLoginEmail] = useState("");
    const [loginStatus, setLoginStatus] = useState("idle");
    const [loginError, setLoginError] = useState("");

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        if (!loginEmail.trim()) return setLoginError("Введите email.");
        setLoginStatus("submitting");
        setLoginError("");
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loginEmail.trim() }),
            });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(body.error || "Не удалось отправить ссылку");
            setLoginStatus("sent");
        } catch (err) {
            setLoginStatus("error");
            setLoginError(err.message || "Ошибка подключения");
        }
    }, [loginEmail]);

    return (
        <section className="py-12 sm:py-20">
            <div className="mx-auto max-w-[1200px] px-5 sm:px-10">
                <div className="mb-10 sm:mb-14">
                    <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.25em] text-[#c9a05a] sm:text-[13px]">
                        Запись
                    </p>
                    <h1 className="display text-[clamp(2.25rem,8vw,5rem)] font-medium leading-[0.95] tracking-[-0.03em] text-[#f5f0ea]">
                        Приходите <span className="italic text-[#c9a05a]">танцевать</span>
                    </h1>
                </div>

                {flow === null ? (
                    <div className="appear grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => setFlow("new")}
                            className="group border border-white/15 px-6 py-10 text-left transition-colors hover:border-[#c9a05a] sm:px-8"
                        >
                            <span className="display block text-[clamp(1.5rem,4vw,2.25rem)] font-medium text-[#f5f0ea]">
                                Записаться впервые
                            </span>
                            <span className="mt-3 block text-[14px] leading-[1.6] text-[#a8a099]">
                                Выберете направление, педагога и удобное время.
                            </span>
                            <span className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#c9a05a]">
                                Начать <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFlow("returning")}
                            className="group border border-white/15 px-6 py-10 text-left transition-colors hover:border-[#c9a05a] sm:px-8"
                        >
                            <span className="display block text-[clamp(1.5rem,4vw,2.25rem)] font-medium text-[#f5f0ea]">
                                Я уже записывался(-лась)
                            </span>
                            <span className="mt-3 block text-[14px] leading-[1.6] text-[#a8a099]">
                                Пришлём ссылку на почту для входа в личный кабинет.
                            </span>
                            <span className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#c9a05a]">
                                Войти <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </button>
                    </div>
                ) : flow === "returning" ? (
                    <div className="appear max-w-md">
                        <button
                            type="button"
                            onClick={() => {
                                setFlow(null);
                                setLoginStatus("idle");
                                setLoginError("");
                            }}
                            className="mb-8 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#a8a099] hover:text-[#c9a05a]"
                        >
                            <ArrowLeft className="h-4 w-4" /> Назад
                        </button>

                        {loginStatus === "sent" ? (
                            <>
                                <h3 className="display mb-4 text-[clamp(1.5rem,5vw,2.5rem)] font-medium text-[#f5f0ea]">
                                    Ссылку отправили
                                </h3>
                                <p className="text-[15px] leading-[1.7] text-[#a8a099]">
                                    Проверьте почту{" "}
                                    <span className="text-[#f5f0ea]">{loginEmail}</span> — там
                                    будет ссылка для входа в личный кабинет. Если письма нет пару
                                    минут, загляните в «Спам».
                                </p>
                            </>
                        ) : (
                            <form onSubmit={handleLogin}>
                                <label className="block">
                                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a8a099] sm:text-[12px]">
                                        Email, на который записывались
                                    </span>
                                    <input
                                        type="email"
                                        required
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        className="block w-full border-b border-white/15 bg-transparent py-3 text-[16px] text-[#f5f0ea] focus:border-[#c9a05a] focus:outline-none"
                                    />
                                </label>
                                {loginError && (
                                    <p className="mt-4 text-[14px] text-red-400">{loginError}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={loginStatus === "submitting"}
                                    className="mt-8 inline-flex items-center gap-3 bg-[#c9a05a] px-8 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-[#0c0a09] transition-colors hover:bg-[#d9b06a] disabled:cursor-not-allowed disabled:opacity-30 sm:text-[13px]"
                                >
                                    {loginStatus === "submitting" ? "Отправляем" : "Прислать ссылку"}
                                </button>
                            </form>
                        )}
                    </div>
                ) : status === "sent" ? (
                    <div className="appear max-w-2xl">
                        <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.25em] text-[#c9a05a] sm:text-[13px]">
                            Проверьте почту
                        </p>
                        <h3 className="display mb-6 text-[clamp(1.75rem,6vw,3rem)] font-medium leading-[1.05] text-[#f5f0ea] sm:mb-8">
                            Осталось подтвердить запись
                            {selectedSlot && (
                                <>
                                    {" "}
                                    на {dayParts(selectedSlot.startTime).day}{" "}
                                    {dayParts(selectedSlot.startTime).month}
                                </>
                            )}
                            {selectedCoach &&
                                `, к ${selectedCoach.name.split("—")[0].trim()}`}
                        </h3>
                        <p className="mb-8 text-[15px] leading-[1.7] text-[#a8a099] sm:text-[17px]">
                            {emailSent ? (
                                <>
                                    Перейдите на почту{" "}
                                    <span className="text-[#f5f0ea]">{form.email}</span> и
                                    нажмите на ссылку в письме — запись подтвердится, и вы
                                    попадёте в личный кабинет. Время закреплено за вами на 15
                                    минут, потом слот освободится. Письма нет? Загляните в
                                    «Спам».
                                </>
                            ) : (
                                <>
                                    Запись сохранили, но письмо с подтверждением на{" "}
                                    <span className="text-[#f5f0ea]">{form.email}</span>{" "}
                                    отправить не удалось. Администратор позвонит за день до
                                    занятия.
                                </>
                            )}
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setStatus("idle");
                                setSelectedSlot(null);
                                setFlow(null);
                            }}
                            className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#c9a05a] underline decoration-1 underline-offset-8 sm:text-[13px]"
                        >
                            Оформить ещё одну
                        </button>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16"
                    >
                        <div className="min-w-0 lg:col-span-7">
                            <button
                                type="button"
                                onClick={() => setFlow(null)}
                                className="mb-10 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#a8a099] hover:text-[#c9a05a]"
                            >
                                <ArrowLeft className="h-4 w-4" /> Назад
                            </button>

                            <fieldset className="mb-12 sm:mb-14">
                                <legend className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#a8a099] sm:text-[12px]">
                                    01 · Направление
                                </legend>
                                <div className="flex flex-wrap gap-2.5 sm:gap-3">
                                    {b.extraFields[0]?.options.map((style) => {
                                        const active = danceStyle === style;
                                        return (
                                            <button
                                                key={style}
                                                type="button"
                                                onClick={() => setDanceStyle(style)}
                                                className={`border px-4 py-3 text-[13px] font-medium transition-colors sm:px-5 sm:text-[14px] ${
                                                    active
                                                        ? "border-[#c9a05a] bg-[#c9a05a] text-[#0c0a09]"
                                                        : "border-white/15 text-[#f5f0ea] hover:border-[#c9a05a]"
                                                }`}
                                            >
                                                {style}
                                            </button>
                                        );
                                    })}
                                </div>
                            </fieldset>

                            <fieldset className="mb-12 sm:mb-14">
                                <legend className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#a8a099] sm:text-[12px]">
                                    02 · Формат
                                </legend>
                                <div className="border-t border-white/[0.08]">
                                    {b.services.map((srv) => {
                                        const active = serviceId === srv.id;
                                        return (
                                            <label
                                                key={srv.id}
                                                className="flex cursor-pointer items-center gap-4 border-b border-white/[0.08] py-4 transition-colors hover:bg-white/[0.02] sm:py-5"
                                            >
                                                <input
                                                    type="radio"
                                                    name="service"
                                                    checked={active}
                                                    onChange={() => setServiceId(srv.id)}
                                                    className="sr-only"
                                                />
                                                <span
                                                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
                                                        active
                                                            ? "border-[#c9a05a]"
                                                            : "border-white/30"
                                                    }`}
                                                >
                                                    {active && (
                                                        <span className="h-2.5 w-2.5 rounded-full bg-[#c9a05a]" />
                                                    )}
                                                </span>
                                                <span className="flex-1 text-[15px] text-[#f5f0ea] sm:text-[16px]">
                                                    {srv.label.split("—")[0].trim()}
                                                </span>
                                                <span className="text-[12px] font-medium uppercase tracking-[0.15em] text-[#a8a099] sm:text-[13px]">
                                                    {srv.label.split("—")[1]?.trim() || "60 мин"}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </fieldset>

                            {resources.length > 0 && (
                                <fieldset className="mb-12 sm:mb-14">
                                    <legend className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#a8a099] sm:text-[12px]">
                                        03 · Педагог
                                    </legend>
                                    <div className="flex flex-wrap gap-2.5 sm:gap-3">
                                        {resources.map((res) => {
                                            const active = selectedResourceId === res.id;
                                            return (
                                                <button
                                                    key={res.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedResourceId(res.id);
                                                        setSelectedSlot(null);
                                                    }}
                                                    className={`border px-4 py-3 text-[13px] font-medium transition-colors sm:px-5 sm:text-[14px] ${
                                                        active
                                                            ? "border-[#c9a05a] bg-[#c9a05a] text-[#0c0a09]"
                                                            : "border-white/15 text-[#f5f0ea] hover:border-[#c9a05a]"
                                                    }`}
                                                >
                                                    {res.name.split("—")[0].trim()}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </fieldset>
                            )}

                            <fieldset className="mb-12 sm:mb-14">
                                <legend className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#a8a099] sm:text-[12px]">
                                    04 · Дата и время
                                </legend>

                                {loading ? (
                                    <div className="flex items-center gap-3 py-8 text-[#a8a099]">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span className="text-[12px] font-medium uppercase tracking-[0.2em]">
                                            Загружаем расписание
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <DatePicker
                                            days={allDays}
                                            selectedKey={selectedDayKey}
                                            onSelect={(key) => {
                                                setSelectedDayKey(key);
                                                setSelectedSlot(null);
                                            }}
                                            slotsByDay={slotsByDay}
                                        />

                                        <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
                                            {activeDaySlots.length > 0 ? (
                                                activeDaySlots.map((s) => {
                                                    const active =
                                                        selectedSlot?.startTime === s.startTime;
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={s.startTime}
                                                            onClick={() => setSelectedSlot(s)}
                                                            className={`border px-5 py-3 text-[14px] font-medium tabular-nums transition-colors sm:px-6 sm:text-[15px] ${
                                                                active
                                                                    ? "border-[#c9a05a] bg-[#c9a05a] text-[#0c0a09]"
                                                                    : "border-white/15 text-[#f5f0ea] hover:border-[#c9a05a]"
                                                            }`}
                                                        >
                                                            {timeOf(s.startTime)}
                                                        </button>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-[14px] leading-[1.7] text-[#a8a099] sm:text-[15px]">
                                                    На этот день окон нет. Попробуйте другого
                                                    педагога или соседний день.
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </fieldset>

                            <fieldset className="mb-10">
                                <legend className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#a8a099] sm:text-[12px]">
                                    05 · Контакты
                                </legend>
                                <div className="space-y-5 sm:space-y-6">
                                    {[
                                        { key: "name", label: "Имя", type: "text" },
                                        { key: "phone", label: "Телефон", type: "tel" },
                                        { key: "email", label: "Email", type: "email" },
                                        {
                                            key: "note",
                                            label: "Комментарий",
                                            type: "text",
                                            ph: "С нуля / был опыт",
                                        },
                                    ].map((f) => (
                                        <label key={f.key} className="block">
                                            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a8a099] sm:text-[12px]">
                                                {f.label}
                                                {f.key !== "note" && " *"}
                                            </span>
                                            <input
                                                required={f.key !== "note"}
                                                type={f.type}
                                                placeholder={f.ph}
                                                value={form[f.key]}
                                                onChange={(e) =>
                                                    setForm({ ...form, [f.key]: e.target.value })
                                                }
                                                className="block w-full border-b border-white/15 bg-transparent py-3 text-[16px] text-[#f5f0ea] placeholder:text-[#a8a099]/50 focus:border-[#c9a05a] focus:outline-none"
                                            />
                                        </label>
                                    ))}
                                </div>

                                <label className="mt-8 flex items-start gap-3 text-[13px] leading-[1.6] text-[#a8a099] sm:text-[14px]">
                                    <input
                                        type="checkbox"
                                        checked={consent}
                                        onChange={(e) => setConsent(e.target.checked)}
                                        className="mt-1 h-4 w-4 accent-[#c9a05a]"
                                    />
                                    <span>
                                        Согласен на обработку персональных данных.
                                        Отменить запись можно за 12 часов до занятия.
                                    </span>
                                </label>
                            </fieldset>

                            {errorMessage && (
                                <p className="mb-6 text-[14px] text-red-400">{errorMessage}</p>
                            )}

                            <button
                                type="submit"
                                disabled={status === "submitting" || !consent}
                                className="group inline-flex w-full items-center justify-center gap-3 bg-[#c9a05a] px-8 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-[#0c0a09] transition-all hover:bg-[#d9b06a] disabled:cursor-not-allowed disabled:opacity-30 sm:w-auto sm:text-[13px]"
                            >
                                {status === "submitting" ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Отправляем</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Отправить заявку</span>
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </div>

                        <aside className="min-w-0 lg:col-span-4 lg:col-start-9">
                            <div className="border border-white/[0.10] bg-white/[0.02] p-6 sm:p-8 lg:sticky lg:top-8">
                                <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c9a05a] sm:mb-8 sm:text-[12px]">
                                    Ваша заявка
                                </p>
                                <dl className="space-y-4 sm:space-y-5">
                                    {[
                                        { k: "Направление", v: danceStyle },
                                        {
                                            k: "Формат",
                                            v: selectedService?.label.split("—")[0].trim(),
                                        },
                                        {
                                            k: "Педагог",
                                            v:
                                                selectedCoach?.name
                                                    .split("—")[0]
                                                    .trim() || "—",
                                        },
                                        {
                                            k: "Дата и время",
                                            v: selectedSlot
                                                ? `${dayParts(selectedSlot.startTime).day} ${dayParts(selectedSlot.startTime).month}, ${timeOf(selectedSlot.startTime)}`
                                                : "—",
                                        },
                                    ].map((row) => (
                                        <div
                                            key={row.k}
                                            className="flex justify-between gap-4 border-b border-white/[0.06] pb-4"
                                        >
                                            <dt className="text-[12px] font-medium uppercase tracking-[0.15em] text-[#a8a099]">
                                                {row.k}
                                            </dt>
                                            <dd className="text-right text-[14px] text-[#f5f0ea] sm:text-[15px]">
                                                {row.v}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                                <p className="mt-6 text-[13px] leading-[1.7] text-[#a8a099] sm:mt-8 sm:text-[14px]">
                                    Первое занятие — бесплатно. Абонемент на 8 занятий —
                                    9 800 ₽, действует три месяца.
                                </p>
                            </div>
                        </aside>
                    </form>
                )}
            </div>
        </section>
    );
}

/* ============================================================
   ROOT
   ============================================================ */

export default function DanceLanding() {
    return (
        <div className="min-h-screen bg-[#0c0a09] text-[#f5f0ea] antialiased">
            <style dangerouslySetInnerHTML={{ __html: INLINE_CSS }} />
            <Header />
            <main>
                <Booking />
            </main>
            <footer className="border-t border-white/[0.06] py-6 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-[#a8a099]">
                Élan · студия танца
            </footer>
        </div>
    );
}