'use client';
// Кнопка «Выбрать даты» у шатра: подставляет шатёр в бронь и едет к календарю
export default function PickTent({ tent, children }) {
  return (
    <button type="button" className="gl-btn sm" onClick={() => {
      window.dispatchEvent(new CustomEvent('prefill', { detail: { key: 'tent', value: tent } }));
      const el = document.getElementById('stay');
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -40 }); else el?.scrollIntoView({ behavior: 'smooth' });
    }}>{children}</button>
  );
}
