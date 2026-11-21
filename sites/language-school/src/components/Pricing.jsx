'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { botLink as link } from '@/data/site';
import { useContent } from './ContentProvider';

const fmt = (n) => n.toLocaleString('ru-RU').replace(/\s/g, ' ');

export default function Pricing() {
  const { site, plans } = useContent();
  const botLink = (start) => link(site.bot, start);
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        q('.plan').forEach((plan, i) => {
          const price = plan.querySelector('.plan__num');
          const target = +price.dataset.value;
          const counter = { v: Math.round(target * 0.4) };
          const tl = gsap.timeline({ scrollTrigger: { trigger: plan, start: 'top 70%' } });
          tl.from(plan.querySelectorAll('.plan__name, .plan__who, .plan__inc'), {
            y: 30,
            autoAlpha: 0,
            stagger: 0.08,
            delay: i * 0.1,
          })
            .to(
              counter,
              {
                v: target,
                duration: 1.4,
                ease: 'out',
                onUpdate: () => (price.textContent = fmt(Math.round(counter.v / 100) * 100)),
              },
              0.1
            )
            .from(plan.querySelectorAll('.plan__price, .plan__per'), { yPercent: 40, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.1)
            .from(plan.querySelector('.btn'), { scale: 0.9, autoAlpha: 0, duration: 0.6 }, 0.5);
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="ceny" className="pricing" aria-label="Цены">
      {plans.map((p) => (
        <article key={p.id} className={`plan plan--${p.id}`} aria-labelledby={`plan-${p.id}`}>
          <h2 id={`plan-${p.id}`} className="plan__name">
            {p.name}
          </h2>
          <p className="plan__who">{p.who}</p>
          <p className="plan__inc">{p.includes}</p>
          <div className="plan__bottom">
            <p className="plan__price">
              <span className="plan__num" data-value={p.price}>
                {fmt(p.price)}
              </span>
              <span className="plan__cur">{site.currency}</span>
            </p>
            <p className="plan__per">{p.period}</p>
            <a className="btn" href={botLink(p.start)} target="_blank" rel="noreferrer">
              {p.action}
            </a>
          </div>
        </article>
      ))}
    </section>
  );
}
