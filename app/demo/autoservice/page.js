import './auto.css';
import DemoBar from '@/components/demo/DemoBar';
import DemoBooking from '@/components/demo/DemoBooking';
import Estimate from './Estimate';

export const metadata = { title: 'Гараж 14 — автосервис · демо', description: 'Демо-лендинг СТО: прикидка стоимости, загрузка постов, запись на ремонт' };

const posts = [
  { n: 'Пост 1', job: 'Ходовая · Skoda Octavia', left: 'до 13:30', busy: true },
  { n: 'Пост 2', job: 'ТО · Toyota RAV4', left: 'до 12:00', busy: true },
  { n: 'Пост 3', job: 'Свободен', left: 'с 11:00', busy: false },
  { n: 'Пост 4', job: 'Диагностика · Kia Ceed', left: 'до 11:40', busy: true },
];

const works = [
  ['Двигатель', 'ТО, ремень ГРМ, прокладки, течи масла'],
  ['Ходовая', 'Рычаги, сайлентблоки, амортизаторы, ступицы'],
  ['Тормоза', 'Колодки, диски, суппорты, жидкость'],
  ['Электрика', 'Компьютерная диагностика, проводка, стартеры'],
  ['Кондиционер', 'Заправка, поиск утечек, чистка испарителя'],
  ['Шины', 'Сезонная замена, балансировка, хранение'],
];

export default function Autoservice() {
  return (
    <div className="ga">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Tektur:wght@500;700;800&family=Fira+Sans:wght@400;500;600&display=swap" />
      <DemoBar slug="autoservice" />

      <header className="ga-top">
        <a href="#" className="ga-logo"><span>Г14</span>Гараж 14</a>
        <nav><a href="#calc">Цены</a><a href="#works">Работы</a><a href="#book">Запись</a></nav>
        <a href="tel:+380000000000" className="ga-phone">+380 00 000 00 00</a>
      </header>

      <section className="ga-hero">
        <div className="ga-hero-l">
          <p className="ga-plate" aria-hidden="true"><span>UA</span>АА 1414 ВС</p>
          <h1>Ремонт без «а ещё у вас тут…»</h1>
          <p className="ga-lead">Сначала диагностика и цена, потом ремонт. Каждую найденную проблему показываем вживую или на фото, и только после «да» берёмся за работу.</p>
          <div className="ga-cta"><a href="#calc" className="ga-btn">Посчитать ремонт</a><a href="#book" className="ga-btn ghost">Записаться</a></div>
        </div>
        <div className="ga-posts">
          <p className="ga-posts-h"><span>Загрузка сейчас</span><b>3 / 4</b></p>
          {posts.map((p) => (
            <div key={p.n} className={`ga-post${p.busy ? '' : ' free'}`}>
              <span className="ga-post-n">{p.n}</span>
              <span className="ga-post-j">{p.job}</span>
              <span className="ga-post-t">{p.left}</span>
            </div>
          ))}
          <p className="ga-posts-f">Ближайшее окно — сегодня</p>
        </div>
      </section>

      <div className="ga-tape" aria-hidden="true" />

      <section id="calc" className="ga-sec">
        <div className="ga-sec-h">
          <h2>Сколько будет стоить</h2>
          <p>Предварительная цена работ. Запчасти — по чеку поставщика, можно привезти свои.</p>
        </div>
        <Estimate />
      </section>

      <section id="works" className="ga-sec">
        <div className="ga-sec-h"><h2>Что делаем</h2><p>Легковые машины и микроавтобусы до 3,5 т. Европа, Япония, Корея.</p></div>
        <ul className="ga-works">
          {works.map(([t, x], i) => (
            <li key={t}><span>{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{x}</p></li>
          ))}
        </ul>
      </section>

      <section id="book" className="ga-sec ga-book">
        <div className="ga-sec-h">
          <h2>Запись на пост</h2>
          <p>Выберите работу и время. Пока машина в ремонте, пишем в Telegram, что сделано и что нашли.</p>
          <dl className="ga-terms">
            <div><dt>Гарантия</dt><dd>6 мес. на работы</dd></div>
            <div><dt>Зона ожидания</dt><dd>кофе, Wi-Fi</dd></div>
            <div><dt>Оплата</dt><dd>картой или по счёту для ФОП</dd></div>
          </dl>
        </div>
        <div className="ga-book-card">
          <DemoBooking
            services={[{ name: 'Диагностика', price: '600 ₴' }, { name: 'ТО', price: 'от 900 ₴' }, { name: 'Ходовая', price: 'по осмотру' }, { name: 'Тормоза', price: 'от 500 ₴' }, { name: 'Шиномонтаж', price: 'от 800 ₴' }, { name: 'Кондиционер', price: 'от 900 ₴' }]}
            serviceLabel="Работа"
            hours={{ start: '08:00', end: '19:00', step: 60 }}
            closed={[0]}
            extra={[{ key: 'car', label: 'Марка и модель', placeholder: 'Skoda Octavia 2017' }]}
            submitText="Записаться"
            doneTitle="Пост забронирован"
          />
        </div>
      </section>

      <footer className="ga-foot">
        <p className="ga-foot-big">Гараж 14</p>
        <p>ул. Промышленная, 14, бокс 3 · Пн–Сб 8:00–19:00 · +380 00 000 00 00</p>
        <p className="ga-foot-small">Демо-проект Template Store. Сервис, номера и адрес вымышлены.</p>
      </footer>
    </div>
  );
}
