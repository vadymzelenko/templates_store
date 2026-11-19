import './timetable.css';
import DemoBar from '@/components/demo/DemoBar';
import Timetable from './Timetable';
import Reveal from '@/components/demo/Reveal';
import Reviews from '@/components/demo/Reviews';
import Photo from '@/components/ui/Photo';
import { P } from '@/lib/photos';
import { coaches, passes } from './data';

export const metadata = { title: 'Тяга — фитнес-студия', description: 'Сайт фитнес-студии: расписание недели на первом экране и запись в один клик' };

export default function Fitness() {
  return (
    <div className="ty">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=IBM+Plex+Sans+Condensed:wght@400;600&display=swap" />
      <DemoBar slug="fitness" />

      <header className="ty-top">
        <p className="ty-logo">ТЯГА</p>
        <p className="ty-sub">студия групповых тренировок · Киев, Лукьяновка · группы до 12 человек</p>
        <p className="ty-first">первое занятие — <b>бесплатно</b></p>
      </header>

      <h1 className="ty-h">Неделя</h1>
      <Timetable />

      <section className="ty-band" aria-label="Студия">
        {[['pilates', 'Пилатес на реформерах'], ['workout', 'Функционал в малых группах'], ['yoga', 'Растяжка по вечерам'], ['gym', 'Зал 220 м² с окнами в пол']].map(([k, cap], i) => (
          <Reveal key={k} delay={i * 0.07} className="ty-band-item"><Photo id={P[k]} w={800} alt={cap} fallback="#d9d5cc" /><span>{cap}</span></Reveal>
        ))}
      </section>

      <section className="ty-coaches">
        <h2>Тренеры</h2>
        <ol>
          {coaches.map((c) => (
            <li key={c.name}><Photo id={P[c.photo]} w={400} alt={c.full} className="ty-cphoto" fallback="#d9d5cc" /><div><span className="ty-cn">{c.name}</span><b>{c.full}</b><p>{c.does}</p></div></li>
          ))}
        </ol>
      </section>

      <section className="ty-reviews">
        <h2>После месяца в Тяге</h2>
        <Reviews className="ty-rv" fallback="#d9d5cc" items={[
          { name: 'Катя, 34', meta: 'пилатес 2 раза в неделю', photo: P.face2, text: 'Спина перестала болеть к третьей неделе. Ира замечает каждую мелочь, хотя в группе восемь человек.' },
          { name: 'Дима, 41', meta: 'функционал + бокс', photo: P.face5, text: 'Бронирую тренировки с телефона по дороге с работы. Видно, сколько мест осталось — не надо писать администратору.' },
          { name: 'Оля, 27', meta: 'растяжка', photo: P.face10, text: 'Села на продольный шпагат за четыре месяца. Лена — лучший тренер по растяжке, что у меня был.' },
        ]} />
      </section>

      <section className="ty-passes">
        <h2>Абонементы</h2>
        <div className="ty-cards">
          {passes.map((p) => (
            <div key={p.name} className="ty-card">
              <p className="ty-card-n">{p.name}</p>
              <div className="ty-holes" aria-hidden="true">
                {Array.from({ length: p.count === 0 ? 12 : Math.min(p.count, 12) }, (_, i) => <i key={i} className={p.count === 0 ? 'inf' : ''} />)}
              </div>
              <p className="ty-card-p">{p.price.toLocaleString('ru-RU').replace(/,/g, ' ')} ₴</p>
              <p className="ty-card-x">{p.count ? `${Math.round(p.price / p.count)} ₴ за занятие · 30 дней` : 'сколько угодно · 30 дней'}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="ty-foot">
        <span>ТЯГА · ул. Мельникова, 18 · +380 00 000 00 00</span>
        <span>© Тяга, {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
