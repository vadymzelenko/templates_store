'use client';
// Поиск и каталог проектов. Ищет по названию, нише, «подходит для» и по всем нишам отрасли.
import { useMemo, useState } from 'react';
import { categories, projects, features } from '@/store/catalog';

const norm = (s) => String(s).toLowerCase().replace(/ё/g, 'е').replace(/[-‑–]/g, ' ').trim();
const catOf = (key) => categories.find((c) => c.key === key);
const quick = ['Барбершоп', 'Стоматология', 'Автосервис', 'Кофейня', 'Ремонт квартир', 'Ветклиника', 'Языковая школа'];

function prefill(values) {
  for (const [key, value] of Object.entries(values)) {
    window.dispatchEvent(new CustomEvent('prefill', { detail: { key, value } }));
  }
  document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
}

// Почему проект попал в выдачу: точная ниша, «подходит для» или та же отрасль
function matchProject(p, q) {
  if (!q) return { ok: true };
  const cat = catOf(p.category);
  if ([p.title, p.niche, p.summary].some((s) => norm(s).includes(q))) return { ok: true };
  const fit = p.alsoFits.find((n) => norm(n).includes(q));
  if (fit) return { ok: true, why: `Подойдёт для: ${fit}` };
  if (norm(cat.name).includes(q)) return { ok: true };
  const near = cat.niches.find((n) => norm(n).includes(q));
  if (near) return { ok: true, why: `Та же отрасль — переделаем под «${near}»` };
  return { ok: false };
}

function Preview({ p, hasPreview }) {
  const { bg, ink, accent } = p.poster;
  return (
    <div className="pc-shot" style={{ '--pbg': bg, '--pink': ink, '--pacc': accent }}>
      <div className="pc-chrome" aria-hidden="true"><i /><i /><i /><span>{p.external ? 'github.com/vadymzelenko' : p.href}</span></div>
      {hasPreview ? (
        <img src={`/previews/${p.slug}.jpg`} alt={`Превью сайта «${p.title}»`} loading="lazy" />
      ) : (
        <div className="pc-poster"><b>{p.title}</b><span>{p.niche}</span></div>
      )}
    </div>
  );
}

function Card({ p, index, why, hasPreview }) {
  const cat = catOf(p.category);
  return (
    <article className="pc">
      <div className="pc-head">
        <span className="pc-num">{String(index + 1).padStart(2, '0')}</span>
        <span className="pc-niche">{p.niche}</span>
        <span className="pc-cat">{cat.name}</span>
      </div>
      <a href={p.href} className="pc-link" {...(p.external ? { target: '_blank', rel: 'noreferrer' } : {})} aria-label={`Открыть «${p.title}»`}>
        <Preview p={p} hasPreview={hasPreview} />
      </a>
      <h3 className="pc-title">{p.title}</h3>
      {why && <p className="pc-why">{why}</p>}
      <p className="pc-sum">{p.summary}</p>
      <ul className="pc-feats">{p.features.map((f) => <li key={f}>{features[f]}</li>)}</ul>
      <div className="pc-actions">
        <a className="btn sm" href={p.href} {...(p.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
          {p.external ? 'Код на GitHub ↗' : 'Открыть демо'}
        </a>
        <button type="button" className="btn ghost sm" onClick={() => prefill({ project: p.slug, industry: cat.name })}>Хочу такой</button>
      </div>
    </article>
  );
}

export default function Catalog({ previews = [] }) {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState(null);
  const [feats, setFeats] = useState([]);
  const q = norm(query);

  const counts = useMemo(() => Object.fromEntries(categories.map((c) => [c.key, projects.filter((p) => p.category === c.key).length])), []);

  const results = projects
    .map((p) => ({ p, m: matchProject(p, q) }))
    .filter(({ p, m }) => m.ok && (!cat || p.category === cat) && feats.every((f) => p.features.includes(f)));

  // Ниша из списка, под которую нет готового проекта именно этой ниши
  const niche = q.length >= 3
    ? categories.flatMap((c) => c.niches.map((n) => ({ n, c }))).find(({ n }) => norm(n).includes(q))
    : null;
  const exact = niche && projects.some((p) => norm(p.niche) === norm(niche.n));
  const activeCat = cat && catOf(cat);

  function toggleFeat(f) { setFeats((s) => (s.includes(f) ? s.filter((x) => x !== f) : [...s, f])); }
  function reset() { setQuery(''); setCat(null); setFeats([]); }

  return (
    <>
      <section className="st-hero">
        <div className="st-hero-text">
          <p className="st-eyebrow">Веб-студия · {projects.length} проектов · {categories.length} отраслей</p>
          <h1>Сайт для вашего дела. С записью клиентов и&nbsp;CRM.</h1>
          <p className="st-lead">Выберите готовый проект из своей отрасли, посмотрите его вживую и закажите такой же под свой бизнес: ваши цены, тексты, цвета и онлайн-запись.</p>
        </div>

        {/* «Прилавок»: несколько проектов лежат на полке */}
        <div className="st-shelf" aria-hidden="true">
          {['language-school', 'barbershop', 'coffee'].filter((s) => previews.includes(s)).map((s, i) => (
            <a key={s} href={projects.find((p) => p.slug === s).href} tabIndex={-1} className={`st-shelf-item i${i}`}>
              <img src={`/previews/${s}.jpg`} alt="" />
            </a>
          ))}
        </div>

        <form className="st-search" role="search" onSubmit={(e) => { e.preventDefault(); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }); }}>
          <label htmlFor="st-q" className="st-search-label">Чем занимается ваш бизнес?</label>
          <div className="st-search-row">
            <input id="st-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Например: барбершоп, стоматология, шиномонтаж" autoComplete="off" />
            <button className="btn">Найти</button>
          </div>
          <div className="st-quick">
            {quick.map((n) => (
              <button type="button" key={n} className={norm(n) === q ? 'on' : ''} onClick={() => { setQuery(n); setCat(null); }}>{n}</button>
            ))}
          </div>
        </form>
      </section>

      <section id="catalog" className="st-catalog">
        <aside className="st-cats" aria-label="Отрасли">
          <p className="st-cats-title">Отрасли</p>
          <button type="button" className={!cat ? 'on' : ''} onClick={() => setCat(null)}>
            <span>Все проекты</span><span className="n">{projects.length}</span>
          </button>
          {categories.map((c) => (
            <button type="button" key={c.key} className={`${cat === c.key ? 'on' : ''}${counts[c.key] ? '' : ' empty'}`} onClick={() => setCat(cat === c.key ? null : c.key)}>
              <span>{c.name}</span><span className="n">{counts[c.key] || '—'}</span>
            </button>
          ))}
        </aside>

        <div className="st-results">
          <div className="st-bar">
            <p className="st-count">
              {results.length ? `Найдено: ${results.length}` : 'Ничего не нашли'}
              {query && <> по запросу «{query}»</>}
              {activeCat && <> в «{activeCat.name}»</>}
            </p>
            <div className="st-feats" aria-label="Возможности">
              {Object.entries(features).filter(([k]) => projects.some((p) => p.features.includes(k))).map(([k, label]) => (
                <button type="button" key={k} aria-pressed={feats.includes(k)} onClick={() => toggleFeat(k)}>{label}</button>
              ))}
            </div>
          </div>

          {niche && !exact && (
            <div className="st-note">
              <p><b>Под «{niche.n}» готового демо пока нет.</b> Соберём на основе проекта из той же отрасли или с нуля, обычно за 5–8 рабочих дней.</p>
              <button type="button" className="btn sm" onClick={() => prefill({ project: 'own', industry: niche.c.name })}>Обсудить свой сайт</button>
            </div>
          )}

          {activeCat && !counts[cat] && (
            <div className="st-note">
              <p><b>В «{activeCat.name}» готовых проектов пока нет.</b> Любой проект ниже перекрашивается под вашу нишу: меняем тексты, услуги, цвета и поля записи.</p>
              <button type="button" className="btn sm" onClick={() => prefill({ project: 'own', industry: activeCat.name })}>Обсудить свой сайт</button>
            </div>
          )}

          {results.length > 0 ? (
            <div className="st-grid">
              {results.map(({ p, m }) => (
                <Card key={p.slug} p={p} index={projects.indexOf(p)} why={m.why} hasPreview={previews.includes(p.slug)} />
              ))}
            </div>
          ) : (
            <div className="st-empty">
              {activeCat && !counts[cat] ? (
                <div className="st-grid">
                  {projects.map((p, i) => <Card key={p.slug} p={p} index={i} hasPreview={previews.includes(p.slug)} />)}
                </div>
              ) : (
                <>
                  <p>Попробуйте другое слово или сбросьте фильтры.</p>
                  <button type="button" className="btn ghost sm" onClick={reset}>Сбросить</button>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
