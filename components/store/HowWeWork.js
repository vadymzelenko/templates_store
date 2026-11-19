'use client';
// Горизонтальная лента «Как работаем»: на десктопе едет вбок при прокрутке страницы, на телефоне листается пальцем.
import { useEffect, useRef, useState } from 'react';
import { MousePointerClick, FileText, Paintbrush, Rocket, LifeBuoy, CalendarCheck } from 'lucide-react';

const STEPS = [
  { n: '01', icon: MousePointerClick, t: 'Выбираете', x: 'Открываете живые сайты в каталоге и смотрите, как они работают на телефоне и компьютере.', d: '5 минут' },
  { n: '02', icon: FileText, t: 'Присылаете контент', x: 'Услуги, цены, фото и контакты. Дадим короткий бриф — тексты с нуля писать не придётся.', d: '1 день' },
  { n: '03', icon: Paintbrush, t: 'Мы собираем', x: 'Переносим контент, подгоняем цвета и шрифты под бренд, настраиваем запись под ваш график.', d: '2–5 дней' },
  { n: '04', icon: Rocket, t: 'Запуск', x: 'Домен, SSL, аналитика, заявки в Telegram. Показываем, как всем пользоваться.', d: '1 день' },
  { n: '05', icon: LifeBuoy, t: 'Поддержка', x: '30 дней правим тексты и цены бесплатно. Потом — по запросу, без абонентки.', d: '30 дней' },
  { n: '+', icon: CalendarCheck, t: 'Онлайн-запись', x: 'Клиент выбирает услугу и свободное время, подтверждает по почте и сам переносит запись. Вы видите всё в CRM.', d: 'в любой шаблон', hi: true },
];

export default function HowWeWork() {
  const wrap = useRef(null);
  const track = useRef(null);
  const [x, setX] = useState(0);
  const [pin, setPin] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
    const on = () => setPin(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    if (!pin) { setX(0); return; }
    const tick = () => {
      const w = wrap.current, t = track.current;
      if (!w || !t) return;
      const r = w.getBoundingClientRect();
      const total = w.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      setX(-(t.scrollWidth - t.parentElement.clientWidth) * p);
    };
    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    return () => { window.removeEventListener('scroll', tick); window.removeEventListener('resize', tick); };
  }, [pin]);

  return (
    <section id="how" ref={wrap} className="scroll-mt-24" style={pin ? { height: '260vh' } : undefined}>
      <div className={pin ? 'sticky top-0 flex h-screen flex-col justify-center overflow-hidden' : 'py-6'}>
        <div className="mb-10 px-5 sm:px-8 md:px-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">Как работаем</p>
          <h2 className="max-w-3xl text-3xl font-black uppercase tracking-tighter sm:text-5xl">От выбора до первой заявки — около недели</h2>
        </div>
        <div className={pin ? 'px-16' : 'overflow-x-auto px-5 pb-4 sm:px-8 [scrollbar-width:none] snap-x snap-mandatory'}>
          <ol ref={track} className="flex gap-5" style={pin ? { transform: `translate3d(${x}px,0,0)`, willChange: 'transform' } : undefined}>
            {STEPS.map(({ n, icon: Icon, t, x: text, d, hi }) => (
              <li key={n} className={`flex w-[78vw] shrink-0 snap-start flex-col rounded-[2rem] border p-7 sm:w-[380px] ${hi ? 'border-white bg-white text-black' : 'border-white/10 bg-neutral-900/60'}`}>
                <div className="mb-10 flex items-center justify-between">
                  <span className={`text-sm font-bold ${hi ? 'text-neutral-500' : 'text-neutral-500'}`}>{n}</span>
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${hi ? 'bg-black text-white' : 'bg-white/10 text-white'}`}><Icon className="h-6 w-6" strokeWidth={1.6} /></span>
                </div>
                <h3 className="mb-3 text-2xl font-bold tracking-tight">{t}</h3>
                <p className={`mb-8 text-sm leading-relaxed ${hi ? 'text-neutral-600' : 'text-neutral-400'}`}>{text}</p>
                <span className={`mt-auto w-fit rounded-full px-3 py-1 text-xs font-bold ${hi ? 'bg-black text-white' : 'bg-white/10 text-white'}`}>{d}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
