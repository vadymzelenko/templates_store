"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { site, sheet, services } from "@/lib/site";
import Photo from "./Photo";
import { useOverlays } from "./Overlays";
import { scrollToHash, useLenis } from "./Motion";

const frames = sheet.flatMap((run) => run.frames.map((name, i) => ({ name, title: i === 0 ? run.title : null })));
const allNames = frames.map((f) => f.name);

export default function Hero() {
  const { openLightbox } = useOverlays();
  const lenis = useLenis();
  const sheetRef = useRef(null);

  const jump = (e, href) => {
    e.preventDefault();
    scrollToHash(lenis.current, href);
  };

  // Колонки контактного листа плывут с разной скоростью — лист «дышит» при прокрутке.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        gsap.utils.toArray(".sheet__cell", sheetRef.current).forEach((cell, i) => {
          const speed = [0, -60, -20, -90, -35, -70, -10][i % 7];
          gsap.to(cell, {
            y: speed,
            ease: "none",
            scrollTrigger: { trigger: sheetRef.current, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      });
    },
    { scope: sheetRef }
  );

  return (
    <section id="top" className="hero" data-section data-start="top bottom">
      <div className="hero__head">
        <p className="hero__avail" data-reveal>
          <span className="live-dot" aria-hidden="true" />
          {site.availability}
        </p>
        <h1 className="display" data-reveal="lines">
          Фотограф в Киеве и&nbsp;Днепре
        </h1>
        <div className="hero__lead">
          <p className="lead" data-reveal>
            Портреты, love story, семьи и свадьбы. Снимаю спокойно, без дежурных поз — кадры проявляются сами.
          </p>
          <div className="hero__actions" data-reveal>
            <a className="btn" href={site.contacts.bot.href} target="_blank" rel="noopener">
              Записаться в Telegram-боте
            </a>
            <a className="hero__more" href="#work" onClick={(e) => jump(e, "#work")}>
              Смотреть портфолио <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>

      <div className="hero__meta" data-reveal="rows">
        <p>
          {site.cities}
          <span className="hero__extra"> · выезд по Украине</span>
        </p>
        <p className="hero__formats">{services.length} форматов съёмки — от портрета до свадьбы</p>
        <p className="hero__social">
          <a className="link" href={site.contacts.instagram.href} target="_blank" rel="noopener">
            Instagram
          </a>
          <a className="link" href={site.contacts.telegram.href} target="_blank" rel="noopener">
            Telegram
          </a>
        </p>
      </div>

      <div className="sheet" ref={sheetRef} aria-label="Контактный лист: избранные кадры">
        {frames.map((f, i) => (
          <div className="sheet__cell" key={f.name}>
            <p className="sheet__title">{f.title || " "}</p>
            <button className="sheet__frame" onClick={() => openLightbox(allNames, i)}>
              <Photo name={f.name} priority={i < 7} sizes="(min-width: 768px) 14vw, 50vw" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
