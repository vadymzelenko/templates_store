'use client';
// «Открыто сейчас» по часам работы
import { useEffect, useState } from 'react';
import { hours } from './data';

const hm = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
function state(d = new Date()) {
  const [o, c] = hours[d.getDay()];
  const m = d.getHours() * 60 + d.getMinutes();
  if (m >= o && m < c) return { open: true, text: `Открыто до ${hm(c)}` };
  return { open: false, text: m < o ? `Откроемся в ${hm(o)}` : `Откроемся завтра в ${hm(hours[(d.getDay() + 1) % 7][0])}` };
}

export default function OpenNow({ className = '' }) {
  const [s, setS] = useState(null);
  useEffect(() => { setS(state()); const t = setInterval(() => setS(state()), 60000); return () => clearInterval(t); }, []);
  return <span className={`ug-open${s?.open ? ' on' : ''} ${className}`}><i />{s ? s.text : ' '}</span>;
}
