'use client';
import { useEffect, useState } from 'react';
import { problems, districts } from './data';

export default function Emergency() {
  const [p, setP] = useState(null);
  const [d, setD] = useState('');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [left, setLeft] = useState(0);
  const [err, setErr] = useState('');
  const prob = problems.find((x) => x.key === p);
  const eta = districts.find((x) => x[0] === d)?.[1];

  useEffect(() => {
    if (!sent) return;
    setLeft(eta * 60);
    const t = setInterval(() => setLeft((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, [sent, eta]);

  function call(e) {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length < 7) return setErr('Номер телефона, пожалуйста');
    if (!d) return setErr('Выберите район — скажем, когда приедем');
    setErr(''); setSent(true);
  }

  return (
    <>
      <section className="pl-what">
        <h2>Что случилось?</h2>
        <div className="pl-probs">
          {problems.map((x) => (
            <button key={x.key} type="button" aria-pressed={p === x.key} onClick={() => setP(x.key)}>{x.name}<small>{x.price}</small></button>
          ))}
        </div>
        {prob && (
          <div className="pl-now" aria-live="polite">
            <p className="pl-now-h">Пока мастер едет — сделайте это:</p>
            <ol>{prob.now.map((s) => <li key={s}>{s}</li>)}</ol>
          </div>
        )}
      </section>

      <form className="pl-call" onSubmit={call} noValidate>
        {sent ? (
          <div className="pl-sent" role="status">
            <p className="pl-sent-h">Мастер выезжает</p>
            <p className="pl-timer">{String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}</p>
            <p>Перезвоним на {phone} в течение 2 минут. {prob ? `Возьмём всё для: «${prob.name.toLowerCase()}».` : ''}</p>
            <p className="pl-small">Мастер позвонит, когда будет подъезжать.</p>
          </div>
        ) : (
          <>
            <p className="pl-call-h">Не можете говорить? Перезвоним сами</p>
            <div className="pl-dist">
              {districts.map(([n, m]) => <button key={n} type="button" aria-pressed={d === n} onClick={() => setD(n)}>{n}<small>~{m} мин</small></button>)}
            </div>
            <div className="pl-row">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+380 ваш номер" inputMode="tel" aria-label="Телефон" />
              <button className="pl-go">Перезвоните мне{eta ? ` · приедем за ~${eta} мин` : ''}</button>
            </div>
            {err && <p className="pl-err" role="alert">{err}</p>}
          </>
        )}
      </form>
    </>
  );
}
