"use client";

import { photos, site } from "@/lib/site";
import { scrollToHash, useLenis } from "./Motion";

const credits = [...new Set(Object.values(photos).map((p) => p.credit))].join(", ");

export default function Footer() {
  const lenis = useLenis();
  const c = site.contacts;

  const jump = (e, href) => {
    e.preventDefault();
    scrollToHash(lenis.current, href);
  };

  return (
    <footer className="footer" data-section data-start="top 90%">
      <div className="footer__cta">
        <p className="footer__eyebrow" data-reveal>
          <span className="live-dot" aria-hidden="true" />
          {site.availability}
        </p>
        <h2 className="footer__title" data-reveal="lines">
          Давайте снимем вашу историю
        </h2>
        <a className="btn btn--tall footer__btn" href={c.bot.href} target="_blank" rel="noopener" data-reveal>
          Записаться в Telegram-боте
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="footer__grid" data-reveal="rows">
        <div className="footer__col footer__about">
          <p className="footer__brand">{site.name}</p>
          <p>
            Фотограф, {site.cities}. Портреты, love story, семьи и свадьбы — спокойно и без дежурных поз.
          </p>
        </div>
        <nav className="footer__col" aria-label="Разделы">
          <p className="footer__label">Разделы</p>
          {site.nav.map((n) => (
            <a key={n.href} href={n.href} className="footer__link" onClick={(e) => jump(e, n.href)}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="footer__col">
          <p className="footer__label">Связаться</p>
          <a className="footer__link footer__phone" href={c.phoneHref}>
            {c.phone}
          </a>
          <a className="footer__link" href={`mailto:${c.email}`}>
            {c.email}
          </a>
          <a className="footer__link" href={c.bot.href} target="_blank" rel="noopener">
            Бот для записи
          </a>
        </div>
        <div className="footer__col">
          <p className="footer__label">Соцсети</p>
          {[c.instagram, c.telegram, c.youtube].map((s) => (
            <a key={s.label} className="footer__link" href={s.href} target="_blank" rel="noopener">
              {s.label}
              <span className="footer__arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
        <div className="footer__col">
          <p className="footer__label">Часы</p>
          {c.hours.map(([d, t]) => (
            <p key={d} className="footer__hours">
              <span>{d}</span>
              <span className="tabular">{t}</span>
            </p>
          ))}
        </div>
      </div>

      <p className="footer__mark" aria-hidden="true">
        {site.name}
      </p>

      <div className="footer__bottom">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="footer__credits">Фото: {credits} (Unsplash)</p>
        <a href="#top" className="footer__top text-btn" onClick={(e) => jump(e, "#top")}>
          Наверх ↑
        </a>
      </div>
    </footer>
  );
}
