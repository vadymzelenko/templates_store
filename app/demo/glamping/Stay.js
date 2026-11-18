'use client';
// Бронь: шатёр + календарь заезда/выезда с ценой каждой ночи
import { useEffect, useMemo, useState } from 'react';
import { tents } from './data';

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const iso = (d) => d.toLocaleDateString('sv-SE');
const money = (n) => n.toLocaleString('ru-RU').replace(/,/g, ' ');
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; }

function Month({ y, m, today, tent, from, to, pick, hover, setHover }) {
  const first = new Date(y, m, 1);
  const lead = (first.getDay() + 6) % 7;
  const n = new Date(y, m + 1, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: n }, (_, i) => new Date(y, m, i + 1))];
  return (
    <div className="gl-month">
      <p className="gl-mname">{MONTHS[m]}</p>
      <div className="gl-wd">{['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map((d) => <span key={d}>{d}</span>)}</div>
      <div className="gl-days">
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const v = iso(d);
          const past = v < today;
          const busy = !past && hash(`${v}|${tent.key}`) < 0.22;
          const wknd = d.getDay() === 5 || d.getDay() === 6;
          const end = to || (from && hover > from ? hover : null);
          const inRange = from && end && v > from && v < end;
          const cls = [v === from && 'from', v === to && 'to', inRange && 'in', busy && 'busy', past && 'past'].filter(Boolean).join(' ');
          return (
            <button key={i} type="button" className={cls} disabled={past || busy} onClick={() => pick(v)} onMouseEnter={() => setHover(v)}
              aria-label={`${d.getDate()} ${MONTHS[m]}${busy ? ', занято' : `, ${wknd ? tent.weekend : tent.price} гривен за ночь`}`}>
              <b>{d.getDate()}</b>{!past && !busy && <small>{String(Math.round((wknd ? tent.weekend : tent.price) / 100) / 10).replace('.', ',')}к</small>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Stay() {
  const [now, setNow] = useState(null);
  const [tentKey, setTent] = useState('dome');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [hover, setHover] = useState('');
  const [guests, setGuests] = useState(2);
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => setNow(new Date()), []);
  const tent = tents.find((t) => t.key === tentKey);

  useEffect(() => { setFrom(''); setTo(''); if (guests > tent.guests) setGuests(tent.guests); }, [tentKey]); // eslint-disable-line

  function pick(v) {
    if (!from || to || v <= from) { setFrom(v); setTo(''); return; }
    // нельзя перескочить через занятую ночь
    const d = new Date(from + 'T00:00:00');
    while (iso(d) < v) { if (hash(`${iso(d)}|${tent.key}`) < 0.22) { setErr('В эти даты есть занятая ночь — выберите другие'); setFrom(v); setTo(''); return; } d.setDate(d.getDate() + 1); }
    setErr(''); setTo(v);
  }

  const nights = useMemo(() => {
    if (!from || !to) return [];
    const out = []; const d = new Date(from + 'T00:00:00');
    while (iso(d) < to) { const w = d.getDay() === 5 || d.getDay() === 6; out.push(w ? tent.weekend : tent.price); d.setDate(d.getDate() + 1); }
    return out;
  }, [from, to, tent]);
  const total = nights.reduce((a, b) => a + b, 0);

  function book(e) {
    e.preventDefault();
    if (!nights.length) return setErr('Выберите дату заезда и выезда');
    if (phone.replace(/\D/g, '').length < 7) return setErr('Оставьте телефон');
    setErr(''); setDone(true);
  }

  if (!now) return <div className="gl-stay" />;
  const today = iso(now);
  const m2 = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return (
    <form className="gl-stay" onSubmit={book} noValidate>
      <div className="gl-tents" role="radiogroup" aria-label="Шатёр">
        {tents.map((t) => (
          <button key={t.key} type="button" role="radio" aria-checked={tentKey === t.key} onClick={() => setTent(t.key)}>
            <b>{t.name}</b><span>до {t.guests} гостей · {t.about}</span><em>от {money(t.price)} ₴ / ночь</em>
          </button>
        ))}
      </div>
      <div className="gl-cal">
        <Month y={now.getFullYear()} m={now.getMonth()} today={today} tent={tent} from={from} to={to} pick={pick} hover={hover} setHover={setHover} />
        <Month y={m2.getFullYear()} m={m2.getMonth()} today={today} tent={tent} from={from} to={to} pick={pick} hover={hover} setHover={setHover} />
      </div>
      <div className="gl-sum" aria-live="polite">
        {done ? (
          <p className="gl-done">Шатёр «{tent.name}» ждёт вас. Демо-режим: бронь никуда не отправлена — в рабочей версии гость получает подтверждение и схему проезда.</p>
        ) : (
          <>
            <p className="gl-sum-l">{from ? (to ? `${nights.length} ${nights.length === 1 ? 'ночь' : nights.length < 5 ? 'ночи' : 'ночей'}` : 'выберите дату выезда') : 'выберите дату заезда'}</p>
            <p className="gl-total">{total ? `${money(total)} ₴` : '—'}</p>
            <div className="gl-guests">
              <span>Гостей</span>
              <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} aria-label="Меньше гостей">−</button>
              <b>{guests}</b>
              <button type="button" onClick={() => setGuests(Math.min(tent.guests, guests + 1))} aria-label="Больше гостей">+</button>
            </div>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" inputMode="tel" aria-label="Телефон" />
            {err && <p className="gl-err" role="alert">{err}</p>}
            <button className="gl-go">Забронировать</button>
          </>
        )}
      </div>
    </form>
  );
}
