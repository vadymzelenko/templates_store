'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { botLink as link, phoneHref } from '@/data/site';
import { useContent } from './ContentProvider';
import { IconPhone, IconTelegram } from './Icons';

// Нижняя панель на телефоне: появляется после первого экрана и прячется у подвала.
export default function MobileBar() {
  const { site } = useContent();
  const botLink = (start) => link(site.bot, start);
  const root = useRef(null);

  useGSAP(() => {
    const el = root.current;
    gsap.set(el, { yPercent: 130 });
    const show = (on) => gsap.to(el, { yPercent: on ? 0 : 130, duration: 0.5, ease: 'out', overwrite: true });
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'bottom 60%',
      endTrigger: '.page',
      end: 'bottom bottom',
      onToggle: (self) => show(self.isActive),
    });
  });

  return (
    <div ref={root} className="mbar">
      <a className="btn mbar__main" href={botLink('site_mobile')} target="_blank" rel="noreferrer">
        <IconTelegram />
        Записаться в боте
      </a>
      <a className="mbar__call" href={phoneHref(site.phone)} aria-label={`Позвонить: ${site.phone}`}>
        <IconPhone />
      </a>
    </div>
  );
}
