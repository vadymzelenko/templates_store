import './garage.css';
import DemoBar from '@/components/demo/DemoBar';
import Garage from './Garage';
import Reveal from '@/components/demo/Reveal';
import Reviews from '@/components/demo/Reviews';
import Photo from '@/components/ui/Photo';
import { P } from '@/lib/photos';
import { Wrench, ShieldCheck, Coffee, Camera } from 'lucide-react';
import { posts } from './data';

export const metadata = { title: 'Гараж 14 — автосервис', description: 'Сайт СТО: выберите, что с машиной, и получите заказ-наряд с ценой' };

export default function Autoservice() {
  return (
    <div className="g14">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Tektur:wght@500;700;900&family=Fira+Sans+Condensed:wght@400;500;600&display=swap" />
      <DemoBar slug="autoservice" />

      <header className="g14-top">
        <span className="g14-plate"><i>UA</i>ГАРАЖ 14</span>
        <span className="g14-addr">ул. Промышленная, 14, бокс 3 · пн–сб 8:00–19:00</span>
        <a className="g14-tel" href="tel:+380000000000">+380 00 000 00 00</a>
      </header>

      <Garage />

      {/* Ворота боксов: что сейчас на постах */}
      <section className="g14-doors" aria-label="Загрузка постов">
        {posts.map((p) => (
          <div key={p.n} className={`g14-door${p.car ? '' : ' open'}`}>
            <span className="g14-door-n">{p.n}</span>
            {p.car ? (
              <p><b>{p.car}</b>{p.job}<br />до {p.until}</p>
            ) : (
              <p><b>Свободен</b>с {p.until} — заезжайте</p>
            )}
          </div>
        ))}
      </section>

      <section className="g14-shop" aria-label="Наш сервис">
        <Reveal className="g14-shot big"><Photo id={P.mechanic} w={1200} alt="Мастер за работой" fallback="#2b2d31" /><span>Пост 1 · ходовая</span></Reveal>
        <Reveal className="g14-shot" delay={0.08}><Photo id={P.carService} w={800} alt="Диагностика" fallback="#2b2d31" /><span>Компьютерная диагностика</span></Reveal>
        <Reveal className="g14-shot" delay={0.16}><Photo id={P.car} w={800} alt="Готовая машина" fallback="#2b2d31" /><span>Выдача после ТО</span></Reveal>
      </section>

      <section className="g14-rules">
        {[[Wrench, 'Сначала цена', 'Диагностика, потом смета. Ремонт — только после вашего «да».'], [Camera, 'Показываем всё', 'Каждую проблему — вживую или на фото в Telegram.'], [Coffee, 'Зона ожидания', 'Кофе, Wi-Fi и окно в бокс: видно, что делают с машиной.'], [ShieldCheck, 'Гарантия 6 месяцев', 'На любые работы. Запчасти по чеку поставщика или ваши.']].map(([Icon, t, x], i) => (
          <Reveal key={t} delay={i * 0.06}><Icon className="g14-ico" strokeWidth={1.6} /><b>{t}</b><span>{x}</span></Reveal>
        ))}
      </section>

      <section className="g14-rv-sec">
        <h2>Что говорят клиенты</h2>
        <Reviews className="g14-rv" fallback="#2b2d31" items={[
          { name: 'Сергей', meta: 'Skoda Octavia, 2016', photo: P.face5, text: 'Приехал со стуком в подвеске, уехал через два часа. По телефону назвали 1 900 ₴, в чеке — 1 900 ₴. Редкость.' },
          { name: 'Марина', meta: 'Kia Sportage, 2019', photo: P.face2, text: 'Прислали фото изношенных колодок прямо с подъёмника. Я не разбираюсь в машинах, но тут всё было понятно.' },
          { name: 'Павел', meta: 'Ford Transit, 2014', photo: P.face3, text: 'Возим на ТО весь наш парк из трёх бусов. Записываю на сайте за минуту, счёт приходит на ФОП.' },
        ]} />
      </section>

      <footer className="g14-foot">
        <span>ГАРАЖ 14</span>
        <span>ул. Промышленная, 14, бокс 3 · © Гараж 14, {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
