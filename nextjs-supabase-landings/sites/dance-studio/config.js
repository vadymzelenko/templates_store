export default {
    id: "dance-studio",
    envPrefix: "DANCE_STUDIO",

    // Тип БД: Google Sheets через Apps Script (как у всех лендингов).
    storage: {
        type: "supabase",
        seed: {
            resources: [
                { id: "coach_alina", name: "Алина — контемпорари" },
                { id: "coach_max", name: "Макс — хип-хоп" },
                { id: "coach_vera", name: "Вера — балет" },
            ],
            users: [
                { id: "admin", email: "admin@dance-studio-v-a.demo", name: "Администратор студии", phone: "" },
            ],
        },
    },

    email: { provider: "console" },

    meta: {
        title: "Élan Dance Studio — запись на занятие",
        description: "Балет, контемпорари и хип-хоп. Выберите педагога и время онлайн.",
    },

    design: "editorial",

    // Синхронизировано с палитрой и шрифтами, реально используемыми на
    // лендинге (landing.jsx), — чтобы CRM выглядела частью того же сайта,
    // а не отдельным продуктом. Меняйте эти значения, а не хардкод в JSX.
    theme: {
        bg: "#0c0a09",
        bgAlt: "#141110",
        fg: "#f5f0ea",
        muted: "#a8a099",
        accent: "#c9a05a",
        accentHover: "#d9b06a",
        accentText: "#0c0a09",
        border: "rgba(255,255,255,0.10)",
        success: "#5dc98a",
        danger: "#e06555",
        font: '"Manrope", -apple-system, system-ui, sans-serif',
        displayFont: '"Playfair Display", "Times New Roman", Georgia, serif',
        radius: "0px",
        ctaRadius: "0px",
    },

    booking: {
        daysAhead: 7,
        slotMinutes: 60,
        services: [
            { id: "trial", label: "Пробное занятие — 60 мин" },
            { id: "individual", label: "Индивидуальный урок — 60 мин" },
            { id: "group", label: "Групповое занятие — 90 мин" },
        ],
        extraFields: [
            {
                key: "danceStyle",
                label: "Стиль танца",
                options: ["Балет", "Хип-хоп", "Контемпорари", "Джаз-фанк"],
            },
        ],
    },

    // Метаданные для админ-панели (sites/dance-studio/crm.jsx читает их как config.crm).
    // Сам React-компонент CRM НЕ импортируется сюда — это создало бы циклический
    // импорт (config.js <-> crm.jsx). Компонент подключается напрямую там, где
    // рендерится страница админки: app/[site]/admin/page.jsx.
    crm: {
        title: "Élan Dance Studio — CRM",
        resourceLabel: "Педагоги",
        // Доп. колонки таблицы записей — ключи соответствуют полям serviceData,
        // которые landing.jsx кладёт в бронирование (serviceId, service, danceStyle, note).
        bookingColumns: [
            { key: "service", label: "Услуга" },
            { key: "danceStyle", label: "Стиль" },
            { key: "note", label: "Комментарий" },
        ],
        hideTabs: [],
    },
};