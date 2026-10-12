'use client';
import { useState } from 'react';
import Link from 'next/link';
import config from '@/engine.config';

const T = config.texts;

export default function LoginButtons({ loggedIn, isAdmin }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle');
  const [msg, setMsg] = useState('');

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  async function send(e) {
    e.preventDefault();
    setState('sending'); setMsg('');
    const r = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
    });
    const d = await r.json().catch(() => ({}));
    if (r.ok) setState('sent');
    else { setMsg(d.error || T.error); setState('idle'); }
  }

  if (loggedIn) {
    return (
      <nav className="nav">
        <Link className="btn ghost sm" href="/profile">{T.btnMyProfile}</Link>
        {isAdmin && <Link className="btn ghost sm" href="/admin">{T.btnAdmin}</Link>}
        <button className="btn ghost sm" onClick={logout}>{T.btnLogout}</button>
      </nav>
    );
  }

  return (
    <>
      <nav className="nav">
        <button className="btn ghost sm" onClick={() => setOpen(true)}>{T.btnRegistered}</button>
        <button className="btn sm" onClick={() => setOpen(true)}>{T.btnProfile}</button>
      </nav>
      {open && (
        <div className="modal-bg" onClick={() => setOpen(false)}>
          <div className="card modal" onClick={(e) => e.stopPropagation()}>
            {state === 'sent' ? (
              <div className="center">
                <h3>{T.loginSentTitle}</h3>
                <p>{T.loginSentText}</p>
              </div>
            ) : (
              <form onSubmit={send} noValidate>
                <h3>{T.loginTitle}</h3>
                <p className="muted">{T.loginText}</p>
                <div className="field">
                  <input type="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mail.com" />
                </div>
                {msg && <p className="msg">{msg}</p>}
                <button className="btn wide-btn" disabled={state === 'sending'}>{T.loginSend}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
