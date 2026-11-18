// Цены клининга — правьте здесь
export const base = { room: 450, bath: 350, kitchen: 400 };
export const extras = [
  { key: 'windows', name: 'Окна', price: 120, unit: 'за створку', max: 12, icon: 'M3 3h18v18H3z M12 3v18 M3 12h18' },
  { key: 'oven', name: 'Духовка', price: 350, icon: 'M3 4h18v16H3z M3 9h18 M7 6.5h1 M10 6.5h1' },
  { key: 'fridge', name: 'Холодильник', price: 350, icon: 'M6 2h12v20H6z M6 10h12 M9 5v3 M9 13v4' },
  { key: 'balcony', name: 'Балкон', price: 400, icon: 'M3 12h18 M5 12v8 M9 12v8 M13 12v8 M17 12v8 M3 20h18 M7 12V4h10v8' },
  { key: 'iron', name: 'Глажка, час', price: 300, icon: 'M3 17h16l2-7c-4 0-9 0-12 3L3 17z' },
];
export const freq = [
  { key: 'once', name: 'Один раз', k: 1 },
  { key: 'biweekly', name: 'Раз в 2 недели', k: 0.85 },
  { key: 'weekly', name: 'Каждую неделю', k: 0.8 },
];
