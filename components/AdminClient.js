'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import config from '@/engine.config';
import { displayValue } from '@/lib/fields';
import EditForm from './EditForm';

const T = config.texts;
const cols = config.adminColumns.map((k) => config.fields.find((f) => f.key === k)).filter(Boolean);
const ACTIONS = {
  created: 'створено', confirmed: 'підтверджено', confirm_failed_slot_taken: 'слот зайнято',
  client_updated: 'змінив клієнт', client_deleted: 'видалив клієнт',
  admin_updated: 'змінив власник', admin_deleted: 'видалив власник',
};

export default function AdminClient() {
  const [tab, setTab] = useState('bookings');
  const [status, setStatus] = useState('');
  const [items, setItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    if (tab === 'bookings') {
      const r = await fetch(`/api/admin/bookings?status=${status}`);
      if (r.ok) setItems((await r.json()).bookings);
    } else {
      const r = await fetch('/api/admin/logs');
      if (r.ok) setLogs((await r.json()).logs);
    }
  }, [tab, status]);

  useEffect(() => { load(); }, [load]);

  async function patch(id, body) {
    const r = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    const d = await r.json().catch(() => ({}));
    if (r.ok) { setItems((x) => x.map((b) => (b.id === id ? d.booking : b))); setEditing(null); return {}; }
    return { error: d.error || T.error, errors: d.errors };
  }

  async function remove(id) {
    if (!confirm(T.deleteConfirm)) return;
    const r = await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
    if (r.ok) setItems((x) => x.filter((b) => b.id !== id));
  }

  return (
    <main>
      <div className="admin-head">
        <h1>{T.adminTitle}</h1>
        {tab === 'bookings' && <span className="admin-count">{items.length}</span>}
      </div>
      <div className="tabs">
        <button className={`btn sm ${tab === 'bookings' ? '' : 'ghost'}`} onClick={() => setTab('bookings')}>{T.tabBookings}</button>
        <button className={`btn sm ${tab === 'logs' ? '' : 'ghost'}`} onClick={() => setTab('logs')}>{T.tabLogs}</button>
        {tab === 'bookings' && (
          <select className="filter" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">{T.all}</option>
            {Object.entries(config.statuses).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
          </select>
        )}
      </div>

      {tab === 'bookings' ? (
        <div className="card scroll">
          {!items.length ? <p className="muted">{T.empty}</p> : (
            <table className="table">
              <thead><tr>{cols.map((f) => <th key={f.key}>{f.label}</th>)}<th>Статус</th><th /></tr></thead>
              <tbody>
                {items.map((b) => (
                  <Fragment key={b.id}>
                    <tr>
                      {cols.map((f) => <td key={f.key}>{displayValue(f, b[f.key])}</td>)}
                      <td>
                        <select value={b.status} onChange={(e) => patch(b.id, { status: e.target.value })}>
                          {Object.entries(config.statuses).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
                        </select>
                      </td>
                      <td className="nowrap">
                        <button className="btn ghost sm" onClick={() => setEditing(editing === b.id ? null : b.id)}>{T.edit}</button>{' '}
                        <button className="btn danger sm" onClick={() => remove(b.id)}>{T.delete}</button>
                      </td>
                    </tr>
                    {editing === b.id && (
                      <tr><td colSpan={cols.length + 2}>
                        <EditForm admin booking={b} onSave={(v) => patch(b.id, { values: v })} onCancel={() => setEditing(null)} />
                      </td></tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="card scroll">
          {!logs.length ? <p className="muted">{T.empty}</p> : (
            <table className="table">
              <thead><tr><th>Час</th><th>Хто</th><th>Дія</th><th>Деталі</th></tr></thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id}>
                    <td className="nowrap">{new Date(l.created_at).toLocaleString(config.brand.locale)}</td>
                    <td>{l.actor}</td>
                    <td>{ACTIONS[l.action] || l.action}</td>
                    <td className="mono">{JSON.stringify(l.details)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </main>
  );
}
