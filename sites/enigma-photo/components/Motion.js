"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Кривые в духе Эмиля Ковальски: быстрый старт, долгий мягкий финиш.
export const EASE = "expo.out";
const LenisContext = createContext({ current: null });
export const useLenis = () => useContext(LenisContext);

export function scrollToHash(lenis, hash) {
  const target = document.querySelector(hash);
  if (!target) return;
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
  else target.scrollIntoView({ behavior: "smooth" });
}

export default function Motion({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useGSAP(() => {
    const root = document.documentElement;
    const mm = gsap.matchMedia();

    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
      (ctx) => {
        const { reduce } = ctx.conditions;
        root.classList.add("anim-ready");
        // Строки режем только после загрузки шрифтов, иначе переносы съедут.
        ctx.add("build", () => {

        // Каждый блок с data-section собирает свои элементы в порядке чтения
        // и показывает их цепочкой, у каждого типа — свой характер движения.
        gsap.utils.toArray("[data-section]").forEach((section) => {
          const items = [...(section.matches("[data-reveal]") ? [section] : []), ...section.querySelectorAll("[data-reveal]")];
          if (!items.length) return;
          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: EASE },
          });
          items.forEach((el, i) => {
            const at = i * 0.08;
            const kind = el.dataset.reveal;
            if (reduce) {
              tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "none" }, at);
              return;
            }
            if (kind === "lines") {
              const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "line" });
              tl.set(el, { autoAlpha: 1 }, at);
              tl.from(split.lines, { yPercent: 105, duration: 1.1, stagger: 0.09 }, at);
            } else if (kind === "develop") {
              const img = el.querySelector("img");
              const dev = el.querySelector(".photo__developer");
              tl.set(el, { autoAlpha: 1 }, at);
              tl.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.2 }, at);
              if (img) tl.from(img, { scale: 1.18, duration: 1.8 }, at);
              if (dev) tl.fromTo(dev, { opacity: 1 }, { opacity: 0, duration: 1.6, ease: "power2.out" }, at + 0.15);
            } else if (kind === "rows") {
              tl.set(el, { autoAlpha: 1 }, at);
              tl.from(el.children, { y: 22, autoAlpha: 0, duration: 0.9, stagger: 0.06 }, at);
            } else {
              tl.fromTo(el, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, at);
            }
          });
          ScrollTrigger.create({
            trigger: section,
            start: section.dataset.start || "top 78%",
            once: true,
            onEnter: () => tl.play(),
          });
        });
        ScrollTrigger.refresh();
        });
        document.fonts ? document.fonts.ready.then(() => ctx.build()) : ctx.build();
      }
    );

    // Пересчёт после загрузки картинок и шрифтов.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  });

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}
