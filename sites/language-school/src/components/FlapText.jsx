'use client';

import { useEffect, useRef } from 'react';

const POOL = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯABCDEFGHIJKLMNOPRSTUVWXYZ0123456789';

function pad(text, length) {
  const chars = Array.from(text.toUpperCase());
  while (chars.length < length) chars.push(' ');
  return chars.slice(0, length);
}

/**
 * Буквы табло вылетов. Каждая ячейка перебирает несколько случайных знаков,
 * прежде чем остановиться на нужном, как настоящее split-flap табло.
 * play=false держит итоговый текст без анимации (например, до появления на экране).
 */
export default function FlapText({ text, length, play = true, delay = 0, className = '', speed = 42 }) {
  const size = length ?? Array.from(text).length;
  const ref = useRef(null);
  const shown = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !play) return;
    const cells = Array.from(root.children);
    const target = pad(text, size);
    const from = shown.current ?? cells.map(() => ' ');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    shown.current = target;

    if (still) {
      cells.forEach((c, i) => {
        c.textContent = target[i];
        c.toggleAttribute('data-blank', target[i] === ' ');
      });
      return;
    }

    const timers = [];
    cells.forEach((cell, i) => {
      if (from[i] === target[i] && shown.current !== null && cell.textContent === target[i]) return;
      const flips = 4 + ((i * 7) % 5);
      for (let k = 0; k <= flips; k++) {
        timers.push(
          setTimeout(() => {
            const last = k === flips;
            cell.textContent = last
              ? target[i]
              : target[i] === ' ' && k > flips - 2
                ? ' '
                : POOL[(Math.random() * POOL.length) | 0];
            cell.toggleAttribute('data-blank', cell.textContent === ' ');
            cell.classList.remove('is-flip');
            void cell.offsetWidth;
            cell.classList.add('is-flip');
          }, delay + i * 38 + k * speed)
        );
      }
    });
    return () => timers.forEach(clearTimeout);
  }, [text, size, play, delay, speed]);

  return (
    <span className={`flap ${className}`}>
      <span className="sr-only">{text}</span>
      <span ref={ref} className="flap__cells" aria-hidden="true">
        {pad(text, size).map((c, i) => (
          <span key={i} className="flap__cell" data-blank={c === ' ' ? '' : undefined}>
            {c}
          </span>
        ))}
      </span>
    </span>
  );
}
