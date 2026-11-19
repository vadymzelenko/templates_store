import './passport.css';
import DemoBar from '@/components/demo/DemoBar';
import Passport from './Passport';
import { doctors } from './data';
import Reveal from '@/components/demo/Reveal';
import Reviews from '@/components/demo/Reviews';
import Photo from '@/components/ui/Photo';
import { P } from '@/lib/photos';

export const metadata = { title: 'Друг — ветклиника', description: 'Сайт ветклиники в виде ветпаспорта: кличка, услуги по виду животного, запись' };

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
                <Photo id={P[d.photo]} w={300} alt={d.name} className="vp-mphoto" fallback="#e6dcc8" />
                <span className="vp-docstamp">{d.stamp}</span>
                <p className="vp-hand">{d.name}</p>
                <p>{d.role}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="vp-team vp-pets">
          <p className="vp-small">5. ПАЦИЕНТЫ И ИХ ЛЮДИ</p>
          <div className="vp-pets-row">
            {[['dogs', 'Рыжик и Луна', 'после стерилизации'], ['vetDog', 'Бакс', 'прививки по графику'], ['cat', 'Мурка', 'чистка зубов']].map(([k, n, m], i) => (
              <Reveal key={k} delay={i * 0.08} className="vp-pet"><Photo id={P[k]} w={600} alt={n} fallback="#e6dcc8" /><b>{n}</b><span>{m}</span></Reveal>
            ))}
          </div>
          <Reviews className="vp-rv" fallback="#e6dcc8" items={[
            { name: 'Ольга, хозяйка Рыжика', meta: 'стерилизация', photo: P.face4, text: 'Тарас позвонил сам через час после операции и рассказал, как Рыжик отходит от наркоза. Такого внимания я не видела нигде.' },
            { name: 'Денис, хозяин Бакса', meta: 'вакцинация', photo: P.face1, text: 'Напоминание о прививке пришло за неделю. Записался прямо из сообщения, в клинике уже знали, кто такой Бакс.' },
            { name: 'Света, хозяйка Мурки', meta: 'ночной визит', photo: P.face2, text: 'В два часа ночи Мурка начала задыхаться. Взяли трубку со второго гудка, когда приехали — кабинет уже был готов.' },
          ]} />
        </section>

        <footer className="vp-foot">ул. Садовая, 3 · ежедневно 9:00–21:00, ночью — экстренные · © Друг, {new Date().getFullYear()}</footer>
      </div>
    </div>
  );
}
