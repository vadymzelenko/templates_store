// Все данные сайта в одном месте.
// Поля с пометкой «ПРОВЕРИТЬ» нужно сверить со старым сайтом photo.enigmastudio.com.ua.

const pic = (id, w, h) => `https://picsum.photos/id/${id}/${w}/${h}`;

export const site = {
  name: "Enigma Studio",
  role: "Фотограф",
  cities: "Киев и Днепр",
  url: "https://photo.enigmastudio.com.ua",
  description:
    "Enigma Studio — фотограф в Киеве и Днепре: портреты, love story, семейные и свадебные съёмки, контент для брендов. Запись через Telegram-бота.",
  availability: "Сейчас открыта запись на ноябрь и декабрь.",

  contacts: {
    phone: "+38 (050) 420-01-10",
    phoneHref: "tel:+380504200110",
    email: "enigmastudio.com.ua@gmail.com",
    // ПРОВЕРИТЬ: ссылки соцсетей и бота
    instagram: { label: "Instagram", handle: "@enigma_studio_", href: "https://instagram.com/enigma_studio_" },
    telegram: { label: "Telegram", handle: "@enigma_studio", href: "https://t.me/enigma_studio" },
    bot: { label: "Telegram-бот", handle: "@enigma_studio_bot", href: "https://t.me/enigma_studio_bot" },
    youtube: { label: "YouTube", handle: "@enigma_studio_", href: "https://www.youtube.com/@enigma_studio_" },
    // ПРОВЕРИТЬ: адрес студии
    address: ["Студия в Киеве и Днепре,", "выезд по всей Украине"],
    hours: [
      ["Пн–Пт", "10:00–20:00"],
      ["Суббота", "10:00–18:00"],
      ["Воскресенье", "по договорённости"],
    ],
  },

  nav: [
    { href: "#work", label: "Портфолио" },
    { href: "#services", label: "Съёмки" },
    { href: "#prices", label: "Цены" },
    { href: "#faq", label: "Вопросы" },
    { href: "#contact", label: "Контакты" },
  ],
};

// Портфолио. Сейчас это атмосферные фото-заглушки (Unsplash через picsum.photos).
// Замените на свои: положите файлы в /public/photos и укажите src: "/photos/имя.jpg".
export const photos = {
  scarf: { src: pic(1005, 1200, 1500), w: 1200, h: 1500, alt: "Девушка в шарфе смотрит на море в сумерках", credit: "Matthew Wiebe" },
  ribbon: { src: pic(1014, 1600, 1000), w: 1600, h: 1000, alt: "Девушка с лентой в волосах у туманного моря", credit: "Oscar Keys" },
  hair: { src: pic(497, 1200, 1500), w: 1200, h: 1500, alt: "Ветер в волосах, серый фон, чёрно-белый кадр", credit: "Volkan Olmez" },
  reading: { src: pic(832, 1600, 1000), w: 1600, h: 1000, alt: "Девушка читает в мягком свете окна", credit: "hieu le" },
  sparkler: { src: pic(660, 1200, 1200), w: 1200, h: 1200, alt: "Девушка с бенгальским огнём в руках", credit: "Morgan Sessions" },
  dusk: { src: pic(550, 1600, 1000), w: 1600, h: 1000, alt: "Девушка над вечерним городом", credit: "Christopher Sardegna" },
  train: { src: pic(821, 1200, 1500), w: 1200, h: 1500, alt: "Девушка на перроне, мимо проносится поезд", credit: "Eutah Mizushima" },
  camera: { src: pic(91, 1200, 1600), w: 1200, h: 1600, alt: "Руки держат плёночную двухобъективную камеру", credit: "Jennifer Trovato" },
  coat: { src: pic(338, 1600, 1000), w: 1600, h: 1000, alt: "Человек в пальто с капюшоном у туманного моря", credit: "Patryk Sobczak" },
  daisies: { src: pic(375, 1200, 1600), w: 1200, h: 1600, alt: "Человек среди ромашек в сумерках", credit: "Wellington Sanipe" },
  suit: { src: pic(22, 1200, 1500), w: 1200, h: 1500, alt: "Мужчина в тёмном костюме на разметке дороги", credit: "Alejandro Escamilla" },
  guitar: { src: pic(334, 1600, 1000), w: 1600, h: 1000, alt: "Мужчина с гитарой на туманном пляже", credit: "Kimberly Richards" },
  seawall: { src: pic(349, 1200, 1500), w: 1200, h: 1500, alt: "Мужчина на набережной смотрит на город", credit: "Caleb George" },
  canoe: { src: pic(1011, 1600, 1000), w: 1600, h: 1000, alt: "Девушка в каноэ на бирюзовом озере", credit: "Roberto Nickson" },
  fog: { src: pic(669, 1200, 1500), w: 1200, h: 1500, alt: "Человек в горчичной куртке в тумане", credit: "Luke Pamer" },
  snow: { src: pic(726, 1600, 1000), w: 1600, h: 1000, alt: "Человек в красной куртке в заснеженном поле", credit: "Caleb George" },
  tram: { src: pic(220, 2400, 1400), w: 2400, h: 1400, alt: "Трамвайные пути уходят в туман под фонарями", credit: "Robin Röcker" },
  book: { src: pic(24, 1200, 1200), w: 1200, h: 1200, alt: "Раскрытая книга на деревянном столе", credit: "Alejandro Escamilla" },
};

// Контактный лист на первом экране: серии кадров с названием над первым кадром.
export const sheet = [
  { title: "Love story у моря", frames: ["scarf", "ribbon", "coat"] },
  { title: "Портрет в студии", frames: ["hair", "suit"] },
  { title: "Домашняя съёмка", frames: ["reading", "sparkler"] },
  { title: "Город вечером", frames: ["dusk", "train", "seawall"] },
  { title: "На природе", frames: ["daisies", "canoe", "fog", "snow"] },
];

// Полноэкранная серия «шторкой».
export const curtain = [
  { photo: "coat", caption: "Love story, ранний вечер у воды" },
  { photo: "reading", caption: "Домашний портрет при свете окна" },
  { photo: "ribbon", caption: "Ветер, туман и одна лента" },
];

// ПРОВЕРИТЬ: список съёмок и цены сверить со старым сайтом.
export const services = [
  { id: "portrait", name: "Портрет", who: "Один человек", where: "Студия или город", time: "1–2 часа", photo: "hair" },
  { id: "lovestory", name: "Love story", who: "Пара", where: "Город, природа", time: "1,5–2 часа", photo: "scarf" },
  { id: "family", name: "Семейная", who: "До шести человек", where: "Дом, студия, парк", time: "1–2 часа", photo: "sparkler" },
  { id: "pregnancy", name: "Беременность", who: "Будущая мама и пара", where: "Студия", time: "1 час", photo: "reading" },
  { id: "content", name: "Контент для бренда", who: "Эксперт, бизнес", where: "Студия, офис", time: "2–3 часа", photo: "suit" },
  { id: "wedding", name: "Свадьба", who: "Пара и гости", where: "Весь день", time: "4–10 часов", photo: "ribbon" },
  { id: "event", name: "Репортаж", who: "Праздник, корпоратив", where: "Выезд", time: "От 2 часов", photo: "dusk" },
];

export const priceGroups = [
  {
    name: "Для одного человека",
    items: [
      { id: "portrait", name: "Портрет, 1 час", note: "20 кадров в авторской обработке", price: 2500, hourly: 2500, base: 1 },
      { id: "pregnancy", name: "Беременность, 1 час", note: "Студия включена, 20 кадров", price: 3000, hourly: 3000, base: 1 },
      { id: "content", name: "Контент для бренда, 2 часа", note: "60 кадров для соцсетей и сайта", price: 6000, hourly: 3000, base: 2 },
    ],
  },
  {
    name: "Пары и семьи",
    items: [
      { id: "lovestory", name: "Love story, 1,5 часа", note: "35 кадров, помощь с локацией и образами", price: 3500, hourly: 2400, base: 1.5 },
      { id: "family", name: "Семейная, 1 час", note: "25 кадров, дети и питомцы — пожалуйста", price: 2800, hourly: 2800, base: 1 },
    ],
  },
  {
    name: "События",
    items: [
      { id: "wedding", name: "Свадьба, за час", note: "От 4 часов, все удачные кадры в обработке", price: 3000, hourly: 3000, base: 4, perHour: true },
      { id: "event", name: "Репортаж, за час", note: "От 2 часов, 40 кадров за час", price: 2200, hourly: 2200, base: 2, perHour: true },
    ],
  },
  {
    name: "Дополнительно",
    items: [
      { id: "studio", name: "Аренда студии, час", note: "Оплачивается по счёту студии", price: 800, extra: true },
      { id: "mua", name: "Визажист и укладка", note: "Подбираю мастера под образ", price: 1500, extra: true },
      { id: "express", name: "Срочная обработка", note: "Готовые кадры за 3 дня", price: 1000, extra: true },
    ],
  },
];

export const steps = [
  {
    when: "За неделю до съёмки",
    text: "обсуждаем идею в Telegram: настроение, локацию, одежду. Пришлю подборку референсов и подскажу, что взять с собой.",
    photo: "camera",
  },
  {
    when: "В день съёмки",
    text: "работаем спокойно, без спешки и дежурных поз. Я подсказываю, как встать и куда смотреть, — вы просто проводите время.",
    photo: "book",
  },
  {
    when: "Через 7–10 дней",
    text: "присылаю онлайн-галерею с обработанными кадрами. Её удобно скачать целиком и отправить близким одной ссылкой.",
    photo: "train",
  },
];

export const facts = [
  ["Где", "Киев и Днепр, выезд по Украине"],
  ["Запись", "Через Telegram-бота, предоплата 30%"],
  ["Готовность", "7–10 дней, срочно — 3 дня"],
];

export const faq = [
  {
    q: "Я не умею позировать. Что делать?",
    a: "Почти никто не умеет, и это нормально. Я веду всю съёмку: подсказываю позу, движение, куда деть руки. Через десять минут о камере обычно забывают.",
  },
  {
    q: "Сколько кадров я получу?",
    a: "Зависит от формата: от 20 кадров за час портретной съёмки. Количество указано в прайсе рядом с каждой съёмкой.",
  },
  {
    q: "Можно получить все исходники?",
    a: "Я отдаю отобранные кадры в авторской обработке. Исходники без обработки не передаю — они не показывают того, что получилось в итоге.",
  },
  {
    q: "Как забронировать дату?",
    a: "Напишите в Telegram-бота: выберите формат и удобную дату, бот пришлёт свободные окна. Дата закрепляется после предоплаты 30%.",
  },
  {
    q: "Что если пойдёт дождь?",
    a: "Перенесём съёмку на другой день без доплаты или переедем в студию. Решаем вместе накануне.",
  },
  {
    q: "Помогаете с образом и локацией?",
    a: "Да. Подскажу одежду и цвета, предложу места под ваше настроение и при необходимости подберу визажиста.",
  },
];
