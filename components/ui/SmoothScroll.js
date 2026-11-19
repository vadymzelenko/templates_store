'use client';
// Мягкая прокрутка колесом (Lenis). Якорные ссылки тоже едут плавно. Уважает prefers-reduced-motion.
import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: { offset: -80 } });
    let id;
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    window.__lenis = lenis;
    return () => { cancelAnimationFrame(id); lenis.destroy(); delete window.__lenis; };
  }, []);
  return null;
}

// Плавно доехать до элемента по id (работает и без Lenis)
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80 });
  else el.scrollIntoView({ behavior: 'smooth' });
}
