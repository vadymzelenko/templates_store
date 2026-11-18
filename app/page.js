'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { templates } from '@/lib/templates';
import { industries } from '@/lib/industries';
import { norm, matchTemplate, findNiche, industryOf, tgLink } from '@/lib/search';
import { Search, Loader2, ArrowUpDown, ArrowDown, Copy, Check, ExternalLink, ArrowRight, X, CalendarCheck, Calculator, ShoppingBag, LayoutGrid } from 'lucide-react';

const BATCH_SIZE = 9;
const QUICK = ['Барбершоп', 'Стоматология', 'Автосервис', 'Кофейня', 'Ремонт квартир', 'Ветклиника', 'Фотограф', 'Психолог', 'Недвижимость'];

// Фильтры по возможностям: ищем по меткам на карточке
const FEATURES = [
  { key: 'booking', label: 'Онлайн-запись', icon: CalendarCheck, test: (t) => (t.badges || []).some((b) => /запис|booksy/i.test(b)) },
  { key: 'calc', label: 'Калькулятор', icon: Calculator, test: (t) => (t.badges || []).some((b) => /калькулятор/i.test(b)) },
  { key: 'preorder', label: 'Предзаказ', icon: ShoppingBag, test: (t) => (t.badges || []).some((b) => /предзаказ/i.test(b)) },
  { key: 'portfolio', label: 'Портфолио', icon: LayoutGrid, test: (t) => (t.badges || []).some((b) => /портфолио|галерея|кейсы/i.test(b)) },
];

export default function CatalogPage() {
  const [industry, setIndustry] = useState('all');
  const [feature, setFeature] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('new');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const observerTarget = useRef(null);

  // Отрасли, в которых есть хотя бы один шаблон
  const industryTabs = useMemo(() => {
    const counts = {};
    templates.forEach((t) => { counts[t.industry] = (counts[t.industry] || 0) + 1; });
    return industries.filter((i) => counts[i.key]).map((i) => ({ ...i, count: counts[i.key] }));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('template_store_state_v2');
      if (saved) {
        const { ind, q, count, sort, feat } = JSON.parse(saved);
        if (ind) setIndustry(ind);
        if (q !== undefined) setSearchQuery(q);
        if (count) setVisibleCount(count);
        if (sort) setSortOption(sort);
        if (feat !== undefined) setFeature(feat);
      }
      const savedScroll = sessionStorage.getItem('template_store_scroll');
      if (savedScroll) setTimeout(() => window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'instant' }), 50);
    } catch (e) {}
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      sessionStorage.setItem('template_store_state_v2', JSON.stringify({ ind: industry, q: searchQuery, count: visibleCount, sort: sortOption, feat: feature }));
    } catch (e) {}
  }, [industry, searchQuery, visibleCount, sortOption, feature, isHydrated]);

  const resetScrollState = () => {
    setVisibleCount(BATCH_SIZE);
    try { sessionStorage.removeItem('template_store_scroll'); } catch (e) {}
  };

  const handleIndustry = (key) => { setIndustry(key); resetScrollState(); };
  const handleSearch = (value) => { setSearchQuery(value); resetScrollState(); };
  const handleFeature = (key) => { setFeature((f) => (f === key ? null : key)); resetScrollState(); };
  const handleCardClick = () => { try { sessionStorage.setItem('template_store_scroll', window.scrollY.toString()); } catch (e) {} };
  const resetAll = () => { setIndustry('all'); setFeature(null); setSearchQuery(''); resetScrollState(); };

  const handleCopy = (e, template) => {
    e.preventDefault();
    navigator.clipboard.writeText(`Привет! Хочу обсудить шаблон ${template.title} (${template.price})`);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const q = norm(searchQuery);

  const processedTemplates = useMemo(() => {
    const feat = FEATURES.find((f) => f.key === feature);
    const result = templates
      .map((t) => ({ t, m: matchTemplate(t, q) }))
      .filter(({ t, m }) => m.ok && (industry === 'all' || t.industry === industry) && (!feat || feat.test(t)));

    const price = (t) => parseInt(String(t.price).replace(/\D/g, ''), 10) || 0;
    result.sort((a, b) => {
      switch (sortOption) {
        case 'price-asc': return price(a.t) - price(b.t);
        case 'price-desc': return price(b.t) - price(a.t);
        case 'new': default: return (b.t.isNew ? 1 : 0) - (a.t.isNew ? 1 : 0);
      }
    });
    return result;
  }, [industry, q, sortOption, feature]);

  // Ниша есть в нашем списке, но шаблона именно под неё нет
  const niche = findNiche(q);
  const exact = niche && templates.some((t) => norm(t.category) === norm(niche.niche));

  useEffect(() => {
    const el = observerTarget.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < processedTemplates.length && !isLoadingMore && isHydrated) {
          setIsLoadingMore(true);
          setTimeout(() => { setVisibleCount((prev) => prev + BATCH_SIZE); setIsLoadingMore(false); }, 300);
        }
      },
      { rootMargin: '400px' }
    );
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [visibleCount, processedTemplates.length, isLoadingMore, isHydrated]);

  const displayed = processedTemplates.slice(0, visibleCount);

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 20, mass: 0.8 } },
  };

  const searchBox = (big) => (
    <div className={`relative w-full group ${big ? '' : 'lg:w-72'}`}>
      <Search className={`absolute top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-white transition-colors ${big ? 'left-5 w-5 h-5' : 'left-3.5 w-4 h-4'}`} />
      <input
        type="text"
        inputMode="search"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={big ? 'Ваш бизнес: барбершоп, СТО, кофейня…' : 'Поиск по нише…'}
        aria-label="Поиск по нише"
        className={`w-full bg-neutral-950/60 focus:bg-neutral-950 border border-white/15 focus:border-white/40 rounded-full transition-all placeholder:text-neutral-500 outline-none text-white font-medium ${big ? 'pl-14 pr-12 py-4 text-sm sm:text-base' : 'pl-10 pr-9 py-2 text-xs'}`}
      />
      {searchQuery && (
        <button type="button" onClick={() => handleSearch('')} aria-label="Очистить поиск" className={`absolute top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white ${big ? 'right-5' : 'right-3'}`}>
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen font-sans antialiased text-white relative bg-[#050505] p-2 md:p-4 selection:bg-white selection:text-black"
      onMouseDown={() => setIsHovering(true)}
      onMouseUp={() => setIsHovering(false)}
    >
      {/* Интерактивный кастомный курсор */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50 w-8 h-8 rounded-full border-2 border-white/50 mix-blend-overlay hidden md:flex items-center justify-center"
        animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16, scale: isHovering ? 0.5 : 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      >
        <div className="w-1 h-1 bg-white rounded-full" />
      </motion.div>

      <div className="bg-[#0b0b0b] rounded-[32px] md:rounded-[48px] overflow-hidden border border-white/10 shadow-2xl relative">

        {/* HERO */}
        <section className="relative w-full min-h-[92vh] flex flex-col justify-between p-6 md:p-12 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1462774603919-1d8087e62cad?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="w-full h-full object-cover opacity-40 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/40 to-black/40" />
          </div>

          {/* Плавающий хедер */}
          <header className="relative z-40 w-full flex justify-center">
            <div className="inline-flex fixed items-center justify-between gap-6 px-6 py-3 bg-neutral-900/50 backdrop-blur-xl border border-white/15 rounded-full shadow-2xl">
              <Link href="/" className="font-bold text-sm tracking-wider uppercase text-white hover:opacity-80 transition-opacity">
                ШАБЛОНЫ<span className="text-neutral-400">САЙТОВ.</span>
              </Link>
              <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase text-neutral-300">
                <a href="#catalog" className="hover:text-white transition-colors">Каталог</a>
                <a href="#how" className="hover:text-white transition-colors">Как работаем</a>
                <a href="https://t.me/vzbbme" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Контакты</a>
              </nav>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
            </div>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
            className="relative z-10 w-full max-w-4xl mx-auto text-center my-auto pt-20 px-2 flex flex-col items-center"
          >
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-neutral-400 mb-5">
              {templates.length} готовых сайтов · {industryTabs.length} отраслей · запуск за 1–3 дня
            </p>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-6 text-white uppercase drop-shadow-2xl">
              Template Store
            </h1>
            <p className="text-base sm:text-lg text-neutral-300 font-normal max-w-xl mx-auto leading-relaxed mb-8">
              Готовые сайты для вашего бизнеса. Выбираете дизайн — мы наполняем его вашим контентом, подключаем запись клиентов и запускаем.
            </p>

            <form className="w-full max-w-2xl" role="search" onSubmit={(e) => { e.preventDefault(); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }); }}>
              {searchBox(true)}
            </form>
            <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-2xl">
              {QUICK.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => { handleSearch(n); setIndustry('all'); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all ${norm(n) === q ? 'bg-white text-black border-white' : 'bg-black/30 backdrop-blur-md text-neutral-300 border-white/15 hover:border-white/40 hover:text-white'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="relative z-10 flex justify-center pb-2 pt-8">
            <a href="#catalog" className="inline-flex flex-col items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Смотреть</span>
              <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:border-white transition-all">
                <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              </div>
            </a>
          </div>
        </section>

        {/* КАТАЛОГ */}
        <main id="catalog" className="px-4 sm:px-6 md:px-16 pt-16 pb-24 scroll-mt-24">

          <div className="mb-6 p-3 sm:p-4 bg-neutral-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl space-y-3">
            {/* Отрасли */}
            <div className="flex gap-2 overflow-x-auto lg:flex-wrap pb-1 -mx-1 px-1 [scrollbar-width:none]">
              <button
                onClick={() => handleIndustry('all')}
                className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${industry === 'all' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
              >
                Все <span className="opacity-50">{templates.length}</span>
              </button>
              {industryTabs.map((i) => (
                <button
                  key={i.key}
                  onClick={() => handleIndustry(i.key)}
                  className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${industry === i.key ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                >
                  {i.name} <span className="opacity-50">{i.count}</span>
                </button>
              ))}
            </div>

            {/* Возможности, поиск, сортировка */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 pt-3 border-t border-white/10">
              <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] lg:flex-1">
                {FEATURES.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => handleFeature(key)}
                    aria-pressed={feature === key}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold border transition-all ${feature === key ? 'bg-emerald-400 text-black border-emerald-400' : 'text-neutral-300 border-white/10 hover:border-white/30'}`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {searchBox(false)}
                <div className="flex items-center gap-2 px-3 py-2 bg-neutral-950/50 rounded-full border border-white/10 shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <select
                    value={sortOption}
                    onChange={(e) => { setSortOption(e.target.value); resetScrollState(); }}
                    aria-label="Сортировка"
                    className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer appearance-none pr-1 [&>option]:bg-neutral-950 [&>option]:text-white"
                  >
                    <option value="new">Сначала новые</option>
                    <option value="price-asc">Сначала дешевле</option>
                    <option value="price-desc">Сначала дороже</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Итог выдачи */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 px-2">
            <p className="text-sm font-bold text-neutral-300">
              {processedTemplates.length ? `Найдено: ${processedTemplates.length}` : 'Ничего не нашли'}
              {searchQuery && <span className="text-neutral-500"> по запросу «{searchQuery}»</span>}
              {industry !== 'all' && <span className="text-neutral-500"> в «{industryOf(industry)?.name}»</span>}
            </p>
            {(searchQuery || industry !== 'all' || feature) && (
              <button onClick={resetAll} className="text-xs font-bold text-neutral-400 hover:text-white underline underline-offset-4">Сбросить фильтры</button>
            )}
          </div>

          {niche && !exact && (
            <div className="mb-8 p-5 sm:p-6 rounded-[2rem] border border-amber-400/30 bg-amber-400/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-sm text-neutral-200 leading-relaxed max-w-2xl">
                <b className="text-white">Под «{niche.niche}» готового шаблона пока нет.</b> Соберём на основе проекта из отрасли «{niche.industry.name}» или с нуля — обычно за 5–8 дней.
              </p>
              <a
                href={tgLink(`Привет! Нужен сайт для ниши «${niche.niche}». `)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-6 py-3 bg-white text-black rounded-full text-xs font-extrabold uppercase tracking-wider hover:bg-neutral-200 transition-colors text-center"
              >
                Обсудить в Telegram
              </a>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {displayed.length > 0 ? (
                displayed.map(({ t: item, m }) => (
                  <motion.div key={item.id} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} exit={{ opacity: 0, scale: 0.9 }}>
                    <Link
                      href={`/templates/${item.slug}`}
                      onClick={handleCardClick}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="group flex flex-col h-full bg-neutral-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden hover:bg-neutral-900/80 transition-all duration-500 hover:-translate-y-1.5 shadow-xl relative"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden p-3 pb-0">
                        <div className="w-full h-full rounded-[2rem] overflow-hidden relative bg-black">
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            loading="lazy"
                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100 ${item.coverImage.startsWith('/previews') ? 'object-top' : ''}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <button
                            onClick={(e) => handleCopy(e, item)}
                            aria-label="Скопировать сообщение для заказа"
                            className="absolute top-3 right-3 z-20 bg-white hover:bg-neutral-200 p-2.5 rounded-full text-black opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg active:scale-90"
                          >
                            {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>

                          <span className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-center gap-2 py-2.5 rounded-full bg-white text-black text-[11px] font-extrabold uppercase tracking-wider opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            Подробнее <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                      <div className="px-6 pt-5 pb-6 flex flex-col flex-grow relative z-10">
                        <p className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-2">
                          {item.category}
                          {item.isNew && <span className="text-emerald-400">· новое</span>}
                        </p>
                        <div className="flex justify-between items-baseline mb-2 gap-4">
                          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">{item.title}</h2>
                          <span className="text-lg font-extrabold text-white shrink-0">{item.price}</span>
                        </div>
                        {m.why && <p className="text-xs font-bold text-amber-300 mb-2">{m.why}</p>}
                        <p className="text-sm text-neutral-300 leading-relaxed mb-5">{item.tagline}</p>
                        {item.badges?.length > 0 && (
                          <p className="mt-auto pt-4 border-t border-white/10 text-xs sm:text-[13px] font-semibold text-neutral-200 leading-relaxed">
                            {item.badges.join('  ·  ')}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 px-6 text-center bg-neutral-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 border-dashed">
                  <p className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-6">По этому запросу ничего не нашли</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={resetAll} className="px-6 py-3 rounded-full border border-white/20 text-xs font-bold uppercase tracking-wider hover:bg-white/5">Показать все</button>
                    <a href={tgLink(`Привет! Ищу сайт для: ${searchQuery || 'моего бизнеса'}. `)} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full bg-white text-black text-xs font-extrabold uppercase tracking-wider hover:bg-neutral-200">Заказать свой</a>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div ref={observerTarget} className="w-full h-16 flex items-center justify-center mt-10">
            {isLoadingMore && <Loader2 className="w-8 h-8 text-white animate-spin" />}
          </div>
        </main>

        {/* КАК РАБОТАЕМ */}
        <section id="how" className="px-4 sm:px-6 md:px-16 pb-24 scroll-mt-28">
          <div className="rounded-[2.5rem] border border-white/10 bg-neutral-900/40 p-6 sm:p-10 md:p-14">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-neutral-500 mb-4">Как работаем</p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase mb-10 max-w-3xl">От выбора шаблона до первой записи — около недели</h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                ['01', 'Выбираете', 'Открываете живое демо и смотрите, как сайт работает на телефоне и компьютере.'],
                ['02', 'Присылаете контент', 'Услуги, цены, фото, контакты. Дадим короткий бриф — писать тексты с нуля не придётся.'],
                ['03', 'Мы собираем', 'Переносим ваш контент, цвета и логотип, настраиваем онлайн-запись под ваш график.'],
                ['04', 'Запуск', 'Домен, SSL, аналитика. Показываем, как принимать заявки. 30 дней поддержки.'],
              ].map(([n, t, x]) => (
                <li key={n} className="border-t border-white/20 pt-5">
                  <span className="text-xs font-bold text-neutral-500">{n}</span>
                  <h3 className="text-lg font-bold mt-3 mb-2">{t}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{x}</p>
                </li>
              ))}
            </ol>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center rounded-[2rem] bg-white text-black p-6 sm:p-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-2">Онлайн-запись в любой шаблон</h3>
                <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
                  Клиент выбирает услугу, мастера и свободное время, подтверждает запись по почте и сам переносит её в личном кабинете. Вы видите всё в CRM. Попробуйте в демо барбершопа, стоматологии или ветклиники.
                </p>
              </div>
              <a href="https://t.me/vzbbme" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-black text-white rounded-full text-xs font-extrabold uppercase tracking-wider hover:bg-neutral-800 text-center">
                Заказать проект
              </a>
            </div>
          </div>
        </section>

        <footer className="bg-neutral-950 border-t border-white/10 py-12 px-6 md:px-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-white" />
              <span className="font-bold text-xs uppercase tracking-widest text-white">TemplateStore © {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-widest text-neutral-400">
              <a href="#catalog" className="hover:text-white transition-colors">Каталог</a>
              <a href="https://t.me/vzbbme" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                Telegram <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
