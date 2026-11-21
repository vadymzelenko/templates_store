# Enigma Studio — сайт фотографа

Next.js 15 (App Router, JavaScript), GSAP + ScrollTrigger + SplitText, Lenis для плавной прокрутки.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Где менять данные

Все тексты, контакты, цены, вопросы и фотографии — в `lib/site.js`.

- **Контакты и ссылки** — `site.contacts` (телефон, почта, Instagram, Telegram, бот, адрес, часы).
- **Фото** — `photos`. Сейчас там атмосферные заглушки с Unsplash (picsum.photos).
  Положите свои снимки в `public/photos/` и укажите `src: "/photos/имя.jpg"` с реальными `w`/`h`.
  После замены уберите строку с авторами Unsplash из `components/Footer.js`.
- **Цены** — `priceGroups` (`base` — базовые часы пакета, `perHour` — цена за час).
- **Бот**: кнопки ведут на `t.me/<бот>?start=<параметр>`, например `lovestory_120m_mua`
  (формат, минуты, допы) — бот может разобрать параметр и сразу предложить даты.

## Устройство

- `components/Motion.js` — Lenis и общая система появления: любой блок с `data-section`
  показывает свои `data-reveal` по очереди (`lines` — строки из маски, `develop` — кадр «проявляется»,
  `rows` — построчно, по умолчанию — подъём с прозрачностью). Без JS контент виден сразу,
  `prefers-reduced-motion` убирает движение.
- `components/Overlays.js` — лайтбокс (клавиши, свайп) и уведомления.
- Секции: `Hero` (контактный лист), `Intro`, `Gallery` (шторка), `Services` (список с превью),
  `Pricing` (меню цен и калькулятор), `Process`, `Faq`, `Contact`, `Footer`.
