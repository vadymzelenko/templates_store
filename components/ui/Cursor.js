'use client';
// Фирменный курсор витрины: точка + мягко догоняющее кольцо. Над [data-cursor] кольцо растёт и показывает подпись.
// Только для мыши (pointer: fine); на телефонах и при prefers-reduced-motion не включается.
import { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [label, setLabel] = useState('');
  const [on, setOn] = useState(false);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!mq.matches) return;
    setOn(true);
    document.documentElement.classList.add('ts-cursor');
    let x = -100, y = -100, rx = -100, ry = -100, id;
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      const t = e.target.closest?.('[data-cursor], a, button, select, summary, label, [role=option]');
      setHover(!!t);
      setLabel(t?.dataset?.cursor || '');
    };
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      id = requestAnimationFrame(loop);
    };
    const leave = () => { x = y = -100; };
    const d = () => setDown(true), u = () => setDown(false);
    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseleave', leave);
    window.addEventListener('mousedown', d); window.addEventListener('mouseup', u);
    id = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('mousemove', move); document.removeEventListener('mouseleave', leave);
      window.removeEventListener('mousedown', d); window.removeEventListener('mouseup', u);
      document.documentElement.classList.remove('ts-cursor');
    };
  }, []);

  if (!on) return null;
  return (
    <>
      <div ref={ring} className={`ts-ring${hover ? ' hover' : ''}${label ? ' label' : ''}${down ? ' down' : ''}`} aria-hidden="true"><span>{label}</span></div>
      <div ref={dot} className="ts-dot" aria-hidden="true" />
    </>
  );
}
