"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { steps, photos } from "@/lib/site";
import Photo from "./Photo";

// Фото слева закреплено и меняется под тот шаг, который сейчас читают справа.
export default function Process() {
  const root = useRef(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      gsap.utils.toArray(".process__step", root.current).forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    },
    { scope: root }
  );

  return (
    <section className="process" ref={root} aria-labelledby="process-title">
      <div className="process__head" data-section>
        <h2 id="process-title" className="head" data-reveal="lines">
          Как проходит съёмка
        </h2>
        <p className="process__sub" data-reveal>
          Три шага от первого сообщения до готовой галереи.
        </p>
      </div>
      <div className="process__body">
        <div className="process__media" aria-hidden="true">
          {steps.map((s, i) => {
            const p = photos[s.photo];
            return (
              <img
                key={s.when}
                src={p.src}
                width={p.w}
                height={p.h}
                alt=""
                loading="lazy"
                decoding="async"
                className={i === active ? "is-on" : ""}
              />
            );
          })}
        </div>
        <ol className="process__steps">
          {steps.map((s, i) => (
            <li key={s.when} className={`process__step ${i === active ? "is-active" : ""}`} data-section>
              <Photo name={s.photo} className="process__inline" />
              <h3 className="process__when" data-reveal>
                {s.when}
              </h3>
              <p className="process__text" data-reveal>
                {s.text.charAt(0).toUpperCase() + s.text.slice(1)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
