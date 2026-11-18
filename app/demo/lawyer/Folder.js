'use client';
// Весь сайт — папка «Дело» с вкладками. Вкладка = раздел.
import { useState } from 'react';
import useSlots, { dayLabel } from '@/components/demo/useSlots';
import { lawyers, cases, prices } from './data';

const TABS = [['case', 'Дело'], ['what', 'С чем работаем'], ['price', 'Стоимость'], ['how', 'Как проходит'], ['apply', 'Заявление']];

export default function Folder() {
  const [tab, setTab] = useState('case');
  const [sit, setSit] = useState(cases[0].key);
  const c = cases.find((x) => x.key === sit);
  const law = lawyers.find((l) => l.key === c.who);

  return (
    <div className="lf">
      <div className="lf-tabs" role="tablist" aria-label="Разделы">
        {TABS.map(([k, n], i) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} style={{ '--i': i }}>{n}</button>
        ))}
      </div>
      <div className="lf-body" role="tabpanel">
        <span className="lf-clip" aria-hidden="true" />
        {tab === 'case' && <CaseTab sit={sit} setSit={setSit} c={c} law={law} go={() => setTab('apply')} />}
        {tab === 'what' && <WhatTab />}
        {tab === 'price' && <PriceTab />}
        {tab === 'how' && <HowTab />}
        {tab === 'apply' && <Apply c={c} law={law} />}
      </div>
    </div>
  );
}

function CaseTab({ sit, setSit, c, law, go }) {
  return (
    <div className="lf-case">
      <p className="lf-meta">АДВОКАТСКОЕ ОБЪЕДИНЕНИЕ «МОРОЗ И ПАРТНЁРЫ» · КИЕВ · С 2007 ГОДА</p>
      <h1>Дело №&nbsp;<span>ваше</span></h1>
      <p className="lf-lead">Опишите ситуацию — скажем, кто из нас её ведёт, сколько это стоит и что будет дальше. Без «это сложный вопрос, приходите».</p>
      <p className="lf-label">Суть обращения:</p>
      <div className="lf-sits">
        {cases.map((x) => (
          <button key={x.key} type="button" aria-pressed={sit === x.key} onClick={() => setSit(x.key)}>{sit === x.key ? '☒' : '☐'} {x.title}</button>
        ))}
      </div>
      <div className="lf-card">
        <span className="lf-stamp">ПРИНЯТО К РАССМОТРЕНИЮ</span>
        <dl>
          <div><dt>Ведёт</dt><dd>{law.name}, {law.role}</dd></div>
          <div><dt>Стоимость</dt><dd>{c.price}</dd></div>
          <div><dt>Срок</dt><dd>{c.time}</dd></div>
        </dl>
        <ol>{c.steps.map((s) => <li key={s}>{s}</li>)}</ol>
        <button type="button" className="lf-go" onClick={go}>Подать заявление на консультацию →</button>
      </div>
    </div>
  );
}

function WhatTab() {
  return (
    <div>
      <h2>С чем работаем</h2>
      <div className="lf-people">
        {lawyers.map((l) => (
          <div key={l.key} className="lf-person">
            <p className="lf-photo" aria-hidden="true">фото<br />3×4</p>
            <div>
              <h3>{l.name}</h3>
              <p className="lf-role">{l.role} · стаж {l.years} лет</p>
              <p>{l.area}</p>
              <p className="lf-small">Ведёт: {cases.filter((c) => c.who === l.key).map((c) => c.title.toLowerCase()).join('; ')}.</p>
            </div>
          </div>
        ))}
      </div>
      <p className="lf-note">✎ Не берём уголовные дела и не работаем «за процент от выигрыша» — честно скажем об этом на первой встрече.</p>
    </div>
  );
}

function PriceTab() {
  return (
    <div>
      <h2>Стоимость</h2>
      <table className="lf-table">
        <tbody>{prices.map(([n, p], i) => <tr key={n}><td>{i + 1}.</td><td>{n}</td><td>{p}</td></tr>)}</tbody>
      </table>
      <p className="lf-note">✎ Цену за дело фиксируем в договоре до начала работы. Если на консультации поняли, что вам не нужен адвокат, — так и скажем.</p>
    </div>
  );
}

function HowTab() {
  const steps = [['Заявление', 'Вы описываете ситуацию в форме или по телефону.'], ['Консультация', '45 минут в офисе или по видео. Смотрим документы, называем варианты и цену.'], ['Договор', 'Фиксируем, что делаем, сроки и стоимость.'], ['Работа', 'Отчитываемся о каждом шаге в мессенджере. Вы всегда знаете, что происходит с делом.']];
  return (
    <div>
      <h2>Как проходит</h2>
      <ol className="lf-how">{steps.map(([t, x]) => <li key={t}><b>{t}</b><span>{x}</span></li>)}</ol>
    </div>
  );
}

function Apply({ c, law }) {
  const s = useSlots({ hours: { start: '10:00', end: '18:00', step: 60 }, closed: [0, 6], busyRate: 0.4, resource: law.key });
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [text, setText] = useState('');
  const [format, setFormat] = useState('в офисе');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (name.trim().length < 2) return setErr('Укажите ФИО');
    if (!s.time) return setErr('Выберите время консультации');
    if (phone.replace(/\D/g, '').length < 7) return setErr('Укажите телефон');
    setErr(''); setDone(true);
  }

  return (
    <form className="lf-apply" onSubmit={submit} noValidate>
      <p className="lf-to">Адвокату {law.to}<br />от <input value={name} onChange={(e) => setName(e.target.value)} placeholder="фамилия, имя" aria-label="ФИО" autoComplete="name" /></p>
      <h2 className="lf-center">ЗАЯВЛЕНИЕ</h2>
      <p className="lf-text">
        Прошу проконсультировать меня по вопросу «{c.title.toLowerCase()}»
        {' '}<select value={format} onChange={(e) => setFormat(e.target.value)} aria-label="Формат"><option>в офисе</option><option>по видеосвязи</option></select>{' '}
        <select value={s.date} onChange={(e) => s.setDate(e.target.value)} aria-label="Дата">{s.dayList.map((v) => <option key={v} value={v}>{dayLabel(v)}</option>)}</select>{' '}в{' '}
        <select value={s.time} onChange={(e) => s.setTime(e.target.value)} aria-label="Время"><option value="">__:__</option>{s.times.filter((t) => !s.busy(t)).map((t) => <option key={t}>{t}</option>)}</select>.
      </p>
      <p className="lf-text">Кратко о ситуации:</p>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} aria-label="Описание ситуации" placeholder="необязательно" />
      <p className="lf-text">Связаться со мной: <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+380" inputMode="tel" aria-label="Телефон" /></p>
      <div className="lf-sign"><span>Дата: {s.dayList[0] ? dayLabel(s.dayList[0]) : ''}</span><span>Подпись: <i>{name || '________'}</i></span></div>
      {err && <p className="lf-err" role="alert">{err}</p>}
      {done ? (
        <div className="lf-done" role="status"><span className="lf-stamp big">ЗАРЕГИСТРИРОВАНО</span><p>Консультация {dayLabel(s.date)} в {s.time}, {format}. Демо-режим: заявление никуда не отправлено.</p></div>
      ) : <button className="lf-go">Подать заявление</button>}
    </form>
  );
}
