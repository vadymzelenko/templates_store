// Валідація ПОВНІСТЮ керується config.fields. Для нової ніші нічого міняти не треба.
import config from '@/engine.config';
import { optValue, fieldByColumn } from './fields';
import { timeOptions, dateBounds, todayStr, nowTimeStr } from './slots';

const T = config.texts;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONTACT = /^(@?[A-Za-z0-9._]{2,30}|\+?[0-9][0-9 ()-]{6,19})$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function validate(values, { admin = false } = {}) {
  const errors = {};
  const clean = {};

  for (const f of config.fields) {
    let v = values[f.key];
    v = typeof v === 'string' ? v.trim() : v ?? '';
    if (v === '') {
      if (f.required) errors[f.key] = T.required;
      clean[f.key] = '';
      continue;
    }
    v = String(v);
    if (v.length > 500) { errors[f.key] = T.invalidText; continue; }

    switch (f.type) {
      case 'email':
        v = v.toLowerCase();
        if (!EMAIL.test(v)) errors[f.key] = T.invalidEmail;
        break;
      case 'contact':
        if (!CONTACT.test(v)) errors[f.key] = T.invalidContact;
        break;
      case 'select':
        if (!f.options.map(optValue).includes(v)) errors[f.key] = T.invalidOption;
        break;
      case 'date': {
        if (!DATE.test(v) || Number.isNaN(Date.parse(v))) { errors[f.key] = T.invalidDate; break; }
        if (!admin) {
          const { min, max } = dateBounds();
          const wd = new Date(v + 'T00:00:00Z').getUTCDay();
          if (v < min || v > max || config.slots.closedWeekdays.includes(wd)) errors[f.key] = T.invalidDate;
        }
        break;
      }
      case 'time':
        if (!timeOptions().includes(v)) errors[f.key] = T.invalidTime;
        break;
    }
    clean[f.key] = v;
  }

  // Не можна записатись на час, що вже минув сьогодні
  const dk = fieldByColumn('date')?.key;
  const tk = fieldByColumn('time')?.key;
  if (!admin && dk && tk && !errors[tk] && clean[dk] === todayStr() && clean[tk] <= nowTimeStr()) {
    errors[tk] = T.invalidTime;
  }

  return { ok: Object.keys(errors).length === 0, errors, clean };
}
