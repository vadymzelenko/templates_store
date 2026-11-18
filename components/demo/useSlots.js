'use client';
// Логика слотов для демо-записи: дни, время, «занято». Внешний вид каждое демо рисует само.
import { useEffect, useMemo, useState } from 'react';

export const WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
export const WD_FULL = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
export const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const fmt = (n) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
export const iso = (d) => d.toLocaleDateString('sv-SE');

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967295;
}

export function dayLabel(v, short = false) {
  if (!v) return '';
  const d = new Date(v + 'T00:00:00');
  return short ? `${WD[d.getDay()]}, ${d.getDate()}` : `${WD[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export default function useSlots({ hours = { start: '10:00', end: '20:00', step: 60 }, closed = [], days = 10, busyRate = 0.35, resource = '' } = {}) {
  const [now, setNow] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  useEffect(() => { setNow(new Date()); }, []);

  const dayList = useMemo(() => {
    if (!now) return [];
    const out = [];
    const d = new Date(now); d.setHours(0, 0, 0, 0);
    // Сегодня осталось меньше четырёх окон — начинаем с завтра
    const nm = now.getHours() * 60 + now.getMinutes();
    let left = 0;
    for (let t = toMin(hours.start); t + hours.step <= toMin(hours.end); t += hours.step) if (t > nm + 30) left++;
    if (left < 4) d.setDate(d.getDate() + 1);
    while (out.length < days) {
      if (!closed.includes(d.getDay())) out.push(iso(d));
      d.setDate(d.getDate() + 1);
    }
    return out;
  }, [now, days, closed, hours]);

  useEffect(() => { if (!date && dayList.length) setDate(dayList[0]); }, [dayList, date]);

  const times = useMemo(() => {
    const out = [];
    for (let t = toMin(hours.start); t + hours.step <= toMin(hours.end); t += hours.step) out.push(fmt(t));
    return out;
  }, [hours]);

  const isToday = now && date === iso(now);
  const nowMin = now ? now.getHours() * 60 + now.getMinutes() : 0;
  const busy = (t, d = date) => (now && d === iso(now) && toMin(t) <= nowMin + 30) || hash(`${d}|${t}|${resource}`) < busyRate;

  useEffect(() => { if (time && busy(time)) setTime(''); });

  return { dayList, date, setDate, times, time, setTime, busy, isToday, ready: !!now };
}
