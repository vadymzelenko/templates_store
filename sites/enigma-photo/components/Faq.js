"use client";

import { useRef } from "react";
import gsap from "gsap";
import { faq, facts, site } from "@/lib/site";
import Photo from "./Photo";

function Question({ q, a }) {
  const ref = useRef(null);
  const body = useRef(null);

  // Плавное раскрытие <details>: высота и прозрачность ответа, без рывка.
  const onClick = (e) => {
    const el = ref.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    e.preventDefault();
    if (el.open) {
      gsap.to(body.current, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
        onComplete: () => (el.open = false),
      });
    } else {
      el.open = true;
      gsap.fromTo(
        body.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.5, ease: "expo.out" }
      );
    }
  };

  return (
    <details className="qa" ref={ref}>
      <summary onClick={onClick}>
        {q}
        <span className="qa__chevron" aria-hidden="true" />
      </summary>
      <div className="qa__body" ref={body}>
        <p>{a}</p>
      </div>
    </details>
  );
}

export default function Faq() {
  return (
    <section id="faq" className="faq" data-section aria-labelledby="faq-title">
      <div className="faq__aside">
        <h2 id="faq-title" className="head" data-reveal="lines">
          Частые вопросы
        </h2>
        <dl className="faq__facts" data-reveal="rows">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <Photo name="daisies" className="faq__photo" />
        <div className="faq__actions" data-reveal>
          <a className="btn" href={site.contacts.telegram.href} target="_blank" rel="noopener">
            Задать свой вопрос
          </a>
          <a className="link" href={site.contacts.phoneHref}>
            {site.contacts.phone}
          </a>
        </div>
      </div>
      <div className="faq__list" data-reveal="rows">
        {faq.map((f) => (
          <Question key={f.q} {...f} />
        ))}
      </div>
    </section>
  );
}
