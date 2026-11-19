import './letter.css';
import { MapPin, Phone, Clock, ShieldCheck, ScanLine, Timer } from 'lucide-react';
import DemoBar from '@/components/demo/DemoBar';
import Reveal from '@/components/demo/Reveal';
import Reviews from '@/components/demo/Reviews';
import Photo from '@/components/ui/Photo';
import { P } from '@/lib/photos';
import Prices from './Prices';
import Sentence from './Sentence';
import { doctors, reviews } from './data';

export const metadata = { title: 'Ровно — стоматология на Подоле', description: 'Стоматология «Ровно»: сначала смета, потом лечение. Запись к врачу онлайн' };

export default function Dental() {
  return (
    <div className="lt">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Caveat:wght@500&family=PT+Mono&display=swap" />
      <DemoBar slug="dental" />

      <header className="lt-head">
        <p className="lt-logo">Ровно<span>стоматология</span></p>
        <nav><a href="#prices">Цены</a><a href="#doctors">Врачи</a><a href="#reviews">Отзывы</a><a href="#book" className="lt-nav-cta">Записаться</a></nav>
      </header>

      <section className="lt-hero">
        <div className="lt-hero-text">
          <p className="lt-date">Подол, Киев</p>
          <h1>Здравствуйте.</h1>
          <p className="lt-lead">Мы — небольшая клиника на Подоле. Четыре врача, два кресла и одно правило: <mark>сначала смета, потом лечение.</mark></p>
          <p>На первом приёме делаем снимок, смотрим каждый зуб и пишем план с ценой по каждой позиции. Его можно забрать с собой и подумать. Первый визит вместе со снимком стоит <b>400 ₴</b>.</p>
          <a href="#book" className="lt-btn">Записаться на осмотр</a>
        </div>
        <Reveal className="lt-hero-pics">
          <Photo id={P.dentist} w={900} alt="Врач на приёме" className="lt-pic-a" fallback="#dfe8e4" />
          <Photo id={P.dentalRoom} w={700} alt="Кабинет клиники" className="lt-pic-b" fallback="#e9efec" />
          <span className="lt-sticker"><b>2 года</b>гарантия на пломбы</span>
        </Reveal>
      </section>

      <section className="lt-facts">
        {[[ShieldCheck, 'Цена не растёт', 'Если в процессе что-то меняется, сначала спрашиваем вас.'], [ScanLine, '3D-снимок на месте', 'Не нужно ехать в диагностический центр.'], [Timer, 'Приём вовремя', 'Плюс-минус десять минут: не ставим пациентов «в окно».']].map(([Icon, t, x]) => (
          <Reveal key={t} className="lt-fact"><Icon strokeWidth={1.4} /><b>{t}</b><span>{x}</span></Reveal>
        ))}
      </section>

      <section className="lt-sec" id="prices">
        <div className="lt-sec-h"><h2>Сколько это стоит</h2><p>Цены «от и до». Точная сумма — в смете после осмотра.</p></div>
        <Prices />
      </section>

      <section className="lt-sec" id="doctors">
        <div className="lt-sec-h"><h2>Кто вас примет</h2><p>У каждого пациента свой лечащий врач.</p></div>
        <ul className="lt-docs">
          {doctors.map((d, i) => (
            <Reveal as="li" key={d.name} delay={i * 0.06}>
              <Photo id={P[d.photo]} w={300} alt={d.name} className="lt-doc-pic" fallback="#e3ece8" />
              <p><b>{d.name}</b> {d.text}</p>
              <span className="lt-sign" aria-hidden="true">{d.sign}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="lt-sec lt-rv-sec" id="reviews">
        <div className="lt-sec-h"><h2>Пишут пациенты</h2><p>4,9 из 5 на Google — 312 отзывов.</p></div>
        <Reviews items={reviews.map((r) => ({ ...r, photo: P[r.photo] }))} className="lt-rv" fallback="#e3ece8" />
      </section>

      <section className="lt-sec lt-book" id="book">
        <div className="lt-sec-h"><h2>Записаться</h2><p>Заполните пропуски — получится готовая запись.</p></div>
        <Sentence />
        <p className="lt-ps"><span>P. S.</span> Если болит прямо сейчас — позвоните, <a href="tel:+380000000000">+380 00 000 00 00</a>. Острую боль принимаем в тот же день, без записи.</p>
        <p className="lt-bye">С заботой,<br /><span className="lt-sign big">врачи «Ровно»</span></p>
      </section>

      <footer className="lt-foot">
        <span><MapPin size={16} /> Киев, ул. Межигорская, 21</span>
        <span><Phone size={16} /> +380 00 000 00 00</span>
        <span><Clock size={16} /> пн–сб 8:00–20:00</span>
        <span>© Ровно, {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
