'use client';
// Виджет записи для демо-лендингов. Ведёт себя как booking engine, но ничего не отправляет:
// занятость слотов генерируется детерминированно, а вместо письма показывается итог.
// Внешний вид настраивается CSS-переменными на обёртке: --bk-accent, --bk-ink, --bk-bg, --bk-line, --bk-radius.
import { useEffect, useMemo, useState } from 'react';

const WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const fmt = (n) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
const iso = (d) => d.toLocaleDateString('sv-SE');

// Стабильный псевдослучайный «занято» — одинаковый при каждом рендере
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967295;
}

export default function DemoBooking({
  services = [],          // [{ name, price?, note? }]
  serviceLabel = 'Услуга',
  resources = null,       // [{ name, note? }] — мастер / врач / пост
  resourceLabel = 'Специалист',
  anyResource = 'Любой свободный',
  hours = { start: '10:00', end: '20:00', step: 60 },
  closed = [],            // дни недели, 0 = вс
  days = 10,
  busyRate = 0.35,
  extra = [],             // доп. поля: [{ key, label, placeholder?, options? }]
  submitText = 'Записаться',
  doneTitle = 'Вы записаны',
  contactLabel = 'Телефон',
  contactPlaceholder = '+380 __ ___ __ __',
}) {
  const [service, setService] = useState('');
  const [resource, setResource] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [form, setForm] = useState({ name: '', phone: '' });
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const [now, setNow] = useState(null);

  // Даты считаем только в браузере, чтобы не было расхождений с сервером
  useEffect(() => { setNow(new Date()); }, []);

  // Кнопки «Записаться» в прайсе шлют событие prefill
  useEffect(() => {
    const h = (e) => {
      if (e.detail.key === 'service') setService(e.detail.value);
      if (e.detail.key === 'resource') setResource(e.detail.value);
    };
    window.addEventListener('prefill', h);
    return () => window.removeEventListener('prefill', h);
  }, []);

  const dayList = useMemo(() => {
    if (!now) return [];
    const out = [];
    const d = new Date(now); d.setHours(0, 0, 0, 0);
    // Под вечер сегодняшний день почти весь в прошлом — начинаем с завтра
    if (now.getHours() * 60 + now.getMinutes() > toMin(hours.end) - 3 * hours.step) d.setDate(d.getDate() + 1);
    while (out.length < days) {
      if (!closed.includes(d.getDay())) out.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return out;
  }, [now, days, closed, hours]);

  useEffect(() => { if (!date && dayList.length) setDate(iso(dayList[0])); }, [dayList, date]);

  const times = useMemo(() => {
    const out = [];
    for (let t = toMin(hours.start); t + hours.step <= toMin(hours.end); t += hours.step) out.push(fmt(t));
    return out;
  }, [hours]);

  const isToday = now && date === iso(now);
  const nowMin = now ? now.getHours() * 60 + now.getMinutes() : 0;
  const busy = (t) => (isToday && toMin(t) <= nowMin + 30) || hash(`${date}|${t}|${resource}`) < busyRate;

  useEffect(() => { if (time && busy(time)) setTime(''); }); // слот стал занят после смены даты/мастера

  function submit(e) {
    e.preventDefault();
    if (services.length && !service) return setErr(`Выберите: ${serviceLabel.toLowerCase()}`);
    if (!time) return setErr('Выберите время');
    if (form.name.trim().length < 2) return setErr('Укажите имя');
    if (form.phone.replace(/\D/g, '').length < 7) return setErr(`Проверьте поле «${contactLabel}»`);
    for (const x of extra) if (x.required && !form[x.key]) return setErr(`Заполните «${x.label}»`);
    setErr(''); setDone(true);
  }

  const dObj = date ? new Date(date + 'T00:00:00') : null;
  const dLabel = dObj ? `${WD[dObj.getDay()]}, ${dObj.getDate()} ${MONTHS[dObj.getMonth()]}` : '';

  if (done) {
    return (
      <div className="bk bk-done" role="status">
        <p className="bk-tag">Демо-режим</p>
        <h3>{doneTitle}</h3>
        <dl>
          {service && <div><dt>{serviceLabel}</dt><dd>{service}</dd></div>}
          {resources && <div><dt>{resourceLabel}</dt><dd>{resource || anyResource}</dd></div>}
          <div><dt>Когда</dt><dd>{dLabel}, {time}</dd></div>
          {extra.filter((x) => form[x.key]).map((x) => <div key={x.key}><dt>{x.label}</dt><dd>{form[x.key]}</dd></div>)}
          <div><dt>Имя</dt><dd>{form.name}</dd></div>
        </dl>
        <p className="bk-hint">В рабочей версии клиенту приходит письмо со ссылкой-подтверждением, открывается личный кабинет для переноса, а запись появляется в CRM владельца.</p>
        <button type="button" className="bk-btn ghost" onClick={() => { setDone(false); setTime(''); }}>Записаться ещё раз</button>
      </div>
    );
  }

  return (
    <form className="bk" onSubmit={submit} noValidate>
      {services.length > 0 && (
        <fieldset className="bk-group">
          <legend>{serviceLabel}</legend>
          <div className="bk-services">
            {services.map((s) => (
              <button type="button" key={s.name} className={service === s.name ? 'on' : ''} onClick={() => setService(s.name)} aria-pressed={service === s.name}>
                <span>{s.name}</span>{s.price && <small>{s.price}</small>}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {resources && (
        <fieldset className="bk-group">
          <legend>{resourceLabel}</legend>
          <div className="bk-chips">
            {[{ name: '' }, ...resources].map((r) => (
              <button type="button" key={r.name || 'any'} className={resource === r.name ? 'on' : ''} aria-pressed={resource === r.name} onClick={() => setResource(r.name)}>
                {r.name || anyResource}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="bk-group">
        <legend>День</legend>
        <div className="bk-days">
          {dayList.map((d) => {
            const v = iso(d);
            return (
              <button type="button" key={v} className={date === v ? 'on' : ''} aria-pressed={date === v} onClick={() => setDate(v)}>
                <small>{WD[d.getDay()]}</small><b>{d.getDate()}</b>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="bk-group">
        <legend>Время {dLabel && <span className="bk-sub">· {dLabel}</span>}</legend>
        <div className="bk-times">
          {times.map((t) => {
            const b = busy(t);
            return (
              <button type="button" key={t} disabled={b} className={time === t ? 'on' : ''} aria-pressed={time === t} onClick={() => setTime(t)} title={b ? 'Занято' : ''}>{t}</button>
            );
          })}
        </div>
      </fieldset>

      <div className="bk-fields">
        <label><span>Имя</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" /></label>
        <label><span>{contactLabel}</span><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={contactPlaceholder} inputMode="tel" autoComplete="tel" /></label>
        {extra.map((x) => (
          <label key={x.key}>
            <span>{x.label}</span>
            {x.options ? (
              <select value={form[x.key] || ''} onChange={(e) => setForm({ ...form, [x.key]: e.target.value })}>
                <option value="">Выберите…</option>
                {x.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input value={form[x.key] || ''} onChange={(e) => setForm({ ...form, [x.key]: e.target.value })} placeholder={x.placeholder} />
            )}
          </label>
        ))}
      </div>

      {err && <p className="bk-err" role="alert">{err}</p>}
      <button className="bk-btn">{submitText}{time && ` на ${time}`}</button>
      <p className="bk-tag">Демо-режим: данные никуда не отправляются</p>
    </form>
  );
}
