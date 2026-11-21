# Вылет — сайт школы иностранных языков

Next.js 16 (App Router, JavaScript) + GSAP 3 (ScrollTrigger, SplitText, Flip, CustomEase).

Идея: школа языков, оформленная как аэропорт. Курсы — рейсы на табло вылетов
с перекидными буквами, заявка — посадочный талон, который собирается на странице
и уходит в Telegram-бот уже заполненным.

## Запуск

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Панель управления (/admin)

Откройте `/admin`, войдите паролем из переменной `ADMIN_PASSWORD`
(в режиме разработки без `.env.local` подходит пароль `admin`). Пример переменных — в `.env.example`.

- **Заявки** из формы «Перезвоним»: статусы (новая, в работе, записан, отказ), заметки, поиск, выгрузка в CSV для Excel.
- **Контакты**: телефон, адрес, часы, почта, Telegram-бот и канал, Instagram.
- **Главный экран, расписание групп, цены, об уроке, шаги записи, сравнение, что входит, вопросы, фото.**

После «Сохранить» сайт обновляется сразу. Опасные ссылки (не https) панель не сохранит.

Если заданы `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`, каждая новая заявка приходит сообщением в Telegram.

### Где хранятся данные

- `content/site.default.json` — исходный контент (в git).
- `content/site.json` — правки из панели, `content/leads.json` — заявки. Оба файла не попадают в git.

Хранилище файловое, поэтому сайт нужно запускать как Node-сервер (`npm run build && npm start`
на VPS, в Docker с томом на `content/` и т. п.). На Vercel и других serverless-хостингах файлы
между запусками не сохраняются — там понадобится база данных (меняется только `src/lib/store.js`).

Кнопки записи открывают бота с параметром `start`, чтобы бот знал, откуда пришёл человек:
`site_hero`, `flight_EN-B1`, `plan_group`, а из конструктора билета — `en_b1_group_adult`
(язык_уровень_формат_возраст).

## Структура

- `src/app` — layout (шрифты Unbounded + Onest с кириллицей, SEO, JSON-LD), страница, 404, robots, sitemap,
  `privacy` (шаблон политики), `admin` (панель), `api/leads` (приём заявок).
- `src/lib/store.js` — чтение и запись контента и заявок, `src/lib/auth.js` — вход в панель.
- `src/components` — секции: Hero (иллюминатор со сменой городов), Marquee, Departures (табло),
  Lesson, Compare, Baggage, Route, BoardingPass (живой конструктор билета), Pricing, Faq,
  Callback (форма звонка), Contact, Footer (открывается из-под страницы), MobileBar.
- `src/lib/gsap.js` — регистрация плагинов и кривые анимаций.

Все анимации уважают `prefers-reduced-motion`; без JavaScript контент остаётся видимым.
