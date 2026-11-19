'use client';
// Карточка шаблона: вся картинка открывает живой сайт, при наведении сайт медленно прокручивается.
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export default function Card({ t, why }) {
  const internal = t.liveDemoUrl.startsWith('/');
  const [tall, setTall] = useState(t.liveDemoUrl.startsWith('/demo/'));
  const img = tall ? `/previews/tall/${t.slug}.jpg` : t.coverImage;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900/50 transition-colors duration-500 hover:border-white/25 hover:bg-neutral-900">
      <a href={t.liveDemoUrl} {...(internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
        data-cursor="Открыть" className="relative m-2.5 mb-0 block aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-neutral-800" aria-label={`Открыть сайт «${t.title}»`}>
        <img src={img} alt="" loading="lazy" decoding="async" onError={() => setTall(false)}
          className={`absolute inset-0 h-full w-full object-cover ${tall ? 'object-top transition-[object-position] duration-[5s] ease-in-out group-hover:object-bottom' : 'transition-transform duration-700 group-hover:scale-105'}`} />
        <span className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 rounded-full bg-white py-2.5 text-xs font-bold text-black opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Открыть сайт <ArrowUpRight className="h-4 w-4" />
        </span>
      </a>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6">
        <p className="mb-1.5 flex items-center gap-2 text-xs font-medium text-neutral-400">
          {t.category}{t.isNew && <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">новое</span>}
        </p>
        <Link href={`/templates/${t.slug}`} className="mb-2 flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-bold leading-tight tracking-tight text-white transition-colors group-hover:text-white/90">{t.title}</h2>
          <span className="shrink-0 text-lg font-extrabold text-white">{t.price}</span>
        </Link>
        {why && <p className="mb-2 text-xs font-semibold text-amber-300">{why}</p>}
        <p className="mb-5 text-sm leading-relaxed text-neutral-400">{t.tagline}</p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <p className="min-w-0 truncate text-xs font-medium text-neutral-300">{(t.badges || []).join(' · ')}</p>
          <Link href={`/templates/${t.slug}`} className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-white/80 hover:text-white">
            Подробнее <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
