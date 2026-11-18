'use client';
// Прайс как кусок сметы: раздел выбирается словом в предложении
import { useState } from 'react';
import { prices } from './data';

export default function Prices() {
  const groups = Object.keys(prices);
  const [g, setG] = useState(groups[0]);
  return (
    <div className="lt-prices">
      <p>
        Показать цены на{' '}
        {groups.map((x, i) => (
          <span key={x}>
            <button type="button" aria-pressed={g === x} onClick={() => setG(x)}>{x}</button>
            {i < groups.length - 2 ? ', ' : i === groups.length - 2 ? ' или ' : '.'}
          </span>
        ))}
      </p>
      <div className="lt-receipt" aria-live="polite">
        <p className="lt-r-h">СМЕТА · {g.toUpperCase()}</p>
        {prices[g].map(([n, a, b]) => (
          <p key={n} className="lt-r-row"><span>{n}</span><i /><span>{b ? `${a}–${b}` : a} ₴</span></p>
        ))}
        <p className="lt-r-f">Точная сумма — после осмотра. В смете она не растёт.</p>
      </div>
    </div>
  );
}
