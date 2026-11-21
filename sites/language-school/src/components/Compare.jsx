'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useContent } from './ContentProvider';

export default function Compare() {
  const { compare } = useContent();
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: q('.cmp')[0], start: 'top 70%' } });
        tl.from(q('.cmp__cell--featured'), {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.5,
          stagger: 0.06,
          ease: 'inOut',
        })
          .from(q('.cmp__row'), { autoAlpha: 0, y: 18, stagger: 0.06, duration: 0.6 }, 0.1);
        gsap.from(q('.compare__title'), {
          y: 30,
          autoAlpha: 0,
          scrollTrigger: { trigger: root.current, start: 'top 75%' },
        });
      });
    },
    { scope: root }
  );

  const cols = compare.columns;

  return (
    <section ref={root} className="compare" aria-labelledby="compare-title">
      <h2 id="compare-title" className="h2 compare__title">
        Сравните сами
      </h2>
      <div className="cmp" role="table" aria-label="Вылет, обычные курсы и репетитор">
        <div className="cmp__row cmp__row--head" role="row">
          <span className="cmp__cell cmp__name" role="columnheader">
            <span className="sr-only">Что сравниваем</span>
          </span>
          {cols.map((c, i) => (
            <span
              key={c}
              role="columnheader"
              className={`cmp__cell cmp__col ${i === compare.featured ? 'cmp__cell--featured' : ''}`}
            >
              {c}
            </span>
          ))}
        </div>
        {compare.rows.map(([name, ...answers]) => (
          <div className="cmp__row" role="row" key={name}>
            <span className="cmp__cell cmp__name" role="rowheader">
              {name}
            </span>
            {answers.map((a, i) => (
              <span
                key={i}
                role="cell"
                data-col={cols[i]}
                className={`cmp__cell ${i === compare.featured ? 'cmp__cell--featured' : ''}`}
              >
                <span className="cmp__mlabel" aria-hidden="true">
                  {cols[i]}
                </span>
                {a}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
