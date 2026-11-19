// Тонкая панель над демо: назад в каталог и «Хочу такой сайт» (страница шаблона с ценой и заказом).
import './demo-kit.css';
import { templates } from '@/lib/templates';

export default function DemoBar({ slug }) {
  const t = templates.find((x) => x.slug === slug);
  return (
    <div className="demo-bar">
      <a className="db-back" href="/#catalog">← Каталог</a>
      <span className="db-name">Пример сайта · {t.title}</span>
      <a className="db-cta" href={`/templates/${slug}`}>Хочу такой сайт · {t.price}</a>
    </div>
  );
}
