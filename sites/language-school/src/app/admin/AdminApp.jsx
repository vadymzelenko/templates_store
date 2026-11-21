'use client';

import { useMemo, useRef, useState, useTransition } from 'react';
import { saveContent, resetContent, setLead, removeLead, loadLeads, logout } from './actions';
import { languages, statuses } from '@/data/site';

const LEAD_STATUS = {
  new: 'Новая',
  work: 'В работе',
  booked: 'Записан',
  lost: 'Отказ',
};
const TIMES = { morning: 'Утром', day: 'Днём', evening: 'Вечером' };
const langName = (code) => languages.find((l) => l.code === code)?.name || '—';

const TABS = [
  { id: 'leads', label: 'Заявки' },
  { id: 'site', label: 'Контакты' },
  { id: 'hero', label: 'Главный экран' },
  { id: 'flights', label: 'Расписание' },
  { id: 'plans', label: 'Цены' },
  { id: 'lesson', label: 'Об уроке' },
  { id: 'route', label: 'Как записаться' },
  { id: 'steps', label: 'Шаги записи' },
  { id: 'compare', label: 'Сравнение' },
  { id: 'baggage', label: 'Что входит' },
  { id: 'faq', label: 'Вопросы' },
  { id: 'photos', label: 'Фото' },
];

/* ---------- Поля ---------- */

function Field({ label, value, onChange, area, type = 'text', hint, ...rest }) {
  return (
    <label className="adm-field">
      <span>{label}</span>
      {area ? (
        <textarea value={value ?? ''} rows={area === true ? 3 : area} onChange={(e) => onChange(e.target.value)} {...rest} />
      ) : (
        <input
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(type === 'number' ? e.target.valueAsNumber || 0 : e.target.value)}
          {...rest}
        />
      )}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="adm-field">
      <span>{label}</span>
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

// Список карточек: добавить, удалить, поменять местами.
function List({ items, onChange, make, title, children, addLabel = 'Добавить' }) {
  const update = (i, patch) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const move = (i, d) => {
    const next = [...items];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="adm-list">
      {items.map((item, i) => (
        <div className="adm-card" key={i}>
          <div className="adm-card__head">
            <strong>{title(item, i)}</strong>
            <div className="adm-card__tools">
              <button type="button" className="adm-icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Выше">
                ↑
              </button>
              <button type="button" className="adm-icon" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Ниже">
                ↓
              </button>
              <button
                type="button"
                className="adm-icon adm-icon--danger"
                onClick={() => confirm('Удалить этот пункт?') && onChange(items.filter((_, j) => j !== i))}
                aria-label="Удалить"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="adm-grid">{children(item, (patch) => update(i, patch), i)}</div>
        </div>
      ))}
      <button type="button" className="adm-btn" onClick={() => onChange([...items, make()])}>
        + {addLabel}
      </button>
    </div>
  );
}

/* ---------- Редакторы разделов ---------- */

const editors = {
  site: (v, set) => {
    const s = (k) => (x) => set({ ...v, [k]: x });
    const a = (k) => (x) => set({ ...v, address: { ...v.address, [k]: x } });
    const h = (k) => (x) => set({ ...v, hours: { ...v.hours, [k]: x } });
    return (
      <>
        <h3>Школа</h3>
        <div className="adm-grid">
          <Field label="Название" value={v.name} onChange={s('name')} />
          <Field label="Заголовок вкладки браузера" value={v.title} onChange={s('title')} />
          <Field label="Описание для поисковиков" value={v.description} onChange={s('description')} area />
          <Field label="Адрес сайта" value={v.url} onChange={s('url')} hint="Например, https://vylet.school" />
        </div>
        <h3>Связь</h3>
        <div className="adm-grid">
          <Field label="Телефон" value={v.phone} onChange={s('phone')} hint="Так, как он будет показан на сайте" />
          <Field label="E-mail" value={v.email} onChange={s('email')} type="email" />
          <Field label="Telegram-бот для записи" value={v.bot} onChange={s('bot')} hint="Имя бота без t.me, например vylet_school_bot" />
          <Field label="Telegram-канал" value={v.telegram} onChange={s('telegram')} hint="Полная ссылка https://t.me/…" />
          <Field label="Instagram" value={v.instagram} onChange={s('instagram')} hint="Полная ссылка https://instagram.com/…" />
          <Field label="Валюта" value={v.currency} onChange={s('currency')} />
        </div>
        <h3>Адрес и часы работы</h3>
        <div className="adm-grid">
          <Field label="Как называется место" value={v.address?.school} onChange={a('school')} />
          <Field label="Улица, дом, офис" value={v.address?.street} onChange={a('street')} />
          <Field label="Город и индекс" value={v.address?.city} onChange={a('city')} />
          <Field label="Ссылка на карту" value={v.address?.mapHref} onChange={a('mapHref')} hint="Пусто — ссылка соберётся из адреса" />
          <Field label="Дни работы" value={v.hours?.days} onChange={h('days')} />
          <Field label="Часы работы" value={v.hours?.time} onChange={h('time')} />
        </div>
      </>
    );
  },

  hero: (v, set) => (
    <div className="adm-grid">
      <Field label="Заголовок" value={v.title} onChange={(x) => set({ ...v, title: x })} area={2} hint="Две короткие строки, перенос — Enter" />
      <Field label="Текст под заголовком" value={v.lead} onChange={(x) => set({ ...v, lead: x })} area={3} />
    </div>
  ),

  route: (v, set) => (
    <>
      <div className="adm-grid">
        <Field label="Заголовок" value={v.title} onChange={(x) => set({ ...v, title: x })} area={2} />
        <Field label="Текст" value={v.text} onChange={(x) => set({ ...v, text: x })} area={3} />
      </div>
    </>
  ),

  lesson: (v, set) => (
    <>
      <div className="adm-grid">
        <Field label="Заголовок" value={v.title} onChange={(x) => set({ ...v, title: x })} area={2} />
        <Field label="Текст" value={v.text} onChange={(x) => set({ ...v, text: x })} area={3} />
      </div>
      <h3>Цифры</h3>
      <List
        items={v.facts}
        onChange={(facts) => set({ ...v, facts })}
        make={() => ({ value: '', label: '' })}
        title={(f) => f.value || 'Новая цифра'}
        addLabel="Добавить цифру"
      >
        {(f, up) => (
          <>
            <Field label="Значение" value={f.value} onChange={(x) => up({ value: x })} />
            <Field label="Подпись" value={f.label} onChange={(x) => up({ label: x })} />
          </>
        )}
      </List>
    </>
  ),

  flights: (v, set) => (
    <List
      items={v}
      onChange={set}
      make={() => ({ time: '18:00', days: 'Пн, Ср', code: 'EN-A1', lang: 'en', title: '', city: 'Лондон', gate: 'Каб. 1', status: 'open', seats: 6 })}
      title={(f) => `${f.time} · ${f.code} · ${f.title || 'новая группа'}`}
      addLabel="Добавить группу"
    >
      {(f, up) => (
        <>
          <Field label="Название курса" value={f.title} onChange={(x) => up({ title: x })} />
          <Select
            label="Язык"
            value={f.lang}
            onChange={(x) => up({ lang: x, city: languages.find((l) => l.code === x)?.city || f.city })}
            options={languages.map((l) => [l.code, l.name])}
          />
          <Field label="Время" value={f.time} onChange={(x) => up({ time: x })} placeholder="18:30" />
          <Field label="Дни" value={f.days} onChange={(x) => up({ days: x })} placeholder="Вт, Чт" />
          <Field label="Код рейса" value={f.code} onChange={(x) => up({ code: x.toUpperCase() })} hint="Уходит в бота, латиница" />
          <Field label="Город на табло" value={f.city} onChange={(x) => up({ city: x })} />
          <Field label="Кабинет или «Онлайн»" value={f.gate} onChange={(x) => up({ gate: x })} />
          <Select label="Статус" value={f.status} onChange={(x) => up({ status: x })} options={Object.entries(statuses).map(([k, l]) => [k, l.replace(':', '')])} />
          <Field label="Свободных мест (0–6)" type="number" min={0} max={6} value={f.seats} onChange={(x) => up({ seats: x })} />
          {f.status === 'soon' && <Field label="Текст статуса" value={f.note} onChange={(x) => up({ note: x })} placeholder="Старт 3 ноября" />}
        </>
      )}
    </List>
  ),

  plans: (v, set) => (
    <List items={v} onChange={set} make={() => ({ id: 'group', name: '', who: '', price: 0, period: '', includes: '', action: 'Выбрать', start: 'plan' })} title={(p) => p.name || 'Тариф'} addLabel="Добавить тариф">
      {(p, up) => (
        <>
          <Field label="Название" value={p.name} onChange={(x) => up({ name: x })} />
          <Select label="Оформление" value={p.id} onChange={(x) => up({ id: x })} options={[['group', 'Тёмное, широкое'], ['solo', 'Белое, узкое']]} />
          <Field label="Цена" type="number" min={0} value={p.price} onChange={(x) => up({ price: x })} />
          <Field label="За что" value={p.period} onChange={(x) => up({ period: x })} placeholder="в месяц" />
          <Field label="Для кого" value={p.who} onChange={(x) => up({ who: x })} area={2} />
          <Field label="Что входит" value={p.includes} onChange={(x) => up({ includes: x })} area={3} />
          <Field label="Текст кнопки" value={p.action} onChange={(x) => up({ action: x })} />
          <Field label="Метка для бота" value={p.start} onChange={(x) => up({ start: x })} hint="Латиница, например plan_group" />
        </>
      )}
    </List>
  ),

  compare: (v, set) => (
    <>
      <div className="adm-grid">
        {v.columns.map((c, i) => (
          <Field key={i} label={`Колонка ${i + 1}${i === v.featured ? ' (выделена)' : ''}`} value={c} onChange={(x) => set({ ...v, columns: v.columns.map((y, j) => (j === i ? x : y)) })} />
        ))}
      </div>
      <h3>Строки</h3>
      <List
        items={v.rows.map((r) => ({ cells: r }))}
        onChange={(rows) => set({ ...v, rows: rows.map((r) => r.cells) })}
        make={() => ({ cells: ['', '', '', ''] })}
        title={(r) => r.cells[0] || 'Новая строка'}
        addLabel="Добавить строку"
      >
        {(r, up) =>
          ['Что сравниваем', ...v.columns].map((label, i) => (
            <Field key={i} label={label} value={r.cells[i]} onChange={(x) => up({ cells: r.cells.map((y, j) => (j === i ? x : y)) })} />
          ))
        }
      </List>
    </>
  ),

  baggage: (v, set) => (
    <List items={v} onChange={set} make={() => ({ title: '', text: '' })} title={(b) => b.title || 'Новый пункт'}>
      {(b, up) => (
        <>
          <Field label="Название" value={b.title} onChange={(x) => up({ title: x })} />
          <Field label="Описание" value={b.text} onChange={(x) => up({ text: x })} area={3} />
        </>
      )}
    </List>
  ),

  steps: (v, set) => (
    <List items={v} onChange={set} make={() => ({ name: '', text: '' })} title={(s) => s.name || 'Шаг'}>
      {(s, up) => (
        <>
          <Field label="Название шага" value={s.name} onChange={(x) => up({ name: x })} />
          <Field label="Описание" value={s.text} onChange={(x) => up({ text: x })} area={3} />
        </>
      )}
    </List>
  ),

  faq: (v, set) => (
    <List items={v} onChange={set} make={() => ({ tab: '', q: '', a: '' })} title={(f) => f.q || 'Новый вопрос'} addLabel="Добавить вопрос">
      {(f, up) => (
        <>
          <Field label="Ярлык (1–2 слова)" value={f.tab} onChange={(x) => up({ tab: x })} maxLength={14} />
          <Field label="Вопрос" value={f.q} onChange={(x) => up({ q: x })} />
          <Field label="Ответ" value={f.a} onChange={(x) => up({ a: x })} area={4} />
        </>
      )}
    </List>
  ),

  photos: (v, set) => {
    const names = { skyline: 'Урок, большое фото', waterfront: 'Урок, второе фото', bench: 'Контакты, круглое фото' };
    return (
      <div className="adm-photos">
        {Object.entries(names).map(([k, label]) => {
          const p = v[k] || { src: '', alt: '', credit: '' };
          const up = (patch) => set({ ...v, [k]: { ...p, ...patch } });
          return (
            <div className="adm-card" key={k}>
              <div className="adm-card__head">
                <strong>{label}</strong>
              </div>
              {p.src && <img className="adm-photo" src={p.src} alt="" />}
              <div className="adm-grid">
                <Field label="Ссылка на фото" value={p.src} onChange={(x) => up({ src: x })} hint="https://…, лучше 1200×800" />
                <Field label="Описание для незрячих" value={p.alt} onChange={(x) => up({ alt: x })} />
                <Field label="Автор фото" value={p.credit} onChange={(x) => up({ credit: x })} />
              </div>
            </div>
          );
        })}
      </div>
    );
  },
};

/* ---------- Заявки ---------- */

function toCsv(rows) {
  const head = ['Дата', 'Имя', 'Телефон', 'Язык', 'Когда звонить', 'Комментарий', 'Статус', 'Заметка', 'Источник'];
  const esc = (x) => `"${String(x ?? '').replace(/"/g, '""')}"`;
  const lines = rows.map((l) =>
    [new Date(l.createdAt).toLocaleString('ru-RU'), l.name, l.phone, langName(l.lang), TIMES[l.time] || '', l.comment, LEAD_STATUS[l.status], l.note, l.source]
      .map(esc)
      .join(';')
  );
  return '﻿' + [head.map(esc).join(';'), ...lines].join('\n');
}

function Leads({ leads, setLeads, notify }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [pending, start] = useTransition();

  const counts = useMemo(() => {
    const c = { all: leads.length };
    for (const l of leads) c[l.status] = (c[l.status] || 0) + 1;
    return c;
  }, [leads]);

  const shown = leads.filter((l) => {
    if (filter !== 'all' && l.status !== filter) return false;
    const q = query.trim().toLowerCase();
    return !q || `${l.name} ${l.phone} ${l.comment} ${l.note}`.toLowerCase().includes(q);
  });

  const act = (fn, msg) =>
    start(async () => {
      try {
        setLeads(await fn());
        if (msg) notify(msg);
      } catch {
        notify('Сессия истекла, войдите снова', true);
      }
    });

  const download = () => {
    const url = URL.createObjectURL(new Blob([toCsv(shown)], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `zayavki-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="adm-leads">
      <div className="adm-toolbar">
        <div className="adm-seg">
          {[['all', 'Все'], ...Object.entries(LEAD_STATUS)].map(([k, l]) => (
            <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}>
              {l} <span>{counts[k] || 0}</span>
            </button>
          ))}
        </div>
        <input className="adm-search" type="search" placeholder="Поиск по имени, телефону…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="button" className="adm-btn" onClick={() => act(loadLeads, 'Список обновлён')} disabled={pending}>
          Обновить
        </button>
        <button type="button" className="adm-btn" onClick={download} disabled={!shown.length}>
          Скачать CSV
        </button>
      </div>

      {!shown.length && (
        <p className="adm-empty">
          {leads.length ? 'Ничего не нашлось.' : 'Заявок пока нет. Они появятся здесь, когда кто-то оставит телефон в форме «Перезвоним» на сайте.'}
        </p>
      )}

      <ul className="adm-leadlist">
        {shown.map((l) => (
          <li key={l.id} className={`adm-lead adm-lead--${l.status}`}>
            <div className="adm-lead__main">
              <div className="adm-lead__who">
                <strong>{l.name}</strong>
                <a href={`tel:${l.phone.replace(/[^\d+]/g, '')}`}>{l.phone}</a>
              </div>
              <div className="adm-lead__meta">
                <span>{new Date(l.createdAt).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                <span>Язык: {langName(l.lang)}</span>
                {l.time && <span>Звонить: {TIMES[l.time]?.toLowerCase()}</span>}
              </div>
              {l.comment && <p className="adm-lead__comment">{l.comment}</p>}
            </div>
            <div className="adm-lead__side">
              <select value={l.status} onChange={(e) => act(() => setLead(l.id, { status: e.target.value }), 'Статус изменён')} aria-label="Статус заявки">
                {Object.entries(LEAD_STATUS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <textarea
                defaultValue={l.note}
                placeholder="Заметка администратора"
                rows={2}
                onBlur={(e) => e.target.value !== (l.note || '') && act(() => setLead(l.id, { note: e.target.value }), 'Заметка сохранена')}
              />
              <button type="button" className="adm-link adm-link--danger" onClick={() => confirm(`Удалить заявку ${l.name}?`) && act(() => removeLead(l.id), 'Заявка удалена')}>
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Приложение ---------- */

export default function AdminApp({ initialContent, initialLeads }) {
  const [tab, setTab] = useState('leads');
  const [saved, setSaved] = useState(initialContent);
  const [draft, setDraft] = useState(initialContent);
  const [leads, setLeads] = useState(initialLeads);
  const [toast, setToast] = useState(null);
  const [pending, start] = useTransition();

  const key = tab;
  const dirty = tab !== 'leads' && JSON.stringify(draft[key]) !== JSON.stringify(saved[key]);
  const newLeads = leads.filter((l) => l.status === 'new').length;

  const timer = useRef(null);
  const notify = (text, bad = false) => {
    clearTimeout(timer.current);
    setToast({ text, bad, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), 3200);
  };

  const go = (id) => {
    if (dirty && !confirm('Есть несохранённые изменения. Уйти без сохранения?')) return;
    if (dirty) setDraft((d) => ({ ...d, [key]: saved[key] }));
    setTab(id);
  };

  const save = () =>
    start(async () => {
      try {
        const res = await saveContent(key, draft[key]);
        if (res.error) return notify(res.error, true);
        setSaved(res.content);
        setDraft(res.content);
        notify('Сохранено. Сайт уже обновлён.');
      } catch {
        notify('Сессия истекла, войдите снова', true);
      }
    });

  const reset = () => {
    if (!confirm('Вернуть исходные значения этого раздела?')) return;
    start(async () => {
      try {
        const res = await resetContent(key);
        setSaved(res.content);
        setDraft(res.content);
        notify('Раздел сброшен к исходным значениям');
      } catch {
        notify('Сессия истекла, войдите снова', true);
      }
    });
  };

  const current = TABS.find((t) => t.id === tab);

  return (
    <div className="adm-app">
      <aside className="adm-side">
        <a className="adm-side__mark" href="/" target="_blank" rel="noreferrer">
          {saved.site?.name || 'Сайт'} <span>открыть сайт ↗</span>
        </a>
        <nav className="adm-tabs" aria-label="Разделы">
          {TABS.map((t) => (
            <button key={t.id} type="button" aria-current={tab === t.id ? 'page' : undefined} onClick={() => go(t.id)}>
              {t.label}
              {t.id === 'leads' && newLeads > 0 && <span className="adm-badge">{newLeads}</span>}
            </button>
          ))}
        </nav>
        <form action={logout}>
          <button type="submit" className="adm-link">
            Выйти
          </button>
        </form>
      </aside>

      <main className="adm-main">
        <header className="adm-head">
          <h1>{current.label}</h1>
          {tab === 'flights' && (
            <p>Группы на табло вылетов. Порядок здесь — порядок на сайте. Код рейса уходит в бота, чтобы администратор видел, на какую группу пришла запись.</p>
          )}
          {tab === 'site' && <p>Эти данные показываются в шапке, контактах, подвале и мобильной панели.</p>}
          {tab === 'leads' && <p>Заявки из формы «Перезвоним». Меняйте статус, оставляйте заметки, выгружайте в Excel.</p>}
        </header>

        {tab === 'leads' ? (
          <Leads leads={leads} setLeads={setLeads} notify={notify} />
        ) : (
          <>
            <div className="adm-editor">{editors[tab](draft[key], (v) => setDraft((d) => ({ ...d, [key]: v })))}</div>
            <div className={`adm-savebar ${dirty ? 'is-dirty' : ''}`}>
              <span>{dirty ? 'Есть несохранённые изменения' : 'Все изменения сохранены'}</span>
              <button type="button" className="adm-link" onClick={reset} disabled={pending}>
                Сбросить к исходным
              </button>
              {dirty && (
                <button type="button" className="adm-btn" onClick={() => setDraft((d) => ({ ...d, [key]: saved[key] }))} disabled={pending}>
                  Отменить
                </button>
              )}
              <button type="button" className="adm-btn adm-btn--primary" onClick={save} disabled={!dirty || pending}>
                {pending ? 'Сохраняем…' : 'Сохранить'}
              </button>
            </div>
          </>
        )}
      </main>

      {toast && (
        <div key={toast.id} className={`adm-toast ${toast.bad ? 'is-bad' : ''}`} role="status">
          {toast.text}
        </div>
      )}
    </div>
  );
}
