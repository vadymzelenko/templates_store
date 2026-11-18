/**
 * ФОРМА ЗАЯВКИ НА СОЗВОН и структура данных. Здесь же определяется, какие колонки увидит владелец в Supabase.
 *
 * Поле: { key, label, type, required, column?, options?, placeholder?, wide?, index? }
 *   type    text | email | select | date | time | textarea | contact
 *   column  email (ровно одно!) | name | date | time | resource
 *           Без column поле ложится в bookings.data (jsonb), миграции не нужны.
 *
 * После изменений: `npm run db:sql` и выполнить supabase/schema.sql
 */
import { formats } from './landing.js';
import { projects, categories } from '../store/catalog.js';

export const OWN_PROJECT = 'Свой проект с нуля';

export const fields = [
  { key: 'project', label: 'Понравился проект', type: 'select', required: true,
    options: [...projects.map((p) => ({ value: p.slug, label: `${p.title} — ${p.niche}` })), { value: 'own', label: OWN_PROJECT }] },
  { key: 'industry', label: 'Ваша отрасль', type: 'select', required: true, options: categories.map((c) => c.name) },
  { key: 'package', label: 'Пакет', type: 'select', required: false, options: formats.map((f) => f.name) },
  { key: 'date', column: 'date', label: 'День созвона', type: 'date', required: true },
  { key: 'time', column: 'time', label: 'Время (Киев)', type: 'time', required: true },
  { key: 'name', column: 'name', label: 'Имя', type: 'text', required: true },
  { key: 'email', column: 'email', label: 'Почта', type: 'email', required: true, placeholder: 'you@mail.com' },
  { key: 'contact', label: 'Telegram или телефон', type: 'contact', required: true, placeholder: '@nickname или +380...' },
  { key: 'comment', label: 'Пара слов о бизнесе', type: 'textarea', placeholder: 'Например: барбершоп на 3 кресла, нужна запись к мастерам' },
];

// Колонки таблицы в CRM владельца (ключи полей)
export const adminColumns = ['name', 'email', 'contact', 'project', 'industry', 'package', 'date', 'time'];
