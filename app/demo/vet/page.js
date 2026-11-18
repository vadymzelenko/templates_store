import './passport.css';
import DemoBar from '@/components/demo/DemoBar';
import Passport from './Passport';
import { doctors } from './data';

export const metadata = { title: 'Друг — ветклиника · демо', description: 'Демо-лендинг ветклиники в виде ветпаспорта: кличка, услуги по виду животного, запись' };

export default function Vet() {
  return (
    <div className="vp">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Rubik+Mono+One&family=Nunito:wght@400;700;800&family=Caveat:wght@600&display=swap" />
      <DemoBar slug="vet" />
      <div className="vp-desk">
        <p className="vp-brand">друг<span>ветклиника</span></p>
        <Passport />
        <section className="vp-team">
          <p className="vp-small">4. ВРАЧИ КЛИНИКИ</p>
          <div className="vp-team-row">
            {doctors.map((d, i) => (
              <div key={d.name} className={`vp-member r${i}`}>
                <span className="vp-docstamp">{d.stamp}</span>
                <p className="vp-hand">{d.name}</p>
                <p>{d.role}</p>
              </div>
            ))}
          </div>
        </section>
        <footer className="vp-foot">ул. Садовая, 3 · ежедневно 9:00–21:00, ночью — экстренные · Демо-проект Template Store, клиника вымышлена.</footer>
      </div>
    </div>
  );
}
