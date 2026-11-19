'use client';
// Ветпаспорт: клиент заполняет кличку и вид — и сайт дальше говорит с ним про его питомца
import { useState } from 'react';
import useSlots, { dayLabel, WD } from '@/components/demo/useSlots';
import { kinds, doctors } from './data';
import Photo from '@/components/ui/Photo';
import { P } from '@/lib/photos';

export default function Passport() {
  const [pet, setPet] = useState('');
  const [kind, setKind] = useState('cat');
  const [svc, setSvc] = useState('');
  const [owner, setOwner] = useState('');
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const s = useSlots({ hours: { start: '09:00', end: '21:00', step: 30 }, busyRate: 0.45, resource: kind });
  const k = kinds.find((x) => x.key === kind);
  const name = pet.trim() || 'Ваш питомец';
  const doc = kind === 'rodent' || kind === 'bird' ? doctors[2] : /стерилиз|кастрац/i.test(svc) ? doctors[1] : doctors[0];

  function submit(e) {
    e.preventDefault();
    if (!pet.trim()) return setErr('Впишите кличку на первой странице');
    if (!svc) return setErr('Отметьте услугу');
    if (!s.time) return setErr('Выберите время');
    if (phone.replace(/\D/g, '').length < 7) return setErr('Проверьте телефон');
    setErr(''); setDone(true);
  }

  return (
    <form onSubmit={submit} noValidate>
      {/* Разворот паспорта */}
      <section className="vp-book">
        <div className="vp-page vp-left">
          <p className="vp-small">ВЕТЕРИНАРНАЯ КЛИНИКА «ДРУГ» · КИЕВ, УЛ. САДОВАЯ, 3</p>
          <h1>Паспорт<br />питомца</h1>
          <p className="vp-intro">Заполните две строчки — и мы покажем, что нужно именно вашему зверю, сколько это стоит и когда можно прийти.</p>
          <div className="vp-sos"><b>24/7</b>экстренный приём<br /><a href="tel:+380000000000">+380 00 000 00 00</a></div>
        </div>
        <div className="vp-page vp-right">
          <p className="vp-small">1. СВЕДЕНИЯ О ЖИВОТНОМ</p>
          <label className="vp-line">
            <span>Кличка</span>
            <input value={pet} onChange={(e) => setPet(e.target.value)} placeholder="Барсик" aria-label="Кличка питомца" />
          </label>
          <p className="vp-line-k">Вид</p>
          <div className="vp-kinds">
            {kinds.map((x) => (
              <button key={x.key} type="button" aria-pressed={kind === x.key} onClick={() => { setKind(x.key); setSvc(''); }}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d={x.icon} /></svg>{x.name}
              </button>
            ))}
          </div>
          <div className="vp-photo">
            {kind === 'cat' || kind === 'dog' ? <Photo key={kind} id={kind === 'cat' ? P.cat : P.dog} w={300} alt={kind === 'cat' ? 'Кот' : 'Собака'} fallback="#f3ecdb" /> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d={k.icon} /></svg>}
          </div>
          {pet.trim() && <span className="vp-stamp">ЗАРЕГИСТРИРОВАН</span>}
        </div>
      </section>

      {/* Страница 2: услуги для этого животного */}
      <section className="vp-sheet">
        <p className="vp-small">2. ЧТО МОЖЕТ ПОНАДОБИТЬСЯ</p>
        <h2>{name} · {k.name.toLowerCase()}</h2>
        <table className="vp-table">
          <thead><tr><th /><th>Процедура</th><th>Цена</th></tr></thead>
          <tbody>
            {k.services.map(([n, p]) => (
              <tr key={n} className={svc === n ? 'on' : ''} onClick={() => setSvc(n)}>
                <td><input type="radio" name="svc" checked={svc === n} onChange={() => setSvc(n)} aria-label={n} /></td>
                <td>{n}</td><td>{p.toLocaleString('ru-RU').replace(/,/g, ' ')} ₴</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="vp-doc">Примет: <b>{doc.name}</b>, {doc.role} <span className="vp-docstamp">{doc.stamp}</span></p>
      </section>

      {/* Страница 3: отметка о визите */}
      <section className="vp-sheet vp-visit" id="book">
        <p className="vp-small">3. ОТМЕТКА О ВИЗИТЕ</p>
        {done ? (
          <div className="vp-done" role="status">
            <span className="vp-stamp big">ЗАПИСАН</span>
            <p><b>{name}</b> ждём {dayLabel(s.date)} в {s.time}: {svc.toLowerCase()}, врач {doc.name}.</p>
            <p className="vp-small">Подтверждение придёт на почту, а за неделю до следующей прививки — напоминание.</p>
            <button type="button" className="vp-link" onClick={() => { setDone(false); s.setTime(''); }}>изменить отметку</button>
          </div>
        ) : (
          <>
            <div className="vp-cal">
              {s.dayList.slice(0, 7).map((v) => {
                const d = new Date(v + 'T00:00:00');
                return <button key={v} type="button" aria-pressed={s.date === v} onClick={() => s.setDate(v)}><small>{WD[d.getDay()]}</small>{d.getDate()}</button>;
              })}
            </div>
            <div className="vp-times">
              {s.times.map((t) => <button key={t} type="button" disabled={s.busy(t)} aria-pressed={s.time === t} onClick={() => s.setTime(t)}>{t}</button>)}
            </div>
            <div className="vp-owner">
              <label className="vp-line"><span>Хозяин</span><input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="имя" autoComplete="name" /></label>
              <label className="vp-line"><span>Телефон</span><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+380" inputMode="tel" autoComplete="tel" /></label>
            </div>
            {err && <p className="vp-err" role="alert">{err}</p>}
            <button className="vp-go">Поставить отметку{s.time && ` · ${s.time}`}</button>
          </>
        )}
      </section>
    </form>
  );
}
