'use client';
// Фото первого экрана медленно уезжает при прокрутке
import { useEffect, useRef } from 'react';
import Photo from '@/components/ui/Photo';
import { P } from '@/lib/photos';

export default function Parallax() {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const on = () => { if (ref.current) ref.current.style.transform = `translate3d(0, ${window.scrollY * 0.3}px, 0) scale(1.08)`; };
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return <div ref={ref} className="ug-hero-bg"><Photo id={P.cafe} w={1920} alt="" fallback="#3b2a20" /></div>;
}
