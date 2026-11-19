import './blueprint.css';
import DemoBar from '@/components/demo/DemoBar';
import Plan from './Plan';
import Measure from './Measure';
import { stages } from './data';
import Reveal from '@/components/demo/Reveal';
import Reviews from '@/components/demo/Reviews';
import Photo from '@/components/ui/Photo';
import { P } from '@/lib/photos';

export const metadata = { title: 'Метр — ремонт квартир', description: 'Сайт ремонта в виде чертежа: кликабельная планировка, смета и сроки' };

const WEEKS = 8;

export default function Renovation() {
  return (
    <div className="bp">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&family=Russo+One&display=swap" />
      <DemoBar slug="renovation" />

      <header className="bp-top">
        <p className="bp-logo">МЕТР</p>
        <p className="bp-mono">ремонт квартир · Киев · 140+ объектов с 2015</p>
        <a href="#measure" className="bp-mono bp-link">→ бесплатный замер</a>
      </header>

      <section className="bp-hero">
        <h1>Посчитайте ремонт прямо на&nbsp;чертеже</h1>
        <Plan />
      </section>

      <section className="bp-sec">
        <h2><span className="bp-mono">Лист 2</span>Сроки — по неделям, как в договоре</h2>
        <div className="bp-gantt" role="table" aria-label="График работ">
          <div className="bp-g-row bp-g-head" role="row">
            <span role="columnheader">Этап</span>
            {Array.from({ length: WEEKS }, (_, i) => <span key={i} role="columnheader">нед {i + 1}</span>)}
          </div>
          {stages.map(([n, start, len]) => (
            <div key={n} className="bp-g-row" role="row">
              <span role="cell">{n}</span>
              <div className="bp-g-track" role="cell" aria-label={`с ${start + 1}-й недели, ${len} нед.`}>
                <i style={{ left: `${(start / WEEKS) * 100}%`, width: `${(len / WEEKS) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="bp-note">Платите по этапам, после приёмки каждого. Фотоотчёт в Telegram — каждую пятницу.</p>
      </section>

      <section className="bp-sec">
        <h2><span className="bp-mono">Лист 3</span>Сданные объекты</h2>
        <div className="bp-objs">
          {[['interior', 'Двушка на Лукьяновке', '54 м²', '8 нед.'], ['penthouse', 'Трёшка в сталинке', '78 м²', '11 нед.'], ['villa', 'Дом в Буче', '140 м²', '16 нед.'], ['estate', 'Студия на Оболони', '31 м²', '5 нед.']].map(([k, n, a, w], i) => (
            <Reveal key={k} delay={i * 0.07} className="bp-obj">
              <Photo id={P[k]} w={900} alt={n} fallback="#2a5a96" />
              <div className="bp-obj-t"><b>{n}</b><span>{a} · {w}</span></div>
            </Reveal>
          ))}
        </div>
        <Reviews className="bp-rv" fallback="#2a5a96" items={[
          { name: 'Алина и Рома', meta: 'двушка, 54 м²', photo: P.face4, text: 'Смета в договоре совпала с финальной суммой до гривны. Каждую пятницу — фото в Telegram, мы ни разу не ездили на объект без повода.' },
          { name: 'Виктор', meta: 'сталинка, 78 м²', photo: P.face5, text: 'Старые стены, кривые полы, проводка 60-х. Ребята честно сказали про сроки — и уложились.' },
          { name: 'Оксана', meta: 'студия, 31 м²', photo: P.face6, text: 'Посчитала ремонт на сайте, на замере цена отличалась на 4%. Так и было в итоге.' },
        ]} />
      </section>

      <section className="bp-sec" id="measure">
        <h2><span className="bp-mono">Лист 4</span>Вызвать замерщика</h2>
        <Measure />
      </section>

      <footer className="bp-foot bp-mono">
        <span>МЕТР · +380 00 000 00 00 · пн–сб 9–19</span>
        <span>© МЕТР, 2015–{new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
