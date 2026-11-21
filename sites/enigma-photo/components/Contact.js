"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { photos, site } from "@/lib/site";
import { useOverlays } from "./Overlays";

export default function Contact() {
  const root = useRef(null);
  const { notify } = useOverlays();
  const c = site.contacts;
  const p = photos.tram;

  // Фото медленно приближается, пока карточка держится на месте.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".contact__photo img",
          { scale: 1.15 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
          }
        );
      });
    },
    { scope: root }
  );

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      notify(`${label} скопирован`);
    } catch {
      notify(text);
    }
  };

  const rows = [
    ["Почта", <a className="link" href={`mailto:${c.email}`}>{c.email}</a>],
    ["Instagram", <a className="link" href={c.instagram.href} target="_blank" rel="noopener">{c.instagram.handle}</a>],
    ["Telegram", <a className="link" href={c.telegram.href} target="_blank" rel="noopener">{c.telegram.handle}</a>],
    ["YouTube", <a className="link" href={c.youtube.href} target="_blank" rel="noopener">{c.youtube.handle}</a>],
    ["Где", c.address.join(" ")],
  ];

  return (
    <section id="contact" className="contact" ref={root} data-section aria-labelledby="contact-title">
      <div className="contact__photo">
        <img src={p.src} width={p.w} height={p.h} alt={p.alt} loading="lazy" decoding="async" />
      </div>
      <div className="contact__info">
        <h2 id="contact-title" className="head" data-reveal="lines">
          Записаться
        </h2>
        <p className="contact__lead" data-reveal>
          Напишите боту: он покажет свободные даты и пришлёт расчёт. Или просто позвоните.
        </p>
        <div className="contact__phone" data-reveal>
          <a href={c.phoneHref}>{c.phone}</a>
          <button className="text-btn" onClick={() => copy(c.phone, "Номер")}>
            Копировать
          </button>
        </div>
        <a className="btn btn--tall contact__btn" href={c.bot.href} target="_blank" rel="noopener" data-reveal>
          Открыть Telegram-бота
        </a>
        <dl className="contact__rows" data-reveal="rows">
          {rows.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          <div>
            <dt>Часы</dt>
            <dd className="contact__hours">
              {c.hours.map(([d, t]) => (
                <span key={d}>
                  <span>{d}</span>
                  <span className="tabular">{t}</span>
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
