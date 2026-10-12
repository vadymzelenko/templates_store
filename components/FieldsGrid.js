'use client';
// Малює поля форми з config.fields. Один компонент для форми, профілю і CRM.
import { useEffect, useState } from 'react';
import config from '@/engine.config';
import { fieldByColumn, optValue, optLabel } from '@/lib/fields';
import { timeOptions, dateBounds } from '@/lib/slots';

const T = config.texts;
const dateKey = fieldByColumn('date')?.key;
const resKey = fieldByColumn('resource')?.key;

export default function FieldsGrid({ values, onChange, fields = config.fields, errors = {}, admin = false, currentId = null }) {
  const [busy, setBusy] = useState([]);
  const date = dateKey ? values[dateKey] : '';
  const resource = resKey ? values[resKey] : '';
  const times = timeOptions();
  const { min, max } = dateBounds();

  useEffect(() => {
    if (!config.uniqueSlot || !date) { setBusy([]); return; }
    const ctrl = new AbortController();
    const qs = new URLSearchParams({ date, resource: resource || '', ...(currentId ? { exclude: currentId } : {}) });
    fetch(`/api/slots?${qs}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => setBusy(d.busy || []))
      .catch(() => {});
    return () => ctrl.abort();
  }, [date, resource, currentId]);

  return (
    <div className="grid">
      {fields.map((f) => {
        const id = `f_${f.key}`;
        const v = values[f.key] ?? '';
        const set = (e) => onChange(f.key, e.target.value);
        let input;
        if (f.type === 'select') {
          input = (
            <select id={id} value={v} onChange={set}>
              <option value="">{T.choose}</option>
              {f.options.map((o) => <option key={optValue(o)} value={optValue(o)}>{optLabel(o)}</option>)}
            </select>
          );
        } else if (f.type === 'time') {
          input = (
            <select id={id} value={v} onChange={set}>
              <option value="">{T.choose}</option>
              {times.map((t) => (
                <option key={t} value={t} disabled={busy.includes(t)}>
                  {t}{busy.includes(t) ? ` (${T.busy})` : ''}
                </option>
              ))}
            </select>
          );
        } else if (f.type === 'date') {
          input = <input id={id} type="date" value={v} onChange={set} {...(admin ? {} : { min, max })} />;
        } else if (f.type === 'textarea') {
          input = <textarea id={id} rows={3} value={v} onChange={set} placeholder={f.placeholder} />;
        } else {
          input = <input id={id} type={f.type === 'email' ? 'email' : 'text'} value={v} onChange={set} placeholder={f.placeholder} />;
        }
        return (
          <div key={f.key} className={`field${f.type === 'textarea' || f.wide ? ' full' : ''}`}>
            <label htmlFor={id}>{f.label}{f.required ? ' *' : ''}</label>
            {input}
            {errors[f.key] && <span className="err">{errors[f.key]}</span>}
          </div>
        );
      })}
    </div>
  );
}
