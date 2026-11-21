'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP, reduced } from '@/lib/gsap';
import { languages, phoneHref } from '@/data/site';
import { useContent } from './ContentProvider';
import { IconArrow, IconPhone } from './Icons';

// Маска телефона: +7 (900) 123-45-67. Номера других стран остаются как ввели.
function formatPhone(value) {
  let d = value.replace(/\D/g, '');
  if (!d) return '';
  if (d[0] === '8') d = '7' + d.slice(1);
  if (d[0] !== '7') return '+' + d.slice(0, 15);
  d = d.slice(0, 11);
  const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
  let out = '+7';
  if (p[0]) out += ` (${p[0]}`;
  if (p[0].length === 3) out += ')';
  if (p[1]) out += ` ${p[1]}`;
  if (p[2]) out += `-${p[2]}`;
  if (p[3]) out += `-${p[3]}`;
  return out;
}

export default function Callback() {
  const { site } = useContent();
  const root = useRef(null);
  const [form, setForm] = useState({ name: '', phone: '', lang: '', time: '', comment: '', agree: false, website: '' });
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState('');

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(q('.cb__intro > *, .cb__form > *'), {
          y: 28,
          autoAlpha: 0,
          stagger: 0.06,
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        });
      });
    },
    { scope: root }
  );

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: k === 'phone' ? formatPhone(v) : v }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const digits = form.phone.replace(/\D/g, '');
    if (!form.name.trim()) return setError('Как к вам обращаться?');
    if (digits.length < 10) return setError('Проверьте номер телефона');
    if (!form.agree) return setError('Нужно согласие на обработку данных');
    setState('sending');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'site_callback' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Не получилось отправить');
      setState('done');
      if (!reduced()) {
        requestAnimationFrame(() =>
          gsap.from(root.current.querySelector('.cb__done'), { y: 30, autoAlpha: 0, scale: 0.97, duration: 0.7 })
        );
      }
    } catch (err) {
      setState('error');
      setError(`${err.message}. Позвоните нам: ${site.phone}`);
    }
  };

  return (
    <section ref={root} id="zayavka" className="cb" aria-labelledby="cb-title">
      <div className="cb__intro">
        <h2 id="cb-title" className="h2">
          Перезвоним <br />
          и подберём группу
        </h2>
        <p>
          Не пользуетесь Telegram или хотите обсудить всё голосом? Оставьте телефон, администратор позвонит в рабочее время ({site.hours.days},{' '}
          {site.hours.time}) и ответит на вопросы.
        </p>
        <a className="cb__phone" href={phoneHref(site.phone)}>
          <IconPhone />
          {site.phone}
        </a>
      </div>

      {state === 'done' ? (
        <div className="cb__done" role="status">
          <p className="cb__done-title">Заявка принята</p>
          <p>
            Спасибо, {form.name.trim()}! Перезвоним на номер {form.phone} в ближайшее рабочее время. Первый урок для вас бесплатный.
          </p>
          <button
            type="button"
            className="link link--strong"
            onClick={() => {
              setForm({ name: '', phone: '', lang: '', time: '', comment: '', agree: false, website: '' });
              setState('idle');
            }}
          >
            Отправить ещё одну заявку
          </button>
        </div>
      ) : (
        <form className="cb__form" onSubmit={submit} noValidate>
          <div className="cb__row">
            <label className="cb__field">
              <span className="field__label">Имя</span>
              <input className="input" name="name" autoComplete="name" maxLength={60} value={form.name} onChange={set('name')} required />
            </label>
            <label className="cb__field">
              <span className="field__label">Телефон</span>
              <input
                className="input"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7 (___) ___-__-__"
                value={form.phone}
                onChange={set('phone')}
                required
              />
            </label>
          </div>
          <div className="cb__row">
            <label className="cb__field">
              <span className="field__label">Язык</span>
              <select className="input" name="lang" value={form.lang} onChange={set('lang')}>
                <option value="">Ещё не решили</option>
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="cb__field">
              <span className="field__label">Когда удобно позвонить</span>
              <select className="input" name="time" value={form.time} onChange={set('time')}>
                <option value="">В любое время</option>
                <option value="morning">Утром, до 12:00</option>
                <option value="day">Днём, 12:00–17:00</option>
                <option value="evening">Вечером, после 17:00</option>
              </select>
            </label>
          </div>
          <label className="cb__field">
            <span className="field__label">Комментарий, если нужен</span>
            <textarea
              className="input input--area"
              name="comment"
              rows={3}
              maxLength={500}
              placeholder="Например: ребёнку 9 лет, учил английский в школе"
              value={form.comment}
              onChange={set('comment')}
            />
          </label>
          {/* Ловушка для ботов: люди это поле не видят. */}
          <input className="cb__trap" tabIndex={-1} autoComplete="off" name="website" value={form.website} onChange={set('website')} aria-hidden="true" />
          <label className="cb__agree">
            <input type="checkbox" checked={form.agree} onChange={set('agree')} />
            <span>
              Согласен на обработку персональных данных по{' '}
              <a className="link link--strong" href="/privacy" target="_blank">
                политике конфиденциальности
              </a>
            </span>
          </label>
          <div className="cb__submit">
            <button className="btn" type="submit" disabled={state === 'sending'}>
              {state === 'sending' ? 'Отправляем…' : 'Жду звонка'}
              <IconArrow className="btn__arrow" />
            </button>
            <p className="cb__error" role="alert" aria-live="assertive">
              {error}
            </p>
          </div>
        </form>
      )}
    </section>
  );
}
