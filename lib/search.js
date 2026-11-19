// Умный поиск витрины: синонимы и разговорные слова, опечатки, несколько языков, подсказки.
import { industries } from './industries';

export const norm = (s) => String(s || '').toLowerCase().replace(/ё/g, 'е').replace(/[ʼ'’`]/g, '').replace(/[-‑–/]/g, ' ').replace(/\s+/g, ' ').trim();
export const industryOf = (key) => industries.find((i) => i.key === key);

// Как люди называют свой бизнес → под какой нишей искать
const SYN = {
  'стоматология': ['зуб', 'зубы', 'зубной', 'дантист', 'стоматолог', 'стоматологія', 'dentist', 'dental', 'dentysta', 'брекеты', 'имплант'],
  'барбершоп': ['стрижка', 'стрижки', 'парикмахер', 'парикмахерская', 'перукарня', 'борода', 'бритье', 'barber', 'fryzjer', 'мужские стрижки'],
  'салон красоты': ['маникюр', 'ногти', 'брови', 'ресницы', 'косметолог', 'beauty', 'salon', 'визажист', 'окрашивание'],
  'автосервис': ['машина', 'авто', 'тачка', 'сто', 'шины', 'шиномонтаж', 'мастерская авто', 'car', 'garage', 'warsztat', 'автомойка', 'детейлинг', 'тюнинг'],
  'кофейня': ['кофе', 'кафе', 'кава', 'кавярня', 'coffee', 'cafe', 'kawiarnia', 'завтрак', 'выпечка', 'пекарня', 'бариста'],
  'ветклиника': ['собака', 'собаки', 'кот', 'кошка', 'коты', 'животные', 'питомец', 'питомцы', 'ветеринар', 'vet', 'pet', 'груминг', 'зоо'],
  'фитнес': ['спорт', 'зал', 'качалка', 'тренировки', 'тренер', 'йога', 'пилатес', 'растяжка', 'бокс', 'gym', 'fitness', 'silownia', 'кроссфит', 'танцы'],
  'юрист': ['адвокат', 'право', 'суд', 'развод', 'наследство', 'нотариус', 'lawyer', 'prawnik', 'юридические услуги', 'бухгалтер'],
  'клининг': ['уборка', 'прибирання', 'чистка', 'мойка окон', 'cleaning', 'sprzatanie', 'химчистка', 'горничная'],
  'глэмпинг': ['отель', 'отдых', 'кемпинг', 'палатка', 'база отдыха', 'гостиница', 'хостел', 'hotel', 'camping', 'домики', 'турбаза', 'апартаменты'],
  'сантехник': ['труба', 'трубы', 'течь', 'потоп', 'засор', 'сантехника', 'сантехнік', 'plumber', 'hydraulik', 'аварийка', 'электрик', 'вызов мастера'],
  'ремонт квартир': ['ремонт', 'квартира', 'стройка', 'отделка', 'строитель', 'дизайн интерьера', 'renovation', 'remont', 'бригада'],
  'фотограф': ['фото', 'фотосессия', 'съемка', 'фотостудия', 'photographer', 'fotograf', 'видеограф', 'свадебный фотограф'],
  'психолог': ['терапия', 'психотерапевт', 'коуч', 'консультации', 'psychologist', 'psycholog'],
  'недвижимость': ['риелтор', 'риэлтор', 'квартиры', 'дома', 'вилла', 'аренда', 'real estate', 'nieruchomosci', 'застройщик'],
  'логистика': ['грузоперевозки', 'перевозки', 'доставка', 'фура', 'транспорт', 'logistics', 'transport', 'вэд'],
  'языковая школа': ['английский', 'курсы языка', 'языки', 'школа', 'обучение', 'репетитор', 'school', 'szkola', 'курсы'],
  'digital-агентство': ['агентство', 'маркетинг', 'smm', 'реклама', 'it', 'веб студия', 'agency'],
  'saas': ['приложение', 'сервис', 'стартап', 'app', 'startup', 'продукт'],
};

// Расстояние Дамерау–Левенштейна (опечатки, перестановки букв)
function dist(a, b) {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 2) return 9;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    const c = a[i - 1] === b[j - 1] ? 0 : 1;
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
  }
  return d[m][n];
}
const close = (q, w) => {
  if (w.startsWith(q) || q.startsWith(w) && w.length >= 4) return true;
  if (q.length < 4) return false;
  const lim = q.length >= 7 ? 2 : 1;
  return dist(q, w.slice(0, Math.max(q.length, Math.min(w.length, q.length + 1)))) <= lim || dist(q, w) <= lim;
};

// Слово запроса → какие ниши под ним скорее всего имеются в виду
function expand(q) {
  const out = new Set([q]);
  for (const [niche, words] of Object.entries(SYN)) {
    if ([niche, ...words].some((w) => { const nw = norm(w); return nw.includes(q) || (q.length >= 4 && nw.split(' ').some((p) => close(q, p))); })) out.add(niche);
  }
  return [...out];
}

function haystack(t) {
  const ind = industryOf(t.industry);
  return { own: [t.title, t.category, t.tagline, ...(t.badges || [])].map(norm), fits: (t.fits || []).map(norm), ind: ind ? [norm(ind.name), ...ind.niches.map(norm)] : [] };
}

// Главная функция: { results: [{ t, why, score }], terms }
export function smartSearch(templates, query) {
  const q = norm(query);
  if (!q) return { results: templates.map((t) => ({ t, score: 0 })), terms: [] };
  const words = q.split(' ').filter((w) => w.length > 1);
  const terms = [...new Set([q, ...words.flatMap(expand)])];
  const results = [];
  for (const t of templates) {
    const h = haystack(t);
    let score = 0, why = '';
    for (const term of terms) {
      const typo = (list) => list.some((s) => s.split(' ').some((p) => p.length >= 4 && close(term, p)));
      if (h.own.some((s) => s.includes(term))) score = Math.max(score, term === q ? 100 : 80);
      else if (h.own.some((s) => s.split(' ').some((p) => close(term, p)))) score = Math.max(score, 70);
      const fit = h.fits.find((s) => s.includes(term)) || (typo(h.fits) && h.fits.find((s) => s.split(' ').some((p) => close(term, p))));
      if (fit && score < 60) { score = 60; why = `Подойдёт для: ${t.fits.find((f) => norm(f) === fit) || fit}`; }
      const near = h.ind.find((s) => s.includes(term));
      if (near && score < 40) { score = 40; why = `Та же отрасль — переделаем под «${term}»`; }
    }
    if (score) results.push({ t, why: score >= 70 ? '' : why, score });
  }
  results.sort((a, b) => b.score - a.score);
  return { results, terms };
}

// Подсказки под строкой поиска: ниши и шаблоны
export function suggest(templates, query, limit = 6) {
  const q = norm(query);
  if (q.length < 2) return [];
  const niches = new Map();
  for (const i of industries) for (const n of i.niches) {
    const nn = norm(n);
    if (nn.startsWith(q) || nn.includes(` ${q}`) || (q.length >= 4 && nn.split(' ').some((p) => close(q, p)))) niches.set(n, i.name);
  }
  for (const [niche, words] of Object.entries(SYN)) if (words.some((w) => norm(w).startsWith(q))) niches.set(niche[0].toUpperCase() + niche.slice(1), 'по смыслу');
  const tpl = smartSearch(templates, q).results.slice(0, 3).map((r) => ({ type: 'tpl', t: r.t }));
  return [...tpl, ...[...niches].slice(0, limit - tpl.length).map(([n, g]) => ({ type: 'niche', n, g }))];
}

export function findNiche(q) {
  q = norm(q);
  if (q.length < 3) return null;
  for (const i of industries) {
    const n = i.niches.find((x) => norm(x).includes(q));
    if (n) return { niche: n, industry: i };
  }
  return null;
}

export const TG = 'vzbbme';
export const tgLink = (text) => `https://t.me/${TG}?text=${encodeURIComponent(text)}`;
