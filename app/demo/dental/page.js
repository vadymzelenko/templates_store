import './dental.css';
import DemoBar from '@/components/demo/DemoBar';
import DemoBooking from '@/components/demo/DemoBooking';
import PriceFilter from './PriceFilter';

export const metadata = { title: 'Ровно — стоматология · демо', description: 'Демо-лендинг стоматологии: прозрачный прайс, врачи, запись онлайн' };

const doctors = [
  { name: 'Ольга Савчук', short: 'Савчук О. В.', role: 'Терапевт, эндодонтист', years: 14, tags: ['Лечение каналов', 'Микроскоп'] },
  { name: 'Игорь Мельник', short: 'Мельник И. А.', role: 'Хирург-имплантолог', years: 11, tags: ['Имплантация', 'Удаление'] },
  { name: 'Анна Ковальчук', short: 'Ковальчук А. С.', role: 'Ортодонт', years: 8, tags: ['Брекеты', 'Элайнеры'] },
  { name: 'Мария Литвин', short: 'Литвин М. Д.', role: 'Гигиенист', years: 6, tags: ['Чистка', 'Детский приём'] },
];

const visit = [
  { t: 'Осмотр и снимок', x: 'Панорамный снимок делаем на месте, он входит в стоимость консультации.' },
  { t: 'План и смета', x: 'Пишем план лечения с ценами по каждому зубу. Цена в смете не растёт.' },
  { t: 'Лечение', x: 'Начинаем в тот же день, если вы готовы. Если нет — отдаём план с собой.' },
];

export default function Dental() {
  return (
    <div className="dn">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Commissioner:wght@300..700&display=swap" />
      <DemoBar slug="dental" />

      <header className="dn-top">
        <a href="#" className="dn-logo"><span className="dn-logo-mark" aria-hidden="true" />Ровно</a>
        <nav><a href="#prices">Цены</a><a href="#doctors">Врачи</a><a href="#visit">Первый визит</a><a href="#contacts">Контакты</a></nav>
        <a href="#book" className="dn-btn">Записаться</a>
      </header>

      <section className="dn-hero">
        <div>
          <p className="dn-kicker">Стоматология на Подоле · Пн–Сб 8:00–20:00</p>
          <h1>Лечим зубы без сюрпризов в&nbsp;чеке</h1>
          <p className="dn-lead">Сначала смета с ценой по каждому зубу, потом лечение. Если в процессе что-то меняется, сначала спрашиваем вас.</p>
          <div className="dn-hero-cta">
            <a href="#book" className="dn-btn lg">Записаться на осмотр</a>
            <span className="dn-hero-price">Консультация и снимок — <b>400 ₴</b></span>
          </div>
        </div>
        <dl className="dn-facts">
          <div><dt>Гарантия на пломбы</dt><dd>2 года</dd></div>
          <div><dt>Снимок на месте</dt><dd>3D и панорама</dd></div>
          <div><dt>Приём начинается</dt><dd>вовремя ±10 мин</dd></div>
          <div><dt>Лицензия МОЗ</dt><dd>№ 000000</dd></div>
        </dl>
      </section>

      <section id="prices" className="dn-sec">
        <div className="dn-sec-h">
          <h2>Цены</h2>
          <p>Указываем цену «от и до». Точная сумма — в смете после осмотра.</p>
        </div>
        <PriceFilter />
      </section>

      <section id="doctors" className="dn-sec">
        <div className="dn-sec-h"><h2>Врачи</h2><p>У каждого пациента свой лечащий врач, который ведёт его от осмотра до результата.</p></div>
        <div className="dn-docs">
          {doctors.map((d) => (
            <article key={d.name} className="dn-doc">
              <div className="dn-doc-pic" aria-hidden="true">{d.name.split(' ').map((w) => w[0]).join('')}</div>
              <div>
                <h3>{d.name}</h3>
                <p className="dn-doc-role">{d.role} · стаж {d.years} лет</p>
                <ul>{d.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="visit" className="dn-sec">
        <div className="dn-sec-h"><h2>Первый визит</h2><p>Около 40 минут. Ничего не лечим без вашего согласия.</p></div>
        <ol className="dn-visit">
          {visit.map((v) => <li key={v.t}><h3>{v.t}</h3><p>{v.x}</p></li>)}
        </ol>
      </section>

      <section id="book" className="dn-sec dn-book">
        <div className="dn-sec-h">
          <h2>Запись к врачу</h2>
          <p>Выберите врача и время. Напомним о приёме за день, перенести можно в личном кабинете.</p>
          <p className="dn-call">Болит прямо сейчас? Звоните: <a href="tel:+380000000000">+380 00 000 00 00</a> — примем сегодня.</p>
        </div>
        <div className="dn-book-card">
          <DemoBooking
            services={[{ name: 'Осмотр и план', price: '400 ₴' }, { name: 'Лечение', price: 'по смете' }, { name: 'Гигиена', price: '1 600 ₴' }, { name: 'Консультация ортодонта', price: '500 ₴' }]}
            serviceLabel="Цель визита"
            resources={doctors.map((d) => ({ name: d.short }))}
            resourceLabel="Врач"
            anyResource="Ближайший свободный"
            hours={{ start: '08:00', end: '20:00', step: 40 }}
            closed={[0]}
            busyRate={0.4}
            submitText="Записаться"
            doneTitle="Ждём вас на приём"
          />
        </div>
      </section>

      <footer id="contacts" className="dn-foot">
        <div><p className="dn-logo">Ровно</p><p>ул. Межигорская, 21, 1 этаж</p></div>
        <div><p>+380 00 000 00 00</p><p>Пн–Сб 8:00–20:00, Вс — выходной</p></div>
        <p className="dn-foot-small">Демо-проект студии «Прилавок». Клиника, врачи и лицензия вымышлены.</p>
      </footer>
    </div>
  );
}
