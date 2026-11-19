'use client';
// Меловая доска = меню и корзина. Тап по позиции — плюс одна в предзаказ, чек печатается ниже.
import { useEffect, useMemo, useState } from 'react';
import { menu, hours } from './data';

const hm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export default function Board() {
  const [cart, setCart] = useState({});
  const [slot, setSlot] = useState('');
  const [name, setName] = useState('');
  const [now, setNow] = useState(null);
  const [done, setDone] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => setNow(new Date()), []);

  const slots = useMemo(() => {
    if (!now) return { day: '', list: [] };
    const d = new Date(now); let [o, c] = hours[d.getDay()];
    let start = Math.max(o, Math.ceil((d.getHours() * 60 + d.getMinutes() + 15) / 10) * 10);
    let day = 'сегодня';
    if (start > c - 10) { d.setDate(d.getDate() + 1); [o, c] = hours[d.getDay()]; start = o; day = 'завтра'; }
    const list = [];
    for (let t = start; t <= c - 10 && list.length < 8; t += 10) list.push(hm(t));
    return { day, list };
  }, [now]);

  const price = Object.fromEntries(menu.flatMap((g) => g.items));
  const lines = Object.entries(cart);
  const total = lines.reduce((s, [n, q]) => s + price[n] * q, 0);
  const add = (n, d = 1) => setCart((c) => { const v = Math.max(0, (c[n] || 0) + d); const x = { ...c, [n]: v }; if (!v) delete x[n]; return x; });

  function order(e) {
    e.preventDefault();
    if (!lines.length) return setErr('чек пустой — тапните что-нибудь на доске');
    if (!slot) return setErr('во сколько зайдёте?');
    if (name.trim().length < 2) return setErr('какое имя написать на стакане?');
    setErr(''); setDone({ num: 100 + ((total * 7 + name.length * 13) % 800) });
  }

  return (
    <>
      <div className="cb-menu">
        {menu.map((g) => (
          <div key={g.group} className="cb-col">
            <h2>{g.group}</h2>
            <ul>
              {g.items.map(([n, p]) => (
                <li key={n}>
                  <button type="button" onClick={() => add(n)} aria-label={`Добавить ${n}, ${p} гривен`}>
                    <span>{n}</span><i /><span>{p}</span>
                    {cart[n] > 0 && <em className="cb-tally" aria-label={`в чеке: ${cart[n]}`}>{'|'.repeat(Math.min(cart[n], 5))}</em>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="cb-hint">↑ тапните позицию — она попадёт в чек</p>
      </div>

      <section className="cb-counter" id="order">
        <div className="cb-counter-text">
          <h2>Заберите без очереди</h2>
          <p>Соберите заказ на доске, выберите время — бариста начнёт за пять минут до вашего прихода. Оплата на кассе.</p>
        </div>
        <form className={`cb-receipt${done ? ' printed' : ''}`} onSubmit={order} noValidate aria-live="polite">
          <p className="cb-r-c">КОФЕЙНЯ «УГОЛ»<br />ул. Ярославова, 1</p>
          <p className="cb-r-c">{done ? `ПРЕДЗАКАЗ № ${done.num}` : 'ПРЕДЗАКАЗ'}</p>
          <div className="cb-r-lines">
            {lines.length ? lines.map(([n, q]) => (
              <div key={n} className="cb-r-line">
                <span>{q} × {n}</span><span>{price[n] * q}.00</span>
                {!done && <span className="cb-r-ctl"><button type="button" onClick={() => add(n, -1)} aria-label={`Убрать ${n}`}>−</button><button type="button" onClick={() => add(n)} aria-label={`Добавить ${n}`}>+</button></span>}
              </div>
            )) : <p className="cb-r-empty">— пусто —</p>}
          </div>
          <div className="cb-r-total"><span>ИТОГО</span><span>{total}.00 ₴</span></div>
          {done ? (
            <>
              <p className="cb-r-c big">{name.toUpperCase()}, ЖДЁМ К {slot}</p>
              <p className="cb-r-c">назовите номер на кассе</p>
              <p className="cb-r-c small">заказ уже у бариста</p>
              <button type="button" className="cb-r-btn" onClick={() => { setDone(null); setCart({}); setSlot(''); }}>новый чек</button>
            </>
          ) : (
            <>
              <p className="cb-r-label">ЗАБЕРУ {slots.day.toUpperCase()} В</p>
              <div className="cb-r-slots">
                {slots.list.map((t) => <button type="button" key={t} aria-pressed={slot === t} onClick={() => setSlot(t)}>{t}</button>)}
              </div>
              <label className="cb-r-label" htmlFor="cb-name">ИМЯ НА СТАКАНЕ</label>
              <input id="cb-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Оля" />
              {err && <p className="cb-r-err" role="alert">* {err}</p>}
              <button className="cb-r-btn">ПЕЧАТЬ ЧЕКА{slot && ` · ${slot}`}</button>
            </>
          )}
          <p className="cb-r-c small">спасибо, что вы с нами</p>
        </form>
      </section>
    </>
  );
}
