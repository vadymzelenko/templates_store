"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { priceGroups, site } from "@/lib/site";

const fmt = (n) => new Intl.NumberFormat("ru-RU").format(n).replace(/ /g, " ");
const shoots = priceGroups.flatMap((g) => g.items).filter((i) => !i.extra);
const extras = priceGroups.flatMap((g) => g.items).filter((i) => i.extra);
const shortName = (i) => i.name.split(",")[0];
const hoursLabel = (h) => `${String(h).replace(".", ",")} ${h === 1 ? "час" : h < 5 ? "часа" : "часов"}`;

function total(shoot, hours, chosen) {
  const main = shoot.perHour ? shoot.hourly * hours : shoot.price + (hours - shoot.base) * shoot.hourly;
  const add = extras
    .filter((e) => chosen.includes(e.id))
    .reduce((sum, e) => sum + (e.id === "studio" ? e.price * Math.ceil(hours) : e.price), 0);
  return Math.round(main + add);
}

// Живая часть страницы: собрать свою съёмку и отправить расчёт боту одной кнопкой.
function Calculator() {
  const [shootId, setShootId] = useState("lovestory");
  const shoot = shoots.find((s) => s.id === shootId);
  const [hours, setHours] = useState(shoot.base);
  const [chosen, setChosen] = useState([]);
  const sum = useMemo(() => total(shoot, hours, chosen), [shoot, hours, chosen]);
  const out = useRef(null);
  const shown = useRef({ v: sum });

  // Сумма докручивается до нового значения, а не прыгает.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tween = gsap.to(shown.current, {
      v: sum,
      duration: reduce ? 0 : 0.6,
      ease: "expo.out",
      onUpdate: () => out.current && (out.current.textContent = fmt(Math.round(shown.current.v))),
    });
    return () => tween.kill();
  }, [sum]);

  const toggle = (id) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  const start = [shoot.id, `${Math.round(hours * 60)}m`, ...chosen].join("_");
  const max = shoot.perHour ? 12 : shoot.base + 3;

  return (
    <form className="calc" onSubmit={(e) => e.preventDefault()} aria-label="Расчёт стоимости">
      <p className="calc__title">Соберите свою съёмку</p>
      <fieldset className="calc__chips">
        <legend className="sr-only">Формат</legend>
        {shoots.map((s) => (
          <label key={s.id} className={`chip ${s.id === shootId ? "is-on" : ""}`}>
            <input type="radio" name="shoot" value={s.id} checked={s.id === shootId} onChange={() => {
                setShootId(s.id);
                setHours(s.base);
              }} />
            {shortName(s)}
          </label>
        ))}
      </fieldset>

      <div className="calc__hours">
        <span>Длительность</span>
        <div className="stepper">
          <button type="button" aria-label="Меньше" disabled={hours <= shoot.base} onClick={() => setHours((h) => h - 0.5)}>
            −
          </button>
          <output className="tabular" aria-live="polite">
            {hoursLabel(hours)}
          </output>
          <button type="button" aria-label="Больше" disabled={hours >= max} onClick={() => setHours((h) => h + 0.5)}>
            +
          </button>
        </div>
      </div>

      <fieldset className="calc__extras">
        <legend className="sr-only">Дополнительно</legend>
        {extras.map((e) => (
          <label key={e.id} className={`check ${chosen.includes(e.id) ? "is-on" : ""}`}>
            <input type="checkbox" checked={chosen.includes(e.id)} onChange={() => toggle(e.id)} />
            <span className="check__box" aria-hidden="true" />
            {shortName(e)}
          </label>
        ))}
      </fieldset>

      <p className="calc__sum">
        <span>Примерно</span>
        <span className="calc__value tabular">
          <span ref={out}>{fmt(sum)}</span> ₴
        </span>
      </p>
      <a className="btn btn--wide" href={`${site.contacts.bot.href}?start=${start}`} target="_blank" rel="noopener">
        Отправить расчёт в бот
      </a>
    </form>
  );
}

export default function Pricing() {
  return (
    <section id="prices" className="pricing" data-section aria-labelledby="prices-title">
      <div className="pricing__head">
        <h2 id="prices-title" className="head" data-reveal="lines">
          Цены
        </h2>
        <p className="pricing__note" data-reveal>
          Цены в гривнах. Обработка, онлайн-галерея и помощь с образом уже включены. Справа можно собрать свою
          съёмку и сразу отправить расчёт боту.
        </p>
      </div>
      <div className="pricing__body">
        <div className="menu-list">
          {priceGroups.map((g) => (
            <div className="menu-list__group" key={g.name} data-reveal="rows">
              <h3 className="menu-list__name">{g.name}</h3>
              {g.items.map((i) => (
                <div className="menu-list__item" key={i.id}>
                  <div className="menu-list__row">
                    <span>{i.name}</span>
                    <span className="tabular">{fmt(i.price)} ₴</span>
                  </div>
                  <p className="menu-list__desc">{i.note}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <aside className="pricing__calc" data-reveal>
          <Calculator />
        </aside>
      </div>
    </section>
  );
}
