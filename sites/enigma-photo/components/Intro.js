"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Photo from "./Photo";

const statement =
  "Я не прошу улыбнуться в камеру. Я жду, пока вы забудете о ней, а свет сам найдёт лицо, — и тогда нажимаю на спуск.";

export default function Intro() {
  const root = useRef(null);

  // Слова набирают яркость по мере прокрутки, как отпечаток в проявителе.
  useGSAP(
    () => {
      const words = root.current.querySelectorAll(".intro__word");
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          words,
          { opacity: 0.18 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 60%", end: "bottom 80%", scrub: true },
          }
        );
        gsap.utils.toArray(".intro__photo", root.current).forEach((el, i) => {
          gsap.fromTo(
            el.querySelector("img"),
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });
      });
    },
    { scope: root }
  );

  return (
    <section className="intro" ref={root} aria-labelledby="intro-title">
      <div className="intro__pin" data-section>
        <h2 id="intro-title" className="head" data-reveal="lines">
          Как я снимаю
        </h2>
        <p className="statement">
          {statement.split(" ").map((w, i) => (
            <span key={i} className="intro__word">
              {w}{" "}
            </span>
          ))}
        </p>
        <p className="intro__note" data-reveal>
          Портрет, пара, семья или целый свадебный день — в каждой съёмке я ищу одно: момент, когда человек перестаёт
          позировать и становится собой.
        </p>
      </div>
      <div className="intro__photos">
        <Photo name="hair" className="intro__photo intro__photo--a" data-section />
        <Photo name="fog" className="intro__photo intro__photo--b" data-section />
        <Photo name="dusk" className="intro__photo intro__photo--c" data-section />
      </div>
    </section>
  );
}
