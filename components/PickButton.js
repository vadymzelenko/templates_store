'use client';
// Кнопка «Выбрать» в прайсе: подставляет значение в форму записи и прокручивает к ней.
export default function PickButton({ fieldKey, value, children, target = 'book', className = 'btn ghost sm' }) {
  function pick() {
    window.dispatchEvent(new CustomEvent('prefill', { detail: { key: fieldKey, value } }));
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
  }
  return <button type="button" className={className} onClick={pick}>{children}</button>;
}
