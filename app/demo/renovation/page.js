import './reno.css';
import DemoBar from '@/components/demo/DemoBar';
import DemoBooking from '@/components/demo/DemoBooking';
import Calc from './Calc';

export const metadata = { title: 'Метр — ремонт квартир · демо', description: 'Демо-лендинг ремонта: калькулятор, этапы, объекты, запись на замер' };

const stages = [
  { w: '1', t: 'Замер и смета', x: 'Обмеры, фото, смета по позициям. Фиксируем цену работ в договоре.' },
  { w: '2–3', t: 'Черновые работы', x: 'Демонтаж, электрика, сантехника, стяжка и штукатурка по маякам.' },
  { w: '4–6', t: 'Чистовая отделка', x: 'Плитка, шпаклёвка под покраску, полы, двери.' },
  { w: '7', t: 'Сдача', x: 'Клининг, установка техники, акт приёмки и гарантия 3 года.' },
];

const objects = [
  { name: 'Двушка на Лукьяновке', area: 54, weeks: 8, type: 'Капитальный', plan: 'M10 10h120v80H10z M70 10v50 M70 60h60 M10 60h30' },
  { name: 'Студия в новостройке', area: 31, weeks: 5, type: 'Под ключ', plan: 'M10 10h120v80H10z M90 10v35h40 M10 70h40v20' },
  { name: 'Трёшка, сталинка', area: 78, weeks: 11, type: 'Дизайнерский', plan: 'M10 10h120v80H10z M50 10v80 M90 10v45 M90 55h40 M50 50h40' },
];

export default function Renovation() {
  return (
    <div className="rn">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=Ubuntu+Mono&display=swap" />
      <DemoBar slug="renovation" />

      <header className="rn-top">
        <a href="#" className="rn-logo">МЕТР<span>ремонт квартир</span></a>
        <nav><a href="#calc">Калькулятор</a><a href="#stages">Этапы</a><a href="#objects">Объекты</a></nav>
        <a href="#book" className="rn-btn sm">Бесплатный замер</a>
      </header>

      <section className="rn-hero">
        <div className="rn-hero-t">
          <p className="rn-mono">Киев и область · 140+ квартир с 2015</p>
          <h1>Ремонт по смете, в которой нет слова «примерно»</h1>
          <p className="rn-lead">Фиксируем цену работ и сроки в договоре. Платите по этапам, после приёмки каждого. Фотоотчёт в Telegram каждую пятницу.</p>
          <a href="#calc" className="rn-btn">Посчитать свою квартиру</a>
        </div>
        <figure className="rn-plan" aria-hidden="true">
          <svg viewBox="0 0 320 240" width="100%">
            <defs><pattern id="g" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="#c9d0d6" strokeWidth=".6" /></pattern></defs>
            <rect width="320" height="240" fill="url(#g)" />
            <g fill="none" stroke="#1b2a3a" strokeWidth="5" strokeLinecap="square">
              <path d="M24 24h272v192H24z" />
              <path d="M168 24v80M168 136v80M24 128h80M136 128h32M232 104h64" />
            </g>
            <g fill="none" stroke="#e5602a" strokeWidth="1.5">
              <path d="M104 128a32 32 0 0 1 32-32" /><path d="M168 104a32 32 0 0 1 32 32" />
            </g>
            <g fontFamily="Ubuntu Mono" fontSize="11" fill="#1b2a3a">
              <text x="60" y="80">Гостиная 18,4</text><text x="200" y="64">Спальня 12,1</text>
              <text x="44" y="176">Кухня 9,8</text><text x="196" y="172">С/у 4,2</text>
            </g>
            <g fontFamily="Ubuntu Mono" fontSize="10" fill="#e5602a"><text x="140" y="16">8 400</text><path d="M24 10h272" stroke="#e5602a" strokeWidth="1" /></g>
          </svg>
          <figcaption className="rn-mono">План 54 м² · кап. ремонт · 8 недель</figcaption>
        </figure>
      </section>

      <section id="calc" className="rn-sec">
        <div className="rn-sec-h"><p className="rn-mono">01</p><h2>Калькулятор</h2><p>Работы и черновые материалы. Чистовые — по вашему выбору, со скидкой наших поставщиков.</p></div>
        <Calc />
      </section>

      <section id="stages" className="rn-sec">
        <div className="rn-sec-h"><p className="rn-mono">02</p><h2>Этапы на примере 54 м²</h2></div>
        <ol className="rn-stages">
          {stages.map((s) => (
            <li key={s.t}><span className="rn-mono">неделя {s.w}</span><h3>{s.t}</h3><p>{s.x}</p></li>
          ))}
        </ol>
      </section>

      <section id="objects" className="rn-sec">
        <div className="rn-sec-h"><p className="rn-mono">03</p><h2>Сданные объекты</h2></div>
        <div className="rn-objs">
          {objects.map((o) => (
            <article key={o.name} className="rn-obj">
              <svg viewBox="0 0 140 100" width="100%" aria-hidden="true"><path d={o.plan} fill="none" stroke="#1b2a3a" strokeWidth="3" /></svg>
              <h3>{o.name}</h3>
              <dl><div><dt>Площадь</dt><dd>{o.area} м²</dd></div><div><dt>Срок</dt><dd>{o.weeks} нед.</dd></div><div><dt>Тип</dt><dd>{o.type}</dd></div></dl>
            </article>
          ))}
        </div>
      </section>

      <section id="book" className="rn-sec rn-book">
        <div className="rn-sec-h">
          <p className="rn-mono">04</p><h2>Бесплатный замер</h2>
          <p>Инженер приедет с лазерным дальномером, через 2 дня пришлём смету по позициям. Ни к чему не обязывает.</p>
        </div>
        <div className="rn-book-card">
          <DemoBooking
            services={[{ name: 'Квартира в новостройке' }, { name: 'Вторичное жильё' }, { name: 'Только санузел' }, { name: 'Дом' }]}
            serviceLabel="Что ремонтируем"
            hours={{ start: '09:00', end: '19:00', step: 120 }}
            closed={[0]}
            busyRate={0.3}
            extra={[{ key: 'addr', label: 'Район или адрес', placeholder: 'Оболонь, ул. Героев полка Азов' }]}
            submitText="Записаться на замер"
            doneTitle="Инженер приедет"
          />
        </div>
      </section>

      <footer className="rn-foot">
        <span>МЕТР · ремонт квартир</span><span>+380 00 000 00 00</span><span>Пн–Сб 9:00–19:00</span>
        <span className="rn-foot-small">Демо-проект Template Store. Компания, объекты и цены вымышлены.</span>
      </footer>
    </div>
  );
}
