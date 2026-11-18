'use client';
// Вызов замерщика: форма в виде графы штампа
import { useState } from 'react';
import useSlots, { dayLabel } from '@/components/demo/useSlots';

const parts = [['09:00', 'утро, 9–11'], ['11:00', 'день, 11–13'], ['13:00', 'после обеда, 13–15'], ['15:00', 'вечер, 15–17'], ['17:00', 'поздно, 17–19']];

export default function Measure() {
  const s = useSlots({ hours: { start: '09:00', end: '19:00', step: 120 }, closed: [0], busyRate: 0.3 });
  const [addr, setAddr] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!s.time) return setErr('выберите время визита');
    if (addr.trim().length < 3) return setErr('укажите район или адрес');
    if (phone.replace(/\D/g, '').length < 7) return setErr('проверьте телефон');
    setErr(''); setDone(true);
  }

  return (
    <form className="bp-form" onSubmit={submit} noValidate>
      <div className="bp-f-row">
        <span className="bp-f-k">Дата</span>
        <div className="bp-f-v bp-f-chips">
          {s.dayList.slice(0, 8).map((v) => <button type="button" key={v} aria-pressed={s.date === v} onClick={() => s.setDate(v)}>{dayLabel(v, true)}</button>)}
        </div>
      </div>
      <div className="bp-f-row">
        <span className="bp-f-k">Время</span>
        <div className="bp-f-v bp-f-chips">
          {parts.map(([t, l]) => <button type="button" key={t} disabled={s.busy(t)} aria-pressed={s.time === t} onClick={() => s.setTime(t)}>{l}</button>)}
        </div>
      </div>
      <label className="bp-f-row"><span className="bp-f-k">Адрес</span><input className="bp-f-v" value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Оболонь, ул. Героев полка Азов, 12" /></label>
      <label className="bp-f-row"><span className="bp-f-k">Имя</span><input className="bp-f-v" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
      <label className="bp-f-row"><span className="bp-f-k">Телефон</span><input className="bp-f-v" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="+380" /></label>
      {err && <p className="bp-err" role="alert">! {err}</p>}
      {done ? (
        <div className="bp-done" role="status">
          <b>СОГЛАСОВАНО</b>
          <p>Инженер приедет {dayLabel(s.date)} ({parts.find((p) => p[0] === s.time)?.[1]}) с лазерным дальномером. Смета по позициям — через 2 дня.</p>
          <p className="bp-small">демо-режим: заявка никуда не отправлена</p>
        </div>
      ) : (
        <button className="bp-go">Вызвать замерщика — бесплатно</button>
      )}
    </form>
  );
}
