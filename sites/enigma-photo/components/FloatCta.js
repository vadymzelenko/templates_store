"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

// Плавающая кнопка на телефоне уходит, когда на экране уже есть такая же кнопка: на первом экране, в контактах и в подвале.
export default function FloatCta() {
  const [away, setAway] = useState(false);

  useEffect(() => {
    const targets = [".hero__head", "#contact", ".footer"].map((q) => document.querySelector(q)).filter(Boolean);
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setAway(visible.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <a
      className={`float-cta ${away ? "is-away" : ""}`}
      href={site.contacts.bot.href}
      target="_blank"
      rel="noopener"
      tabIndex={away ? -1 : undefined}
    >
      Записаться
    </a>
  );
}
