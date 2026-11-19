'use client';
// Расписание недели = главный экран. Клик по занятию бронирует место; справа собирается «моя неделя».
import { useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';
import { types, days, times, schedule } from './data';

function taken(i) { return (i * 7 + 3) % 9; } // сколько мест уже занято (стабильно для демо)

export default function Timetable() {
  const [filter, setFilter] = useState(null);
  const [mine, setMine] = useState([]);
  const [phone, setPhone] = useState('');
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  const cells = useMemo(() => schedule.map((c, i) => ({ i, day: c[0], time: c[1], type: c[2], coach: c[3], spots: c[4], left: Math.max(0, c[4] - taken(i)) })), []);
  const toggle = (i) => setMine((m) => (m.includes(i) ? m.filter((x) => x !== i) : [...m, i]));
  const chosen = cells.filter((c) => mine.includes(c.i));
  const per = chosen.length;
  const tip = per === 0 ? 'Нажмите на занятие в расписании' : per === 1 ? 'Разовое — 280 ₴' : per <= 2 ? `${per} занятия в неделю — абонемент на 8 выйдет по 238 ₴ за раз` : `${per} занятий в неделю — берите 12 или безлимит, выгоднее на 20–30%`;

  function book(e) {
    e.preventDefault();
    if (!per) return setErr('Выберите хотя бы одно занятие');
    if (phone.replace(/\D/g, '').length < 7) return setErr('Укажите телефон');
    setErr(''); setDone(true);
  }

  return (
    <section className="tt">
      <div className="tt-legend" role="group" aria-label="Фильтр по направлению">
        {Object.entries(types).map(([k, t]) => (
          <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(filter === k ? null : k)} style={{ '--c': t.color }}>
            <i />{t.name}
          </button>
        ))}
      </div>

      <div className="tt-wrap">
        <div className="tt-grid" role="table" aria-label="Расписание на неделю">
          <div className="tt-corner" role="columnheader" />
          {days.map((d) => <div key={d} className="tt-day" role="columnheader">{d}</div>)}
          {times.map((t) => (
            <div key={t} className="tt-row" role="row">
              <div className="tt-time" role="rowheader">{t}</div>
              {days.map((d, di) => {
                const here = cells.filter((c) => c.day === di && c.time === t);
                return (
                  <div key={d} className="tt-cell" role="cell">
                    {here.map((c) => {
                      const ty = types[c.type];
                      const on = mine.includes(c.i);
                      const dim = filter && filter !== c.type;
                      return (
                        <button key={c.i} type="button" className={`tt-class${on ? ' on' : ''}${dim ? ' dim' : ''}`} style={{ '--c': ty.color }}
                          disabled={!c.left && !on} onClick={() => toggle(c.i)} aria-pressed={on}
                          aria-label={`${days[c.day]} ${c.time}, ${ty.name}, тренер ${c.coach}, мест: ${c.left}`}>
                          <b>{ty.name}</b>
                          <span>{c.coach}</span>
                          <em>{on ? <><Check size={13} strokeWidth={3} /> вы записаны</> : c.left ? `${c.left} из ${c.spots}` : 'мест нет'}</em>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <form className="tt-mine" onSubmit={book} noValidate aria-live="polite">
        <p className="tt-mine-h">Моя неделя <span>{per}</span></p>
        {done ? (
          <div className="tt-done">
            <p>Записали на {per} {per === 1 ? 'занятие' : per < 5 ? 'занятия' : 'занятий'}. Напомним за 2 часа до начала.</p>
            <p className="tt-small">Пришлём напоминание за 2 часа.</p>
            <button type="button" className="tt-link" onClick={() => { setDone(false); setMine([]); }}>начать заново</button>
          </div>
        ) : (
          <>
            <ul>
              {chosen.map((c) => (
                <li key={c.i}><span>{days[c.day]} {c.time}</span><b>{types[c.type].name}</b><button type="button" onClick={() => toggle(c.i)} aria-label="Убрать"><X size={16} /></button></li>
              ))}
            </ul>
            <p className="tt-tip">{tip}</p>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" inputMode="tel" aria-label="Телефон" />
            {err && <p className="tt-err" role="alert">{err}</p>}
            <button className="tt-go">Записаться{per ? ` · ${per}` : ''}</button>
          </>
        )}
      </form>
    </section>
  );
}
