// Бренд и визуальная тема витрины. Цвета и шрифты уходят в CSS-переменные (--accent, --bg ...) и в письмо.
export const brand = {
  name: 'Прилавок',
  tagline: 'веб-студия',
  description: 'Лендинги и сайты с онлайн-записью и CRM для малого бизнеса. Готовые проекты по отраслям.',
  locale: 'ru',
};

export const theme = {
  colors: {
    accent: '#d6411b',    // кнопки, ссылки
    accentInk: '#ffffff', // текст на кнопке
    bg: '#f1eee6',        // бумага
    card: '#faf8f3',
    text: '#151412',
    muted: '#6b665c',
    line: '#d8d2c4',
    soft: '#e7e1d3',
    mark: '#d6411b',
    danger: '#b03a2e',
  },
  fonts: {
    // Шрифты с кириллицей. Пустой url = системный шрифт.
    url: 'https://fonts.googleapis.com/css2?family=Golos+Text:wght@400..800&family=IBM+Plex+Mono:wght@400;500&display=swap',
    display: "'Golos Text', system-ui, sans-serif",
    body: "'Golos Text', system-ui, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace",
  },
};
