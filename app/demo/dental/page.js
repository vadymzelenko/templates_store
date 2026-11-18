import './letter.css';
import DemoBar from '@/components/demo/DemoBar';
import Prices from './Prices';
import Sentence from './Sentence';
import { doctors } from './data';

export const metadata = { title: 'Ровно — стоматология · демо', description: 'Демо-лендинг стоматологии в виде письма: смета, врачи, запись одной фразой' };

export default function Dental() {
  return (
    <div className="lt">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Caveat:wght@500&family=PT+Mono&display=swap" />
      <DemoBar slug="dental" />

      <header className="lt-head">
        <p className="lt-logo">Ровно<span>стоматология</span></p>
        <address>Киев, ул. Межигорская, 21<br />+380 00 000 00 00<br />пн–сб 8:00–20:00</address>
      </header>

      <main className="lt-body">
        <p className="lt-date">Подол, ноябрь</p>
        <h1>Здравствуйте.</h1>

        <p className="lt-lead">
          Мы — небольшая клиника на Подоле. Четыре врача, два кресла и одно правило:
          <mark> сначала смета, потом лечение.</mark>
        </p>
        <p>
          На первом приёме делаем снимок, смотрим каждый зуб и пишем план с ценой по каждой позиции.
          Его можно забрать с собой и подумать. Если в процессе что-то меняется, сначала спрашиваем вас, а уже потом меняем сумму.
        </p>
        <aside className="lt-side"><b>400 ₴</b> стоит первый визит вместе со снимком</aside>
        <p>
          Гарантия на пломбы — два года. Приём начинается вовремя, плюс-минус десять минут: мы не ставим пациентов «в окно» друг другу.
        </p>

        <h2>Сколько это стоит</h2>
        <Prices />

        <h2>Кто вас примет</h2>
        <ul className="lt-docs">
          {doctors.map((d) => (
            <li key={d.name}>
              <p><b>{d.name}</b> {d.text}</p>
              <span className="lt-sign" aria-hidden="true">{d.sign}</span>
            </li>
          ))}
        </ul>

        <h2 id="book">Записаться</h2>
        <p className="lt-hint">Заполните пропуски — получится готовая запись.</p>
        <Sentence />

        <p className="lt-ps"><span>P. S.</span> Если болит прямо сейчас — позвоните, <a href="tel:+380000000000">+380 00 000 00 00</a>. Острую боль принимаем в тот же день, без записи.</p>

        <p className="lt-bye">С заботой,<br /><span className="lt-sign big">врачи «Ровно»</span></p>
      </main>

      <footer className="lt-foot">Демо-проект Template Store. Клиника, врачи и адрес вымышлены.</footer>
    </div>
  );
}
