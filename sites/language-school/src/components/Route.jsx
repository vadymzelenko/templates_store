'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { botLink as link } from '@/data/site';
import { useContent } from './ContentProvider';
import { IconPlane, IconTelegram } from './Icons';

if (typeof window !== 'undefined') gsap.registerPlugin(MotionPathPlugin, DrawSVGPlugin);

// Траектория полёта: три «аэропорта» — три шага записи.
const PATH = 'M40 190 C 220 190, 260 70, 400 70 S 640 210, 800 190 S 1040 60, 1160 70';
const STOPS = [0.2, 0.55, 1];

export default function Route() {
  const { site, steps, route } = useContent();
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const path = q('.flight__progress')[0];
      const stepsEls = q('.route__step');
      const dots = q('.flight__stop');
      const light = (p) =>
        STOPS.forEach((s, i) => {
          const on = p >= s - 0.02;
          stepsEls[i]?.classList.toggle('is-on', on);
          dots[i]?.classList.toggle('is-on', on);
        });

      // Точки остановок — ровно на траектории.
      const raw = MotionPathPlugin.getRawPath(path);
      MotionPathPlugin.cacheRawPathMeasurements(raw);
      dots.forEach((d, i) => {
        const pt = MotionPathPlugin.getPositionOnPath(raw, STOPS[i]);
        d.setAttribute('cx', pt.x);
        d.setAttribute('cy', pt.y);
      });

      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          wide: '(min-width: 761px)',
        },
        (ctx) => {
          const { motion, wide } = ctx.conditions;
          gsap.from(q('.route__head > *'), {
            y: 30,
            autoAlpha: motion ? 0 : 1,
            stagger: 0.08,
            scrollTrigger: { trigger: root.current, start: 'top 70%' },
          });

          if (!motion) {
            light(1);
            return;
          }

          if (wide) {
            const tl = gsap.timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                trigger: q('.flight')[0],
                start: 'top 75%',
                end: 'bottom 35%',
                scrub: 0.8,
                onUpdate: (self) => light(self.progress),
              },
            });
            tl.fromTo(path, { drawSVG: '0%' }, { drawSVG: '100%' }, 0).to(
              q('.flight__plane')[0],
              {
                motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: true },
              },
              0
            );
          } else {
            // На телефоне — вертикальная линия, самолёт летит сверху вниз.
            const track = q('.route__steps')[0];
            gsap.timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                trigger: track,
                start: 'top 70%',
                end: 'bottom 55%',
                scrub: 0.6,
                onUpdate: (self) => light(self.progress),
              },
            })
              .fromTo(q('.route__fill'), { scaleY: 0 }, { scaleY: 1 }, 0)
              .fromTo(q('.route__plane'), { top: '0%' }, { top: '100%' }, 0);
          }
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} id="kak" className="route" aria-labelledby="route-title">
      <div className="route__head">
        <h2 id="route-title" className="h2">
          {route.title.split('\n').map((l, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {l}
            </span>
          ))}
        </h2>
        <p>{route.text}</p>
      </div>

      <div className="flight" aria-hidden="true">
        <svg viewBox="0 0 1200 260" className="flight__svg">
          <path d={PATH} className="flight__base" />
          <path d={PATH} className="flight__progress" />
          {STOPS.map((s, i) => (
            <circle key={i} className="flight__stop" r="13" cx="0" cy="0" />
          ))}
          <g className="flight__plane">
            <circle r="26" fill="#ff7a1f" />
            <IconPlane x="-14" y="-14" width="28" height="28" color="#050f16" />
          </g>
        </svg>
      </div>

      <ol className="route__steps">
        <span className="route__track" aria-hidden="true">
          <span className="route__fill" />
          <span className="route__plane">
            <IconPlane />
          </span>
        </span>
        {steps.map((s, i) => (
          <li key={i} className="route__step">
            <strong>{s.name}</strong>
            <span>{s.text}</span>
          </li>
        ))}
      </ol>

      <div className="route__cta">
        <a className="btn btn--light" href={link(site.bot, 'level_test')} target="_blank" rel="noreferrer">
          <IconTelegram />
          Пройти тест уровня
        </a>
        <span>15 минут, бесплатно, результат сразу</span>
      </div>
    </section>
  );
}
