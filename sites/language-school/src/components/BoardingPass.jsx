'use client';

import { useMemo, useRef, useState } from 'react';
import { gsap, useGSAP, reduced } from '@/lib/gsap';
import { languages, botLink as link } from '@/data/site';
import { useContent } from './ContentProvider';
import FlapText from './FlapText';
import { IconTelegram } from './Icons';

const levels = [
  { id: 'a0', name: 'С нуля' },
  { id: 'a2', name: 'A1–A2' },
  { id: 'b1', name: 'B1' },
  { id: 'b2', name: 'B2 и выше' },
];
const formats = [
  { id: 'group', name: 'Группа', gate: 'Каб. 1–4', seat: 'место в группе до 6' },
  { id: 'solo', name: 'Один на один', gate: 'Каб. 5', seat: 'место у окна' },
  { id: 'online', name: 'Онлайн', gate: 'Zoom', seat: 'подключение из дома' },
];
const ages = [
  { id: 'adult', name: 'Взрослый' },
  { id: 'teen', name: 'Подросток' },
  { id: 'kid', name: 'Ребёнок 7–11' },
];

function hash(str) {
  let h = 2166136261;
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

// Штрихкод, который меняется вместе с билетом.
function Barcode({ seed, bars = 46 }) {
  let h = seed;
  let x = 0;
  const rects = [];
  for (let i = 0; i < bars; i++) {
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    const w = 1 + (h % 4);
    if (i % 2 === 0) rects.push(<rect key={i} x={x} y="0" width={w} height="40" />);
    x += w + 1;
  }
  return (
    <svg className="pass__barcode" viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" aria-hidden="true">
      <g fill="currentColor">{rects}</g>
    </svg>
  );
}

function Choice({ legend, options, value, onChange, name }) {
  return (
    <fieldset className="field">
      <legend className="field__label">{legend}</legend>
      <div className="chips">
        {options.map((o) => (
          <label key={o.id ?? o.code} className="chip">
            <input
              type="radio"
              name={name}
              value={o.id ?? o.code}
              checked={value === (o.id ?? o.code)}
              onChange={() => onChange(o.id ?? o.code)}
            />
            <span>{o.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function BoardingPass() {
  const { site } = useContent();
  const botLink = (start) => link(site.bot, start);
  const root = useRef(null);
  const [name, setName] = useState('');
  const [lang, setLang] = useState('en');
  const [level, setLevel] = useState('a0');
  const [format, setFormat] = useState('group');
  const [age, setAge] = useState('adult');
  const [toast, setToast] = useState(false);

  const l = languages.find((x) => x.code === lang);
  const f = formats.find((x) => x.id === format);
  const lv = levels.find((x) => x.id === level);
  const a = ages.find((x) => x.id === age);
  const start = `${lang}_${level}_${format}_${age}`;
  const seed = useMemo(() => hash(start + name), [start, name]);
  const flight = `${lang.toUpperCase()}-${(seed % 900) + 100}`;
  const passenger = name.trim() || 'Ваше имя';

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 65%' } });
        tl.from(q('.ticket__head > *'), { y: 30, autoAlpha: 0, stagger: 0.08 })
          .from(q('.field'), { y: 24, autoAlpha: 0, stagger: 0.07 }, 0.15)
          .from(q('.pass'), { yPercent: 40, rotate: 8, autoAlpha: 0, duration: 1.1 }, 0.2);
      });
    },
    { scope: root }
  );

  // Небольшая «встряска» билета при каждом изменении.
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.fromTo(root.current.querySelector('.pass__main'), { rotate: -0.6 }, { rotate: 0, duration: 0.5, ease: 'out' });
    },
    { dependencies: [lang, level, format, age], scope: root }
  );

  const send = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3200);
    if (reduced()) return;
    const stub = root.current.querySelector('.pass__stub');
    gsap
      .timeline()
      .to(stub, { rotate: 10, x: 30, y: 50, autoAlpha: 0, duration: 0.6, ease: 'inOut', transformOrigin: '0% 0%' })
      .set(stub, { rotate: 0, x: 0, y: -20 }, 1.2)
      .to(stub, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'out' });
  };

  return (
    <section ref={root} id="bilet" className="ticket" aria-labelledby="ticket-title">
      <div className="ticket__head">
        <h2 id="ticket-title" className="h2">
          Соберите свой билет
        </h2>
        <p>Выберите язык, уровень и формат. Бот получит заявку уже заполненной и предложит группу по времени.</p>
      </div>

      <div className="ticket__grid">
        <form className="ticket__form" onSubmit={(e) => e.preventDefault()}>
          <div className="field">
            <label className="field__label" htmlFor="pass-name">
              Имя пассажира
            </label>
            <input
              id="pass-name"
              className="input"
              type="text"
              maxLength={22}
              autoComplete="given-name"
              placeholder="Например, Анна"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Choice legend="Язык" name="lang" options={languages} value={lang} onChange={setLang} />
          <Choice legend="Уровень" name="level" options={levels} value={level} onChange={setLevel} />
          <Choice legend="Формат" name="format" options={formats} value={format} onChange={setFormat} />
          <Choice legend="Кто учится" name="age" options={ages} value={age} onChange={setAge} />
        </form>

        <div className="ticket__side">
          <article className="pass" aria-label="Ваш посадочный талон">
            <div className="pass__main">
              <div className="pass__top">
                <span className="pass__brand">Вылет</span>
                <span>Посадочный талон</span>
              </div>
              <div className="pass__route">
                <div>
                  <span className="pass__k">Откуда</span>
                  <span className="pass__iata">RUS</span>
                  <span className="pass__v">Русский</span>
                </div>
                <svg className="pass__plane" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M21 15.5v-2l-8-5V3.3c0-.8-.7-1.5-1.5-1.5S10 2.5 10 3.3v5.2l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5l8 2.5Z" transform="rotate(90 12 12)" />
                </svg>
                <div className="pass__to">
                  <span className="pass__k">Куда</span>
                  <FlapText className="pass__iata" text={l.iata} length={3} />
                  <span className="pass__v" lang={l.code}>
                    {l.native}
                  </span>
                </div>
              </div>
              <dl className="pass__info">
                <div>
                  <dt>Пассажир</dt>
                  <dd>{passenger}</dd>
                </div>
                <div>
                  <dt>Рейс</dt>
                  <dd>{flight}</dd>
                </div>
                <div>
                  <dt>Уровень</dt>
                  <dd>{lv.name}</dd>
                </div>
                <div>
                  <dt>Класс</dt>
                  <dd>{f.name}</dd>
                </div>
                <div>
                  <dt>Выход</dt>
                  <dd>{f.gate}</dd>
                </div>
                <div>
                  <dt>Категория</dt>
                  <dd>{a.name}</dd>
                </div>
              </dl>
              <p className="pass__note">Посадка: первый урок бесплатно, {f.seat}.</p>
            </div>
            <div className="pass__stub" aria-hidden="true">
              <span className="pass__k">Рейс</span>
              <span className="pass__stub-flight">{flight}</span>
              <span className="pass__k">Направление</span>
              <span className="pass__stub-city">{l.city}</span>
              <Barcode seed={seed} />
            </div>
          </article>

          <a className="btn btn--wide" href={botLink(start)} target="_blank" rel="noreferrer" onClick={send}>
            <IconTelegram />
            Отправить билет в бот
          </a>
          <p className="ticket__alt">
            Нет Telegram?{' '}
            <a className="link link--strong" href="#zayavka">
              Оставьте телефон
            </a>
            , и мы перезвоним.
          </p>
        </div>
      </div>

      <div className={`toast ${toast ? 'is-on' : ''}`} role="status" aria-live="polite">
        <IconTelegram /> Открываем @{site.bot}, нажмите «Запустить»
      </div>
    </section>
  );
}
