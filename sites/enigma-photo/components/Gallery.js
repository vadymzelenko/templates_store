"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { curtain, photos, site } from "@/lib/site";
import { useOverlays } from "./Overlays";

export default function Gallery() {
  const root = useRef(null);
  const { openLightbox } = useOverlays();
  const names = curtain.map((c) => c.photo);

  // Каждый следующий кадр наезжает «шторкой», а предыдущий уходит в темноту и чуть отдаляется.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray(".curtain__panel", root.current);
        panels.forEach((panel, i) => {
          const next = panels[i + 1];
          if (!next) return;
          gsap.to(panel.querySelector("img"), {
            scale: 0.9,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
          });
          gsap.to(panel.querySelector(".curtain__shade"), {
            opacity: 0.85,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
          });
        });
        gsap.utils.toArray(".curtain__caption", root.current).forEach((cap) => {
          gsap.from(cap, {
            y: 24,
            autoAlpha: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: cap, start: "top 92%", once: true },
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <section id="work" className="gallery" ref={root} aria-labelledby="work-title">
      <div className="gallery__intro" data-section>
        <h2 id="work-title" className="head" data-reveal="lines">
          Портфолио
        </h2>
        <p className="gallery__text" data-reveal>
          Несколько кадров во весь экран — так, как их стоит смотреть. Больше работ и свежие съёмки — в{" "}
          <a className="link" href={site.contacts.instagram.href} target="_blank" rel="noopener">
            Instagram
          </a>
          .
        </p>
      </div>
      <div className="curtain">
        {curtain.map((c, i) => {
          const p = photos[c.photo];
          return (
            <figure className="curtain__panel" key={c.photo}>
              <button className="curtain__open" onClick={() => openLightbox(names, i)}>
                <img src={p.src} width={p.w} height={p.h} alt={p.alt} loading="lazy" decoding="async" />
              </button>
              <span className="curtain__shade" aria-hidden="true" />
              <figcaption className="curtain__caption">{c.caption}</figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
