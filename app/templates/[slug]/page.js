'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { templates } from '@/lib/templates';
import { industryOf, tgLink } from '@/lib/search';
import { motion, AnimatePresence } from 'framer-motion';

import {
    ArrowLeft, ExternalLink, Code2, Rocket, MessageCircle,
    CheckCircle2, Sparkles, ShieldCheck, Zap,
    Heart, Flame, Copy, Check
} from 'lucide-react';

export default function TemplateDetailPage({ params }) {
    const resolvedParams = use(params);
    const template = templates.find((t) => t.slug === resolvedParams.slug);

    if (!template) notFound();

    const [isCopied, setIsCopied] = useState(false);
    const industry = industryOf(template.industry);
    const telegram = template.telegramUrl || tgLink(`Привет! Хочу сайт как «${template.title}» (${template.price}). Мой бизнес: `);
    const similar = templates.filter((t) => t.industry === template.industry && t.slug !== template.slug).slice(0, 3);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    };

    return (
        <div className="min-h-screen font-sans antialiased text-white relative bg-[#050505] p-2 md:p-4 selection:bg-white selection:text-black">

            {/* Всплывающее уведомление (Toast) */}
            <AnimatePresence>
                {isCopied && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-neutral-900 border border-white/20 text-white px-5 py-3 rounded-full shadow-2xl font-bold text-xs flex items-center gap-2"
                    >
                        <Check className="w-4 h-4 text-emerald-400" />
                        Ссылка скопирована
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Статичный хедер, длина на ширину контейнера */}
            <div className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none">
                <header className="w-full max-w-6xl pointer-events-auto">
                    <div className="flex items-center px-4 sm:px-6 py-3 bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl w-full">

                        {/* Левая часть: Кнопка назад */}
                        <div className="flex-1 flex justify-start">
                            <Link
                                href="/"
                                className="font-bold text-[10px] sm:text-xs tracking-wider uppercase text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">К витрине</span>
                            </Link>
                        </div>

                        {/* Центральная часть: Категория строго по центру */}
                        <div className="flex justify-center shrink-0">
                            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full whitespace-nowrap">
                                {template.category}
                            </span>
                        </div>

                        {/* Правая часть: Копировать ссылку */}
                        <div className="flex-1 flex justify-end">
                            <button
                                onClick={handleCopyLink}
                                className="p-2 sm:px-3 sm:py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-300 hover:text-white transition-all text-xs flex items-center justify-center gap-2 active:scale-95"
                                title="Копировать ссылку"
                            >
                                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>

                    </div>
                </header>
            </div>

            {/* Главный контейнер (одинаковые скругления внутри: rounded-[2rem]) */}
            <div className="bg-[#0b0b0b] rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-2xl relative pt-24 md:pt-32 pb-0 flex flex-col min-h-[calc(100vh-1rem md:2rem)]">

                <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 flex-grow w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start">

                        {/* ЛЕВАЯ КОЛОНКА: Основной контент */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-8 sm:space-y-12"
                        >
                            {/* Заголовок */}
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-[10px] sm:text-xs font-medium mb-4"
                                >
                                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                    Премиум шаблон интерфейса
                                </motion.div>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 sm:mb-6 uppercase leading-none">
                                    {template.title}
                                </h1>
                                <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl font-medium">
                                    {template.tagline}
                                </p>
                            </div>

                            {/* Обложка без отступов (картинка заливает блок) */}
                            <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative group bg-neutral-900">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />
                                <img
                                    src={template.coverImage}
                                    alt={template.title}
                                    className={`w-full object-cover block relative z-0 ${template.coverImage.startsWith('/previews') ? 'aspect-[4/3] object-top' : ''} transition-transform duration-700 group-hover:scale-[1.02]`}
                                />
                            </div>

                            {/* Возможности шаблона */}
                            {template.features?.length > 0 && (
                                <section className="bg-neutral-900/60 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] border border-white/10 shadow-xl space-y-6">
                                    <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" /> Что умеет сайт
                                    </h2>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        {template.features.map((f) => (
                                            <li key={f} className="flex items-start gap-3 p-3 sm:p-4 rounded-[1.5rem] bg-white/5 border border-white/10 px-4 sm:px-5 text-xs sm:text-sm font-semibold text-neutral-200">
                                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0 mt-0.5" />{f}
                                            </li>
                                        ))}
                                    </ul>
                                    {template.fits?.length > 0 && (
                                        <p className="text-xs sm:text-sm text-neutral-400 font-medium">
                                            Легко переделать под: <span className="text-neutral-200">{template.fits.join(', ')}</span>
                                        </p>
                                    )}
                                </section>
                            )}

                            {/* Детали шаблона */}
                            <section className="bg-neutral-900/60 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] border border-white/10 shadow-xl space-y-4">
                                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                                    <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" /> Детали шаблона
                                </h2>
                                <p className="text-neutral-300 leading-relaxed text-sm sm:text-base font-medium whitespace-pre-line">
                                    {template.description}
                                </p>
                            </section>

                            {/* Что входит в стоимость */}
                            <section className="bg-neutral-900/60 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] border border-white/10 shadow-xl space-y-6">
                                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" /> Что входит в стоимость
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    {[
                                        'Полный исходный код проекта',
                                        'Настройка вашего домена и SSL',
                                        'Подключение аналитики и метрик',
                                        'Адаптивная верстка под все экраны',
                                        'Базовая SEO-оптимизация метатегов',
                                        'Техническая поддержка 30 дней'
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 sm:p-4 rounded-[1.5rem] bg-white/5 border border-white/10 px-4 sm:px-5">
                                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0 mt-0.5" />
                                            <span className="text-xs sm:text-sm font-semibold text-neutral-200">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Требования */}
                            <section className="bg-neutral-900/60 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] border border-white/10 shadow-xl space-y-6">
                                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" /> Требования для старта
                                </h2>
                                <div className="space-y-3">
                                    {[
                                        'Логотип и текстовое наполнение (контент) для вашего бренда',
                                        'Доступ к доменному регистратору (или поможем зарегистрировать)',
                                        'ТЗ или пожелания по цветовой гамме (если нужны правки)'
                                    ].map((req, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 sm:p-4 rounded-[1.5rem] bg-white/5 border border-white/10 px-4 sm:px-5 text-neutral-300 font-medium text-xs sm:text-sm">
                                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-indigo-400 shrink-0" />
                                            {req}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </motion.div>

                        {/* ПРАВАЯ КОЛОНКА: Фиксированный сайдбар */}
                        <motion.div
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="relative lg:sticky lg:top-28 h-max"
                        >
                            <div className="p-6 sm:p-8 rounded-[2rem] border border-white/10 bg-neutral-900/90 backdrop-blur-3xl shadow-2xl space-y-6 sm:space-y-8">
                                <div>
                                    <div className="text-[10px] sm:text-xs font-extrabold text-neutral-400 uppercase tracking-widest mb-2">Стоимость под ключ</div>
                                    <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">{template.price}</div>

                                    <div className="mt-4 flex items-center gap-2.5 text-[10px] sm:text-xs font-bold text-neutral-300 bg-white/5 border border-white/10 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full">
                                        <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 shrink-0" />
                                        Развертывание за 1-3 дня
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <a
                                        href={telegram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3.5 sm:py-4 bg-white hover:bg-neutral-200 text-black rounded-full font-extrabold uppercase tracking-wider text-[10px] sm:text-xs transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95"
                                    >
                                        <MessageCircle className="w-4 h-4 fill-current" />
                                        Обсудить в Telegram
                                    </a>
                                    <a
                                        href={template.liveDemoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3.5 sm:py-4 bg-transparent hover:bg-white/5 text-white rounded-full font-extrabold uppercase tracking-wider text-[10px] sm:text-xs transition-all border border-white/20 flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        {template.liveDemoUrl.includes('github.com') ? 'Код на GitHub' : 'Открыть живое демо'}
                                    </a>
                                </div>

                                <div className="pt-6 border-t border-white/10 space-y-4">
                                    <div className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                        <Code2 className="w-4 h-4 text-neutral-400" /> Стек технологий
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {template.techStack.map((tech) => (
                                            <span key={tech} className="bg-white/5 text-neutral-300 font-bold text-[10px] sm:text-[11px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {similar.length > 0 && (
                                    <div className="pt-6 border-t border-white/10 space-y-3">
                                        <div className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest">
                                            Ещё в отрасли «{industry?.name}»
                                        </div>
                                        {similar.map((t) => (
                                            <Link key={t.slug} href={`/templates/${t.slug}`} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-colors">
                                                <img src={t.coverImage} alt="" className="w-16 h-12 rounded-xl object-cover object-top border border-white/10" />
                                                <span className="flex-1 text-xs font-bold text-neutral-200">{t.title}</span>
                                                <span className="text-xs font-extrabold text-neutral-400">{t.price}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>

                    </div>
                </main>

                {/* Подвал */}
                <footer className="bg-neutral-950/50 backdrop-blur-md border-t border-white/10 py-8 sm:py-10 px-4 sm:px-16 mt-10 sm:mt-20 rounded-b-[2rem] md:rounded-b-[3rem]">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">

                        <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white" />
                                <span className="font-bold text-[10px] sm:text-xs uppercase tracking-widest text-white">TemplateStore © 2026</span>
                            </div>
                            <div className="hidden md:block w-px h-4 bg-white/10" />
                            <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-400">
                                <Link href="/#catalog" className="hover:text-white transition-colors">Каталог</Link>
                                <a href="https://t.me/vzbbme" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Telegram</a>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-neutral-500">
                            Сделано с <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500 fill-current" /> в Харькове и Гданьске
                        </div>

                    </div>
                </footer>

            </div>
        </div>
    );
}