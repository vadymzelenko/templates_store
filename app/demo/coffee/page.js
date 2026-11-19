import './chalk.css';
import DemoBar from '@/components/demo/DemoBar';
import Board from './Board';
import OpenNow from './OpenNow';
import Reveal from '@/components/demo/Reveal';
import Reviews from '@/components/demo/Reviews';
import Photo from '@/components/ui/Photo';
import { P } from '@/lib/photos';

export const metadata = { title: 'Угол — кофейня', description: 'Сайт кофейни: меловая доска-меню и предзаказ к нужному времени' };

export default function Coffee() {
  return (
    <div className="cb">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Neucha&family=Cousine:wght@400;700&display=swap" />
      <DemoBar slug="coffee" />

      <section className="cb-board">
        <div className="cb-frame">
          <OpenNow />
          <header className="cb-head">
            <svg className="cb-cup" viewBox="0 0 120 100" aria-hidden="true">
              <path d="M22 40h64v20a32 32 0 0 1-64 0z M86 46h8a12 12 0 0 1 0 24h-9 M40 30c-6-8 6-12 0-22 M56 30c-6-8 6-12 0-22 M72 30c-6-8 6-12 0-22 M14 96h84" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h1>Угол</h1>
            <p>кофе · выпечка · ул. Ярославова, 1</p>
          </header>
          <Board />
          <p className="cb-scribble" aria-hidden="true">растительное молоко — бесплатно!</p>
        </div>
      </section>

      <section className="cb-wall" aria-label="Фото кофейни">
        <h2>Как у нас</h2>
        <div className="cb-wall-row" data-lenis-prevent>
          {[['cafe', 'Утро, 8:15'], ['coffeeArt', 'Латте-арт от Даши'], ['croissant', 'Круассаны из печи'], ['barista', 'Стойка у окна'], ['espresso', 'Эспрессо на зерне недели'], ['cafeDetail', 'Тот самый угол']].map(([k, cap], i) => (
            <Reveal key={k} delay={i * 0.05} className="cb-pol" style={{ '--r': `${[-3, 2, -1, 3, -2, 1][i]}deg` }}>
              <Photo id={P[k]} w={600} alt={cap} fallback="#e9dcc3" />
              <span>{cap}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="cb-napkins">
        <h2>Оставили на салфетках</h2>
        <Reviews className="cb-rv" fallback="#e9dcc3" items={[
          { name: 'Аня', meta: 'каждое утро перед работой', photo: P.face2, text: 'Заказываю с остановки — подхожу, а флэт уайт уже стоит с моим именем. Магия.' },
          { name: 'Тарас', meta: 'работает тут с ноутбуком', photo: P.face1, text: 'Лучший фильтр на Подоле и розетка у каждого столика. Синнабон — отдельная любовь.' },
          { name: 'Ира и Макс', meta: 'по выходным', photo: P.face4, text: 'Пришли за кофе, остались на завтрак. Банановый хлеб берём домой каждую субботу.' },
        ]} />
      </section>

      <footer className="cb-foot">
        <svg viewBox="0 0 300 160" className="cb-map" aria-hidden="true">
          <path d="M0 96 L300 76" stroke="#3a2a1f" strokeWidth="2" fill="none" />
          <path d="M0 120 L300 100" stroke="#3a2a1f" strokeWidth="2" fill="none" />
          <path d="M150 0 L176 160" stroke="#3a2a1f" strokeWidth="2" fill="none" />
          <path d="M176 0 L202 160" stroke="#3a2a1f" strokeWidth="2" fill="none" />
          <text x="10" y="70" fontFamily="Neucha" fontSize="14" fill="#3a2a1f">Ярославова</text>
          <text x="214" y="40" fontFamily="Neucha" fontSize="14" fill="#3a2a1f" transform="rotate(81 214 40)">Стрелецкая</text>
          <circle cx="206" cy="122" r="9" fill="#c8462b" /><text x="220" y="146" fontFamily="Neucha" fontSize="15" fill="#c8462b">мы тут!</text>
        </svg>
        <div>
          <p className="cb-foot-h">Где нас найти</p>
          <p>Угловая дверь с зелёной ручкой.<br />Пн–пт 7:30–20:00, сб–вс 9:00–21:00.</p>
          <p className="cb-foot-small">© Угол, {new Date().getFullYear()} · @ugol.coffee</p>
        </div>
      </footer>
    </div>
  );
}
