'use client';
import { useEffect, useState } from 'react';
import config from '@/engine.config';
import { fieldByColumn } from '@/lib/fields';
import FieldsGrid from './FieldsGrid';

const T = config.texts;
const emailKey = fieldByColumn('email').key;

export default function BookingForm() {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | sent
  const [msg, setMsg] = useState('');

  // Кнопка «Обрати» у прайсі лендингу
  useEffect(() => {
    const h = (e) => setValues((s) => ({ ...s, [e.detail.key]: e.detail.value }));
    window.addEventListener('prefill', h);
    return () => window.removeEventListener('prefill', h);
  }, []);

  async function submit(e) {
    e.preventDefault();
    setState('sending'); setMsg(''); setErrors({});
    const r = await fetch('/api/book', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values),
    });
    const d = await r.json().catch(() => ({}));
    if (r.ok) { setState('sent'); return; }
    setErrors(d.errors || {}); setMsg(d.error || T.error); setState('idle');
  }

  if (state === 'sent') {
    return (
      <div className="center sent">
        <h2>{T.sentTitle}</h2>
        <p>{T.sentText.replace('{email}', values[emailKey] || '')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <FieldsGrid values={values} errors={errors} onChange={(k, v) => setValues((s) => ({ ...s, [k]: v }))} />
      {msg && <p className="msg">{msg}</p>}
      <button className="btn wide-btn" disabled={state === 'sending'}>
        {state === 'sending' ? T.submitting : T.submit}
      </button>
    </form>
  );
}
