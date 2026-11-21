// Неизменяемая часть сайта: навигация, языки (к ним привязаны рисунки городов) и помощники.
// Всё, что меняется (контакты, расписание, цены, тексты), хранится в content/ и правится в /admin.

export const nav = [
  { href: '#tablo', label: 'Курсы' },
  { href: '#kak', label: 'Как учим' },
  { href: '#ceny', label: 'Цены' },
  { href: '#voprosy', label: 'Вопросы' },
  { href: '#kontakty', label: 'Контакты' },
];

// Языки — «направления». code уходит в команду /start Telegram-бота.
export const languages = [
  { code: 'en', name: 'Английский', native: 'English', hello: 'Hello', city: 'Лондон', iata: 'LHR' },
  { code: 'de', name: 'Немецкий', native: 'Deutsch', hello: 'Hallo', city: 'Берлин', iata: 'BER' },
  { code: 'es', name: 'Испанский', native: 'Español', hello: 'Hola', city: 'Мадрид', iata: 'MAD' },
  { code: 'pl', name: 'Польский', native: 'Polski', hello: 'Cześć', city: 'Варшава', iata: 'WAW' },
  { code: 'fr', name: 'Французский', native: 'Français', hello: 'Bonjour', city: 'Париж', iata: 'CDG' },
  { code: 'zh', name: 'Китайский', native: '中文', hello: '你好', city: 'Пекин', iata: 'PEK' },
];

export const statuses = {
  open: 'Набор открыт',
  few: 'Осталось мест:',
  board: 'Идёт посадка',
  soon: 'Скоро старт',
};

export const GROUP_SIZE = 6;

export function phoneHref(phone = '') {
  const digits = phone.replace(/[^\d+]/g, '');
  return `tel:${digits}`;
}

export function botHref(bot = '') {
  return `https://t.me/${bot.replace(/^@/, '')}`;
}

export function botLink(bot, start) {
  const base = botHref(bot);
  return start ? `${base}?start=${encodeURIComponent(start)}` : base;
}

export function mapHref(address) {
  if (address?.mapHref) return address.mapHref;
  const q = [address?.city, address?.street].filter(Boolean).join(', ');
  return `https://yandex.ru/maps/?text=${encodeURIComponent(q)}`;
}

export function statusText(f) {
  if (f.status === 'few') return `${statuses.few} ${f.seats}`;
  if (f.status === 'soon' && f.note) return f.note;
  return statuses[f.status] ?? f.status;
}
