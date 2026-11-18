import './poster.css';
import DemoBar from '@/components/demo/DemoBar';
import TearOffs from './TearOffs';
import Booking from './Booking';
import { services, masters } from './data';

export const metadata = { title: 'Ремесло — барбершоп · демо', description: 'Демо-лендинг барбершопа в стиле уличной афиши, с записью к мастеру' };

export default function Barbershop() {
  return (
    <div className="ps-page">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Alumni+Sans:wght@600;800;900&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&display=swap" />
      <DemoBar slug="barbershop" />

      <div className="ps-wall">
        {/* АФИША */}
        <section className="ps-poster">
          <div className="ps-tape ps-tape-l" aria-hidden="true" />
          <div className="ps-tape ps-tape-r" aria-hidden="true" />
          <p className="ps-top"><span>Барбершоп</span><span>★ осн. 2016 ★</span><span>ул. Литейная, 7</span></p>
          <h1 className="ps-name">Ремесло</h1>
          <p className="ps-sub">стрижка · борода · опасная бритва</p>
          <div className="ps-card" aria-label="Мастера">
            {masters.map((m, i) => (
              <span key={m.name} className="ps-card-n">{m.name}{i < masters.length - 1 && <i>✕</i>}</span>
            ))}
          </div>
          <p className="ps-every">Ежедневно <b>10—21</b> · без выходных · кофе бесплатно</p>
          <a href="#book" className="ps-stamp" aria-label="Записаться: стрижка 650 гривен">
            <span>стрижка</span><b>650</b><span>гривен</span>
          </a>
          <TearOffs />
        </section>

        <aside className="ps-note">
          <p>Сорвите листок с нужной услугой — она сразу попадёт в запись.</p>
        </aside>

        {/* МАСТЕРА — как анонс боёв */}
        <section className="ps-fight" id="team">
          <h2>Сегодня в кресле</h2>
          {masters.map((m) => (
            <article key={m.name} className="ps-fighter">
              <span className="ps-f-years"><b>{m.years}</b>лет<br />в деле</span>
              <div>
                <h3>{m.name} <em>{m.nick}</em></h3>
                <p>{m.does}</p>
              </div>
              <a href={`#book`} data-master={m.name} className="ps-f-go">к нему →</a>
            </article>
          ))}
        </section>

        {/* ЗАПИСЬ — билет */}
        <section id="book" className="ps-book">
          <Booking services={services} masters={masters} />
        </section>

        <footer className="ps-foot">
          <p className="ps-foot-big">Литейная, 7</p>
          <p>Вход со двора, ищите вывеску с ножницами · +380 00 000 00 00 · @remeslo.barber</p>
          <p className="ps-foot-small">Демо-проект Template Store. Имена и контакты вымышлены.</p>
        </footer>
      </div>
    </div>
  );
}
