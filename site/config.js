// site/config.js
export default {
    id: "dance-studio",

    storage: {
        type: "supabase",
        seed: {
            resources: [
                { id: "coach_alina", name: "Алина — контемпорари" },
                { id: "coach_max",   name: "Макс — хип-хоп" },
                { id: "coach_vera",  name: "Вера — балет" },
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
            { id: "trial",      label: "Пробное занятие — 60 мин" },
            { id: "individual", label: "Индивидуальный урок — 60 мин" },
            { id: "group",      label: "Групповое занятие — 90 мин" },
        ],
        extraFields: [
            {
                key: "danceStyle",
                label: "Стиль танца",
                options: ["Балет", "Хип-хоп", "Контемпорари", "Джаз-фанк"],
            },
        ],
    },

    crm: {
        title: "Élan Dance Studio — CRM",
        resourceLabel: "Педагоги",
        bookingColumns: [
            { key: "service",    label: "Услуга" },
            { key: "danceStyle", label: "Стиль" },
            { key: "note",       label: "Комментарий" },
        ],
        hideTabs: [],
    },
};