'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { languages } from '@/data/site';
import { IconPlane } from './Icons';

const words = [...languages.map((l) => ({ text: l.hello, lang: l.code })), { text: 'Ciao', lang: 'it' }, { text: 'Привет', lang: 'ru' }];

function Row({ hidden }) {
  return (
    <div className="marquee__row" aria-hidden={hidden || undefined}>
      {words.map((w) => (
        <span key={w.text} className="marquee__item">
          <span lang={w.lang}>{w.text}</span>
          <IconPlane className="marquee__plane" />
        </span>
      ))}
    </div>
  );
}

// Бесконечная лента приветствий. Скорость и направление зависят от скролла.
export default function Marquee() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const track = root.current.querySelector('.marquee__track');
        const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
        loop.totalTime(28 * 100); // запас, чтобы лента могла крутиться назад
        const planes = root.current.querySelectorAll('.marquee__plane');
        let dir = 1;
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
          onUpdate(self) {
            const v = self.getVelocity();
            if (self.direction !== dir) {
              dir = self.direction;
              gsap.to(planes, { rotate: dir === 1 ? 0 : 180, duration: 0.5 });
            }
            gsap.to(loop, { timeScale: dir * Math.min(1 + Math.abs(v) / 400, 5), duration: 0.2, overwrite: true });
            gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.25, ease: 'out' });
          },
        });
        return () => st.kill();
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="marquee" aria-label="Привет на шести языках">
      <div className="marquee__track">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
