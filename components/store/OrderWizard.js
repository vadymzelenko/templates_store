'use client';
// Заказ в 5 коротких шагов. Выбор в шаге сам листает дальше; в конце — готовое сообщение в Telegram.
import { useState } from 'react';
import { Check, Send } from 'lucide-react';
import Stepper from '@/components/ui/Stepper';
import { templates } from '@/lib/templates';
import { tgLink } from '@/lib/search';

const NICHES = ['Барбершоп', 'Салон красоты', 'Клиника', 'Кафе', 'Автосервис', 'Ремонт', 'Фитнес', 'Юрист', 'Отель', 'Другое'];
const NEEDS = ['Онлайн-запись', 'Калькулятор цены', 'Предзаказ', 'Прайс и меню', 'Портфолио', 'Заявки в Telegram', 'Несколько языков', 'Админка для текстов'];
const BUDGETS = ['до $150', '$150–300', '$300–600', 'больше $600', 'пока не знаю'];
const WHEN = ['Как можно скорее', 'В течение месяца', 'Не горит'];

const chip = (on) => `rounded-full border px-4 py-2.5 text-sm font-semibold transition-all ${on ? 'border-white bg-white text-black' : 'border-white/15 text-neutral-200 hover:border-white/40'}`;

export default function OrderWizard() {
  const [f, setF] = useState({ biz: '', like: '', needs: [], budget: '', when: '', name: '' });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const text = ['Привет! Хочу сайт.', f.biz && `Бизнес: ${f.biz}`, f.like && `Понравился шаблон: ${f.like}`, f.needs.length && `Нужно: ${f.needs.join(', ')}`, f.budget && `Бюджет: ${f.budget}`, f.when && `Срок: ${f.when}`, f.name && `Меня зовут ${f.name}`].filter(Boolean).join('\n');
  const pickThen = (k, v, next) => { set(k, v); setTimeout(next, 260); };

  const steps = [
    { key: 'biz', title: 'Чем вы занимаетесь?', hint: 'Выберите или напишите своими словами.', valid: () => f.biz.trim().length > 1,
      render: ({ next }) => (
        <div>
          <div className="mb-4 flex flex-wrap gap-2">{NICHES.map((n) => <button key={n} type="button" className={chip(f.biz === n)} onClick={() => pickThen('biz', n, next)}>{n}</button>)}</div>
          <input value={f.biz} onChange={(e) => set('biz', e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && f.biz.trim()) next(); }} placeholder="Например: барбершоп на 3 кресла в Кракове"
            className="w-full rounded-2xl border border-white/15 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-neutral-500 focus:border-white/50" />
        </div>
      ) },
    { key: 'like', title: 'Какой шаблон понравился?', hint: 'Можно пропустить — подберём вместе.',
      render: ({ next }) => (
        <div className="grid max-h-[360px] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-4" data-lenis-prevent>
          {templates.map((t) => (
            <button key={t.slug} type="button" onClick={() => pickThen('like', t.title, next)} className={`group overflow-hidden rounded-2xl border text-left transition-all ${f.like === t.title ? 'border-white' : 'border-white/10 hover:border-white/40'}`}>
              <img src={t.coverImage} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover object-top" />
              <span className="flex items-center justify-between gap-2 px-3 py-2 text-xs font-semibold text-neutral-200"><span className="truncate">{t.title}</span>{f.like === t.title && <Check className="h-4 w-4 shrink-0" />}</span>
            </button>
          ))}
          <button type="button" onClick={() => pickThen('like', '', next)} className="rounded-2xl border border-dashed border-white/20 p-4 text-sm font-semibold text-neutral-300 hover:border-white/50">Ещё не выбрал</button>
        </div>
      ) },
    { key: 'needs', title: 'Что должно быть на сайте?', hint: 'Отметьте всё нужное.',
      render: () => (
        <div className="flex flex-wrap gap-2">{NEEDS.map((n) => <button key={n} type="button" className={chip(f.needs.includes(n))} aria-pressed={f.needs.includes(n)} onClick={() => set('needs', f.needs.includes(n) ? f.needs.filter((x) => x !== n) : [...f.needs, n])}>{n}</button>)}</div>
      ) },
    { key: 'budget', title: 'Бюджет и сроки', hint: 'Примерно — точную цену назовём после разговора.',
      render: ({ next }) => (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">{BUDGETS.map((b) => <button key={b} type="button" className={chip(f.budget === b)} onClick={() => set('budget', b)}>{b}</button>)}</div>
          <div className="flex flex-wrap gap-2">{WHEN.map((w) => <button key={w} type="button" className={chip(f.when === w)} onClick={() => pickThen('when', w, next)}>{w}</button>)}</div>
        </div>
      ) },
    { key: 'send', title: 'Почти готово', hint: 'Откроется Telegram с этим сообщением — останется нажать «Отправить».',
      render: () => (
        <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Как вас зовут" autoComplete="name"
            className="h-fit w-full rounded-2xl border border-white/15 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-neutral-500 focus:border-white/50" />
          <pre className="whitespace-pre-wrap rounded-2xl bg-white p-5 font-sans text-sm leading-relaxed text-neutral-800">{text}</pre>
        </div>
      ) },
  ];

  return (
    <Stepper steps={steps} className="store-stp" finishText={<span className="inline-flex items-center gap-2">Отправить в Telegram <Send className="h-4 w-4" /></span>}
      onFinish={() => window.open(tgLink(text), '_blank', 'noopener')} />
  );
}
