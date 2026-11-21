"use client";

import { useState } from "react";
import { services, photos, site } from "@/lib/site";

export default function Services() {
  // Превью справа всегда занято кадром: по умолчанию первая съёмка, при наведении — текущая.
  const [active, setActive] = useState(services[0].id);
  const [hovering, setHovering] = useState(false);

  return (
    <section id="services" className="services" data-section aria-labelledby="services-title">
      <h2 id="services-title" className="head" data-reveal="lines">
        Съёмки
      </h2>
      <p className="services__sub" data-reveal>
        Выберите формат — бот сразу подскажет свободные даты.
      </p>

      <div className="index" onMouseLeave={() => setHovering(false)}>
        <ul className="index__list" data-reveal="rows">
          {services.map((s) => (
            <li key={s.id}>
              <a
                className={`index__row ${hovering && active !== s.id ? "is-dim" : ""}`}
                href={`${site.contacts.bot.href}?start=${s.id}`}
                target="_blank"
                rel="noopener"
                onMouseEnter={() => {
                  setActive(s.id);
                  setHovering(true);
                }}
                onFocus={() => setActive(s.id)}
              >
                <span className="index__name">{s.name}</span>
                <span className="index__cell">{s.who}</span>
                <span className="index__cell">{s.where}</span>
                <span className="index__cell index__time tabular">{s.time}</span>
                <img
                  className="index__thumb"
                  src={photos[s.photo].src}
                  width={photos[s.photo].w}
                  height={photos[s.photo].h}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </li>
          ))}
        </ul>
        <div className="index__frame" aria-hidden="true">
          {services.map((s) => (
            <img
              key={s.id}
              src={photos[s.photo].src}
              alt=""
              loading="lazy"
              className={active === s.id ? "is-on" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
