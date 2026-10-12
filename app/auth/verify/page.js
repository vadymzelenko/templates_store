'use client';
// Токен гаситься POST-запитом з браузера, а не GET-переходом:
// поштові сканери посилань не "спалюють" magic link, бо не виконують JS.
import { useEffect, useRef, useState } from 'react';
import config from '@/engine.config';

const T = config.texts;

export default function VerifyPage() {
  const [msg, setMsg] = useState(T.verifying);
  const [failed, setFailed] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const token = new URLSearchParams(window.location.search).get('token');
    fetch('/api/auth/verify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }),
    })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (r.ok) window.location.replace(d.redirect || '/profile');
        else { setMsg(d.error || T.tokenInvalid); setFailed(true); }
      })
      .catch(() => { setMsg(T.error); setFailed(true); });
  }, []);

  return (
    <main className="card center verify">
      <p>{msg}</p>
      {failed && <a className="btn" href="/">←</a>}
    </main>
  );
}
