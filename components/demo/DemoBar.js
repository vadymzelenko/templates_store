// Тонкая панель над демо: назад в каталог и «Хочу такой сайт» с выбранным проектом.
import './demo-kit.css';
import { projects, categories } from '@/store/catalog';

export default function DemoBar({ slug }) {
  const p = projects.find((x) => x.slug === slug);
  const cat = categories.find((c) => c.key === p.category);
  const qs = new URLSearchParams({ project: slug, industry: cat.name });
  return (
    <div className="demo-bar">
      <a className="db-back" href="/#catalog">← Каталог</a>
      <span className="db-name">Демо · «{p.title}» · {p.niche}</span>
      <a className="db-cta" href={`/?${qs}#order`}>Хочу такой сайт</a>
    </div>
  );
}
