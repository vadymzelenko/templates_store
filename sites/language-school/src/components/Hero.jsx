'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, SplitText, useGSAP, reduced } from '@/lib/gsap';
import { languages, botLink as link } from '@/data/site';
import { useContent } from './ContentProvider';
import Skyline from './Skyline';
import FlapText from './FlapText';
import { IconArrow } from './Icons';

const HOLD = 5200;

export default function Hero() {
  const { site, hero } = useContent();
  const botLink = (start) => link(site.bot, start);
  const root = useRef(null);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const current = languages[index];

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(q('.hero__title'), { type: 'lines', mask: 'lines', linesClass: 'hero__line' });
        const word = q('.hero__word span');

        const tl = gsap.timeline({ delay: 0.15, onComplete: () => setReady(true) });
        tl.set(q('[data-hero]'), { autoAlpha: 1 })
          .from(q('.window__frame'), { scale: 0.86, rotate: -4, duration: 1.2, ease: 'out' }, 0)
          .to(q('.window__shade'), { yPercent: -100, duration: 1.3, ease: 'inOut' }, 0.45)
          .from(q('.window__view'), { scale: 1.25, duration: 1.8, ease: 'soft' }, 0.45)
          .from(split.lines, { yPercent: 110, duration: 1, stagger: 0.1 }, 0.2)
          .from(q('.hero__lead, .hero__actions, .window__caption'), { y: 24, autoAlpha: 0, stagger: 0.09 }, 0.55)
          .from(word, { yPercent: 105, duration: 1.1, stagger: 0.06, ease: 'out' }, 0.35);

        // Огромное слово «Вылет» уходит вниз и расползается при скролле.
        gsap.to(q('.hero__word'), {
          yPercent: 30,
          scaleY: 1.25,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to(q('.window'), {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });

        // Облака медленно плывут.
        gsap.utils.toArray(q('.cloud')).forEach((c, i) => {
          gsap.to(c, { x: i % 2 ? -26 : 30, duration: 7 + (i % 3), repeat: -1, yoyo: true, ease: 'sine.inOut' });
        });

        // Иллюминатор слегка поворачивается за курсором.
        const frame = q('.window__frame')[0];
        const rx = gsap.quickTo(frame, 'rotationY', { duration: 0.8 });
        const ry = gsap.quickTo(frame, 'rotationX', { duration: 0.8 });
        const move = (e) => {
          if (e.pointerType !== 'mouse') return;
          rx((e.clientX / innerWidth - 0.5) * 10);
          ry((e.clientY / innerHeight - 0.5) * -8);
        };
        window.addEventListener('pointermove', move);
        return () => {
          window.removeEventListener('pointermove', move);
          split.revert();
        };
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(q('[data-hero]'), { autoAlpha: 1 });
        gsap.set(q('.window__shade'), { yPercent: -100 });
        setReady(true);
      });
    },
    { scope: root }
  );

  // Медленная смена видов за окном; пауза, когда вкладка скрыта.
  useEffect(() => {
    if (!ready || reduced()) return;
    let timer;
    const tick = () => {
      timer = setTimeout(() => {
        if (!document.hidden) setIndex((i) => (i + 1) % languages.length);
        tick();
      }, HOLD);
    };
    tick();
    return () => clearTimeout(timer);
  }, [ready]);

  useEffect(() => {
    const views = root.current?.querySelectorAll('.window__scene');
    if (!views) return;
    views.forEach((v, i) => {
      gsap.to(v, { autoAlpha: i === index ? 1 : 0, scale: i === index ? 1 : 1.06, duration: 1.6, ease: 'soft' });
    });
  }, [index]);

  return (
    <section ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero__grid">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title" data-hero>
            {hero.title.split('\n').map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>
          <p className="hero__lead" data-hero>
            {hero.lead}
          </p>
          <div className="hero__actions" data-hero>
            <a className="btn" href={botLink('site_hero')} target="_blank" rel="noreferrer">
              Записаться в боте
              <IconArrow className="btn__arrow" />
            </a>
            <a className="link link--strong" href="#tablo">
              Расписание групп
            </a>
          </div>
        </div>

        <figure className="window" data-hero>
          <div className="window__frame">
            <div className="window__view">
              {languages.map((l, i) => (
                <div key={l.code} className="window__scene" style={{ opacity: i === 0 ? 1 : 0 }} aria-hidden={i !== index}>
                  <Skyline code={l.code} />
                </div>
              ))}
              <div className="window__shade" aria-hidden="true">
                <span />
              </div>
            </div>
          </div>
          <figcaption className="window__caption">
            <span>За окном</span>
            <FlapText className="flap--hero" text={current.city} length={7} />
            <span className="window__hello" lang={current.code}>
              {current.hello}!
            </span>
          </figcaption>
        </figure>
      </div>

      <div className="hero__word" aria-hidden="true">
        {Array.from('Вылет').map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
    </section>
  );
}
