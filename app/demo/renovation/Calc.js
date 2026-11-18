'use client';
import { useState } from 'react';

const types = [
  { key: 'cos', name: 'Косметический', rate: 2400, wk: 0.08, x: 'Обои или покраска, ламинат, без переноса стен и коммуникаций' },
  { key: 'cap', name: 'Капитальный', rate: 5200, wk: 0.15, x: 'Электрика и сантехника с нуля, стяжка, штукатурка, плитка' },
  { key: 'des', name: 'Дизайнерский', rate: 7800, wk: 0.2, x: 'По дизайн-проекту: сложные потолки, подсветка, ниши, авторский надзор' },
];
const extras = [
  { key: 'bath', name: 'Санузел под ключ', price: 38000, wk: 1 },
  { key: 'floor', name: 'Тёплый пол', price: 14000, wk: 0 },
  { key: 'ceil', name: 'Натяжные потолки', price: 9000, wk: 0 },
  { key: 'clean', name: 'Клининг после ремонта', price: 4500, wk: 0 },
];
const fmt = (n) => Math.round(n / 1000) * 1000;
const money = (n) => fmt(n).toLocaleString('ru-RU').replace(/,/g, ' ');

export default function Calc() {
  const [area, setArea] = useState(54);
  const [type, setType] = useState('cap');
  const [ex, setEx] = useState(['bath']);
  const t = types.find((x) => x.key === type);
  const base = area * t.rate + extras.filter((e) => ex.includes(e.key)).reduce((s, e) => s + e.price, 0);
  const weeks = Math.max(2, Math.round(area * t.wk + extras.filter((e) => ex.includes(e.key)).reduce((s, e) => s + e.wk, 0)));

  function book() {
    window.dispatchEvent(new CustomEvent('prefill', { detail: { key: 'service', value: 'Вторичное жильё' } }));
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="rn-calc">
      <div className="rn-calc-in">
        <label className="rn-area">
          <span className="rn-mono">Площадь</span>
          <b>{area} м²</b>
          <input type="range" min="20" max="160" value={area} onChange={(e) => setArea(+e.target.value)} />
          <span className="rn-scale rn-mono"><span>20</span><span>90</span><span>160</span></span>
        </label>
        <div className="rn-types" role="radiogroup" aria-label="Тип ремонта">
          {types.map((x) => (
            <button key={x.key} type="button" role="radio" aria-checked={type === x.key} onClick={() => setType(x.key)}>
              <b>{x.name}</b><span className="rn-mono">{x.rate.toLocaleString('ru-RU')} ₴/м²</span><small>{x.x}</small>
            </button>
          ))}
        </div>
        <div className="rn-extras">
          {extras.map((e) => (
            <label key={e.key}>
              <input type="checkbox" checked={ex.includes(e.key)} onChange={() => setEx((s) => (s.includes(e.key) ? s.filter((k) => k !== e.key) : [...s, e.key]))} />
              <span>{e.name}</span><span className="rn-mono">+{money(e.price)}</span>
            </label>
          ))}
        </div>
      </div>
      <aside className="rn-result" aria-live="polite">
        <p className="rn-mono">Предварительно</p>
        <p className="rn-sum">{money(base * 0.95)} – {money(base * 1.1)} ₴</p>
        <dl>
          <div><dt>Срок</dt><dd>≈ {weeks} нед.</dd></div>
          <div><dt>Оплата</dt><dd>4 этапа</dd></div>
          <div><dt>Гарантия</dt><dd>3 года</dd></div>
        </dl>
        <button type="button" className="rn-btn" onClick={book}>Уточнить на замере</button>
      </aside>
    </div>
  );
}
