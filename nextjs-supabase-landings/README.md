# Booking Sites — мультитенантная система записи на Next.js + Google Sheets

Один Next.js-процесс обслуживает несколько лендингов (`sites/<id>/`). Каждый сайт
хранит данные в своей Google Таблице через Apps Script (без Service Account).

## Быстрый старт (локально, без Google Sheets)

```bash
npm install
cp .env .env      # задайте DANCE_STUDIO_ADMIN_EMAIL / _PASSWORD
npm run dev
```

- Лендинг: http://localhost:3000/dance-studio
- Админка: http://localhost:3000/dance-studio/admin (логин/пароль из `.env`)
- Личный кабинет: открывается по ссылке из письма (`/dance-studio/dashboard`)

Без `DANCE_STUDIO_SHEETS_WEBAPP_URL` работает демо-хранилище в памяти (данные
пропадают при перезапуске). Письма при `EMAIL_PROVIDER=console` не отправляются —
ссылки подтверждения/входа печатаются в терминале, где запущен `npm run dev`.

## Структура

```
src/                  библиотека: BookingEngine, jwt, dates, адаптеры, schema-engine
lib/                  engine.js (сборка движка по env), demoStorage.js, adminAuth.js, cookies.js, env.js
sites/registry.js     реестр сайтов
sites/<id>/           config.js, landing.jsx, crm.jsx, apps-script/Code.gs
apps-script/Code.gs   шаблон серверной части для Google Таблицы
app/[site]/           страницы: лендинг, admin, dashboard
app/[site]/api/       confirm, login  — GET-ссылки из писем (baseUrl + /api/...)
app/api/[site]/       JSON API для лендинга, кабинета и админки
```

Почему два дерева API: `BookingEngine` строит ссылки из писем как
`<PREFIX>_BASE_URL + /api/confirm` (то есть `/dance-studio/api/confirm`), а
`landing.jsx`/`crm.jsx` ходят на `/api/dance-studio/...`.

## Подключение Google Sheets

1. Новая Google Таблица → Расширения → Apps Script → вставить `apps-script/Code.gs`.
2. Project Settings → Script Properties → `APPS_SCRIPT_SECRET` = ваш секрет.
3. Развернуть → Веб-приложение → «Выполнять от имени: я», «Доступ: Все». Скопировать URL `/exec`.
4. В `.env`: `<PREFIX>_SHEETS_WEBAPP_URL` и `<PREFIX>_SHEETS_SECRET` (тот же секрет).

## Как подключить следующий сайт

1. Создать `sites/<id>/` по образцу `dance-studio` (`config.js` с уникальными `id` и `envPrefix`,
   `landing.jsx`, `crm.jsx`). В `config.js` поле `crm` — обычный объект
   (`title`, `resourceLabel`, `bookingColumns`, `hideTabs`), не импорт компонента.
2. Дописать сайт в `sites/registry.js` (`config`, `Landing`, `Crm`).
3. Развернуть отдельную Google Таблицу + Apps Script (см. выше).
4. Скопировать блок `DANCE_STUDIO_*` в `.env` с новым префиксом.
5. Открыть `/<id>` и `/<id>/admin`.

## Безопасность

- Не коммитьте `.env`. Если секреты (Gmail App Password, Sheets secret, JWT) когда-либо
  попадали в чат/репозиторий — перевыпустите их.
- В продакшене задайте длинный случайный `<PREFIX>_JWT_SECRET`.
- `MemoryLockAdapter` работает в пределах одного процесса; для serverless с несколькими
  инстансами нужен свой `ILockProvider` (например, Redis).

## Известные ограничения

- `AppsScriptAdapter` реализует только `IBookingStorage`; schema-engine (`src/schema/*`)
  лежит отдельно и к адаптеру не подключён.
- Проект собран без запуска `npm install`/`next build` (в среде сборки не было сети) —
  первый запуск может потребовать мелких правок.
