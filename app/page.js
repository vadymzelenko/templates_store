'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { templates } from '@/lib/templates';
import { Search, Sparkles, Loader2, ArrowUpDown, ArrowDown, Copy, Check, ExternalLink, ArrowRight } from 'lucide-react';

const BATCH_SIZE = 6;

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('popular');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const observerTarget = useRef(null);
  const categories = ['Все', ...Array.from(new Set(templates.map((t) => t.category)))];

  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const savedState = sessionStorage.getItem('template_store_state');
    if (savedState) {
      try {
        const { cat, q, count, sort } = JSON.parse(savedState);
        if (cat) setSelectedCategory(cat);
        if (q !== undefined) setSearchQuery(q);
        if (count) setVisibleCount(count);
        if (sort) setSortOption(sort);
      } catch (e) {}
    }
    setIsHydrated(true);

    const savedScroll = sessionStorage.getItem('template_store_scroll');
    if (savedScroll) {
      setTimeout(() => window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'instant' }), 50);
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      sessionStorage.setItem('template_store_state', JSON.stringify({
        cat: selectedCategory, q: searchQuery, count: visibleCount, sort: sortOption
      }));
    }
  }, [selectedCategory, searchQuery, visibleCount, sortOption, isHydrated]);

  const resetScrollState = () => {
    setVisibleCount(BATCH_SIZE);
    sessionStorage.removeItem('template_store_scroll');
  };

  const handleCategoryChange = (cat) => { setSelectedCategory(cat); resetScrollState(); };
  const handleSearchChange = (e) => { setSearchQuery(e.target.value); resetScrollState(); };
  const handleSortChange = (e) => { setSortOption(e.target.value); resetScrollState(); };
  const handleCardClick = () => sessionStorage.setItem('template_store_scroll', window.scrollY.toString());

  const handleCopy = (e, template) => {
    e.preventDefault();
    navigator.clipboard.writeText(`Привет! Хочу обсудить шаблон ${template.title} (${template.price})`);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const processedTemplates = useMemo(() => {
    let result = templates.filter((t) => {
      const matchesCategory = selectedCategory === 'Все' || t.category === selectedCategory;
      const searchLower = searchQuery.toLowerCase();
      return matchesCategory && (t.title.toLowerCase().includes(searchLower) || t.description.toLowerCase().includes(searchLower) || t.category.toLowerCase().includes(searchLower));
    });

    result.sort((a, b) => {
      const priceA = parseInt(a.price.replace(/\D/g, '')) || 0;
      const priceB = parseInt(b.price.replace(/\D/g, '')) || 0;
      switch (sortOption) {
        case 'price-asc': return priceA - priceB;
        case 'price-desc': return priceB - priceA;
        case 'popular': default: return (b.usedCount || 0) - (a.usedCount || 0);
      }
    });

    return result;
  }, [selectedCategory, searchQuery, sortOption]);

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && visibleCount < processedTemplates.length && !isLoadingMore && isHydrated) {
            setIsLoadingMore(true);
            setTimeout(() => {
              setVisibleCount((prev) => prev + BATCH_SIZE);
              setIsLoadingMore(false);
            }, 400);
          }
        },
        { rootMargin: '400px' }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => { if (observerTarget.current) observer.unobserve(observerTarget.current); };
  }, [visibleCount, processedTemplates.length, isLoadingMore, isHydrated]);

  const displayedTemplates = processedTemplates.slice(0, visibleCount);

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 20, mass: 0.8 }
    }
  };

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
            transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
        >
          <div className="w-1 h-1 bg-white rounded-full" />
        </motion.div>

        {/* Главный закругленный контейнер страницы в стиле референса */}
        <div className="bg-[#0b0b0b] rounded-[32px] md:rounded-[48px] overflow-hidden border border-white/10 shadow-2xl relative">

          {/* HERO СЕКЦИЯ С ФОТО И ПЛАВАЮЩИМ ХЕДЕРОМ */}
          <section className="relative w-full h-[90vh] min-h-[600px] flex flex-col justify-between p-6 md:p-12 overflow-hidden">
            {/* Фоновое изображение с затемнением */}
            <div className="absolute inset-0 pointer-events-none">
              <img
                  src="https://images.unsplash.com/photo-1462774603919-1d8087e62cad?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Hero Background"
                  className="w-full h-full object-cover opacity-45 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/30 to-black/40" />
            </div>

            {/* Плавающий островной хедер (как на референсе) */}
            <header className="relative z-40 w-full flex justify-center">
              <div className="inline-flex fixed items-center justify-between gap-6 px-6 py-3 bg-neutral-900/40 backdrop-blur-xl border border-white/15 rounded-full shadow-2xl">
                <Link href="/" className="font-bold text-sm tracking-wider uppercase text-white hover:opacity-80 transition-opacity">
                  ШАБЛОНЫ<span className="text-neutral-400">САЙТОВ.</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase text-neutral-300">
                  <Link href="#catalog" className="hover:text-white transition-colors">Портфолио</Link>
                  <Link href="#catalog" className="hover:text-white transition-colors">Про мене</Link>
                  <a href="https://t.me/your_username" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Контакти</a>
                </nav>

                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
              </div>
            </header>

            {/* Центральный крупный заголовок */}
<motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
    className="relative z-10 max-w-4xl mx-auto text-center my-auto px-4 flex flex-col items-center"
>
  <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-6 text-white uppercase drop-shadow-2xl">
    Template Store
  </h1>
  
  <p className="text-base sm:text-lg text-neutral-400 font-normal max-w-xl mx-auto leading-relaxed mb-8">
    Готовые премиум-шаблоны для вашего бизнеса. Вы выбираете дизайн — мы настраиваем, интегрируем и запускаем.
  </p>

  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
    <a
        href="#catalog"
        className="w-full sm:w-auto px-8 py-3.5 bg-white text-black hover:bg-neutral-200 text-sm font-bold rounded-full transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 group"
    >
      Смотреть каталог
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </a>
    <a
        href="https://t.me/your_username"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900/50 hover:bg-neutral-800 text-white border border-white/10 hover:border-white/20 text-sm font-medium rounded-full transition-all duration-300 flex items-center justify-center backdrop-blur-md"
    >
      Заказать проект
    </a>
  </div>
</motion.div>

            {/* Кнопка прокрутки вниз */}
            <div className="relative z-10 flex justify-center pb-2">
              <a href="#catalog" className="inline-flex flex-col items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em]">дивитись</span>
                <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:border-white transition-all">
                  <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                </div>
              </a>
            </div>
          </section>

          {/* ОСНОВНОЙ КАТАЛОГ */}
          <main id="catalog" className="px-6 md:px-16 pt-16 pb-32 scroll-mt-12">

            {/* Панель поиска и фильтров */}
            <div className="mb-12 p-4 bg-neutral-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 w-full lg:w-auto">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 uppercase tracking-wider ${
                            selectedCategory === cat
                                ? 'bg-white text-black shadow-lg scale-100'
                                : 'bg-transparent text-neutral-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {cat}
                    </button>
                ))}
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                <div className="relative flex-1 lg:w-64 group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-white transition-colors" />
                  <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Пошук..."
                      className="w-full pl-10 pr-4 py-2 bg-neutral-950/50 focus:bg-neutral-950 border border-white/10 focus:border-white/30 rounded-full text-xs transition-all placeholder:text-neutral-500 outline-none text-white font-medium"
                  />
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-neutral-950/50 rounded-full border border-white/10 shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <select
                      value={sortOption}
                      onChange={handleSortChange}
                      className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer appearance-none pr-2 [&>option]:bg-neutral-950 [&>option]:text-white"
                  >
                    <option value="popular">Популярні</option>
                    <option value="price-asc">Спочатку дешеві</option>
                    <option value="price-desc">Спочатку дорогі</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Сетка карточек */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {displayedTemplates.length > 0 ? (
                    displayedTemplates.map((item) => (
                        <motion.div
                            key={item.id}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
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
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="absolute top-3 left-3 z-10">
                                  <span className="bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full text-[10px] font-bold text-neutral-200 uppercase tracking-wider">
                                    {item.category}
                                  </span>
                                </div>

                                <button
                                    onClick={(e) => handleCopy(e, item)}
                                    className="absolute top-3 right-3 z-20 bg-white hover:bg-neutral-200 p-2.5 rounded-full text-black opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg active:scale-90"
                                >
                                  {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow relative z-10">
                              <div className="flex justify-between items-center mb-3 gap-4">
                                <h2 className="text-xl font-bold text-white tracking-tight group-hover:text-neutral-300 transition-colors">
                                  {item.title}
                                </h2>
                                <span className="text-sm font-extrabold text-white bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
                                  {item.price}
                                </span>
                              </div>
                              <p className="text-xs font-medium text-neutral-400 line-clamp-2 leading-relaxed">
                                {item.tagline}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center text-neutral-500 bg-neutral-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 border-dashed text-sm font-bold uppercase tracking-wider">
                      За запитом нічого не знайдено
                    </div>
                )}
              </AnimatePresence>
            </div>

            <div ref={observerTarget} className="w-full h-24 flex items-center justify-center mt-12">
              {isLoadingMore && (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
              )}
            </div>
          </main>

          {/* Подвал */}
          <footer className="bg-neutral-950 border-t border-white/10 py-12 px-6 md:px-16">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-white" />
                <span className="font-bold text-xs uppercase tracking-widest text-white">TemplateStore © 2026</span>
              </div>
              <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                <a href="https://t.me/vzbbme" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Telegram <ExternalLink className="w-3 h-3" />
                </a>
                <a href="mailto:hello@example.com" className="hover:text-white transition-colors">
                  Email
                </a>
              </div>
            </div>
          </footer>

        </div>
      </div>
  );
}
