'use client';
import { useState } from 'react';
import config from '@/engine.config';
import { fieldByColumn } from '@/lib/fields';
import FieldsGrid from './FieldsGrid';

const T = config.texts;
const emailKey = fieldByColumn('email')?.key;

// onSave(values) -> {} при успіху, або { error, errors }
export default function EditForm({ booking, onSave, onCancel, admin = false }) {
  const [values, setValues] = useState(booking);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const fields = admin ? config.fields : config.fields.filter((f) => f.key !== emailKey);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setMsg(''); setErrors({});
    const payload = {};
    for (const f of fields) payload[f.key] = values[f.key];
    const res = await onSave(payload);
    setBusy(false);
    if (res?.error) { setMsg(res.error); setErrors(res.errors || {}); }
  }

  return (
    <form onSubmit={submit} noValidate>
      <FieldsGrid fields={fields} values={values} errors={errors} admin={admin} currentId={booking.id}
        onChange={(k, v) => setValues((s) => ({ ...s, [k]: v }))} />
      {msg && <p className="msg">{msg}</p>}
      <div className="row">
        <button className="btn sm" disabled={busy}>{T.save}</button>
        <button type="button" className="btn ghost sm" onClick={onCancel}>{T.cancel}</button>
      </div>
    </form>
  );
}
