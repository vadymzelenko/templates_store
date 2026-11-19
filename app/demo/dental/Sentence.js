'use client';
// Запись одной фразой: пропуски в тексте — это поля формы
import { useState } from 'react';
import useSlots, { dayLabel } from '@/components/demo/useSlots';
import { doctors, reasons } from './data';

export default function Sentence() {
  const [reason, setReason] = useState(reasons[0]);
  const [doc, setDoc] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const s = useSlots({ hours: { start: '08:00', end: '20:00', step: 40 }, closed: [0], resource: doc, busyRate: 0.45 });
  const docObj = doctors.find((d) => d.name === doc);
  const free = s.times.filter((t) => !s.busy(t));

  function submit(e) {
    e.preventDefault();
    if (!s.time) return setErr('Выберите время — пропуск после «в».');
    if (name.trim().length < 2) return setErr('Напишите, как вас зовут.');
    if (phone.replace(/\D/g, '').length < 7) return setErr('Проверьте номер телефона.');
    setErr(''); setDone(true);
  }

  if (done) {
    return (
      <div className="lt-done" role="status">
        <p>{name}, ждём вас <b>{dayLabel(s.date)}</b> в <b>{s.time}</b>{docObj ? <> у {docObj.name}</> : null}.</p>
        <p className="lt-small">Подтверждение придёт на почту, перенести приём можно по ссылке из письма. Напомним за день.</p>
        <button type="button" onClick={() => { setDone(false); s.setTime(''); }}>← исправить</button>
      </div>
    );
  }

  return (
    <form className="lt-form" onSubmit={submit} noValidate>
      <p>
        Я хочу записаться на{' '}
        <select value={reason} onChange={(e) => setReason(e.target.value)} aria-label="Цель визита">
          {reasons.map((r) => <option key={r}>{r}</option>)}
        </select>{' '}
        к{' '}
        <select value={doc} onChange={(e) => setDoc(e.target.value)} aria-label="Врач">
          <option value="">ближайшему свободному врачу</option>
          {doctors.map((d) => <option key={d.name} value={d.name}>{d.short}</option>)}
        </select>{' '}
        в{' '}
        <select value={s.date} onChange={(e) => s.setDate(e.target.value)} aria-label="День">
          {s.dayList.map((v) => <option key={v} value={v}>{dayLabel(v)}</option>)}
        </select>{' '}
        в{' '}
        <select value={s.time} onChange={(e) => s.setTime(e.target.value)} aria-label="Время" className={s.time ? '' : 'empty'}>
          <option value="">{free.length ? '__:__' : 'нет окон'}</option>
          {free.map((t) => <option key={t}>{t}</option>)}
        </select>.
        {' '}Меня зовут{' '}
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="имя" aria-label="Имя" size={Math.max(6, name.length + 1)} autoComplete="name" />,
        {' '}мой телефон{' '}
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+380 …" aria-label="Телефон" size={14} inputMode="tel" autoComplete="tel" />.
      </p>
      {err && <p className="lt-err" role="alert">{err}</p>}
      <button className="lt-send">Отправить запись</button>
    </form>
  );
}
