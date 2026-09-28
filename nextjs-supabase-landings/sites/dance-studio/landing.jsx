"use client";

import React, {
    useEffect,
    useRef,
    useState,
    useMemo,
    useCallback,
} from "react";
import {
    ArrowRight,
    Phone,
    Loader2,
    Menu as MenuIcon,
    X,
    ArrowLeft,
} from "lucide-react";
import config from "./config.js";

/* ============================================================
   STYLES
   ============================================================ */
const INLINE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700&family=Manrope:wght@300;400;500;600;700&display=swap');

:root {
  --bg:       #0c0a09;
  --bg-2:     #141110;
  --fg:       #f5f0ea;
  --fg-2:     #a8a099;
  --accent:   #c9a05a;
  --accent-2: #d9b06a;
  --rule:     rgba(255,255,255,0.10);
}

html, body {
  background: var(--bg);
  color: var(--fg);
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

.reveal-mask { display: block; overflow: hidden; }
.reveal-mask > * {
  display: block;
  transform: translateY(110%);
  will-change: transform;
}

.fade-in {
  opacity: 0;
  transform: translateY(20px);
  will-change: opacity, transform;
}

.appear { animation: appearUp 0.6s ease both; }
@keyframes appearUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: none; }
}

.no-scroll::-webkit-scrollbar { display: none; }
.no-scroll { -ms-overflow-style: none; scrollbar-width: none; }

@media (max-width: 640px) {
  .display { letter-spacing: -0.03em; }
}

@media (prefers-reduced-motion: reduce) {
  .reveal-mask > * { transform: none !important; }
  .fade-in { opacity: 1 !important; transform: none !important; }
  .appear { animation: none !important; }
}
`;

/* ============================================================
   DATA
   ============================================================ */

const PROGRAMS = [
    {
        id: "contemporary",
        title: "Контемпорари",
        subtitle: "Свободное движение",
        desc: "Современный танец, где техника встречается с эмоцией. Работаем с пластикой, дыханием и импровизацией.",
        img: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=1200&q=80",
        level: "Начальный · Средний",
        duration: "60 минут",
        days: "Ср · Пт",
    },
    {
        id: "hiphop",
        title: "Хип-хоп",
        subtitle: "Энергия и грув",
        desc: "Уличная культура, мощная подача и работа с музыкальной формой. Фристайл и баттлы.",
        img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&q=80",
        level: "Начальный · Продвинутый",
        duration: "60 минут",
        days: "Вт · Чт",
    },
    {
        id: "ballet",
        title: "Классический балет",
        subtitle: "Основа основ",
        desc: "Постановка корпуса, выворотность, работа у станка и на середине. Сила и изящество.",
        img: "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=1200&q=80",
        level: "Любой уровень",
        duration: "90 минут",
        days: "Ср · Сб",
    },
    {
        id: "jazzfunk",
        title: "Джаз-фанк",
        subtitle: "Ярко и динамично",
        desc: "Смесь джаза, хип-хопа и вога. Динамичная хореография и уверенность в теле.",
        img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1200&q=80",
        level: "Средний",
        duration: "60 минут",
        days: "Пн · Чт",
    },
    {
        id: "stretching",
        title: "Растяжка",
        subtitle: "Гибкость без боли",
        desc: "Глубокий стретчинг, шпагаты, мобильность суставов. Мягкий подход без травм.",
        img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80",
        level: "Любой уровень",
        duration: "60 минут",
        days: "Вт · Вс",
    },
];

const TEACHERS = [
    {
        id: "coach_alina",
        name: "Алина Смирнова",
        role: "Контемпорари",
        bio: "Выпускница ГИТИСа, мастерская Аллы Сигаловой. Ведёт класс с 2018 года.",
        img: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=900&q=80",
    },
    {
        id: "coach_max",
        name: "Макс Власов",
        role: "Хип-хоп · Джаз-фанк",
        bio: "Финалист Juste Debout 2019. Учит фристайлу и работе с музыкальной формой.",
        img: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=900&q=80",
    },
    {
        id: "coach_vera",
        name: "Вера Орлова",
        role: "Балет · Растяжка",
        bio: "МГАХ. Двенадцать лет в труппе Музыкального театра Станиславского.",
        img: "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=900&q=80",
    },
];

const NAV_LINKS = [
    { href: "#programs", label: "Программы" },
    { href: "#teachers", label: "Педагоги" },
    { href: "#booking", label: "Запись" },
];

/* ============================================================
   UTILS
   ============================================================ */

function groupDays(slots) {
    const map = {};
    for (const s of slots) {
        const d = new Date(s.startTime);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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
    return new Date(iso).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

// Ключ дня в локальной зоне (без времени).
function dayKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// Календарная арифметика: DST-safe, без миллисекундных прибавлений.
function daysFromToday(count = 45) {
    const out = [];
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const d = today.getDate();
    for (let i = 0; i < count; i++) {
        const day = new Date(y, m, d + i, 0, 0, 0, 0);
        out.push({ key: dayKey(day), date: day });
    }
    return out;
}

/* ============================================================
   GSAP HOOK
   ============================================================ */

function useGsapAnimations(rootRef) {
    useEffect(() => {
        if (typeof window === "undefined" || !rootRef.current) return;
        let ctx;
        let cancelled = false;

        const init = async () => {
            const gsapModule = await import("gsap");
            const gsap = gsapModule.default || gsapModule.gsap;
            const ScrollTriggerModule = await import("gsap/ScrollTrigger");
            const ScrollTrigger =
                ScrollTriggerModule.default || ScrollTriggerModule.ScrollTrigger;
            if (cancelled) return;
            gsap.registerPlugin(ScrollTrigger);

            ctx = gsap.context(() => {
                const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
                tl.to(".hero-line > *", { y: 0, duration: 1.4, stagger: 0.12 })
                    .to(
                        ".hero-fade",
                        { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 },
                        "-=0.9"
                    )
                    .to(
                        ".hero-image",
                        {
                            clipPath: "inset(0% 0% 0% 0%)",
                            duration: 1.6,
                            ease: "power4.inOut",
                        },
                        "-=1.4"
                    )
                    .to(
                        ".hero-meta",
                        { opacity: 1, duration: 0.9, stagger: 0.08 },
                        "-=0.8"
                    );

                gsap.utils.toArray(".reveal-mask").forEach((mask) => {
                    if (mask.closest(".hero-line")) return;
                    const inner = mask.querySelector(":scope > *");
                    if (!inner) return;
                    gsap.to(inner, {
                        y: 0,
                        duration: 1.3,
                        ease: "power4.out",
                        scrollTrigger: { trigger: mask, start: "top 88%", once: true },
                    });
                });

                gsap.utils.toArray(".fade-in").forEach((el) => {
                    if (el.classList.contains("hero-fade")) return;
                    gsap.to(el, {
                        opacity: 1,
                        y: 0,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: { trigger: el, start: "top 90%", once: true },
                    });
                });

                gsap.utils.toArray(".program-item").forEach((item) => {
                    const img = item.querySelector(".program-img");
                    if (img) {
                        gsap.fromTo(
                            img,
                            { yPercent: -12 },
                            {
                                yPercent: 12,
                                ease: "none",
                                scrollTrigger: {
                                    trigger: item,
                                    start: "top bottom",
                                    end: "bottom top",
                                    scrub: true,
                                },
                            }
                        );
                    }
                    gsap.from(item.querySelectorAll(".program-text > *"), {
                        y: 60,
                        opacity: 0,
                        duration: 1,
                        stagger: 0.08,
                        ease: "power3.out",
                        scrollTrigger: { trigger: item, start: "top 75%", once: true },
                    });
                });

                gsap.from(".teacher-card", {
                    y: 100,
                    opacity: 0,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".teachers-grid",
                        start: "top 78%",
                        once: true,
                    },
                });

                const quoteWords = gsap.utils.toArray(".quote-word");
                if (quoteWords.length) {
                    gsap.fromTo(
                        quoteWords,
                        { opacity: 0.12 },
                        {
                            opacity: 1,
                            duration: 0.7,
                            stagger: 0.08,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: ".quote-block",
                                start: "top 70%",
                                once: true,
                            },
                        }
                    );
                }

                const fb = document.querySelector(".full-bleed-img");
                if (fb) {
                    gsap.fromTo(
                        fb,
                        { scale: 1.15, yPercent: -5 },
                        {
                            scale: 1,
                            yPercent: 5,
                            ease: "none",
                            scrollTrigger: {
                                trigger: ".full-bleed-section",
                                start: "top bottom",
                                end: "bottom top",
                                scrub: true,
                            },
                        }
                    );
                }
            }, rootRef);

            ScrollTrigger.refresh();
        };

        init();
        return () => {
            cancelled = true;
            if (ctx) ctx.revert();
        };
    }, [rootRef]);
}

/* ============================================================
   HEADER
   ============================================================ */

function Header({ menuOpen, setMenuOpen }) {
    const close = useCallback(() => setMenuOpen(false), [setMenuOpen]);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    useEffect(() => {
        const onEsc = (e) => {
            if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [close]);

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#0c0a09]/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:h-20 sm:px-10">
                    <a href="#" className="flex items-baseline gap-3" onClick={close}>
                        <span className="display text-2xl font-medium tracking-tight text-[#f5f0ea] sm:text-[26px]">
                            Élan
                        </span>
                        <span className="hidden text-[11px] font-medium uppercase tracking-[0.22em] text-[#a8a099] sm:inline">
                            студия танца
                        </span>
                    </a>

                    <nav className="hidden items-center gap-10 text-[12px] font-semibold uppercase tracking-[0.2em] md:flex">
                        {NAV_LINKS.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                className="text-[#f5f0ea] transition-colors hover:text-[#c9a05a]"
                            >
                                {l.label}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <a
                            href="tel:+74951234567"
                            className="hidden items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#c9a05a] transition-colors hover:text-[#d9b06a] sm:flex"
                        >
                            <Phone className="h-3.5 w-3.5" />
                            <span>+7 495 123 45 67</span>
                        </a>

                        <button
                            type="button"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
                            aria-expanded={menuOpen}
                            className="flex h-10 w-10 items-center justify-center text-[#f5f0ea] transition-colors hover:text-[#c9a05a] md:hidden"
                        >
                            {menuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </header>

            <div
                className={`fixed inset-0 z-40 bg-[#0c0a09] transition-opacity duration-500 md:hidden ${
                    menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                }`}
            >
                <nav className="flex h-full flex-col justify-center px-8 pt-20">
                    <ul className="space-y-2">
                        {NAV_LINKS.map((l, i) => (
                            <li
                                key={l.href}
                                style={{
                                    transitionDelay: menuOpen ? `${150 + i * 70}ms` : "0ms",
                                    transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                                    opacity: menuOpen ? 1 : 0,
                                    transition:
                                        "opacity .5s cubic-bezier(.22,1,.36,1), transform .5s cubic-bezier(.22,1,.36,1)",
                                }}
                            >
                                <a
                                    href={l.href}
                                    onClick={close}
                                    className="display block py-4 text-[clamp(2.5rem,11vw,4rem)] font-medium leading-[1] text-[#f5f0ea] transition-colors hover:text-[#c9a05a]"
                                >
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div
                        className="mt-16 border-t border-white/[0.08] pt-8"
                        style={{
                            transition: "opacity .5s ease",
                            transitionDelay: menuOpen ? "400ms" : "0ms",
                            opacity: menuOpen ? 1 : 0,
                        }}
                    >
                        <a
                            href="tel:+74951234567"
                            className="flex items-center gap-3 text-[16px] font-semibold text-[#c9a05a]"
                        >
                            <Phone className="h-4 w-4" />
                            +7 495 123 45 67
                        </a>
                        <p className="mt-4 text-[14px] leading-[1.7] text-[#a8a099]">
                            Большой Козихинский, 7
                            <br />
                            вход со двора
                        </p>
                    </div>
                </nav>
            </div>
        </>
    );
}

/* ============================================================
   HERO
   ============================================================ */

function Hero() {
    return (
        <section className="relative flex h-[100svh] min-h-[600px] w-full flex-col overflow-hidden">
            <div
                className="hero-image absolute inset-0"
                style={{ clipPath: "inset(50% 0% 50% 0%)" }}
            >
                <img
                    src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1920&q=80"
                    alt=""
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a09]/75 via-[#0c0a09]/60 to-[#0c0a09]" />
            </div>

            <div className="relative z-20 mx-auto flex h-full w-full max-w-[1440px] flex-col justify-between px-5 pb-8 pt-24 sm:px-10 sm:pb-12 sm:pt-32">
                <div className="flex flex-1 flex-col justify-center">
                    <p className="hero-fade mb-6 text-[12px] font-semibold uppercase tracking-[0.25em] text-[#c9a05a] opacity-0 sm:mb-8 sm:text-[13px]">
                        Студия танца · Москва · с 2016
                    </p>

                    <h1 className="display text-[clamp(2.75rem,13vw,10rem)] font-medium leading-[0.9] tracking-[-0.03em] text-[#f5f0ea]">
                        <span className="reveal-mask block">
                            <span className="hero-line block">Искусство</span>
                        </span>
                        <span className="reveal-mask block">
                            <span className="hero-line block italic text-[#c9a05a]">
                                движения
                            </span>
                        </span>
                        <span className="reveal-mask block">
                            <span className="hero-line block">без границ</span>
                        </span>
                    </h1>

                    <p className="hero-fade mt-6 max-w-md text-[15px] leading-[1.65] text-[#a8a099] opacity-0 sm:mt-10 sm:max-w-xl sm:text-[17px]">
                        Пять направлений для взрослых. Первое занятие — бесплатно.
                        Приходите в чём удобно.
                    </p>

                    <div className="hero-fade mt-8 flex flex-wrap items-center gap-4 opacity-0 sm:mt-10 sm:gap-6">
                        <a
                            href="#booking"
                            className="group inline-flex items-center gap-2.5 bg-[#c9a05a] px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-[#0c0a09] transition-colors hover:bg-[#d9b06a] sm:px-8 sm:py-4 sm:text-[13px]"
                        >
                            Записаться
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                        <a
                            href="#programs"
                            className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#f5f0ea] underline decoration-[#c9a05a] decoration-1 underline-offset-8 transition-colors hover:text-[#c9a05a] sm:text-[13px]"
                        >
                            Программы
                        </a>
                    </div>
                </div>

                <div className="hero-meta mt-8 grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-5 opacity-0 sm:mt-12 sm:gap-10 sm:pt-6">
                    {[
                        { n: "12", l: "Направлений" },
                        { n: "1200", l: "Учеников" },
                        { n: "8", l: "Педагогов" },
                    ].map((m) => (
                        <div key={m.l}>
                            <div className="display text-3xl font-medium leading-none text-[#f5f0ea] sm:text-5xl">
                                {m.n}
                            </div>
                            <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#a8a099] sm:mt-2 sm:text-[11px]">
                                {m.l}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ============================================================
   QUOTE
   ============================================================ */

function QuoteBlock() {
    const words =
        "Танец — это язык, на котором тело говорит то, что не может сказать голос".split(
            " "
        );
    return (
        <section className="quote-block border-y border-white/[0.06] py-24 sm:py-48">
            <div className="mx-auto max-w-[1200px] px-5 sm:px-10">
                <p className="display text-center text-[clamp(1.5rem,4vw,3.5rem)] font-medium leading-[1.25] tracking-[-0.02em] text-[#f5f0ea]">
                    {words.map((w, i) => (
                        <span key={i} className="quote-word inline-block">
                            {w}&nbsp;
                        </span>
                    ))}
                </p>
            </div>
        </section>
    );
}

/* ============================================================
   PROGRAMS
   ============================================================ */

function Programs() {
    return (
        <section id="programs" className="scroll-mt-16 py-20 sm:py-32">
            <div className="mx-auto max-w-[1440px] px-5 sm:px-10">
                <div className="section-title mb-14 sm:mb-32">
                    <p className="fade-in mb-5 text-[12px] font-semibold uppercase tracking-[0.25em] text-[#c9a05a] sm:text-[13px]">
                        Программы
                    </p>
                    <h2 className="display text-[clamp(2.25rem,8vw,6rem)] font-medium leading-[0.95] tracking-[-0.03em] text-[#f5f0ea]">
                        <span className="title-line reveal-mask block">
                            <span>Найдите своё</span>
                        </span>
                        <span className="title-line reveal-mask block">
                            <span className="italic text-[#c9a05a]">направление</span>
                        </span>
                    </h2>
                </div>

                <div className="space-y-20 sm:space-y-40">
                    {PROGRAMS.map((p, i) => {
                        const isEven = i % 2 === 0;
                        return (
                            <article
                                key={p.id}
                                className="program-item grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-16"
                            >
                                <div
                                    className={`md:col-span-6 ${
                                        isEven ? "md:order-1" : "md:order-2"
                                    }`}
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <img
                                            src={p.img}
                                            alt={p.title}
                                            className="program-img h-full w-full scale-110 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09]/40 to-transparent" />
                                        <div className="absolute left-4 top-4 bg-[#0c0a09]/75 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#c9a05a] backdrop-blur-sm sm:left-5 sm:top-5 sm:text-[11px]">
                                            {p.level}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`md:col-span-6 ${
                                        isEven ? "md:order-2" : "md:order-1"
                                    }`}
                                >
                                    <div className="program-text">
                                        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.25em] text-[#c9a05a] sm:mb-4 sm:text-[13px]">
                                            {p.subtitle}
                                        </p>
                                        <h3 className="display mb-5 text-[clamp(2rem,6vw,4rem)] font-medium leading-[1] tracking-[-0.02em] text-[#f5f0ea] sm:mb-6">
                                            {p.title}
                                        </h3>
                                        <p className="mb-7 max-w-lg text-[15px] leading-[1.7] text-[#a8a099] sm:mb-8 sm:text-[17px]">
                                            {p.desc}
                                        </p>

                                        <div className="mb-8 flex flex-wrap gap-2.5 sm:mb-10 sm:gap-3">
                                            {[p.duration, p.days].map((d) => (
                                                <span
                                                    key={d}
                                                    className="border border-white/15 px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.15em] text-[#f5f0ea] sm:px-4 sm:text-[12px]"
                                                >
                                                    {d}
                                                </span>
                                            ))}
                                        </div>

                                        <a
                                            href="#booking"
                                            className="group inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#f5f0ea] transition-colors hover:text-[#c9a05a] sm:text-[13px]"
                                        >
                                            Записаться
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </a>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ============================================================
   FULL-BLEED
   ============================================================ */

function FullBleed() {
    return (
        <section className="full-bleed-section relative h-[60vh] min-h-[500px] overflow-hidden sm:h-[90vh]">
            <img
                src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1920&q=80"
                alt=""
                className="full-bleed-img absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#0c0a09]/60" />

            <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center px-5 sm:px-10">
                <div>
                    <p className="fade-in mb-5 text-[12px] font-semibold uppercase tracking-[0.25em] text-[#c9a05a] sm:mb-6 sm:text-[13px]">
                        Первое занятие
                    </p>
                    <h2 className="display text-[clamp(2.5rem,9vw,7rem)] font-medium leading-[0.95] tracking-[-0.03em] text-[#f5f0ea]">
                        <span className="reveal-mask block">
                            <span>Бесплатно.</span>
                        </span>
                        <span className="reveal-mask block italic text-[#c9a05a]">
                            <span>Без условий.</span>
                        </span>
                    </h2>
                    <p className="fade-in mt-6 max-w-md text-[15px] leading-[1.7] text-[#a8a099] sm:mt-8 sm:text-[17px]">
                        Приходите, попробуйте, посмотрите на педагога и группу.
                        Решение принимаете вы.
                    </p>
                </div>
            </div>
        </section>
    );
}

/* ============================================================
   TEACHERS
   ============================================================ */

function Teachers() {
    return (
        <section
            id="teachers"
            className="scroll-mt-16 border-t border-white/[0.06] py-20 sm:py-32"
        >
            <div className="mx-auto max-w-[1440px] px-5 sm:px-10">
                <div className="section-title mb-14 sm:mb-24">
                    <p className="fade-in mb-5 text-[12px] font-semibold uppercase tracking-[0.25em] text-[#c9a05a] sm:mb-6 sm:text-[13px]">
                        Команда
                    </p>
                    <h2 className="display text-[clamp(2.25rem,8vw,6rem)] font-medium leading-[0.95] tracking-[-0.03em] text-[#f5f0ea]">
                        <span className="title-line reveal-mask block">
                            <span>Педагоги</span>
                        </span>
                    </h2>
                </div>

                <div className="teachers-grid grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
                    {TEACHERS.map((t, i) => (
                        <article key={t.id} className="teacher-card">
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <img
                                    src={t.img}
                                    alt={t.name}
                                    className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out hover:scale-[1.06]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9a05a] sm:text-[11px]">
                                        0{i + 1} / {t.role}
                                    </p>
                                    <h3 className="display text-2xl font-medium text-[#f5f0ea] sm:text-3xl">
                                        {t.name}
                                    </h3>
                                </div>
                            </div>
                            <p className="mt-5 text-[14px] leading-[1.7] text-[#a8a099] sm:text-[15px]">
                                {t.bio}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ============================================================
   DATE PICKER — пагинация, без DST-багов
   ============================================================ */

function DatePicker({ days, selectedKey, onSelect, slotsByDay }) {
    const [perPage, setPerPage] = useState(7);
    const [page, setPage] = useState(0);

    // Адаптивное число колонок
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

    // Синхронизируем страницу с выбранным днём только если день
    // изменился извне. Собственные клики «вперёд/назад» не сбрасываем.
    const lastSyncedKey = useRef(null);
    useEffect(() => {
        if (selectedKey === lastSyncedKey.current) return;
        lastSyncedKey.current = selectedKey;
        if (!selectedKey) return;
        const idx = days.findIndex((d) => d.key === selectedKey);
        if (idx < 0) return;
        const target = Math.min(Math.floor(idx / perPage), totalPages - 1);
        setPage(target);
    }, [selectedKey, days, perPage, totalPages]);

    // Не даём странице выйти за пределы
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
        let idx = days.findIndex(
            (d) => d.key === todayK && slotsByDay[d.key]?.length > 0
        );
        if (idx < 0) idx = days.findIndex((d) => slotsByDay[d.key]?.length > 0);
        if (idx < 0) idx = 0;
        setPage(Math.min(Math.floor(idx / perPage), totalPages - 1));
    };

    // Свайп на мобилке
    const touchStartX = useRef(null);
    const onTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e) => {
        if (touchStartX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 50) {
            if (dx < 0) goNext();
            else goPrev();
        }
        touchStartX.current = null;
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
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
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
   КЭШ РАСПИСАНИЯ — бэкенд ходит в Google Sheets, это небыстро.
   Держим ответ в sessionStorage, чтобы не дёргать его повторно
   при каждом заходе/перезагрузке в рамках одной вкладки.
   ============================================================ */

const AVAILABILITY_CACHE_TTL_MS = 2 * 60 * 1000; // 2 минуты

function readAvailabilityCache(siteId) {
    try {
        const raw = sessionStorage.getItem(`${siteId}:availability`);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || Date.now() - parsed.ts > AVAILABILITY_CACHE_TTL_MS) return null;
        return parsed.data;
    } catch {
        return null;
    }
}

function writeAvailabilityCache(siteId, data) {
    try {
        sessionStorage.setItem(
            `${siteId}:availability`,
            JSON.stringify({ ts: Date.now(), data })
        );
    } catch {
        // приватный режим / переполненное хранилище — не критично, просто не кэшируем
    }
}

/* ============================================================
   BOOKING
   ============================================================ */

function Booking() {
    const b = config.booking;
    const daysAhead = b.daysAhead > 0 ? b.daysAhead : 45;

    // null — ещё не выбрано; "new" — обычная запись; "returning" — уже
    // был клиент, хочет попасть в личный кабинет.
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

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        note: "",
    });
    const [consent, setConsent] = useState(false);
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [emailSent, setEmailSent] = useState(true);

    // Форма и слоты нужны только тем, кто выбрал «Записаться впервые» —
    // не грузим расписание, пока человек не дошёл до этого шага.
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

            let free = (data.slots || []).filter(
                (s) => s.freeResourceIds?.length > 0
            );

            // Реальные слоты с бэкенда используем как есть — бэкенд сам
            // решает, какие часы рабочие. Демо-сетку генерируем только
            // если сервер вообще ничего не вернул.
            if (free.length === 0) {
                const gen = [];
                const seed = new Date(start);
                seed.setHours(0, 0, 0, 0);
                const y0 = seed.getFullYear();
                const m0 = seed.getMonth();
                const d0 = seed.getDate();

                for (let d = 0; d < daysAhead; d++) {
                    // Календарная арифметика — DST-safe, без 86400000
                    const dayDate = new Date(y0, m0, d0 + d, 0, 0, 0, 0);
                    const dow = dayDate.getDay();
                    if (dow === 0) continue; // воскресенье

                    [11, 13, 15, 17, 18, 19, 20].forEach((h) => {
                        const s = new Date(
                            dayDate.getFullYear(),
                            dayDate.getMonth(),
                            dayDate.getDate(),
                            h, 0, 0, 0
                        );
                        const e = new Date(s.getTime() + 3600000);
                        gen.push({
                            startTime: s.toISOString(),
                            endTime: e.toISOString(),
                            freeResourceIds: fetched.map((r) => r.id),
                        });
                    });
                }
                free = gen;
            }

            setSlots(free);

            const g = groupDays(free);
            if (g[0]) setSelectedDayKey(g[0].key);
        };

        const cached = readAvailabilityCache(config.id);
        if (cached) {
            applyAvailability(cached);
            setLoading(false);
            return;
        }

        const params = new URLSearchParams({
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            slotMinutes: String(b.slotMinutes),
        });

        setLoading(true);
        fetch(`/${config.id}/api/availability?${params.toString()}`)
            .then((r) => r.json())
            .then((data) => {
                writeAvailabilityCache(config.id, data);
                applyAvailability(data);
            })
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
                map[k] = map[k].filter((s) =>
                    s.freeResourceIds?.includes(selectedResourceId)
                );
            }
        }
        return map;
    }, [slots, selectedResourceId]);

    const allDays = useMemo(() => {
        const base = daysFromToday(daysAhead);
        const baseKeys = new Set(base.map((x) => x.key));
        const extra = days
            .filter((d) => !baseKeys.has(d.key))
            .map((d) => ({ key: d.key, date: d.date }));
        return [...base, ...extra].sort((a, b) =>
            a.key < b.key ? -1 : a.key > b.key ? 1 : 0
        );
    }, [days]);

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
                const res = await fetch(`/${config.id}/api/book`, {
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
                if (!res.ok) {
                    throw new Error(body.error || "Не удалось отправить заявку");
                }
                // Бэкенд может явно сообщить, что письмо не ушло
                // (body.emailSent === false), даже если саму запись создал.
                // Если поле не пришло вовсе — считаем по умолчанию, что ушло,
                // но именно это стоит проверить на стороне API.
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

    // "Уже записывались" — просим email и просим бэкенд прислать ссылку
    // для входа в личный кабинет. Путь /api/<site>/login — по аналогии с
    // /api/<site>/book; если в вашей библиотеке эндпоинт называется иначе,
    // поменяйте здесь.
    const [loginEmail, setLoginEmail] = useState("");
    const [loginStatus, setLoginStatus] = useState("idle");
    const [loginError, setLoginError] = useState("");

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        if (!loginEmail.trim()) return setLoginError("Введите email.");
        setLoginStatus("submitting");
        setLoginError("");
        try {
            const res = await fetch(`/${config.id}/api/login`, {
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
        <section
            id="booking"
            className="scroll-mt-16 border-t border-white/[0.06] py-20 sm:py-32"
        >
            <div className="mx-auto max-w-[1440px] px-5 sm:px-10">
                <div className="section-title mb-14 sm:mb-24">
                    <p className="fade-in mb-5 text-[12px] font-semibold uppercase tracking-[0.25em] text-[#c9a05a] sm:mb-6 sm:text-[13px]">
                        Запись
                    </p>
                    <h2 className="display text-[clamp(2.25rem,8vw,6rem)] font-medium leading-[0.95] tracking-[-0.03em] text-[#f5f0ea]">
                        <span className="title-line reveal-mask block">
                            <span>Приходите</span>
                        </span>
                        <span className="title-line reveal-mask block">
                            <span className="italic text-[#c9a05a]">танцевать</span>
                        </span>
                    </h2>
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
                                Пришлём ссылку на почту для входа в личный кабинет — там
                                видно вашу запись.
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
                                    <span className="text-[#f5f0ea]">{loginEmail}</span> —
                                    там будет ссылка для входа в личный кабинет. Если письма
                                    нет пару минут, загляните в «Спам».
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
                        <h3 className="display mb-6 text-[clamp(1.75rem,6vw,3.5rem)] font-medium leading-[1.05] text-[#f5f0ea] sm:mb-8">
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
                                    попадёте в личный кабинет. Время закреплено за вами на
                                    15 минут, потом слот освободится. Письма нет? Загляните в
                                    «Спам».
                                </>
                            ) : (
                                <>
                                    Запись сохранили, но письмо с подтверждением на{" "}
                                    <span className="text-[#f5f0ea]">{form.email}</span> отправить
                                    не удалось. Администратор позвонит за день до занятия — если
                                    сомневаетесь, что запись прошла, позвоните нам сами.
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

                            {/* 01 Направление */}
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

                            {/* 02 Формат */}
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

                            {/* 03 Педагог */}
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

                            {/* 04 Дата и время */}
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
                                                        selectedSlot?.startTime ===
                                                        s.startTime;
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
                                                    На этот день окон нет. Попробуйте
                                                    другого педагога или соседний день.
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </fieldset>

                            {/* 05 Контакты */}
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
                                                    setForm({
                                                        ...form,
                                                        [f.key]: e.target.value,
                                                    })
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
                                <p className="mb-6 text-[14px] text-red-400">
                                    {errorMessage}
                                </p>
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
                            <div className="border border-white/[0.10] bg-white/[0.02] p-6 sm:p-8 lg:sticky lg:top-24">
                                <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c9a05a] sm:mb-8 sm:text-[12px]">
                                    Ваша заявка
                                </p>
                                <dl className="space-y-4 sm:space-y-5">
                                    {[
                                        { k: "Направление", v: danceStyle },
                                        {
                                            k: "Формат",
                                            v: selectedService?.label
                                                .split("—")[0]
                                                .trim(),
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
   FOOTER
   ============================================================ */

function Footer() {
    return (
        <footer className="border-t border-white/[0.06] pb-10 pt-16 sm:pt-24">
            <div className="mx-auto max-w-[1440px] px-5 sm:px-10">
                <div className="grid grid-cols-2 gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="col-span-2 lg:col-span-6">
                        <h2 className="display text-[clamp(2rem,7vw,5rem)] font-medium leading-[1] tracking-[-0.03em] text-[#f5f0ea]">
                            Большой
                            <br />
                            Козихинский, 7
                            <br />
                            <span className="italic text-[#c9a05a]">
                                вход со двора
                            </span>
                        </h2>
                        <p className="mt-6 max-w-md text-[14px] leading-[1.7] text-[#a8a099] sm:mt-8 sm:text-[15px]">
                            Пять минут от метро «Маяковская». Душ, шкафчики и чай на
                            кухне. Коврики и мячи — в студии.
                        </p>
                    </div>

                    <div className="col-span-1 lg:col-span-2">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#a8a099] sm:mb-4 sm:text-[12px]">
                            Телефон
                        </p>
                        <a
                            href="tel:+74951234567"
                            className="text-[15px] text-[#f5f0ea] transition-colors hover:text-[#c9a05a] sm:text-[16px]"
                        >
                            +7 495 123 45 67
                        </a>
                    </div>

                    <div className="col-span-1 lg:col-span-2">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#a8a099] sm:mb-4 sm:text-[12px]">
                            Почта
                        </p>
                        <a
                            href="mailto:hi@elan.studio"
                            className="break-all text-[15px] text-[#f5f0ea] transition-colors hover:text-[#c9a05a] sm:text-[16px]"
                        >
                            hi@elan.studio
                        </a>
                    </div>

                    <div className="col-span-2 lg:col-span-2">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#a8a099] sm:mb-4 sm:text-[12px]">
                            Часы
                        </p>
                        <p className="text-[14px] leading-[1.7] text-[#f5f0ea] sm:text-[15px]">
                            Пн–Пт — 10:00–23:00
                            <br />
                            Сб–Вс — 10:00–20:00
                        </p>
                    </div>
                </div>

                <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-white/[0.06] pt-6 text-[11px] font-medium uppercase tracking-[0.22em] text-[#a8a099] sm:mt-20 sm:flex-row sm:items-center sm:text-[12px]">
                    <span>Élan · студия танца · © {new Date().getFullYear()}</span>
                    <div className="flex flex-wrap gap-6 sm:gap-8">
                        <a href="#" className="transition-colors hover:text-[#c9a05a]">
                            Instagram
                        </a>
                        <a href="#" className="transition-colors hover:text-[#c9a05a]">
                            Telegram
                        </a>
                        <a
                            href={`/${config.id}/admin`}
                            className="transition-colors hover:text-[#c9a05a]"
                        >
                            CRM
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* ============================================================
   ROOT
   ============================================================ */

export default function DanceLanding() {
    const rootRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useGsapAnimations(rootRef);

    return (
        <div
            ref={rootRef}
            className="min-h-screen bg-[#0c0a09] text-[#f5f0ea] antialiased"
        >
            <style dangerouslySetInnerHTML={{ __html: INLINE_CSS }} />

            <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <main className="pt-16 sm:pt-20">
                <Hero />
                <QuoteBlock />
                <Programs />
                <FullBleed />
                <Teachers />
                <Booking />
            </main>

            <Footer />
        </div>
    );
}