'use client';
// Запись в виде билета: слева корешок с итогом, справа выбор
import { useEffect, useState } from 'react';
import useSlots, { dayLabel, WD } from '@/components/demo/useSlots';

export default function Booking({ services, masters }) {
  const [service, setService] = useState(services[0].name);
  const [master, setMaster] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const s = useSlots({ hours: { start: '10:00', end: '21:00', step: 60 }, resource: master, busyRate: 0.4 });
  const svc = services.find((x) => x.name === service);

  useEffect(() => {
    const h = (e) => { if (e.detail.key === 'service') setService(e.detail.value); };
    window.addEventListener('prefill', h);
    const links = document.querySelectorAll('[data-master]');
    const pick = (e) => setMaster(e.currentTarget.dataset.master);
    links.forEach((l) => l.addEventListener('click', pick));
    return () => { window.removeEventListener('prefill', h); links.forEach((l) => l.removeEventListener('click', pick)); };
  }, []);

  function submit(e) {
    e.preventDefault();
    if (!s.time) return setErr('Выберите время');
    if (name.trim().length < 2) return setErr('Как вас записать?');
    if (phone.replace(/\D/g, '').length < 7) return setErr('Проверьте телефон');
    setErr(''); setDone(true);
  }

  return (
    <form className="tk" onSubmit={submit} noValidate>
      <div className="tk-stub">
        <p className="tk-adm">Допуск в кресло</p>
        <p className="tk-num">№ {done ? String(Math.abs(name.length * 977 + phone.length * 31) % 900 + 100) : '———'}</p>
        <dl>
          <div><dt>Услуга</dt><dd>{svc.name}</dd></div>
          <div><dt>Мастер</dt><dd>{master || 'кто свободен'}</dd></div>
          <div><dt>Когда</dt><dd>{s.time ? `${dayLabel(s.date)}, ${s.time}` : '—'}</dd></div>
          <div><dt>К оплате</dt><dd className="tk-sum">{svc.price} ₴</dd></div>
        </dl>
        {done && <p className="tk-ok">ЗАПИСАН · ждём {name}</p>}
      </div>

      <div className="tk-main">
        {done ? (
          <div className="tk-done">
            <h2>До встречи!</h2>
            <p>Билет выше — ваша запись. В рабочей версии на почту приходит подтверждение, а перенести время можно в личном кабинете.</p>
            <p className="tk-demo">демо-режим: данные никуда не отправлены</p>
            <button type="button" className="tk-again" onClick={() => { setDone(false); s.setTime(''); }}>Оторвать ещё один</button>
          </div>
        ) : (
          <>
            <h2>Запись</h2>
            <p className="tk-label">Что делаем</p>
            <div className="tk-row">
              {services.map((x) => (
                <button type="button" key={x.name} aria-pressed={service === x.name} onClick={() => setService(x.name)}>{x.short}</button>
              ))}
            </div>
            <p className="tk-label">К кому</p>
            <div className="tk-row">
              {[{ name: '' }, ...masters].map((m) => (
                <button type="button" key={m.name || 'any'} aria-pressed={master === m.name} onClick={() => setMaster(m.name)}>{m.name || 'Любой'}</button>
              ))}
            </div>
            <p className="tk-label">День</p>
            <div className="tk-row tk-days">
              {s.dayList.map((v) => {
                const d = new Date(v + 'T00:00:00');
                return <button type="button" key={v} aria-pressed={s.date === v} onClick={() => s.setDate(v)}><small>{WD[d.getDay()]}</small>{d.getDate()}</button>;
              })}
            </div>
            <p className="tk-label">Час</p>
            <div className="tk-row">
              {s.times.map((t) => (
                <button type="button" key={t} disabled={s.busy(t)} aria-pressed={s.time === t} onClick={() => s.setTime(t)}>{t}</button>
              ))}
            </div>
            <div className="tk-fields">
              <label>Имя<input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
              <label>Телефон<input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="+380" autoComplete="tel" /></label>
            </div>
            {err && <p className="tk-err" role="alert">{err}</p>}
            <button className="tk-go">Записаться{s.time && ` на ${s.time}`}</button>
          </>
        )}
      </div>
    </form>
  );
}
