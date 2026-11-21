"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { site } from "@/lib/site";
import { scrollToHash, useLenis, EASE } from "./Motion";

export default function Header() {
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menu = useRef(null);
  const tl = useRef(null);

  // Шапка уходит вверх при прокрутке вниз и возвращается при движении вверх.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 160 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = menu.current;
    tl.current = gsap
      .timeline({ paused: true, defaults: { ease: EASE } })
      .set(el, { autoAlpha: 1 })
      .fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7 })
      .from(el.querySelectorAll(".menu__link"), { yPercent: 110, duration: 0.8, stagger: 0.05 }, 0.12)
      .from(el.querySelectorAll(".menu__foot > *"), { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.05 }, 0.3);
    return () => tl.current.kill();
  }, []);

  useEffect(() => {
    if (!tl.current) return;
    if (open) {
      tl.current.timeScale(1).play();
      lenis.current?.stop();
      document.documentElement.classList.add("is-locked");
    } else {
      tl.current.timeScale(1.6).reverse();
      lenis.current?.start();
      document.documentElement.classList.remove("is-locked");
    }
  }, [open, lenis]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const jump = (e, href) => {
    e.preventDefault();
    setOpen(false);
    // Ждём, пока Lenis снова запустится после закрытия меню.
    requestAnimationFrame(() => scrollToHash(lenis.current, href));
  };

  return (
    <>
      <header className={`header ${hidden && !open ? "is-hidden" : ""}`}>
        <a href="#top" className="header__mark" onClick={(e) => jump(e, "#top")}>
          {site.name}
        </a>
        <nav className="header__nav" aria-label="Разделы">
          {site.nav.map((n) => (
            <a key={n.href} href={n.href} className="link" onClick={(e) => jump(e, n.href)}>
              {n.label}
            </a>
          ))}
        </nav>
        <a className="btn btn--small header__cta" href={site.contacts.bot.href} target="_blank" rel="noopener">
          Записаться
        </a>
        <button
          className="header__burger text-btn"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Закрыть" : "Меню"}
        </button>
      </header>

      <div id="menu" ref={menu} className="menu" aria-hidden={!open} inert={!open ? true : undefined}>
        <nav className="menu__nav" aria-label="Меню">
          {site.nav.map((n) => (
            <span key={n.href} className="menu__mask">
              <a href={n.href} className="menu__link" onClick={(e) => jump(e, n.href)}>
                {n.label}
              </a>
            </span>
          ))}
        </nav>
        <div className="menu__foot">
          <a className="btn" href={site.contacts.bot.href} target="_blank" rel="noopener">
            Записаться в Telegram-боте
          </a>
          <a className="link" href={site.contacts.phoneHref}>
            {site.contacts.phone}
          </a>
          <div className="menu__social">
            <a className="link" href={site.contacts.instagram.href} target="_blank" rel="noopener">
              Instagram
            </a>
            <a className="link" href={site.contacts.telegram.href} target="_blank" rel="noopener">
              Telegram
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
