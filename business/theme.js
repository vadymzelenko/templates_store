// Бренд і візуальна тема. Кольори й шрифти потрапляють у CSS-змінні (--accent, --bg ...) і в лист.
export const brand = {
  name: 'Studio Light',
  tagline: 'Фотостудія з природним світлом',
  locale: 'uk',
};

export const theme = {
  colors: {
    accent: '#236a8c',    // кнопки, посилання
    accentInk: '#ffffff', // текст на кнопці
    bg: '#f3f6f8',
    card: '#ffffff',
    text: '#13202b',
    muted: '#62717d',
    line: '#dbe3e8',
    soft: '#e6eef3',
    mark: '#d9483b',      // «олівець» на контактному листі
    danger: '#b03a2e',
  },
  fonts: {
    // Шрифт з кирилицею. Порожній url = системний шрифт.
    url: 'https://fonts.googleapis.com/css2?family=Geologica:wght@300..700&display=swap',
    display: "'Geologica', system-ui, sans-serif",
    body: "'Geologica', system-ui, sans-serif",
  },
};
