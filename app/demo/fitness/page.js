import './timetable.css';
import DemoBar from '@/components/demo/DemoBar';
import Timetable from './Timetable';
import { coaches, passes } from './data';

export const metadata = { title: 'Тяга — фитнес-студия · демо', description: 'Демо-лендинг фитнес-студии: расписание недели на первом экране и запись в один клик' };

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

      <section className="ty-coaches">
        <h2>Тренеры</h2>
        <ol>
          {coaches.map((c) => (
            <li key={c.name}><span className="ty-cn">{c.name}</span><div><b>{c.full}</b><p>{c.does}</p></div></li>
          ))}
        </ol>
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
        <span>Демо-проект Template Store. Студия и тренеры вымышлены.</span>
      </footer>
    </div>
  );
}
