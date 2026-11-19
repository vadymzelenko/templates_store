'use client';
// Поле умного поиска с выпадающими подсказками и управлением с клавиатуры
import { useMemo, useRef, useState } from 'react';
import { Search, X, ArrowUpRight, CornerDownLeft } from 'lucide-react';
import { suggest } from '@/lib/search';
import { templates } from '@/lib/templates';

export default function SmartSearch({ value, onChange, onSubmit, big = false, placeholder }) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1);
  const box = useRef(null);
  const items = useMemo(() => suggest(templates, value), [value]);

  function choose(it) {
    setOpen(false);
    if (it.type === 'tpl') { window.location.href = `/templates/${it.t.slug}`; return; }
    onChange(it.n); onSubmit?.(it.n);
  }
  function key(e) {
    if (!open || !items.length) { if (e.key === 'Enter') { e.preventDefault(); onSubmit?.(value); } return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => (h + 1) % items.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => (h - 1 + items.length) % items.length); }
    else if (e.key === 'Enter') { e.preventDefault(); if (hi >= 0) choose(items[hi]); else { setOpen(false); onSubmit?.(value); } }
    else if (e.key === 'Escape') setOpen(false);
  }

  return (
    <div ref={box} className={`relative w-full ${big ? '' : 'lg:max-w-sm'}`} onBlur={(e) => { if (!box.current.contains(e.relatedTarget)) setOpen(false); }}>
      <Search className={`pointer-events-none absolute z-10 top-1/2 -translate-y-1/2 text-neutral-400 ${big ? 'left-6 w-5 h-5' : 'left-4 w-4 h-4'}`} />
      <input
        type="text" inputMode="search" role="combobox" aria-expanded={open && items.length > 0} aria-controls="ss-list" aria-autocomplete="list"
        value={value} placeholder={placeholder}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setHi(-1); }}
        onFocus={() => setOpen(true)} onKeyDown={key}
        className={`w-full rounded-full border border-white/15 bg-black/40 text-white placeholder:text-neutral-500 outline-none backdrop-blur-xl transition-colors focus:border-white/50 focus:bg-black/70 ${big ? 'h-16 pl-14 pr-14 text-base sm:text-lg' : 'h-11 pl-11 pr-10 text-sm'}`}
      />
      {value && (
        <button type="button" onClick={() => { onChange(''); setOpen(false); }} aria-label="Очистить" className={`absolute top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white ${big ? 'right-6' : 'right-4'}`}>
          <X className="w-4 h-4" />
        </button>
      )}
      {open && items.length > 0 && (
        <ul id="ss-list" role="listbox" className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/95 p-2 text-left shadow-2xl backdrop-blur-xl">
          {items.map((it, i) => (
            <li key={it.type === 'tpl' ? it.t.slug : it.n} role="option" aria-selected={hi === i}>
              <button type="button" tabIndex={-1} onMouseEnter={() => setHi(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => choose(it)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors ${hi === i ? 'bg-white/10' : ''}`}>
                {it.type === 'tpl' ? (
                  <>
                    <img src={it.t.coverImage} alt="" className="h-10 w-14 shrink-0 rounded-lg object-cover object-top" />
                    <span className="flex-1 min-w-0"><span className="block truncate text-sm font-semibold text-white">{it.t.title}</span><span className="block text-xs text-neutral-400">{it.t.category} · {it.t.price}</span></span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-500" />
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-neutral-500 ml-1" />
                    <span className="flex-1 text-sm text-white">{it.n}</span>
                    <span className="text-xs text-neutral-500">{it.g}</span>
                  </>
                )}
              </button>
            </li>
          ))}
          <li className="flex items-center gap-2 px-3 pt-2 pb-1 text-[11px] text-neutral-500"><CornerDownLeft className="w-3 h-3" /> Enter — показать все результаты</li>
        </ul>
      )}
    </div>
  );
}
