import config from '@/engine.config';

const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const fmt = (n) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;

export function timeOptions() {
  const { start, end, stepMinutes } = config.slots;
  const out = [];
  for (let t = toMin(start); t + stepMinutes <= toMin(end); t += stepMinutes) out.push(fmt(t));
  return out;
}

export const todayStr = () => new Date().toLocaleDateString('sv-SE', { timeZone: config.timezone });
export const nowTimeStr = () =>
  new Date().toLocaleTimeString('en-GB', { timeZone: config.timezone, hour: '2-digit', minute: '2-digit' });

export function dateBounds() {
  const min = todayStr();
  const d = new Date(min + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + config.slots.daysAhead);
  return { min, max: d.toISOString().slice(0, 10) };
}
