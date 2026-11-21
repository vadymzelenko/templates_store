'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { botLink as link, phoneHref, mapHref } from '@/data/site';
import { useContent } from './ContentProvider';
import { IconArrow } from './Icons';

export default function Contact() {
  const { site, photos } = useContent();
  const botLink = (start) => link(site.bot, start);
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(q('.row__text'), {
          yPercent: 100,
          duration: 0.9,
          stagger: 0.07,
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        });
        gsap.from(q('.row__photo'), {
          scale: 0,
          rotate: -40,
          duration: 1,
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        });
        gsap.from(q('.row__go'), {
          scale: 0,
          duration: 0.8,
          ease: 'back.out(1.8)',
          scrollTrigger: { trigger: q('.row--hello')[0], start: 'top 90%' },
        });
      });
    },
    { scope: root }
  );

  const rows = [
    { text: site.address.school },
    { text: site.address.street, href: mapHref(site.address), label: 'Открыть на карте' },
    { text: site.address.city },
    { text: `${site.hours.days}, ${site.hours.time}` },
    { text: site.phone, href: phoneHref(site.phone), label: 'Позвонить' },
    { text: 'Instagram', href: site.instagram, label: 'Открыть Instagram', ext: true },
    { text: 'Telegram-канал', href: site.telegram, label: 'Открыть Telegram-канал', ext: true },
  ];

  return (
    <section ref={root} id="kontakty" className="contact" aria-labelledby="contact-title">
      <h2 id="contact-title" className="sr-only">
        Контакты
      </h2>
      <address className="rows">
        {rows.map((r, i) =>
          r.href ? (
            <a
              key={i}
              className="row row--link"
              href={r.href}
              {...(r.ext ? { target: '_blank', rel: 'noreferrer' } : {})}
              aria-label={`${r.text}. ${r.label}`}
            >
              <span className="row__mask">
                <span className="row__text">{r.text}</span>
              </span>
              <IconArrow className="row__arrow" />
            </a>
          ) : (
            <div key={i} className="row">
              <p className="row__mask">
                <span className="row__text">{r.text}</span>
              </p>
              {i === 0 && (
                <img className="row__photo" src={photos.bench.src} alt={photos.bench.alt} width="160" height="160" loading="lazy" />
              )}
            </div>
          )
        )}
        <div className="row row--hello">
          <p className="row__mask">
            <span className="row__text">Привет!</span>
          </p>
          <a className="row__go" href={botLink('site_contact')} target="_blank" rel="noreferrer" aria-label="Написать в Telegram-бот">
            <IconArrow />
          </a>
        </div>
      </address>
    </section>
  );
}
