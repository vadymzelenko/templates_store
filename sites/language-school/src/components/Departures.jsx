'use client';

import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Flip } from 'gsap/Flip';
import { languages, statusText, botLink as link, GROUP_SIZE } from '@/data/site';
import { useContent } from './ContentProvider';
import FlapText from './FlapText';
import { IconArrow, IconTelegram } from './Icons';

if (typeof window !== 'undefined') gsap.registerPlugin(Flip);

// Свободные места — оранжевые клетки, занятые — тёмные.
function Seats({ free }) {
  const n = Math.max(0, Math.min(GROUP_SIZE, Number(free) || 0));
  return (
    <span className="seats" aria-hidden="true">
      {Array.from({ length: GROUP_SIZE }, (_, i) => (
        <span key={i} className={i < GROUP_SIZE - n ? 'seats__taken' : 'seats__free'} />
      ))}
    </span>
  );
}

export default function Departures() {
  const { site, flights } = useContent();
  const botLink = (start) => link(site.bot, start);
  const root = useRef(null);
  const [play, setPlay] = useState(false);
  const [filter, setFilter] = useState('all');
  const flipState = useRef(null);

  const used = new Set(flights.map((f) => f.lang));
  const filters = [
    { code: 'all', name: 'Все', count: flights.length },
    ...languages.filter((l) => used.has(l.code)).map((l) => ({ ...l, count: flights.filter((f) => f.lang === l.code).length })),
  ];

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      ScrollTrigger.create({
        trigger: q('.board')[0],
        start: 'top 80%',
        once: true,
        onEnter: () => setPlay(true),
      });
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(q('.tablo__head > *'), {
          y: 32,
          autoAlpha: 0,
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        });
        gsap.from(q('.board__row'), {
          autoAlpha: 0,
          y: 24,
          stagger: 0.05,
          duration: 0.7,
          clearProps: 'all',
          scrollTrigger: { trigger: q('.board')[0], start: 'top 80%' },
        });
        gsap.from(q('.tablo__more > *'), {
          y: 24,
          autoAlpha: 0,
          stagger: 0.08,
          scrollTrigger: { trigger: q('.tablo__more')[0], start: 'top 90%' },
        });
      });
    },
    { scope: root }
  );

  // Плавная перестановка строк при смене фильтра.
  useGSAP(
    () => {
      if (!flipState.current) return;
      Flip.from(flipState.current, {
        duration: 0.55,
        ease: 'out',
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.04 }),
      });
      flipState.current = null;
      ScrollTrigger.refresh();
    },
    { dependencies: [filter], scope: root }
  );

  const choose = (code) => {
    if (code === filter) return;
    flipState.current = Flip.getState(root.current.querySelectorAll('.board__row'));
    setFilter(code);
  };

  return (
    <section ref={root} id="tablo" className="tablo" aria-labelledby="tablo-title">
      <div className="tablo__head">
        <h2 id="tablo-title" className="h2">
          Табло вылетов
        </h2>
        <p className="tablo__note">
          Ближайшие группы и свободные места. Выберите рейс, и бот забронирует место на бесплатный пробный урок.
        </p>
        <div className="chips chips--dark" role="group" aria-label="Фильтр по языку">
          {filters.map((f) => (
            <button key={f.code} type="button" className="chip" aria-pressed={filter === f.code} onClick={() => choose(f.code)}>
              {f.name}
              <span className="chip__count">{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="board">
        <div className="board__labels" aria-hidden="true">
          <span>Время</span>
          <span>Рейс</span>
          <span>Курс</span>
          <span>Направление</span>
          <span>Выход</span>
          <span>Места</span>
          <span />
        </div>
        <ul className="board__list">
          {flights.map((f, i) => {
            const hidden = filter !== 'all' && f.lang !== filter;
            const status = statusText(f);
            return (
              <li key={`${f.code}-${i}`} className="board__row" hidden={hidden} data-status={f.status}>
                <span className="board__time">
                  <FlapText text={f.time} play={play} delay={i * 80} />
                  <small>{f.days}</small>
                </span>
                <span className="board__code">
                  <FlapText text={f.code} length={6} play={play} delay={i * 80 + 120} />
                </span>
                <span className="board__title">{f.title}</span>
                <span className="board__city">
                  <FlapText text={f.city} length={7} play={play} delay={i * 80 + 200} />
                </span>
                <span className="board__gate">{f.gate}</span>
                <span className="board__status">
                  <span className="board__status-text">{status}</span>
                  {f.status !== 'soon' && <Seats free={f.seats} />}
                </span>
                <a
                  className="board__book"
                  href={botLink(`flight_${f.code}`)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Записаться: ${f.title}, ${f.days} в ${f.time}`}
                >
                  Записаться
                  <IconArrow />
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="tablo__more">
        <p>
          Не нашли удобное время? Соберём группу под вас или подберём индивидуальное расписание.
        </p>
        <div className="tablo__more-actions">
          <a className="btn btn--light" href={botLink('flight_custom')} target="_blank" rel="noreferrer">
            <IconTelegram />
            Подобрать в боте
          </a>
          <a className="link link--strong" href="#zayavka">
            Оставить телефон
          </a>
        </div>
      </div>
    </section>
  );
}
