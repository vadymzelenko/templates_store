'use client';
// Меню с вкладками + предзаказ: плавающая корзина и панель оформления (время → имя → готово)
import { useEffect, useMemo, useState } from 'react';
import { Plus, Minus, ShoppingBag, X, Check, Clock } from 'lucide-react';
import Photo from '@/components/ui/Photo';
import { P } from '@/lib/photos';
import { menu, hours } from './data';

const hm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const price = Object.fromEntries(Object.values(menu).flat().map((i) => [i.n, i.p]));

export default function Shop() {
  const tabs = Object.keys(menu);
  const [tab, setTab] = useState(tabs[0]);
  const [cart, setCart] = useState({});
  const [open, setOpen] = useState(false);
  const [slot, setSlot] = useState('');
  const [name, setName] = useState('');
  const [done, setDone] = useState(null);
  const [bump, setBump] = useState(0);
  const [now, setNow] = useState(null);
  useEffect(() => setNow(new Date()), []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);

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

  const lines = Object.entries(cart);
  const count = lines.reduce((a, [, q]) => a + q, 0);
  const total = lines.reduce((a, [n, q]) => a + price[n] * q, 0);
  const add = (n, d = 1) => { setCart((c) => { const v = Math.max(0, (c[n] || 0) + d); const x = { ...c, [n]: v }; if (!v) delete x[n]; return x; }); if (d > 0) setBump((b) => b + 1); };
  const finish = () => { setDone({ num: 100 + ((total * 7 + name.length * 13) % 800) }); };
  const reset = () => { setDone(null); setCart({}); setSlot(''); setOpen(false); };

  return (
    <>
      <div className="ug-tabs" role="tablist">
        {tabs.map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>{t}</button>)}
      </div>
      <ul className="ug-menu" key={tab}>
        {menu[tab].map((i, k) => (
          <li key={i.n} style={{ animationDelay: `${k * 50}ms` }}>
            {i.photo ? <Photo id={P[i.photo]} w={200} alt={i.n} className="ug-mpic" fallback="#eadfce" /> : <span className="ug-mpic ug-mpic-empty" aria-hidden="true" />}
            <div className="ug-mtext"><b>{i.n}</b><span>{i.d}</span></div>
            <span className="ug-mprice">{i.p} ₴</span>
            {cart[i.n] ? (
              <span className="ug-qty"><button onClick={() => add(i.n, -1)} aria-label={`Убрать ${i.n}`}><Minus size={14} /></button><b>{cart[i.n]}</b><button onClick={() => add(i.n)} aria-label={`Ещё ${i.n}`}><Plus size={14} /></button></span>
            ) : (
              <button className="ug-add" onClick={() => add(i.n)} aria-label={`В предзаказ: ${i.n}`}><Plus size={18} /></button>
            )}
          </li>
        ))}
      </ul>

      <button className={`ug-cartbtn${count ? ' show' : ''}`} key={bump} onClick={() => setOpen(true)} aria-label="Открыть предзаказ">
        <ShoppingBag size={20} /> <span>{count} · {total} ₴</span> <b>Оформить</b>
      </button>

      <div className={`ug-drawer${open ? ' open' : ''}`} aria-hidden={!open}>
        <div className="ug-drawer-bg" onClick={() => setOpen(false)} />
        <aside className="ug-panel" role="dialog" aria-label="Предзаказ" data-lenis-prevent>
          <header><h3>Ваш заказ</h3><button onClick={() => setOpen(false)} aria-label="Закрыть"><X /></button></header>
          {done ? (
            <div className="ug-done">
              <span className="ug-done-ico"><Check /></span>
              <p className="ug-done-num">№ {done.num}</p>
              <p>{name}, ждём вас {slots.day} к <b>{slot}</b>. Назовите номер на кассе — оплата при получении.</p>
              <button className="ug-btn" onClick={reset}>Готово</button>
            </div>
          ) : (
            <>
              <ul className="ug-lines">
                {lines.map(([n, q]) => <li key={n}><span>{n}</span><span className="ug-qty"><button onClick={() => add(n, -1)} aria-label="меньше"><Minus size={14} /></button><b>{q}</b><button onClick={() => add(n)} aria-label="больше"><Plus size={14} /></button></span><span>{price[n] * q} ₴</span></li>)}
                {!lines.length && <li className="ug-empty">Пока пусто — добавьте что-нибудь из меню</li>}
              </ul>
              <p className="ug-label"><Clock size={16} /> Заберу {slots.day} в</p>
              <div className="ug-slots">{slots.list.map((t) => <button key={t} aria-pressed={slot === t} onClick={() => setSlot(t)}>{t}</button>)}</div>
              <label className="ug-label" htmlFor="ug-name">Имя на стакане</label>
              <input id="ug-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Оля" />
              <div className="ug-total"><span>Итого</span><b>{total} ₴</b></div>
              <button className="ug-btn" disabled={!lines.length || !slot || name.trim().length < 2} onClick={finish}>Заказать{slot && ` к ${slot}`}</button>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
