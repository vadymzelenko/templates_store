'use client';
// Запись-билет: слева корешок с итогом, справа шаги, которые листаются сами
import { useEffect, useState } from 'react';
import { Scissors } from 'lucide-react';
import Stepper from '@/components/ui/Stepper';
import useSlots, { dayLabel, WD } from '@/components/demo/useSlots';

export default function Booking({ services, masters }) {
  const [service, setService] = useState('');
  const [master, setMaster] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [done, setDone] = useState(false);
  const [stepKey, setStepKey] = useState(0);
  const s = useSlots({ hours: { start: '10:00', end: '21:00', step: 60 }, resource: master || '', busyRate: 0.4 });
  const svc = services.find((x) => x.name === service);
  const later = (fn) => setTimeout(fn, 280);

  useEffect(() => {
    const h = (e) => { if (e.detail.key === 'service') { setService(e.detail.value); setStepKey((k) => k + 1); } };
    window.addEventListener('prefill', h);
    const links = document.querySelectorAll('[data-master]');
    const pick = (e) => setMaster(e.currentTarget.dataset.master);
    links.forEach((l) => l.addEventListener('click', pick));
    return () => { window.removeEventListener('prefill', h); links.forEach((l) => l.removeEventListener('click', pick)); };
  }, []);

  const steps = [
    { key: 'svc', title: 'Что делаем?', valid: () => !!service,
      render: ({ next }) => <div className="tk-row">{services.map((x) => <button type="button" key={x.name} aria-pressed={service === x.name} onClick={() => { setService(x.name); later(next); }}>{x.short}<small>{x.price} ₴</small></button>)}</div> },
    { key: 'who', title: 'К кому?', valid: () => master !== null,
      render: ({ next }) => <div className="tk-row">{[{ name: '' }, ...masters].map((m) => <button type="button" key={m.name || 'any'} aria-pressed={master === m.name} onClick={() => { setMaster(m.name); later(next); }}>{m.name || 'Кто свободен'}</button>)}</div> },
    { key: 'when', title: 'Когда?', valid: () => !!s.time,
      render: ({ next }) => (
        <>
          <div className="tk-row tk-days">{s.dayList.map((v) => { const d = new Date(v + 'T00:00:00'); return <button type="button" key={v} aria-pressed={s.date === v} onClick={() => s.setDate(v)}><small>{WD[d.getDay()]}</small>{d.getDate()}</button>; })}</div>
          <div className="tk-row tk-hours">{s.times.map((t) => <button type="button" key={t} disabled={s.busy(t)} aria-pressed={s.time === t} onClick={() => { s.setTime(t); later(next); }}>{t}</button>)}</div>
        </>
      ) },
    { key: 'who2', title: 'Как вас записать?', valid: () => name.trim().length > 1 && phone.replace(/\D/g, '').length >= 7,
      render: () => (
        <div className="tk-fields">
          <label>Имя<input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
          <label>Телефон<input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="+380" autoComplete="tel" /></label>
        </div>
      ) },
  ];

  return (
    <div className="tk">
      <div className="tk-stub">
        <p className="tk-adm">Допуск в кресло</p>
        <p className="tk-num">№ {done ? String((name.length * 977 + phone.length * 31) % 900 + 100) : '———'}</p>
        <dl>
          <div><dt>Услуга</dt><dd>{svc ? svc.name : '—'}</dd></div>
          <div><dt>Мастер</dt><dd>{master === null ? '—' : master || 'кто свободен'}</dd></div>
          <div><dt>Когда</dt><dd>{s.time ? `${dayLabel(s.date)}, ${s.time}` : '—'}</dd></div>
          <div><dt>К оплате</dt><dd className="tk-sum">{svc ? `${svc.price} ₴` : '—'}</dd></div>
        </dl>
        {done && <p className="tk-ok">ЗАПИСАН</p>}
      </div>
      <div className="tk-main">
        {done ? (
          <div className="tk-done">
            <Scissors className="tk-done-ico" strokeWidth={1.5} />
            <h2>До встречи, {name}!</h2>
            <p>Пришлём напоминание за 2 часа. Если планы поменяются — перенести запись можно по ссылке из сообщения.</p>
            <button type="button" className="tk-again" onClick={() => { setDone(false); s.setTime(''); setStepKey((k) => k + 1); }}>Записаться ещё раз</button>
          </div>
        ) : (
          <>
            <h2>Запись</h2>
            <Stepper key={stepKey} start={stepKey && service ? 1 : 0} steps={steps} className="tk-stp" finishText="Записаться" onFinish={() => setDone(true)} />
          </>
        )}
      </div>
    </div>
  );
}
