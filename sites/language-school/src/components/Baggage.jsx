'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useContent } from './ContentProvider';

const stickers = [
  { x: 44, y: 120, r: -12, w: 118, h: 54, fill: '#ffffff', ink: '#050f16', text: 'Hello', shape: 'rect' },
  { x: 196, y: 108, r: 9, w: 92, h: 92, fill: '#ff7a1f', ink: '#050f16', text: 'Hola', shape: 'circle' },
  { x: 60, y: 222, r: 6, w: 130, h: 50, fill: '#ff7a1f', ink: '#050f16', text: 'Cześć', shape: 'rect' },
  { x: 214, y: 236, r: -8, w: 104, h: 58, fill: '#ffffff', ink: '#050f16', text: 'Hallo', shape: 'rect' },
  { x: 120, y: 320, r: -4, w: 96, h: 96, fill: '#ffffff', ink: '#050f16', text: '你好', shape: 'circle' },
  { x: 242, y: 340, r: 12, w: 112, h: 46, fill: '#ff7a1f', ink: '#050f16', text: 'Salut', shape: 'rect' },
];

function Suitcase() {
  return (
    <svg className="suitcase" viewBox="0 0 380 480" role="img" aria-label="Чемодан, обклеенный стикерами с приветствиями на разных языках">
      <rect x="138" y="8" width="104" height="22" rx="11" fill="#050f16" />
      <rect x="150" y="22" width="16" height="44" fill="#050f16" />
      <rect x="214" y="22" width="16" height="44" fill="#050f16" />
      <rect x="10" y="60" width="360" height="400" rx="36" fill="#050f16" />
      <rect x="84" y="60" width="18" height="400" fill="#1b2a33" />
      <rect x="278" y="60" width="18" height="400" fill="#1b2a33" />
      <circle cx="70" cy="466" r="12" fill="#050f16" />
      <circle cx="310" cy="466" r="12" fill="#050f16" />
      {stickers.map((s, i) => (
        <g key={i} className="sticker" transform={`translate(${s.x} ${s.y}) rotate(${s.r})`}>
          {s.shape === 'circle' ? (
            <circle cx="0" cy="0" r={s.w / 2} fill={s.fill} />
          ) : (
            <rect x={-s.w / 2} y={-s.h / 2} width={s.w} height={s.h} rx="6" fill={s.fill} />
          )}
          <text
            x="0"
            y="1"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={s.ink}
            fontFamily="var(--font-display)"
            fontWeight="800"
            fontSize={s.text.length > 4 ? 22 : 26}
          >
            {s.text}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Baggage() {
  const { baggage } = useContent();
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        q('.bag__line').forEach((line, i) => {
          gsap.fromTo(
            line,
            { xPercent: i % 2 ? -4 : 3 },
            {
              xPercent: i % 2 ? 3 : -4,
              ease: 'none',
              scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
        });
        gsap.from(q('.suitcase'), {
          yPercent: 30,
          rotate: 14,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: 0.6 },
        });
        gsap.from(q('.sticker'), {
          scale: 0,
          transformOrigin: '50% 50%',
          duration: 0.6,
          stagger: 0.08,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: q('.suitcase')[0], start: 'top 60%' },
        });
        gsap.from(q('.bag__item'), {
          y: 28,
          autoAlpha: 0,
          stagger: 0.08,
          scrollTrigger: { trigger: q('.bag__list')[0], start: 'top 80%' },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="bag" aria-labelledby="bag-title">
      <div className="bag__stack">
        <p className="bag__line bag__line--muted" aria-hidden="true">
          Учебники
        </p>
        <h2 id="bag-title" className="bag__title">
          <span className="bag__line bag__line--ink">Багаж</span>
          <span className="bag__line bag__line--ink">включён</span>
        </h2>
        <p className="bag__line bag__line--muted" aria-hidden="true">
          без доплат
        </p>
        <Suitcase />
      </div>
      <dl className="bag__list">
        {baggage.map((b) => (
          <div key={b.title} className="bag__item">
            <dt>{b.title}</dt>
            <dd>{b.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
