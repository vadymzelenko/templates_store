'use client';
// Плавное появление блока при прокрутке. Двигаем через CSS `translate`, поэтому собственный
// `transform` элемента (наклон полароида, записки) не ломается.
import { createElement, useEffect, useRef, useState } from 'react';

export default function Reveal({ children, delay = 0, className = '', as = 'div', style, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { rootMargin: '0px 0px -60px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return createElement(as, { ref, className: `rvl${shown ? ' in' : ''} ${className}`, style: { ...style, transitionDelay: `${delay}s` }, ...rest }, children);
}
