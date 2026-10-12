'use client';
// Кнопка «Обрати» у прайсі: підставляє значення у форму запису й прокручує до неї.
export default function PickButton({ fieldKey, value, children }) {
  function pick() {
    window.dispatchEvent(new CustomEvent('prefill', { detail: { key: fieldKey, value } }));
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
  }
  return <button type="button" className="btn ghost sm" onClick={pick}>{children}</button>;
}
