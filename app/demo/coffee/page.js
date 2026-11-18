import './chalk.css';
import DemoBar from '@/components/demo/DemoBar';
import Board from './Board';
import OpenNow from './OpenNow';

export const metadata = { title: 'Угол — кофейня · демо', description: 'Демо-лендинг кофейни: меловая доска-меню и предзаказ к нужному времени' };

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
          <p className="cb-foot-small">Демо-проект Template Store. Кофейня и адрес вымышлены.</p>
        </div>
      </footer>
    </div>
  );
}
