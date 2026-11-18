import './barber.css';
import DemoBar from '@/components/demo/DemoBar';
import DemoBooking from '@/components/demo/DemoBooking';
import PickButton from '@/components/PickButton';

export const metadata = { title: 'Ремесло — барбершоп · демо', description: 'Демо-лендинг барбершопа с онлайн-записью к мастеру' };

const prices = [
  { group: 'Стрижки', items: [
    { name: 'Мужская стрижка', time: '50 мин', price: '650' },
    { name: 'Стрижка машинкой', time: '30 мин', price: '400' },
    { name: 'Удлинённая стрижка', time: '60 мин', price: '750' },
    { name: 'Детская, до 12 лет', time: '40 мин', price: '450' },
  ] },
  { group: 'Борода и бритьё', items: [
    { name: 'Моделирование бороды', time: '30 мин', price: '400' },
    { name: 'Королевское бритьё', time: '45 мин', price: '550' },
    { name: 'Камуфляж седины', time: '20 мин', price: '350' },
  ] },
  { group: 'Вместе выгоднее', items: [
    { name: 'Стрижка + борода', time: '80 мин', price: '950' },
    { name: 'Отец + сын', time: '90 мин', price: '1 000' },
  ] },
];

const masters = [
  { name: 'Артём', role: 'Топ-барбер', years: '9 лет в профессии', note: 'Классика, фейды, сложные удлинённые формы.', next: '14:00' },
  { name: 'Денис', role: 'Барбер', years: '5 лет', note: 'Короткие стрижки и бороды любой длины.', next: '12:30' },
  { name: 'Слава', role: 'Барбер', years: '3 года', note: 'Текстура, кроп, укладки. Спокойно работает с детьми.', next: '16:00' },
];

export default function Barbershop() {
  return (
    <div className="bb">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Alumni+Sans:wght@500;700;800;900&family=Literata:opsz,wght@7..72,400;7..72,600&display=swap" />
      <DemoBar slug="barbershop" />

      <header className="bb-top">
        <a href="#" className="bb-logo">РЕМЕСЛО<small>барбершоп · с 2016</small></a>
        <nav><a href="#price">Прайс</a><a href="#team">Мастера</a><a href="#where">Адрес</a></nav>
        <a href="tel:+380000000000" className="bb-phone">+380 00 000 00 00</a>
        <a href="#book" className="bb-cta">Записаться</a>
      </header>

      <section className="bb-hero">
        <h1><span>Стрижём</span><span className="bb-out">по-честному</span></h1>
        <div className="bb-hero-row">
          <p className="bb-lead">Мужские стрижки и бороды без спешки. Час на клиента, кофе за счёт заведения, мастер не меняется от визита к визиту.</p>
          <div className="bb-today">
            <p className="bb-today-h">Сегодня в зале</p>
            {masters.map((m) => (
              <div key={m.name} className="bb-today-row">
                <span>{m.name}</span><i /><span>свободен с {m.next}</span>
              </div>
            ))}
            <a href="#book" className="bb-today-link">Выбрать время →</a>
          </div>
        </div>
      </section>

      <div className="bb-strip">
        <span>ул. Литейная, 7</span><span>Ежедневно 10:00–21:00</span><span>Парковка во дворе</span><span>Оплата картой</span>
      </div>

      <section id="price" className="bb-sec">
        <div className="bb-sec-h"><h2>Прайс</h2><p>Цены в гривнах. Без скрытых доплат за «длинные волосы» и «сложный случай».</p></div>
        <div className="bb-price">
          {prices.map((g) => (
            <div key={g.group} className="bb-pgroup">
              <h3>{g.group}</h3>
              <ul>
                {g.items.map((i) => (
                  <li key={i.name}>
                    <span className="bb-pname">{i.name}<small>{i.time}</small></span>
                    <span className="bb-dots" aria-hidden="true" />
                    <span className="bb-pval">{i.price}</span>
                    <PickButton fieldKey="service" value={i.name} className="bb-pick">записаться</PickButton>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="team" className="bb-sec">
        <div className="bb-sec-h"><h2>Мастера</h2><p>Можно записаться к конкретному мастеру или к тому, кто свободен раньше.</p></div>
        <div className="bb-team">
          {masters.map((m) => (
            <article key={m.name} className="bb-m">
              <div className="bb-m-pic" aria-hidden="true"><span>{m.name[0]}</span></div>
              <p className="bb-m-role">{m.role} · {m.years}</p>
              <h3>{m.name}</h3>
              <p>{m.note}</p>
              <PickButton fieldKey="resource" value={m.name} className="bb-link">Записаться к {m.name === 'Слава' ? 'Славе' : m.name === 'Денис' ? 'Денису' : 'Артёму'} →</PickButton>
            </article>
          ))}
        </div>
      </section>

      <section id="book" className="bb-sec bb-book">
        <div className="bb-sec-h">
          <h2>Запись</h2>
          <p>Выберите услугу, мастера и свободное время. Подтверждение придёт на почту, перенести запись можно в личном кабинете.</p>
          <ul className="bb-rules">
            <li><b>15 минут</b> ждём, если опаздываете. Дальше — переносим.</li>
            <li><b>Кофе, чай</b> или вода, пока ждёте.</li>
            <li><b>Отменить</b> можно в кабинете за 2 часа.</li>
          </ul>
        </div>
        <div className="bb-book-card">
          <DemoBooking
            services={prices.flatMap((g) => g.items).slice(0, 8).map((i) => ({ name: i.name, price: `${i.price} ₴` }))}
            resources={masters}
            resourceLabel="Мастер"
            hours={{ start: '10:00', end: '21:00', step: 60 }}
            submitText="Записаться"
            doneTitle="До встречи в «Ремесле»"
          />
        </div>
      </section>

      <footer id="where" className="bb-foot">
        <div><p className="bb-foot-big">ул. Литейная, 7</p><p>Вход со двора, вывеска с ножницами. Ежедневно 10:00–21:00.</p></div>
        <div><p>+380 00 000 00 00</p><p>@remeslo.barber</p></div>
        <p className="bb-foot-small">Демо-проект Template Store. Все имена и контакты вымышлены.</p>
      </footer>
    </div>
  );
}
