'use client';
import { useState } from 'react';

const prices = {
  'Лечение': [
    ['Пломба при кариесе', '1 400', '2 200'],
    ['Лечение канала, 1 канал', '1 800', '2 600'],
    ['Повторное лечение канала', '2 600', '3 800'],
    ['Восстановление зуба', '2 200', '3 400'],
  ],
  'Гигиена': [
    ['Профессиональная чистка', '1 600', '1 900'],
    ['Air Flow', '900', '900'],
    ['Фторирование', '400', '400'],
  ],
  'Имплантация': [
    ['Удаление зуба', '800', '2 500'],
    ['Имплант с установкой', '16 000', '24 000'],
    ['Коронка на имплант', '9 000', '14 000'],
  ],
  'Ортодонтия': [
    ['Консультация ортодонта', '500', '500'],
    ['Брекеты, одна челюсть', '14 000', '22 000'],
    ['Элайнеры, курс', '45 000', '90 000'],
  ],
};

export default function PriceFilter() {
  const groups = Object.keys(prices);
  const [g, setG] = useState(groups[0]);
  return (
    <div className="dn-prices">
      <div className="dn-tabs" role="tablist">
        {groups.map((x) => (
          <button key={x} type="button" role="tab" aria-selected={g === x} onClick={() => setG(x)}>{x}<span>{prices[x].length}</span></button>
        ))}
      </div>
      <table className="dn-table">
        <thead><tr><th>Услуга</th><th>от</th><th>до</th></tr></thead>
        <tbody>
          {prices[g].map(([n, a, b]) => (
            <tr key={n}><td>{n}</td><td>{a} ₴</td><td>{a === b ? '—' : `${b} ₴`}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
