import './coffee.css';
import DemoBar from '@/components/demo/DemoBar';
import Preorder from './Preorder';
import OpenNow from './OpenNow';

export const metadata = { title: 'Угол — кофейня · демо', description: 'Демо-лендинг кофейни: меню, «открыто сейчас», предзаказ к нужному времени' };

export default function Coffee() {
  return (
    <div className="cf">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Prosto+One&family=Rubik:wght@400;500;600&display=swap" />
      <DemoBar slug="coffee" />

      <header className="cf-top">
        <a href="#" className="cf-logo">Угол</a>
        <OpenNow />
        <nav><a href="#menu">Меню</a><a href="#order">Предзаказ</a><a href="#where">Где мы</a></nav>
      </header>

      <section className="cf-hero">
        <h1>Кофе на углу Ярославовой и Стрелецкой</h1>
        <div className="cf-hero-side">
          <p>Обжариваем зерно сами раз в неделю, печём круассаны с 6 утра. Закажите заранее — заберёте без очереди.</p>
          <a href="#order" className="cf-btn">Заказать к приходу</a>
        </div>
        <div className="cf-cup" aria-hidden="true">
          <svg viewBox="0 0 200 200" width="100%" height="100%">
            <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 7" />
            <path d="M52 78h86v38a43 43 0 0 1-86 0z" fill="currentColor" />
            <path d="M138 88h10a16 16 0 0 1 0 32h-12" fill="none" stroke="currentColor" strokeWidth="9" />
            <path d="M78 40c-8 10 8 16 0 28M100 34c-8 12 8 20 0 34M122 40c-8 10 8 16 0 28" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <rect x="40" y="160" width="120" height="6" rx="3" fill="currentColor" />
          </svg>
        </div>
      </section>

      <section id="menu" className="cf-sec cf-menu-sec">
        <h2>Меню</h2>
        <p className="cf-sub">Растительное молоко без доплаты. Цены в гривнах.</p>
        <div className="cf-board">
          <table>
            <thead><tr><th>Кофе</th><th>S</th><th>M</th><th>L</th></tr></thead>
            <tbody>
              {[['Эспрессо', 45, '—', '—'], ['Американо', 50, 60, 70], ['Капучино', 60, 75, 90], ['Флэт уайт', 75, '—', '—'], ['Латте', 65, 80, 95], ['Раф ванильный', 80, 95, 110], ['Фильтр дня', 55, 65, '—']].map(([n, ...p]) => (
                <tr key={n}><td>{n}</td>{p.map((x, i) => <td key={i}>{x}</td>)}</tr>
              ))}
            </tbody>
          </table>
          <table>
            <thead><tr><th>Не кофе</th><th>S</th><th>M</th><th>L</th></tr></thead>
            <tbody>
              {[['Какао', 60, 75, 90], ['Матча латте', 80, 95, '—'], ['Чай листовой', 45, 55, '—'], ['Лимонад сезонный', '—', 75, 90]].map(([n, ...p]) => (
                <tr key={n}><td>{n}</td>{p.map((x, i) => <td key={i}>{x}</td>)}</tr>
              ))}
            </tbody>
          </table>
          <table>
            <thead><tr><th colSpan="3">Выпечка</th><th>шт</th></tr></thead>
            <tbody>
              {[['Круассан', 55], ['Пан о шоколя', 65], ['Синнабон', 70], ['Банановый хлеб', 60]].map(([n, p]) => (
                <tr key={n}><td colSpan="3">{n}</td><td>{p}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="order" className="cf-sec cf-order">
        <div className="cf-order-h">
          <h2>Предзаказ</h2>
          <p className="cf-sub">Соберите заказ и выберите, когда зайдёте. Бариста начнёт готовить за 5 минут до этого времени.</p>
        </div>
        <Preorder />
      </section>

      <section id="where" className="cf-sec cf-where">
        <div>
          <h2>Где мы</h2>
          <p className="cf-addr">ул. Ярославова, 1 — угловая дверь с зелёной ручкой</p>
          <dl className="cf-hours">
            <div><dt>Пн–Пт</dt><dd>7:30–20:00</dd></div>
            <div><dt>Сб–Вс</dt><dd>9:00–21:00</dd></div>
          </dl>
        </div>
        <div className="cf-map" aria-hidden="true">
          <svg viewBox="0 0 400 260" width="100%" height="100%">
            <rect width="400" height="260" fill="#eadfc9" />
            <path d="M0 150 L400 120" stroke="#f8f3e9" strokeWidth="34" />
            <path d="M190 0 L230 260" stroke="#f8f3e9" strokeWidth="30" />
            <text x="18" y="112" fontSize="13" fill="#8a735f" fontFamily="Rubik">ул. Ярославова</text>
            <text x="238" y="40" fontSize="13" fill="#8a735f" fontFamily="Rubik" transform="rotate(80 238 40)">ул. Стрелецкая</text>
            <circle cx="236" cy="162" r="14" fill="#c8462b" />
            <circle cx="236" cy="162" r="5" fill="#f3ead9" />
          </svg>
        </div>
      </section>

      <footer className="cf-foot">
        <span>Угол · кофе и выпечка</span><span>@ugol.coffee</span>
        <span className="cf-foot-small">Демо-проект Template Store. Кофейня и адрес вымышлены.</span>
      </footer>
    </div>
  );
}
