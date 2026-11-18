import './garage.css';
import DemoBar from '@/components/demo/DemoBar';
import Garage from './Garage';
import { posts } from './data';

export const metadata = { title: 'Гараж 14 — автосервис · демо', description: 'Демо-лендинг СТО: выберите, что с машиной, и получите заказ-наряд с ценой' };

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

      <section className="g14-rules">
        <p><b>01</b> Сначала диагностика и цена. Ремонт — только после вашего «да».</p>
        <p><b>02</b> Каждую найденную проблему показываем вживую или на фото в Telegram.</p>
        <p><b>03</b> Запчасти по чеку поставщика. Можно привезти свои.</p>
        <p><b>04</b> Гарантия на работы — полгода, на любые.</p>
      </section>

      <footer className="g14-foot">
        <span>ГАРАЖ 14</span>
        <span>Демо-проект Template Store. Сервис, номера и адрес вымышлены.</span>
      </footer>
    </div>
  );
}
