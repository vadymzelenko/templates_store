'use client';
// Калькулятор уборки + выбор времени приезда
import { useState } from 'react';
import useSlots, { dayLabel, WD } from '@/components/demo/useSlots';
import { base, extras, freq } from './data';

const money = (n) => Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ');

function Counter({ label, value, set, min = 0, max = 9 }) {
  return (
    <div className="cl-cnt">
      <span>{label}</span>
      <button type="button" onClick={() => set(Math.max(min, value - 1))} aria-label={`Меньше: ${label}`}>−</button>
      <b aria-live="polite">{value}</b>
      <button type="button" onClick={() => set(Math.min(max, value + 1))} aria-label={`Больше: ${label}`}>+</button>
    </div>
  );
}

export default function Calc() {
  const [rooms, setRooms] = useState(2);
  const [baths, setBaths] = useState(1);
  const [ex, setEx] = useState({ windows: 0 });
  const [fr, setFr] = useState('once');
  const [addr, setAddr] = useState('');
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const s = useSlots({ hours: { start: '08:00', end: '20:00', step: 120 }, busyRate: 0.3 });

  const k = freq.find((f) => f.key === fr).k;
  const exSum = extras.reduce((a, e) => a + (ex[e.key] || 0) * e.price, 0);
  const sum = (rooms * base.room + baths * base.bath + base.kitchen + exSum) * k;
  const hours = Math.max(2, Math.round((rooms * 0.8 + baths * 0.6 + 0.8 + Object.values(ex).reduce((a, b) => a + b, 0) * 0.3) * 2) / 2);
  const setE = (key, v) => setEx((o) => ({ ...o, [key]: v }));

  function order(e) {
    e.preventDefault();
    if (!s.time) return setErr('Когда приехать?');
    if (addr.trim().length < 3) return setErr('Укажите адрес');
    if (phone.replace(/\D/g, '').length < 7) return setErr('Проверьте телефон');
    setErr(''); setDone(true);
  }

  return (
    <form className="cl-calc" onSubmit={order} noValidate>
      <div className="cl-calc-l">
        <h2>Сколько стоит уборка</h2>
        <Counter label="Комнаты" value={rooms} set={setRooms} min={1} />
        <Counter label="Санузлы" value={baths} set={setBaths} min={1} max={4} />
        <p className="cl-k">Кухня входит всегда.</p>
        <p className="cl-label">Ещё помыть</p>
        <div className="cl-extras">
          {extras.map((e) => (
            e.max ? (
              <div key={e.key} className={`cl-ex${ex[e.key] ? ' on' : ''}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d={e.icon} /></svg>
                <span>{e.name}<small>{e.price} ₴ {e.unit}</small></span>
                <span className="cl-mini"><button type="button" onClick={() => setE(e.key, Math.max(0, (ex[e.key] || 0) - 1))} aria-label="меньше створок">−</button><b>{ex[e.key] || 0}</b><button type="button" onClick={() => setE(e.key, Math.min(e.max, (ex[e.key] || 0) + 1))} aria-label="больше створок">+</button></span>
              </div>
            ) : (
              <button key={e.key} type="button" className={`cl-ex${ex[e.key] ? ' on' : ''}`} aria-pressed={!!ex[e.key]} onClick={() => setE(e.key, ex[e.key] ? 0 : 1)}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d={e.icon} /></svg>
                <span>{e.name}<small>+{e.price} ₴</small></span>
              </button>
            )
          ))}
        </div>
        <p className="cl-label">Как часто</p>
        <div className="cl-freq">
          {freq.map((f) => (
            <button key={f.key} type="button" aria-pressed={fr === f.key} onClick={() => setFr(f.key)}>{f.name}{f.k < 1 && <em>−{Math.round((1 - f.k) * 100)}%</em>}</button>
          ))}
        </div>
      </div>

      <div className="cl-calc-r" aria-live="polite">
        <div className="cl-bubble">
          <p>Итого</p>
          <b>{money(sum)} ₴</b>
          <span>≈ {String(hours).replace('.', ',')} ч · бригада из {rooms > 3 ? 3 : 2} человек</span>
        </div>
        {done ? (
          <div className="cl-done" role="status">
            <p><b>Приедем {dayLabel(s.date)}, {s.time}.</b> Привезём всё своё: химию, пылесос, тряпки.</p>
            <p className="cl-small">Подтверждение пришлём в Telegram, за час до приезда — напоминание.</p>
            <button type="button" className="cl-link" onClick={() => { setDone(false); s.setTime(''); }}>изменить</button>
          </div>
        ) : (
          <>
            <p className="cl-label">Когда приехать</p>
            <div className="cl-days">
              {s.dayList.slice(0, 7).map((v) => { const d = new Date(v + 'T00:00:00'); return <button key={v} type="button" aria-pressed={s.date === v} onClick={() => s.setDate(v)}><small>{WD[d.getDay()]}</small>{d.getDate()}</button>; })}
            </div>
            <div className="cl-hours">
              {s.times.map((t) => <button key={t} type="button" disabled={s.busy(t)} aria-pressed={s.time === t} onClick={() => s.setTime(t)}>{t}</button>)}
            </div>
            <input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Адрес" aria-label="Адрес" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" inputMode="tel" aria-label="Телефон" />
            {err && <p className="cl-err" role="alert">{err}</p>}
            <button className="cl-go">Заказать уборку</button>
          </>
        )}
      </div>
    </form>
  );
}
