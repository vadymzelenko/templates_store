'use client';
import { useState } from 'react';
import config from '@/engine.config';
import { fieldByColumn, displayValue } from '@/lib/fields';
import EditForm from './EditForm';

const T = config.texts;
const emailKey = fieldByColumn('email')?.key;
const shown = config.fields.filter((f) => f.key !== emailKey);

export default function ProfileClient({ email, initial }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState(null);

  async function remove(id) {
    if (!confirm(T.deleteConfirm)) return;
    const r = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    if (r.ok) setItems((x) => x.filter((b) => b.id !== id));
    else alert((await r.json().catch(() => ({}))).error || T.error);
  }

  async function save(id, values) {
    const r = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ values }),
    });
    const d = await r.json().catch(() => ({}));
    if (r.ok) { setItems((x) => x.map((b) => (b.id === id ? d.booking : b))); setEditing(null); return {}; }
    return { error: d.error || T.error, errors: d.errors };
  }

  return (
    <main>
      <div className="page-head">
        <div>
          <h1>{T.profileTitle}</h1>
          <p className="muted">{email}</p>
        </div>
        <a className="btn" href="/#book">{T.newBooking}</a>
      </div>

      {!items.length && <p className="card muted">{T.noBookings}</p>}

      <div className="list">
        {items.map((b) => {
          const st = config.statuses[b.status] || { label: b.status, color: '#555' };
          const editable = config.clientEditable.includes(b.status);
          return (
            <article key={b.id} className="card">
              {editing === b.id ? (
                <EditForm booking={b} onSave={(v) => save(b.id, v)} onCancel={() => setEditing(null)} />
              ) : (
                <div className="booking">
                  <dl className="kv">
                    {shown.map((f) => (
                      <div key={f.key}><dt>{f.label}</dt><dd>{displayValue(f, b[f.key])}</dd></div>
                    ))}
                  </dl>
                  <div className="side">
                    <span className="badge" style={{ '--c': st.color }}>{st.label}</span>
                    {editable && (
                      <div className="row">
                        <button className="btn ghost sm" onClick={() => setEditing(b.id)}>{T.edit}</button>
                        <button className="btn danger sm" onClick={() => remove(b.id)}>{T.delete}</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}
