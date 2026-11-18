'use client';
import { useEffect, useMemo, useState } from 'react';

const items = [
  { n: 'Капучино M', p: 75 }, { n: 'Флэт уайт', p: 75 }, { n: 'Латте M', p: 80 }, { n: 'Американо M', p: 60 },
  { n: 'Раф ванильный M', p: 95 }, { n: 'Матча латте', p: 80 }, { n: 'Круассан', p: 55 }, { n: 'Синнабон', p: 70 },
];
const hours = { 0: [540, 1260], 1: [450, 1200], 2: [450, 1200], 3: [450, 1200], 4: [450, 1200], 5: [450, 1200], 6: [540, 1260] };
const hm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export default function Preorder() {
  const [cart, setCart] = useState({});
  const [slot, setSlot] = useState('');
  const [name, setName] = useState('');
  const [now, setNow] = useState(null);
  const [done, setDone] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => setNow(new Date()), []);

  // Ближайшие слоты по 10 минут: сегодня, если открыто, иначе — завтра с открытия
  const slots = useMemo(() => {
    if (!now) return { day: '', list: [] };
    let d = new Date(now); let [o, c] = hours[d.getDay()];
    let start = Math.max(o, Math.ceil((d.getHours() * 60 + d.getMinutes() + 15) / 10) * 10);
    let day = 'сегодня';
    if (start > c - 10) { d.setDate(d.getDate() + 1); [o, c] = hours[d.getDay()]; start = o; day = 'завтра'; }
    const list = [];
    for (let t = start; t <= c - 10 && list.length < 12; t += 10) list.push(hm(t));
    return { day, list };
  }, [now]);

  const lines = items.filter((i) => cart[i.n]);
  const total = lines.reduce((s, i) => s + i.p * cart[i.n], 0);
  const add = (n, d) => setCart((c) => { const v = Math.max(0, (c[n] || 0) + d); const x = { ...c, [n]: v }; if (!v) delete x[n]; return x; });

  function submit(e) {
    e.preventDefault();
    if (!lines.length) return setErr('Добавьте что-нибудь из меню');
    if (!slot) return setErr('Выберите время');
    if (name.trim().length < 2) return setErr('Как вас позвать?');
    setErr(''); setDone({ num: 100 + Math.floor(Math.random() * 800), slot, day: slots.day });
  }

  if (done) {
    return (
      <div className="cf-po cf-po-done" role="status">
        <p className="cf-po-tag">Демо-режим</p>
        <p className="cf-po-num">№ {done.num}</p>
        <p>{name}, заказ будет готов {done.day} к <b>{done.slot}</b>. Назовите номер на кассе, оплата при получении.</p>
        <p className="cf-po-hint">В рабочей версии заказ падает бариста в Telegram, а гостю приходит подтверждение.</p>
        <button type="button" className="cf-btn" onClick={() => { setDone(null); setCart({}); setSlot(''); }}>Новый заказ</button>
      </div>
    );
  }

  return (
    <form className="cf-po" onSubmit={submit} noValidate>
      <ul className="cf-po-items">
        {items.map((i) => (
          <li key={i.n} className={cart[i.n] ? 'on' : ''}>
            <span className="cf-po-n">{i.n}</span>
            <span className="cf-po-p">{i.p} ₴</span>
            <span className="cf-po-q">
              <button type="button" onClick={() => add(i.n, -1)} aria-label={`Убрать ${i.n}`} disabled={!cart[i.n]}>−</button>
              <b>{cart[i.n] || 0}</b>
              <button type="button" onClick={() => add(i.n, 1)} aria-label={`Добавить ${i.n}`}>+</button>
            </span>
          </li>
        ))}
      </ul>
      <div className="cf-po-side">
        <p className="cf-po-label">Заберу {slots.day}</p>
        <div className="cf-po-slots">
          {slots.list.map((t) => <button type="button" key={t} aria-pressed={slot === t} onClick={() => setSlot(t)}>{t}</button>)}
        </div>
        <label className="cf-po-label" htmlFor="cf-name">Имя на стакане</label>
        <input id="cf-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Оля" />
        <div className="cf-po-total"><span>{lines.reduce((s, i) => s + cart[i.n], 0)} поз.</span><b>{total} ₴</b></div>
        {err && <p className="cf-po-err" role="alert">{err}</p>}
        <button className="cf-btn wide">Заказать{slot && ` к ${slot}`}</button>
      </div>
    </form>
  );
}
