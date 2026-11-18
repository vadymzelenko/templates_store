'use client';
// Форма заказа: собирает бриф и открывает Telegram с готовым сообщением (сервер не нужен)
import { useState } from 'react';
import { industries } from '@/lib/industries';
import { templates } from '@/lib/templates';
import { tgLink } from '@/lib/search';

const NEEDS = ['Онлайн-запись', 'Калькулятор цены', 'Предзаказ', 'Прайс и меню', 'Портфолио', 'Заявки в Telegram', 'Несколько языков', 'Админка для текстов'];
const BUDGETS = ['до $150', '$150–300', '$300–600', 'больше $600', 'пока не знаю'];

export default function OrderForm() {
  const [f, setF] = useState({ biz: '', industry: '', like: '', needs: [], budget: '', when: '', name: '' });
  const [err, setErr] = useState('');
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const toggle = (n) => set('needs', f.needs.includes(n) ? f.needs.filter((x) => x !== n) : [...f.needs, n]);

  const text = [
    'Привет! Хочу сайт.',
    f.biz && `Бизнес: ${f.biz}`,
    f.industry && `Отрасль: ${f.industry}`,
    f.like && `Понравился шаблон: ${f.like}`,
    f.needs.length && `Нужно: ${f.needs.join(', ')}`,
    f.budget && `Бюджет: ${f.budget}`,
    f.when && `Срок: ${f.when}`,
    f.name && `Меня зовут ${f.name}`,
  ].filter(Boolean).join('\n');

  function send(e) {
    e.preventDefault();
    if (f.biz.trim().length < 3) { setErr('Напишите пару слов о бизнесе'); return; }
    setErr('');
    window.open(tgLink(text), '_blank', 'noopener');
  }

  const field = 'w-full bg-neutral-950/60 border border-white/15 focus:border-white/50 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors';
  const label = 'block text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2';

  return (
    <form onSubmit={send} noValidate className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={label} htmlFor="o-biz">Чем занимаетесь *</label>
          <input id="o-biz" className={field} value={f.biz} onChange={(e) => set('biz', e.target.value)} placeholder="Барбершоп на 3 кресла в Кракове" />
        </div>
        <div>
          <label className={label} htmlFor="o-ind">Отрасль</label>
          <select id="o-ind" className={field} value={f.industry} onChange={(e) => set('industry', e.target.value)}>
            <option value="">—</option>
            {industries.map((i) => <option key={i.key}>{i.name}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="o-like">Понравился шаблон</label>
          <select id="o-like" className={field} value={f.like} onChange={(e) => set('like', e.target.value)}>
            <option value="">— ещё не выбрал —</option>
            {templates.map((t) => <option key={t.slug}>{t.title}</option>)}
          </select>
        </div>
        <fieldset className="sm:col-span-2">
          <legend className={label}>Что должно быть на сайте</legend>
          <div className="flex flex-wrap gap-2">
            {NEEDS.map((n) => (
              <button key={n} type="button" aria-pressed={f.needs.includes(n)} onClick={() => toggle(n)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${f.needs.includes(n) ? 'bg-white text-black border-white' : 'text-neutral-300 border-white/15 hover:border-white/40'}`}>{n}</button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className={label}>Бюджет</legend>
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map((b) => (
              <button key={b} type="button" aria-pressed={f.budget === b} onClick={() => set('budget', b)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-all ${f.budget === b ? 'bg-emerald-400 text-black border-emerald-400' : 'text-neutral-300 border-white/15 hover:border-white/40'}`}>{b}</button>
            ))}
          </div>
        </fieldset>
        <div>
          <label className={label} htmlFor="o-when">Когда нужен сайт</label>
          <input id="o-when" className={field} value={f.when} onChange={(e) => set('when', e.target.value)} placeholder="к открытию, через 2 недели" />
          <label className={`${label} mt-4`} htmlFor="o-name">Как вас зовут</label>
          <input id="o-name" className={field} value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Имя" autoComplete="name" />
        </div>
      </div>

      <div className="rounded-[2rem] bg-white text-black p-6 flex flex-col">
        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-3">Сообщение, которое уйдёт в Telegram</p>
        <pre className="flex-1 whitespace-pre-wrap font-sans text-sm leading-relaxed text-neutral-800 bg-neutral-100 rounded-2xl p-4 min-h-[180px]">{text}</pre>
        {err && <p className="text-sm font-bold text-red-600 mt-3" role="alert">{err}</p>}
        <button className="mt-4 px-6 py-4 bg-black text-white rounded-full text-xs font-extrabold uppercase tracking-wider hover:bg-neutral-800">Отправить в Telegram</button>
        <p className="text-[11px] text-neutral-500 mt-3 text-center">Откроется чат @vzbbme с этим текстом — останется нажать «Отправить»</p>
      </div>
    </form>
  );
}
