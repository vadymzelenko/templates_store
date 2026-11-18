'use client';
import { useEffect, useState } from 'react';

// Часы работы: [открытие, закрытие] в минутах; 0 = воскресенье
const hours = { 0: [540, 1260], 1: [450, 1200], 2: [450, 1200], 3: [450, 1200], 4: [450, 1200], 5: [450, 1200], 6: [540, 1260] };
const hm = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;

export function openState(d = new Date()) {
  const [o, c] = hours[d.getDay()];
  const m = d.getHours() * 60 + d.getMinutes();
  if (m >= o && m < c) return { open: true, text: `Открыто до ${hm(c)}`, from: m, to: c };
  const next = m < o ? hm(o) : `завтра с ${hm(hours[(d.getDay() + 1) % 7][0])}`;
  return { open: false, text: `Закрыто · откроемся ${m < o ? `в ${next}` : next}` };
}

export default function OpenNow() {
  const [s, setS] = useState(null);
  useEffect(() => { setS(openState()); const t = setInterval(() => setS(openState()), 60000); return () => clearInterval(t); }, []);
  if (!s) return <span className="cf-open" />;
  return <span className={`cf-open${s.open ? ' on' : ''}`}><i />{s.text}</span>;
}
