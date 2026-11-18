'use client';
import { useState } from 'react';

const classes = [
  { key: 'a', name: 'Малый', ex: 'Polo, Rio, Jazz', k: 1 },
  { key: 'b', name: 'Средний', ex: 'Octavia, Camry, Ceed', k: 1.2 },
  { key: 'c', name: 'Кроссовер', ex: 'RAV4, Tucson, Kodiaq', k: 1.4 },
  { key: 'd', name: 'Бус', ex: 'Transit, Vito, T5', k: 1.6 },
];

const jobs = [
  { key: 'to', name: 'ТО: масло и фильтры', price: 900, h: 1 },
  { key: 'diag', name: 'Компьютерная диагностика', price: 600, h: 0.5 },
  { key: 'pads', name: 'Передние колодки', price: 500, h: 0.7 },
  { key: 'disks', name: 'Передние диски и колодки', price: 1100, h: 1.2 },
  { key: 'arms', name: 'Передние рычаги', price: 1600, h: 2 },
  { key: 'timing', name: 'Ремень ГРМ с роликами', price: 3200, h: 3.5 },
  { key: 'ac', name: 'Заправка кондиционера', price: 900, h: 0.8 },
  { key: 'tires', name: 'Сезонная замена шин', price: 800, h: 0.7 },
];

const money = (n) => Math.round(n / 10) * 10;
const fmt = (n) => n.toLocaleString('ru-RU').replace(/,/g, ' ');

export default function Estimate() {
  const [cls, setCls] = useState('b');
  const [sel, setSel] = useState(['to', 'pads']);
  const k = classes.find((c) => c.key === cls).k;
  const chosen = jobs.filter((j) => sel.includes(j.key));
  const total = chosen.reduce((s, j) => s + money(j.price * k), 0);
  const hours = chosen.reduce((s, j) => s + j.h, 0);

  function book() {
    window.dispatchEvent(new CustomEvent('prefill', { detail: { key: 'service', value: sel.includes('diag') || !sel.length ? 'Диагностика' : sel.includes('tires') && sel.length === 1 ? 'Шиномонтаж' : 'ТО' } }));
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="ga-est">
      <div className="ga-est-in">
        <p className="ga-est-step">1 · Класс машины</p>
        <div className="ga-classes">
          {classes.map((c) => (
            <button key={c.key} type="button" aria-pressed={cls === c.key} onClick={() => setCls(c.key)}>
              <b>{c.name}</b><small>{c.ex}</small>
            </button>
          ))}
        </div>
        <p className="ga-est-step">2 · Что сделать</p>
        <div className="ga-jobs">
          {jobs.map((j) => (
            <label key={j.key} className={sel.includes(j.key) ? 'on' : ''}>
              <input type="checkbox" checked={sel.includes(j.key)} onChange={() => setSel((s) => (s.includes(j.key) ? s.filter((x) => x !== j.key) : [...s, j.key]))} />
              <span>{j.name}</span>
              <b>{fmt(money(j.price * k))} ₴</b>
            </label>
          ))}
        </div>
      </div>
      <aside className="ga-order" aria-live="polite">
        <p className="ga-order-h">Заказ-наряд <span>предварительный</span></p>
        <ul>
          {chosen.length ? chosen.map((j) => <li key={j.key}><span>{j.name}</span><span>{fmt(money(j.price * k))}</span></li>) : <li><span>Отметьте работы слева</span></li>}
        </ul>
        <div className="ga-order-sum"><span>Работы</span><b>{fmt(total)} ₴</b></div>
        <p className="ga-order-time">В боксе ≈ {hours ? `${String(hours).replace('.', ',')} ч` : '—'}</p>
        <button type="button" className="ga-btn" onClick={book}>Записаться на эти работы</button>
      </aside>
    </div>
  );
}
