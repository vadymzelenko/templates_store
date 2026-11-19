'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpDown, CalendarCheck, Calculator, ShoppingBag, LayoutGrid, Plus, Send } from 'lucide-react';
import { templates } from '@/lib/templates';
import { industries } from '@/lib/industries';
import { norm, smartSearch, findNiche, industryOf, tgLink } from '@/lib/search';
import { scrollToId } from '@/components/ui/SmoothScroll';
import SmartSearch from '@/components/store/SmartSearch';
import Card from '@/components/store/Card';
import HowWeWork from '@/components/store/HowWeWork';
import OrderWizard from '@/components/store/OrderWizard';

const QUICK = ['Барбершоп', 'Стоматология', 'Автосервис', 'Кофейня', 'Фитнес', 'Юрист', 'Клининг', 'Отель', 'Ветклиника', 'Фотограф'];

const FEATURES = [
  { key: 'booking', label: 'Онлайн-запись', icon: CalendarCheck, test: (t) => (t.badges || []).some((b) => /запис|booksy|брон/i.test(b)) },
  { key: 'calc', label: 'Калькулятор', icon: Calculator, test: (t) => (t.badges || []).some((b) => /калькулятор/i.test(b)) },
  { key: 'preorder', label: 'Предзаказ', icon: ShoppingBag, test: (t) => (t.badges || []).some((b) => /предзаказ/i.test(b)) },
  { key: 'portfolio', label: 'Портфолио', icon: LayoutGrid, test: (t) => (t.badges || []).some((b) => /портфолио|галерея|кейсы/i.test(b)) },
];

const FAQ = [
  ['Это шаблон или сайт под меня?', 'Сайт под вас. Шаблон — проверенная основа: структура, вёрстка и логика уже работают. Мы меняем тексты, услуги, цены, фото, цвета и поля записи. Поэтому быстрее и дешевле, чем с нуля.'],
  ['Что входит в цену?', 'Перенос вашего контента, адаптация под бренд, домен и SSL, аналитика, адаптив под телефоны и 30 дней поддержки. Цена в карточке — за запуск под ключ.'],
  ['Как работает онлайн-запись?', 'Клиент выбирает услугу, специалиста и свободное время — занятое выбрать нельзя. Подтверждение приходит на почту, перенести запись можно в личном кабинете. Вам — CRM со статусами и журналом.'],
  ['Сколько стоит содержание сайта?', 'Для небольшого бизнеса обычно хватает бесплатных тарифов хостинга. Платите только за домен — от $10 в год. Всё регистрируем на вас.'],
  ['Можно поменять дизайн шаблона?', 'Да: цвета, шрифты, блоки и порядок секций — под ваш бренд. Если нужно совсем иначе — сделаем дизайн с нуля, это отдельная цена.'],
  ['Моей ниши нет в каталоге', 'Наберите её в поиске своими словами — поиск понимает «зубы», «тачку» и «потоп». Или ответьте на пять вопросов внизу страницы.'],
];

const reveal = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] } };

// Две бегущие ленты настоящих скриншотов на первом экране
function Marquee() {
  const shots = templates.filter((t) => t.coverImage.startsWith('/previews/'));
  const rows = [shots.filter((_, i) => i % 2 === 0), shots.filter((_, i) => i % 2 === 1)];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-[10%] -right-[10%] top-[6%] flex -rotate-[8deg] flex-col gap-5 opacity-60">
        {rows.map((row, r) => (
          <div key={r} className={`flex w-max gap-5 ${r ? 'ts-marquee-rev' : 'ts-marquee'}`}>
            {[...row, ...row].map((t, i) => (
              <img key={i} src={t.coverImage} alt="" className="h-[200px] w-[267px] rounded-2xl object-cover object-top shadow-2xl sm:h-[260px] sm:w-[347px]" />
            ))}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,11,11,.55)_0%,rgba(11,11,11,.92)_55%,#0b0b0b_85%)]" />
    </div>
  );
}

export default function CatalogPage() {
  const [industry, setIndustry] = useState('all');
  const [feature, setFeature] = useState(null);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('new');

  useEffect(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem('ts_state_v3') || '{}');
      if (s.ind) setIndustry(s.ind); if (s.q) setQuery(s.q); if (s.sort) setSort(s.sort); if (s.feat) setFeature(s.feat);
      const y = sessionStorage.getItem('ts_scroll'); if (y) setTimeout(() => window.scrollTo(0, +y), 60);
    } catch (e) {}
  }, []);
  useEffect(() => { try { sessionStorage.setItem('ts_state_v3', JSON.stringify({ ind: industry, q: query, sort, feat: feature })); } catch (e) {} }, [industry, query, sort, feature]);
  useEffect(() => {
    const save = () => { try { sessionStorage.setItem('ts_scroll', String(window.scrollY)); } catch (e) {} };
    window.addEventListener('pagehide', save);
    return () => window.removeEventListener('pagehide', save);
  }, []);

  const tabs = useMemo(() => {
    const c = {}; templates.forEach((t) => { c[t.industry] = (c[t.industry] || 0) + 1; });
    return industries.filter((i) => c[i.key]).map((i) => ({ ...i, count: c[i.key] }));
  }, []);

  const results = useMemo(() => {
    const feat = FEATURES.find((f) => f.key === feature);
    let r = smartSearch(templates, query).results.filter(({ t }) => (industry === 'all' || t.industry === industry) && (!feat || feat.test(t)));
    const price = (t) => parseInt(String(t.price).replace(/\D/g, ''), 10) || 0;
    if (!query) r = [...r].sort((a, b) => (sort === 'price-asc' ? price(a.t) - price(b.t) : sort === 'price-desc' ? price(b.t) - price(a.t) : (b.t.isNew ? 1 : 0) - (a.t.isNew ? 1 : 0)));
    else if (sort !== 'new') r = [...r].sort((a, b) => (sort === 'price-asc' ? price(a.t) - price(b.t) : price(b.t) - price(a.t)));
    return r;
  }, [industry, query, sort, feature]);

  const niche = findNiche(query);
  const exact = niche && templates.some((t) => norm(t.category) === norm(niche.niche));
  const reset = () => { setIndustry('all'); setFeature(null); setQuery(''); };
  const go = (q) => { setQuery(q); setIndustry('all'); scrollToId('catalog'); };

  return (
    <div className="min-h-screen bg-[#050505] p-2 font-sans text-white antialiased selection:bg-white selection:text-black md:p-4">
      <div className="relative rounded-[28px] border border-white/10 bg-[#0b0b0b] md:rounded-[44px]">

        {/* Шапка */}
        <header className="fixed left-0 right-0 top-4 z-40 flex justify-center px-3 md:top-7">
          <div className="flex items-center gap-5 rounded-full border border-white/15 bg-neutral-900/60 px-5 py-2.5 shadow-2xl backdrop-blur-xl sm:gap-7 sm:px-6">
            <Link href="/" className="text-sm font-bold uppercase tracking-wider">ШАБЛОНЫ<span className="text-neutral-400">САЙТОВ.</span></Link>
            <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-widest text-neutral-300 md:flex">
              {[['catalog', 'Каталог'], ['how', 'Как работаем'], ['faq', 'Вопросы']].map(([id, n]) => <a key={id} href={`#${id}`} className="transition-colors hover:text-white">{n}</a>)}
            </nav>
            <a href="#order" className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black transition-colors hover:bg-neutral-200">Заказать</a>
          </div>
        </header>

        {/* Первый экран */}
        <section className="relative flex min-h-[94vh] flex-col items-center justify-center overflow-hidden rounded-t-[28px] px-5 pb-16 pt-28 text-center md:rounded-t-[44px]">
          <Marquee />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }} className="relative z-10 flex w-full max-w-3xl flex-col items-center">
            <p className="mb-6 rounded-full border border-white/15 bg-black/40 px-4 py-1.5 text-xs font-semibold text-neutral-300 backdrop-blur-md">
              {templates.length} живых сайтов · {tabs.length} отраслей · запуск за 1–3 дня
            </p>
            <h1 className="mb-6 text-[13vw] font-black uppercase leading-[.85] tracking-tighter sm:text-8xl md:text-9xl">Template<br />Store</h1>
            <p className="mb-9 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">Готовые сайты для малого бизнеса. Выбираете дизайн — мы наполняем его вашим контентом, подключаем запись клиентов и запускаем.</p>
            <SmartSearch big value={query} onChange={setQuery} onSubmit={() => scrollToId('catalog')} placeholder="Чем занимаетесь? Например: зубы, тачки, кофе" />
            <div className="mt-4 flex max-w-2xl flex-wrap justify-center gap-2">
              {QUICK.map((n) => (
                <button key={n} type="button" onClick={() => go(n)} className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md transition-all ${norm(n) === norm(query) ? 'border-white bg-white text-black' : 'border-white/15 bg-black/30 text-neutral-300 hover:border-white/40 hover:text-white'}`}>{n}</button>
              ))}
            </div>
          </motion.div>
          <a href="#catalog" className="absolute bottom-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-neutral-400 transition-colors hover:border-white hover:text-white" aria-label="К каталогу"><ArrowDown className="h-4 w-4" /></a>
        </section>

        {/* Каталог */}
        <main id="catalog" className="scroll-mt-24 px-3 pb-24 pt-10 sm:px-6 md:px-12 lg:px-16">
          <div className="sticky top-[72px] z-30 mb-8 rounded-[1.75rem] border border-white/10 bg-neutral-950/80 p-2.5 shadow-2xl backdrop-blur-xl md:top-[88px]">
            <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
              <button onClick={() => setIndustry('all')} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${industry === 'all' ? 'bg-white text-black' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}>Все <span className="opacity-50">{templates.length}</span></button>
              {tabs.map((i) => (
                <button key={i.key} onClick={() => setIndustry(i.key)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${industry === i.key ? 'bg-white text-black' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}>{i.name} <span className="opacity-50">{i.count}</span></button>
              ))}
            </div>
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-2 lg:flex-row lg:items-center">
              <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] lg:flex-1">
                {FEATURES.map(({ key, label, icon: Icon }) => (
                  <button key={key} onClick={() => setFeature((f) => (f === key ? null : key))} aria-pressed={feature === key}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-all ${feature === key ? 'border-emerald-400 bg-emerald-400 text-black' : 'border-white/10 text-neutral-300 hover:border-white/30'}`}>
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <SmartSearch value={query} onChange={setQuery} placeholder="Поиск по нише…" />
                <label className="flex h-11 shrink-0 items-center gap-2 rounded-full border border-white/10 px-4 text-xs font-bold">
                  <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />
                  <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Сортировка" className="cursor-pointer appearance-none bg-transparent outline-none [&>option]:bg-neutral-950">
                    <option value="new">Сначала новые</option><option value="price-asc">Сначала дешевле</option><option value="price-desc">Сначала дороже</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 px-2">
            <p className="text-sm font-semibold text-neutral-300">
              {results.length ? `Найдено: ${results.length}` : 'Ничего не нашли'}
              {query && <span className="text-neutral-500"> по запросу «{query}»</span>}
              {industry !== 'all' && <span className="text-neutral-500"> в «{industryOf(industry)?.name}»</span>}
            </p>
            {(query || industry !== 'all' || feature) && <button onClick={reset} className="text-xs font-bold text-neutral-400 underline underline-offset-4 hover:text-white">Сбросить</button>}
          </div>

          {niche && !exact && (
            <motion.div {...reveal} className="mb-8 flex flex-col justify-between gap-4 rounded-[2rem] border border-amber-300/25 bg-amber-300/[.04] p-6 md:flex-row md:items-center">
              <p className="max-w-2xl text-sm leading-relaxed text-neutral-200"><b className="text-white">Под «{niche.niche}» готового сайта пока нет.</b> Соберём на основе проекта из отрасли «{niche.industry.name}» или с нуля — обычно за 5–8 дней.</p>
              <a href={tgLink(`Привет! Нужен сайт для ниши «${niche.niche}». `)} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold text-black hover:bg-neutral-200">Обсудить в Telegram <Send className="h-3.5 w-3.5" /></a>
            </motion.div>
          )}

          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 lg:gap-7">
              {results.map(({ t, why }, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.2, 0.7, 0.2, 1] }}>
                  <Card t={t} why={why} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-white/15 px-6 py-20 text-center">
              <p className="mb-6 text-sm font-semibold text-neutral-400">Попробуйте сказать иначе — например, «стрижки» вместо «барбер»</p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <button onClick={reset} className="rounded-full border border-white/20 px-6 py-3 text-xs font-bold hover:bg-white/5">Показать все</button>
                <a href="#order" className="rounded-full bg-white px-6 py-3 text-xs font-bold text-black hover:bg-neutral-200">Заказать свой сайт</a>
              </div>
            </div>
          )}
        </main>

        <HowWeWork />

        {/* Кто делает */}
        <section className="px-5 py-24 sm:px-8 md:px-16">
          <motion.div {...reveal} className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">Кто делает</p>
              <h2 className="mb-6 text-3xl font-black uppercase tracking-tighter sm:text-5xl">Небольшая студия, а не конвейер</h2>
              <p className="mb-4 max-w-xl leading-relaxed text-neutral-300">Каждый сайт сделан руками под конкретную нишу: у барбершопа — афиша с отрывными листочками, у автосервиса — заказ-наряд, у ветклиники — паспорт питомца. Никаких конструкторов и одинаковых блоков.</p>
              <p className="max-w-xl leading-relaxed text-neutral-400">Работаем из Харькова и Гданьска. Общаемся в Telegram — без менеджеров и созвонов ради созвонов.</p>
            </div>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10">
              {[[templates.length, 'готовых сайтов в каталоге'], ['1–3 дня', 'запуск готового шаблона'], ['30 дней', 'поддержки после запуска'], ['100%', 'код и домен — ваши']].map(([n, t]) => (
                <div key={t} className="bg-[#0b0b0b] p-6 sm:p-8"><dt className="text-3xl font-black tracking-tight sm:text-5xl">{n}</dt><dd className="mt-2 text-sm text-neutral-400">{t}</dd></div>
              ))}
            </dl>
          </motion.div>
        </section>

        {/* Вопросы */}
        <section id="faq" className="scroll-mt-24 px-5 pb-24 sm:px-8 md:px-16">
          <motion.div {...reveal} className="grid gap-8 border-t border-white/10 pt-16 lg:grid-cols-[340px_1fr]">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">Вопросы</p>
              <h2 className="text-3xl font-black uppercase tracking-tighter sm:text-5xl">Что обычно спрашивают</h2>
            </div>
            <div className="border-t border-white/10">
              {FAQ.map(([q, a]) => (
                <details key={q} className="group border-b border-white/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-base font-bold sm:text-lg [&::-webkit-details-marker]:hidden">
                    {q}<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 transition-transform duration-300 group-open:rotate-45"><Plus className="h-4 w-4" /></span>
                  </summary>
                  <p className="max-w-3xl pb-6 text-sm leading-relaxed text-neutral-400 sm:text-base">{a}</p>
                </details>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Заказ */}
        <section id="order" className="scroll-mt-24 px-3 pb-24 sm:px-6 md:px-16">
          <motion.div {...reveal} className="rounded-[2.25rem] border border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 sm:p-10 md:p-14">
            <div className="mb-10 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">Заказать</p>
                <h2 className="text-3xl font-black uppercase tracking-tighter sm:text-5xl">Пять вопросов — и обсудим ваш сайт</h2>
              </div>
              <p className="max-w-sm text-sm text-neutral-400">Отвечайте, что знаете. В конце откроется Telegram с готовым сообщением.</p>
            </div>
            <OrderWizard />
          </motion.div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-6 border-t border-white/10 px-6 py-10 md:flex-row md:px-16">
          <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"><span className="h-3 w-3 rounded-full bg-white" />TemplateStore © {new Date().getFullYear()}</span>
          <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            <a href="#catalog" className="hover:text-white">Каталог</a>
            <a href="https://t.me/vzbbme" target="_blank" rel="noopener noreferrer" className="hover:text-white">Telegram</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
