'use client';
// Первый экран = инструмент: «что с машиной» → заказ-наряд с ценой → время заезда
import { useState } from 'react';
import useSlots, { dayLabel, WD } from '@/components/demo/useSlots';
import { classes, symptoms } from './data';

const fmt = (n) => (Math.round(n / 10) * 10).toLocaleString('ru-RU').replace(/,/g, ' ');

export default function Garage() {
  const [cls, setCls] = useState('b');
  const [sel, setSel] = useState(['squeal']);
  const [car, setCar] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('pick'); // pick | time | done
  const [err, setErr] = useState('');
  const s = useSlots({ hours: { start: '08:00', end: '19:00', step: 60 }, closed: [0], busyRate: 0.4 });

  const k = classes.find((c) => c.key === cls).k;
  const jobs = symptoms.filter((x) => sel.includes(x.key)).flatMap((x) => x.jobs);
  const total = jobs.reduce((a, [, p]) => a + Math.round((p * k) / 10) * 10, 0);
  const hours = jobs.reduce((a, [, , h]) => a + h, 0);
  const toggle = (key) => setSel((v) => (v.includes(key) ? v.filter((x) => x !== key) : [...v, key]));

  function confirm(e) {
    e.preventDefault();
    if (!s.time) return setErr('Выберите час заезда');
    if (car.trim().length < 2) return setErr('Укажите машину');
    if (phone.replace(/\D/g, '').length < 7) return setErr('Проверьте телефон');
    setErr(''); setStep('done');
  }

  return (
    <section className="g14-tool">
      <div className="g14-ask">
        <h1>Что с машиной?</h1>
        <p className="g14-ask-sub">Отметьте всё, что замечали. Посчитаем работы сразу, без звонка.</p>
        <div className="g14-sym">
          {symptoms.map((x) => (
            <button key={x.key} type="button" aria-pressed={sel.includes(x.key)} onClick={() => toggle(x.key)}>
              <span className="g14-box" aria-hidden="true">{sel.includes(x.key) ? '✕' : ''}</span>{x.say}
            </button>
          ))}
        </div>
        <p className="g14-label">Машина</p>
        <div className="g14-cls">
          {classes.map((c) => (
            <button key={c.key} type="button" aria-pressed={cls === c.key} onClick={() => setCls(c.key)}>
              {c.name}<small>{c.ex}</small>
            </button>
          ))}
        </div>
      </div>

      {/* Заказ-наряд: бумажный бланк */}
      <form className="g14-order" onSubmit={confirm} noValidate aria-live="polite">
        <div className="g14-order-h">
          <span>ЗАКАЗ-НАРЯД</span>
          <span>№ {step === 'done' ? `14-${(total % 900) + 100}` : 'черновик'}</span>
        </div>
        <table>
          <tbody>
            {jobs.length ? jobs.map(([n, p]) => (
              <tr key={n}><td>{n}</td><td>{fmt(p * k)}</td></tr>
            )) : <tr><td colSpan="2" className="g14-empty">отметьте, что беспокоит →</td></tr>}
          </tbody>
        </table>
        <div className="g14-sum"><span>работы, ₴<br /><small>≈ {String(Math.round(hours * 10) / 10).replace('.', ',')} ч в боксе</small></span><b>{fmt(total)}</b></div>

        {step === 'pick' && (
          <button type="button" className="g14-go" disabled={!jobs.length} onClick={() => setStep('time')}>Выбрать время заезда →</button>
        )}

        {step === 'time' && (
          <div className="g14-when">
            <div className="g14-days">
              {s.dayList.slice(0, 7).map((v) => {
                const d = new Date(v + 'T00:00:00');
                return <button key={v} type="button" aria-pressed={s.date === v} onClick={() => s.setDate(v)}>{WD[d.getDay()]}<b>{d.getDate()}</b></button>;
              })}
            </div>
            <div className="g14-hours">
              {s.times.map((t) => <button key={t} type="button" disabled={s.busy(t)} aria-pressed={s.time === t} onClick={() => s.setTime(t)}>{t}</button>)}
            </div>
            <input value={car} onChange={(e) => setCar(e.target.value)} placeholder="Машина и год, напр. Octavia 2017" aria-label="Машина" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" inputMode="tel" aria-label="Телефон" />
            {err && <p className="g14-err" role="alert">{err}</p>}
            <button className="g14-go">Забронировать пост{s.time && ` · ${s.time}`}</button>
          </div>
        )}

        {step === 'done' && (
          <div className="g14-stamp-wrap">
            <span className="g14-stamp">ПРИНЯТО</span>
            <p>{car}, {dayLabel(s.date)}, {s.time}. Мастер позвонит, если после диагностики что-то изменится.</p>
            <p className="g14-demo">Подтверждение придёт в Telegram и на почту.</p>
            <button type="button" className="g14-link" onClick={() => { setStep('pick'); s.setTime(''); }}>новый заказ-наряд</button>
          </div>
        )}
      </form>
    </section>
  );
}
