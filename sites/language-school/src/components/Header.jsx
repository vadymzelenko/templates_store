'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, reduced } from '@/lib/gsap';
import { nav, botLink as link, phoneHref } from '@/data/site';
import { useContent } from './ContentProvider';
import { IconTelegram, IconInstagram } from './Icons';

export default function Header() {
  const { site } = useContent();
  const botLink = (start) => link(site.bot, start);
  const header = useRef(null);
  const menu = useRef(null);
  const burger = useRef(null);
  const [open, setOpen] = useState(false);

  // Шапка уезжает при скролле вниз и возвращается при скролле вверх.
  useGSAP(() => {
    const el = header.current;
    const show = gsap.quickTo(el, 'yPercent', { duration: 0.45, ease: 'out' });
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate(self) {
        if (document.documentElement.classList.contains('menu-open')) return;
        const y = self.scroll();
        el.classList.toggle('is-scrolled', y > 40);
        if (y < 120 || self.direction === -1) show(0);
        else show(-110);
      },
    });
  });

  // Полноэкранное меню раскрывается кругом из кнопки, которой его открыли.
  useEffect(() => {
    const m = menu.current;
    const b = burger.current;
    if (!m || !b) return;
    const r = b.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const links = m.querySelectorAll('[data-menu-item]');
    document.documentElement.classList.toggle('menu-open', open);
    gsap.set(header.current, { yPercent: 0 });

    if (open) {
      m.hidden = false;
      if (reduced()) {
        gsap.set(m, { clipPath: 'none' });
        return;
      }
      gsap.fromTo(
        m,
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${radius}px at ${x}px ${y}px)`, duration: 0.7, ease: 'inOut' }
      );
      gsap.fromTo(
        links,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.8, stagger: 0.05, delay: 0.2, ease: 'out' }
      );
      const onKey = (e) => e.key === 'Escape' && setOpen(false);
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    } else if (!m.hidden) {
      gsap.to(m, {
        clipPath: `circle(0px at ${x}px ${y}px)`,
        duration: reduced() ? 0 : 0.5,
        ease: 'inOut',
        onComplete: () => (m.hidden = true),
      });
    }
  }, [open]);

  return (
    <>
      <header ref={header} className="hdr">
        <a className="hdr__mark" href="#top" aria-label={`${site.name}, на главную`}>
          Вылет
        </a>
        <nav className="hdr__nav" aria-label="Разделы">
          {nav.map((n) => (
            <a key={n.href} className="link" href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <a className="hdr__phone link" href={phoneHref(site.phone)}>
          {site.phone}
        </a>
        <a className="btn btn--sm hdr__cta" href={botLink('site_header')} target="_blank" rel="noreferrer">
          Записаться
        </a>
        <button
          ref={burger}
          className="hdr__burger"
          type="button"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="hdr__burger-lines" aria-hidden="true" />
          <span className="sr-only">{open ? 'Закрыть меню' : 'Открыть меню'}</span>
        </button>
      </header>

      <div ref={menu} id="menu" className="menu" hidden>
        <nav className="menu__nav" aria-label="Меню">
          {nav.map((n) => (
            <span className="menu__line" key={n.href}>
              <a data-menu-item className="menu__link" href={n.href} onClick={() => setOpen(false)}>
                {n.label}
              </a>
            </span>
          ))}
        </nav>
        <div className="menu__foot">
          <a className="menu__phone" href={phoneHref(site.phone)}>
            {site.phone}
          </a>
          <div className="menu__social">
            <a href={site.instagram} target="_blank" rel="noreferrer" className="round" aria-label="Instagram">
              <IconInstagram />
            </a>
            <a href={site.telegram} target="_blank" rel="noreferrer" className="round" aria-label="Telegram-канал">
              <IconTelegram />
            </a>
          </div>
          <a className="btn btn--light" href={botLink('site_menu')} target="_blank" rel="noreferrer">
            Записаться в боте
          </a>
        </div>
      </div>
    </>
  );
}
