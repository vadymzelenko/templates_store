// Поиск по витрине: название, ниша, описание, «подходит для» и все ниши отрасли.
import { industries } from './industries';

export const norm = (s) => String(s || '').toLowerCase().replace(/ё/g, 'е').replace(/[-‑–]/g, ' ').trim();
export const industryOf = (key) => industries.find((i) => i.key === key);

// { ok, why } — почему шаблон попал в выдачу
export function matchTemplate(t, q) {
  if (!q) return { ok: true };
  const ind = industryOf(t.industry);
  if ([t.title, t.category, t.tagline, t.description, ...(t.badges || [])].some((s) => norm(s).includes(q))) return { ok: true };
  const fit = (t.fits || []).find((n) => norm(n).includes(q));
  if (fit) return { ok: true, why: `Подойдёт для: ${fit}` };
  if (ind && norm(ind.name).includes(q)) return { ok: true };
  const near = ind?.niches.find((n) => norm(n).includes(q));
  if (near) return { ok: true, why: `Та же отрасль — переделаем под «${near}»` };
  return { ok: false };
}

// Ниша из общего списка, которая совпала с запросом
export function findNiche(q) {
  if (q.length < 3) return null;
  for (const i of industries) {
    const n = i.niches.find((x) => norm(x).includes(q));
    if (n) return { niche: n, industry: i };
  }
  return null;
}

export const TG = 'vzbbme';
export const tgLink = (text) => `https://t.me/${TG}?text=${encodeURIComponent(text)}`;
