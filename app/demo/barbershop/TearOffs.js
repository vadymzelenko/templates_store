'use client';
// Отрывные листочки внизу афиши: «сорвать» = выбрать услугу для записи
import { useState } from 'react';
import { services } from './data';

export default function TearOffs() {
  const [torn, setTorn] = useState(null);
  function tear(s) {
    setTorn(s.name);
    window.dispatchEvent(new CustomEvent('prefill', { detail: { key: 'service', value: s.name } }));
    setTimeout(() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' }), 450);
  }
  return (
    <div className="ps-tabs" role="list" aria-label="Услуги и цены">
      {services.map((s) => (
        <button key={s.name} type="button" role="listitem" className={`ps-tab${torn === s.name ? ' torn' : ''}`} onClick={() => tear(s)} aria-label={`${s.name}, ${s.price} гривен, записаться`}>
          <span className="ps-tab-name">{s.short}</span>
          <span className="ps-tab-price">{s.price} ₴</span>
          <span className="ps-tab-time">{s.time}</span>
        </button>
      ))}
    </div>
  );
}
