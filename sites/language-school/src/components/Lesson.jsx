'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useContent } from './ContentProvider';

const STAMP = 'первый урок бесплатно • ';

export default function Lesson() {
  const { lesson, photos } = useContent();
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%' } });
        tl.from(q('.lesson__title .lesson__line > span'), { yPercent: 110, duration: 1, stagger: 0.1 })
          .from(q('.lesson__text'), { y: 24, autoAlpha: 0 }, 0.3)
          .from(q('.lesson__photo'), { clipPath: 'inset(100% 0 0 0)', duration: 1.2, stagger: 0.15, ease: 'inOut' }, 0.1)
          .from(q('.lesson__photo img'), { scale: 1.25, duration: 1.8, stagger: 0.15, ease: 'soft' }, 0.1)
          .from(q('.stamp'), { scale: 0, rotate: -90, duration: 1, ease: 'back.out(1.6)' }, 0.8);

        // Цифры набираются от нуля, если это число.
        q('.fact').forEach((fact, i) => {
          const v = fact.querySelector('.fact__value');
          const m = v.textContent.match(/^(\d+)(.*)$/);
          const ft = gsap.timeline({ scrollTrigger: { trigger: fact, start: 'top 88%' } });
          ft.from(fact, { y: 30, autoAlpha: 0, duration: 0.8, delay: (i % 2) * 0.08 });
          if (m && +m[1] > 0) {
            const o = { n: 0 };
            ft.to(o, { n: +m[1], duration: 1.2, onUpdate: () => (v.textContent = Math.round(o.n) + m[2]) }, 0);
          }
        });

        // Фотографии двигаются с разной скоростью, штамп вращается при скролле.
        gsap.to(q('.lesson__photo--a'), {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
        gsap.to(q('.lesson__photo--b'), {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
        gsap.to(q('.stamp__ring'), {
          rotate: 220,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    },
    { scope: root }
  );

  const lines = lesson.title.split('\n');

  return (
    <section ref={root} className="lesson" aria-labelledby="lesson-title">
      <div className="lesson__copy">
        <h2 id="lesson-title" className="h2 lesson__title">
          {lines.map((l, i) => (
            <span key={i} className="lesson__line">
              <span>{l}</span>{' '}
            </span>
          ))}
        </h2>
        <p className="lesson__text">{lesson.text}</p>
        <ul className="lesson__facts">
          {lesson.facts.map((f, i) => (
            <li key={i} className="fact">
              <span className="fact__value">{f.value}</span>
              <span className="fact__label">{f.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="lesson__media">
        <figure className="lesson__photo lesson__photo--a">
          <img src={photos.skyline.src} alt={photos.skyline.alt} width="1200" height="800" loading="lazy" />
        </figure>
        <figure className="lesson__photo lesson__photo--b">
          <img src={photos.waterfront.src} alt={photos.waterfront.alt} width="1200" height="800" loading="lazy" />
        </figure>
        <div className="stamp" aria-hidden="true">
          <svg className="stamp__ring" viewBox="0 0 200 200">
            <defs>
              <path id="stamp-circle" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" />
            </defs>
            <circle cx="100" cy="100" r="98" fill="#050f16" />
            <text fill="#ff7a1f" fontSize="18" fontWeight="700">
              <textPath href="#stamp-circle" textLength="462" lengthAdjust="spacing">{STAMP.toUpperCase()}</textPath>
            </text>
          </svg>
          <span className="stamp__core">0&nbsp;₽</span>
        </div>
      </div>
    </section>
  );
}
