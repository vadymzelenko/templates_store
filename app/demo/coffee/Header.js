'use client';
// Шапка: прозрачная над фото, при прокрутке становится светлой; прячется при прокрутке вниз
import { useEffect, useState } from 'react';
import OpenNow from './OpenNow';

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const on = () => { const y = window.scrollY; setSolid(y > 60); if (Math.abs(y - last) > 6) { setHidden(y > last && y > 400); last = y; } };
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`ug-head${solid ? ' solid' : ''}${hidden ? ' hide' : ''}`}>
      <a href="#top" className="ug-logo">Угол</a>
      <nav><a href="#menu">Меню</a><a href="#about">О нас</a><a href="#gallery">Атмосфера</a><a href="#visit">Как найти</a></nav>
      <OpenNow />
    </header>
  );
}
