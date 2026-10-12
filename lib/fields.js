// Мапінг "поля з конфігу" <-> "рядок БД". Єдине місце, яке знає про структуру таблиці.
import config from '@/engine.config';

export const COLUMN_MAP = {
  email: 'client_email',
  name: 'client_name',
  date: 'slot_date',
  time: 'slot_time',
  resource: 'resource',
};

export const fieldByColumn = (c) => config.fields.find((f) => f.column === c);
export const optValue = (o) => (typeof o === 'object' ? o.value : o);
export const optLabel = (o) => (typeof o === 'object' ? o.label : o);

// { key: value } -> { row: {колонки}, data: {jsonb} }
export function splitValues(values) {
  const row = {};
  const data = {};
  for (const f of config.fields) {
    const v = values[f.key];
    if (v === undefined) continue;
    if (f.column) row[COLUMN_MAP[f.column]] = v === '' ? null : v;
    else data[f.key] = v;
  }
  return { row, data };
}

// рядок БД -> { id, status, created_at, ...значення полів за key }
export function flatten(b) {
  const out = { id: b.id, status: b.status, created_at: b.created_at };
  for (const f of config.fields) {
    out[f.key] = f.column ? b[COLUMN_MAP[f.column]] ?? '' : b.data?.[f.key] ?? '';
  }
  return out;
}

export function displayValue(field, v) {
  if (v === undefined || v === null || v === '') return '—';
  if (field.type === 'select') {
    const o = field.options.find((x) => optValue(x) === v);
    return o ? optLabel(o) : v;
  }
  return v;
}
