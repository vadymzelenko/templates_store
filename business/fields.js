/**
 * ФОРМА і СТРУКТУРА ДАНИХ. Тут же визначається, які колонки побачить власник у Supabase.
 *
 * Поле: { key, label, type, required, column?, options?, placeholder?, wide?, index? }
 *   type    text | email | select | date | time | textarea | contact
 *   column  email (рівно одне!) | name | date | time | resource
 *           Без column поле лягає в bookings.data (jsonb), міграцій не треба.
 *   index   true = індекс по jsonb-полю (для швидкого пошуку, напр. номер авто)
 *
 * Після змін у цьому файлі: `npm run db:sql` і запустити supabase/schema.sql
 * (оновлює зручний view bookings_readable, дані не чіпає).
 */
import { formats } from './landing.js';

export const fields = [
  { key: 'format', label: 'Формат зйомки', type: 'select', required: true, options: formats.map((f) => f.name) },
  { key: 'date', column: 'date', label: 'Дата', type: 'date', required: true },
  { key: 'time', column: 'time', label: 'Час початку', type: 'time', required: true },
  { key: 'name', column: 'name', label: "Ім'я", type: 'text', required: true },
  { key: 'email', column: 'email', label: 'Пошта', type: 'email', required: true, placeholder: 'you@mail.com' },
  { key: 'contact', label: 'Instagram або телефон', type: 'contact', required: true, placeholder: '@nickname або +380...' },

  // Приклади для інших ніш:
  // { key: 'master', column: 'resource', label: 'Майстер', type: 'select', required: true, options: ['Анна', 'Олег'] },
  // { key: 'comment', label: 'Коментар', type: 'textarea', wide: true },
];

// Колонки таблиці в CRM власника (ключі полів)
export const adminColumns = ['name', 'email', 'contact', 'format', 'date', 'time'];
