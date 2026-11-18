'use client';
// Табличка на двери: «Открыто / Закрыто» по часам работы, качается на гвоздике
import { useEffect, useState } from 'react';
import { hours } from './data';

const hm = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
export function openState(d = new Date()) {
  const [o, c] = hours[d.getDay()];
  const m = d.getHours() * 60 + d.getMinutes();
  if (m >= o && m < c) return { open: true, text: `до ${hm(c)}` };
  return { open: false, text: m < o ? `с ${hm(o)}` : `завтра с ${hm(hours[(d.getDay() + 1) % 7][0])}` };
}

export default function OpenNow() {
  const [s, setS] = useState(null);
  useEffect(() => { setS(openState()); const t = setInterval(() => setS(openState()), 60000); return () => clearInterval(t); }, []);
  return (
    <div className={`cb-sign${s?.open ? ' on' : ''}`} aria-live="polite">
      <span className="cb-sign-nail" aria-hidden="true" />
      <b>{s ? (s.open ? 'Открыто' : 'Закрыто') : '…'}</b>
      <small>{s?.text}</small>
    </div>
  );
}
