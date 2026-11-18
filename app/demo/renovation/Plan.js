'use client';
// Интерактивная планировка: клик по комнате включает/выключает её в смете. Итог — в штампе чертежа.
import { useState } from 'react';
import { rooms, types } from './data';

const S = 40; // px на метр
const money = (n) => (Math.round(n / 1000) * 1000).toLocaleString('ru-RU').replace(/,/g, ' ');

export default function Plan() {
  const [on, setOn] = useState(rooms.map((r) => r.key));
  const [type, setType] = useState('cap');
  const t = types.find((x) => x.key === type);
  const chosen = rooms.filter((r) => on.includes(r.key));
  const area = chosen.reduce((s, r) => s + r.w * r.h, 0);
  const dry = chosen.filter((r) => !r.wet).reduce((s, r) => s + r.w * r.h, 0);
  const cost = dry * t.rate + (chosen.some((r) => r.wet) ? t.bath : 0);
  const weeks = Math.max(1, Math.round(area * (type === 'cos' ? 0.08 : type === 'cap' ? 0.15 : 0.2)));
  const toggle = (k) => setOn((v) => (v.includes(k) ? v.filter((x) => x !== k) : [...v, k]));

  const W = 8.8 * S, H = 6.9 * S;
  return (
    <div className="bp-sheet">
      <div className="bp-draw">
        <svg viewBox={`-50 -50 ${W + 100} ${H + 100}`} className="bp-svg" role="group" aria-label="Планировка квартиры: нажмите на комнату">
          <defs>
            <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#fff" strokeOpacity=".35" strokeWidth="2" /></pattern>
          </defs>
          {/* размерные линии */}
          <g className="bp-dim">
            <line x1="0" y1="-26" x2={W} y2="-26" /><line x1="0" y1="-34" x2="0" y2="-18" /><line x1={W} y1="-34" x2={W} y2="-18" />
            <text x={W / 2} y="-32" textAnchor="middle">8 800</text>
            <line x1="-26" y1="0" x2="-26" y2={H} /><line x1="-34" y1="0" x2="-18" y2="0" /><line x1="-34" y1={H} x2="-18" y2={H} />
            <text x="-32" y={H / 2} textAnchor="middle" transform={`rotate(-90 -32 ${H / 2})`}>6 900</text>
          </g>
          {rooms.map((r) => {
            const sel = on.includes(r.key);
            return (
              <g key={r.key} className={`bp-room${sel ? ' on' : ''}`} onClick={() => toggle(r.key)} role="checkbox" aria-checked={sel} tabIndex={0}
                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(r.key); } }}>
                <rect x={r.x * S} y={r.y * S} width={r.w * S} height={r.h * S} />
                {sel && <rect x={r.x * S} y={r.y * S} width={r.w * S} height={r.h * S} fill="url(#hatch)" className="bp-hatch" />}
                <text x={(r.x + r.w / 2) * S} y={(r.y + r.h / 2) * S - 4} textAnchor="middle" className="bp-rname">{r.name}</text>
                <text x={(r.x + r.w / 2) * S} y={(r.y + r.h / 2) * S + 14} textAnchor="middle" className="bp-rarea">{(r.w * r.h).toFixed(1).replace('.', ',')} м²</text>
              </g>
            );
          })}
          {/* двери */}
          <g className="bp-door"><path d={`M ${3.4 * S} ${3.9 * S + 30} a 30 30 0 0 1 30 -30`} /><path d={`M ${6.6 * S} ${3.9 * S + 30} a 30 30 0 0 0 -30 -30`} /></g>
        </svg>
        <p className="bp-tip">Нажмите на комнату, чтобы убрать её из сметы или вернуть</p>
      </div>

      <div className="bp-types" role="radiogroup" aria-label="Тип ремонта">
        {types.map((x) => (
          <button key={x.key} type="button" role="radio" aria-checked={type === x.key} onClick={() => setType(x.key)}>
            <b>{x.name}</b><span>{x.rate.toLocaleString('ru-RU')} ₴/м² · {x.x}</span>
          </button>
        ))}
      </div>

      {/* Штамп чертежа с итогом */}
      <table className="bp-stamp" aria-live="polite">
        <tbody>
          <tr><td colSpan="2" className="bp-st-firm">МЕТР · ремонт квартир</td><td>Лист</td><td>1</td></tr>
          <tr><td>Объект</td><td colSpan="3">Ваша квартира</td></tr>
          <tr><td>Площадь</td><td>{area.toFixed(1).replace('.', ',')} м²</td><td>Срок</td><td>≈ {weeks} нед.</td></tr>
          <tr><td>Смета</td><td colSpan="3" className="bp-st-sum">{area ? `${money(cost * 0.95)} – ${money(cost * 1.1)} ₴` : '—'}</td></tr>
          <tr><td>Тип</td><td colSpan="3">{t.name}</td></tr>
        </tbody>
      </table>
    </div>
  );
}
