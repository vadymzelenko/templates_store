'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { nav, botLink as link, phoneHref, mapHref } from '@/data/site';
import { useContent } from './ContentProvider';

export default function Footer() {
  const { site, photos } = useContent();
  const botLink = (start) => link(site.bot, start);
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Подвал открывается из-под страницы, буквы названия поднимаются по очереди.
        const tl = gsap.timeline({
          scrollTrigger: { trigger: document.querySelector('.page'), start: 'bottom bottom', end: 'bottom 15%', scrub: 0.6 },
        });
        tl.from(q('.foot__word span'), { yPercent: 100, stagger: 0.08, ease: 'out' }, 0).from(
          q('.foot__cols > *'),
          { y: 40, autoAlpha: 0, stagger: 0.05 },
          0
        );
      });
    },
    { scope: root }
  );

  const credits = Object.values(photos)
    .map((p) => p.credit)
    .join(', ');

  return (
    <footer ref={root} className="foot">
      <div className="foot__cols">
        <div>
          <p className="foot__h">Адрес</p>
          <p>{site.address.street}</p>
          <p>{site.address.city}</p>
          <a className="link" href={mapHref(site.address)} target="_blank" rel="noreferrer">
            Открыть на карте
          </a>
        </div>
        <nav aria-label="Разделы в подвале">
          <p className="foot__h">Разделы</p>
          {nav.map((n) => (
            <a key={n.href} className="link" href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <div>
          <p className="foot__h">Мы в сети</p>
          <a className="link" href={site.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a className="link" href={site.telegram} target="_blank" rel="noreferrer">
            Telegram-канал
          </a>
          <a className="link" href={botLink('site_footer')} target="_blank" rel="noreferrer">
            Бот для записи
          </a>
        </div>
        <div>
          <p className="foot__h">Связаться</p>
          <a className="link" href={phoneHref(site.phone)}>
            {site.phone}
          </a>
          <a className="link" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <p>
            {site.hours.days}, {site.hours.time}
          </p>
        </div>
      </div>

      <div className="foot__word" role="img" aria-label={site.name}>
        {Array.from(site.name).map((c, i) => (
          <span key={i} aria-hidden="true">
            {c}
          </span>
        ))}
      </div>

      <p className="foot__legal">
        © {new Date().getFullYear()} {site.title}. Фото: {credits} (Unsplash). Иллюстрации городов нарисованы для сайта.
      </p>
    </footer>
  );
}
