// Отзывы с фото. Внешний вид задаёт className демо: .rv-list > .rv-item (.rv-photo, .rv-text, .rv-name, .rv-meta, .rv-stars)
import Photo from '@/components/ui/Photo';
import Reveal from './Reveal';

function Stars({ n = 5 }) {
  return (
    <span className="rv-stars" aria-label={`${n} из 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.8z" fill={i < n ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.2" /></svg>
      ))}
    </span>
  );
}

export default function Reviews({ items, className = '', fallback = '#ccc' }) {
  return (
    <div className={`rv-list ${className}`}>
      {items.map((r, i) => (
        <Reveal key={r.name} delay={(i % 3) * 0.08} className="rv-item">
          <Photo id={r.photo} w={160} alt={r.name} className="rv-photo" fallback={fallback} />
          <Stars n={r.stars ?? 5} />
          <p className="rv-text">{r.text}</p>
          <p className="rv-name">{r.name}</p>
          {r.meta && <p className="rv-meta">{r.meta}</p>}
        </Reveal>
      ))}
    </div>
  );
}
