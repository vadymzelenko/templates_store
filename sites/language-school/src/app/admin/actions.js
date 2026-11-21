'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { checkPassword, startSession, endSession, requireAdmin, adminConfigured } from '@/lib/auth';
import { saveSection, resetSection, getContent, getLeads, updateLead, deleteLead } from '@/lib/store';

const SECTIONS = ['site', 'hero', 'lesson', 'route', 'flights', 'compare', 'baggage', 'steps', 'plans', 'faq', 'photos'];
const LEAD_STATUSES = ['new', 'work', 'booked', 'lost'];

// Небольшая защита от перебора пароля.
const attempts = new Map();

export async function login(_prev, formData) {
  if (!adminConfigured()) return { error: 'Пароль не задан: добавьте ADMIN_PASSWORD в переменные окружения.' };
  const key = 'global';
  const now = Date.now();
  const list = (attempts.get(key) || []).filter((t) => now - t < 5 * 60 * 1000);
  if (list.length >= 10) return { error: 'Слишком много попыток. Подождите пять минут.' };
  if (!checkPassword(String(formData.get('password') || ''))) {
    list.push(now);
    attempts.set(key, list);
    return { error: 'Неверный пароль' };
  }
  attempts.delete(key);
  await startSession();
  redirect('/admin');
}

export async function logout() {
  await endSession();
  redirect('/admin/login');
}

// Пропускаем только простые данные и ограничиваем длину строк.
function sanitize(v, depth = 0) {
  if (depth > 6) throw new Error('Слишком глубокая структура');
  if (typeof v === 'string') return v.slice(0, 3000);
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  if (typeof v === 'boolean' || v === null) return v;
  if (Array.isArray(v)) return v.slice(0, 200).map((x) => sanitize(x, depth + 1));
  if (typeof v === 'object') {
    const out = {};
    for (const [k, x] of Object.entries(v)) {
      if (/^[a-zA-Z][\w]{0,40}$/.test(k)) out[k] = sanitize(x, depth + 1);
    }
    return out;
  }
  return '';
}

const isHttp = (u) => !u || /^https?:\/\/[^\s"'<>]+$/i.test(u);

function validate(key, value) {
  if (key === 'site') {
    for (const f of ['url', 'instagram', 'telegram']) {
      if (!isHttp(value[f])) throw new Error(`Поле «${f}» должно начинаться с https://`);
    }
    if (value.address?.mapHref && !isHttp(value.address.mapHref)) throw new Error('Ссылка на карту должна начинаться с https://');
    if (value.bot && !/^@?[A-Za-z0-9_]{3,40}$/.test(value.bot)) throw new Error('Имя бота: только латиница, цифры и _');
    if (value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) throw new Error('Проверьте e-mail');
  }
  if (key === 'photos') {
    for (const p of Object.values(value)) if (!isHttp(p?.src)) throw new Error('Адрес фото должен начинаться с https://');
  }
  if (key === 'flights') {
    for (const f of value) {
      if (!/^[A-Za-z0-9-]{1,8}$/.test(f.code || '')) throw new Error(`Код рейса «${f.code}»: латиница, цифры и дефис, до 8 знаков`);
      f.seats = Math.max(0, Math.min(6, Math.round(Number(f.seats) || 0)));
    }
  }
  if (key === 'plans') {
    for (const p of value) {
      p.price = Math.max(0, Math.round(Number(p.price) || 0));
      p.start = String(p.start || '').replace(/[^\w-]/g, '').slice(0, 60);
    }
  }
}

export async function saveContent(key, value) {
  await requireAdmin();
  if (!SECTIONS.includes(key)) return { error: 'Неизвестный раздел' };
  try {
    const clean = sanitize(value);
    validate(key, clean);
    await saveSection(key, clean);
  } catch (e) {
    return { error: e.message };
  }
  revalidatePath('/', 'layout');
  return { ok: true, content: await getContent() };
}

export async function resetContent(key) {
  await requireAdmin();
  if (!SECTIONS.includes(key)) return { error: 'Неизвестный раздел' };
  await resetSection(key);
  revalidatePath('/', 'layout');
  return { ok: true, content: await getContent() };
}

export async function loadLeads() {
  await requireAdmin();
  return getLeads();
}

export async function setLead(id, patch) {
  await requireAdmin();
  const p = {};
  if (patch.status !== undefined && LEAD_STATUSES.includes(patch.status)) p.status = patch.status;
  if (patch.note !== undefined) p.note = String(patch.note).slice(0, 2000);
  await updateLead(String(id), p);
  return getLeads();
}

export async function removeLead(id) {
  await requireAdmin();
  await deleteLead(String(id));
  return getLeads();
}
