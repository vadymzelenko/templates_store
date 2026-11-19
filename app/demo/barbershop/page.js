import './poster.css';
import { Scissors, MapPin, Clock, Phone, AtSign } from 'lucide-react';
import DemoBar from '@/components/demo/DemoBar';
import Reveal from '@/components/demo/Reveal';
import Reviews from '@/components/demo/Reviews';
import Photo from '@/components/ui/Photo';
import { P } from '@/lib/photos';
import TearOffs from './TearOffs';
import Booking from './Booking';
import { services, masters, gallery, reviews } from './data';

export const metadata = { title: 'Ремесло — барбершоп', description: 'Барбершоп «Ремесло»: мужские стрижки и бороды, запись к мастеру онлайн' };

export default function Barbershop() {
  return (
    <div className="ps-page">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Alumni+Sans:wght@600;800;900&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&display=swap" />
      <DemoBar slug="barbershop" />

      <div className="ps-wall">
        <section className="ps-poster">
          <div className="ps-tape ps-tape-l" aria-hidden="true" />
          <div className="ps-tape ps-tape-r" aria-hidden="true" />
          <p className="ps-top"><span>Барбершоп</span><span className="ps-est"><Scissors size={16} /> осн. 2016 <Scissors size={16} style={{ transform: 'scaleX(-1)' }} /></span><span>ул. Литейная, 7</span></p>
          <h1 className="ps-name">Ремесло</h1>
          <p className="ps-sub">стрижка · борода · опасная бритва</p>
          <div className="ps-card" aria-label="Мастера">
            {masters.map((m, i) => (
              <span key={m.name} className="ps-card-n">{m.name}{i < masters.length - 1 && <Scissors className="ps-x" aria-hidden="true" />}</span>
            ))}
          </div>
          <p className="ps-every">Ежедневно <b>10—21</b> · без выходных · кофе бесплатно</p>
          <a href="#book" className="ps-stamp" aria-label="Записаться: стрижка 650 гривен"><span>стрижка</span><b>650</b><span>гривен</span></a>
          <TearOffs />
        </section>
        <p className="ps-note"><span>Сорвите листок с услугой — она сразу попадёт в запись</span></p>

        {/* Фото зала на скотче */}
        <section className="ps-gallery" aria-label="Фото барбершопа">
          {gallery.map((g, i) => (
            <Reveal key={g.photo} delay={i * 0.08} className="ps-polaroid" style={{ '--r': `${g.rot}deg` }}>
              <span className="ps-tape-s" aria-hidden="true" />
              <Photo id={P[g.photo]} w={700} alt={g.cap} fallback="#3a332c" />
              <p>{g.cap}</p>
            </Reveal>
          ))}
        </section>

        <Reveal as="section" className="ps-fight" id="team">
          <h2>Сегодня в кресле</h2>
          {masters.map((m) => (
            <article key={m.name} className="ps-fighter">
              <Photo id={P[m.photo]} w={240} alt={m.name} className="ps-f-photo" fallback="#3a332c" />
              <div>
                <h3>{m.name} <em>{m.nick}</em></h3>
                <p>{m.does}</p>
                <span className="ps-f-years"><b>{m.years}</b> лет в деле</span>
              </div>
              <a href="#book" data-master={m.name} className="ps-f-go">к нему →</a>
            </article>
          ))}
        </Reveal>

        <section className="ps-reviews">
          <h2>Что говорят в зале</h2>
          <Reviews items={reviews.map((r) => ({ ...r, photo: P[r.photo] }))} className="ps-rv" fallback="#3a332c" />
        </section>

        <section id="book" className="ps-book">
          <Booking services={services} masters={masters} />
        </section>

        <footer className="ps-foot">
          <p className="ps-foot-big">Литейная, 7</p>
          <ul className="ps-foot-list">
            <li><MapPin size={18} /> Вход со двора, ищите вывеску с ножницами</li>
            <li><Clock size={18} /> Ежедневно 10:00–21:00</li>
            <li><Phone size={18} /> <a href="tel:+380000000000">+380 00 000 00 00</a></li>
            <li><AtSign size={18} /> @remeslo.barber</li>
          </ul>
          <p className="ps-foot-small">© Ремесло, 2016–{new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}
