# Template Store — витрина готовых сайтов

Next.js 16 + Tailwind 4 + Framer Motion. Деплой — Vercel (ветка `main`).

## Что где
| Путь | Что это |
|---|---|
| `app/page.js` | Витрина: поиск по нише, фильтры по отраслям и возможностям, каталог, «Как работаем» |
| `app/templates/[slug]/page.js` | Страница шаблона: цена, что умеет, детали, похожие, кнопки «Обсудить в Telegram» и «Живое демо» |
| `lib/templates.js` | База шаблонов (лёгкая CMS) — **сюда добавлять новые карточки** |
| `lib/industries.js` | 22 отрасли и ~300 ниш, по ним работает поиск |
| `lib/search.js` | Логика поиска и ссылка на Telegram |
| `public/projects/**` | HTML-лендинги |
| `app/demo/*` | Демо на Next.js с рабочей онлайн-записью (демо-режим) |
| `public/previews/*.jpg` | Обложки карточек |

## Как добавить шаблон
1. Положите HTML в `public/projects/<папка>/<файл>.html` (или сделайте страницу в `app/demo/<slug>`).
2. Добавьте объект в `lib/templates.js`:
   - `industry` — ключ отрасли из `lib/industries.js` (`beauty`, `medicine`, `auto`, `food` …);
   - `category` — ниша, которая видна на карточке;
   - `badges` — короткие метки («Онлайн-запись», «Калькулятор», «Портфолио» — по ним работают фильтры);
   - `fits` — ниши, под которые шаблон легко переделать (поиск покажет его и по ним);
   - `liveDemoUrl` — относительный путь (`/projects/...html` или `/demo/...`);
   - `coverImage` — `/previews/<slug>.jpg` или любая ссылка на картинку.
3. Обложка: `npm run dev`, затем `npm run previews` — снимет первый экран всех шаблонов с `coverImage: /previews/...`.

`telegramUrl` можно оставить пустым — кнопка сама откроет чат @vzbbme с готовым текстом.

## Демо с онлайн-записью
`/demo/barbershop`, `/demo/dental`, `/demo/autoservice`, `/demo/coffee`, `/demo/renovation`, `/demo/vet`, `/demo/photo-studio`.
Виджет записи — `components/demo/DemoBooking.js` (ведёт себя как booking engine, но ничего не отправляет).
Рабочий booking engine (Supabase, magic link, кабинет, CRM) лежит в ветке `supabase-crm-landings` и подключается к проекту клиента при заказе.
