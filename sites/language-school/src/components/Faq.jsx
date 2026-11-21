'use client';

import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useContent } from './ContentProvider';

export default function Faq() {
  const { faq } = useContent();
  const root = useRef(null);
  const [open, setOpen] = useState(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(q('.faq__title'), { y: 30, autoAlpha: 0, scrollTrigger: { trigger: root.current, start: 'top 75%' } });
        // Карточки «вкладываются» в картотеку одна за другой.
        gsap.from(q('.card'), {
          y: 120,
          rotate: (i) => (i % 2 ? 3 : -3),
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.09,
          scrollTrigger: { trigger: q('.cards')[0], start: 'top 80%' },
        });
      });
    },
    { scope: root }
  );

  const toggle = (i) => {
    setOpen((v) => (v === i ? -1 : i));
    // Высота страницы изменилась — пересчитаем триггеры ниже.
    setTimeout(() => ScrollTrigger.refresh(), 450);
  };

  return (
    <section ref={root} id="voprosy" className="faq" aria-labelledby="faq-title">
      <h2 id="faq-title" className="h2 faq__title">
        Вопросы перед вылетом
      </h2>
      <div className="cards">
        {faq.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.tab} className={`card card--${i % 3} ${isOpen ? 'is-open' : ''}`} style={{ '--i': i }}>
              <h3 className="card__h">
                <button
                  type="button"
                  className="card__btn"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  id={`faq-q-${i}`}
                  onClick={() => toggle(i)}
                >
                  <span className="card__tab">{f.tab}</span>
                  <span className="card__q">{f.q}</span>
                  <span className="card__icon" aria-hidden="true" />
                </button>
              </h3>
              <div className="card__panel" id={`faq-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                <div>
                  <p className="card__a">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
