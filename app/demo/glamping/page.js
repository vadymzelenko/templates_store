import './forest.css';
import DemoBar from '@/components/demo/DemoBar';
import Stay from './Stay';
import { day } from './data';
import Reveal from '@/components/demo/Reveal';
import Reviews from '@/components/demo/Reviews';
import Photo from '@/components/ui/Photo';
import { P } from '@/lib/photos';

export const metadata = { title: 'Сосны — глэмпинг', description: 'Сайт глэмпинга: ночной лес и бронирование шатра по датам' };

function Night() {
  const stars = Array.from({ length: 70 }, (_, i) => [(i * 137.5) % 1200, (i * 53) % 330, (i % 3) + 1]);
  const pines = Array.from({ length: 22 }, (_, i) => [i * 58 - 20 + ((i * 17) % 23), 300 + ((i * 41) % 90), 90 + ((i * 29) % 80)]);
  return (
    <svg className="gl-night" viewBox="0 0 1200 560" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b1530" /><stop offset=".7" stopColor="#1d2c52" /><stop offset="1" stopColor="#33416b" /></linearGradient>
        <radialGradient id="glow"><stop offset="0" stopColor="#ffcf7a" stopOpacity=".9" /><stop offset="1" stopColor="#ffcf7a" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="1200" height="560" fill="url(#sky)" />
      {stars.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r * 0.7} fill="#fff" opacity={0.4 + (i % 5) * 0.12} className={i % 7 === 0 ? 'tw' : ''} />)}
      <circle cx="960" cy="110" r="46" fill="#f6eed2" /><circle cx="980" cy="98" r="44" fill="#1a2850" />
      <path d="M0 470 Q300 400 600 450 T1200 430 V560 H0z" fill="#0e1a33" />
      {pines.map(([x, y, h], i) => <path key={i} d={`M${x} ${y} l${h * 0.22} ${h} h-${h * 0.44}z`} fill={i % 2 ? '#0a1428' : '#0d1a31'} />)}
      {/* шатры с тёплым светом */}
      <circle cx="380" cy="490" r="70" fill="url(#glow)" /><path d="M330 520 L380 450 L430 520z" fill="#e9a54a" /><path d="M372 520 L380 490 L388 520z" fill="#5a2d0c" />
      <circle cx="700" cy="500" r="60" fill="url(#glow)" /><path d="M660 525 a40 40 0 0 1 80 0z" fill="#f0b45c" />
      <circle cx="560" cy="540" r="26" fill="url(#glow)" /><path d="M552 548 l8 -20 8 20z" fill="#ff8b3d" />
      <rect y="545" width="1200" height="15" fill="#08101f" />
    </svg>
  );
}

export default function Glamping() {
  return (
    <div className="gl">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Prata&family=Commissioner:wght@300;400;600&display=swap" />
      <DemoBar slug="glamping" />
      <section className="gl-hero">
        <Night />
        <div className="gl-hero-t">
          <p className="gl-kicker">глэмпинг в 90 км от Киева</p>
          <h1>Сосны</h1>
          <p>Шесть шатров на берегу лесного озера. Без вай-фая в спальнях — зато со звёздами, которых в городе не видно.</p>
          <a href="#stay" className="gl-btn">Выбрать даты</a>
        </div>
      </section>
      <section id="stay" className="gl-sec">
        <h2>Когда приедете?</h2>
        <p className="gl-sub">Цена — за ночь в шатре. Пятница и суббота дороже, зачёркнутые ночи уже заняты.</p>
        <Stay />
      </section>
      <section className="gl-gallery" aria-label="Фото глэмпинга">
        <div className="gl-gal-row" data-lenis-prevent>
          {[['tentNight', 'Купол ночью', 'tall'], ['lake', 'Озеро в 7 утра', ''], ['campfire', 'Костровая', ''], ['tent', 'Сафари-тент', 'tall']].map(([k, cap, cls], i) => (
            <Reveal key={k} delay={i * 0.06} className={`gl-gal-item ${cls}`}><Photo id={P[k]} w={1000} alt={cap} fallback="#1d2c52" /><span>{cap}</span></Reveal>
          ))}
        </div>
      </section>

      <section className="gl-sec gl-day">
        <h2>Один день в Соснах</h2>
        <ol>{day.map(([t, x]) => <li key={t}><time>{t}</time><span>{x}</span></li>)}</ol>
      </section>
      <section className="gl-sec">
        <h2>Гости пишут</h2>
        <Reviews className="gl-rv" fallback="#1d2c52" items={[
          { name: 'Марта и Олег', meta: 'Купол, 2 ночи', photo: P.face12, text: 'Лежали в кровати и смотрели на звёзды через потолок. Утром — кофе на веранде и туман над озером. Вернёмся летом.' },
          { name: 'Семья Ткачей', meta: 'А-фрейм, 3 ночи', photo: P.face5, text: 'Дети не вспомнили про планшеты ни разу: сап, велосипеды, костёр. Банный чан — отдельный восторг.' },
          { name: 'Катя', meta: 'Сафари-тент, день рождения', photo: P.face2, text: 'Отмечали с подругами. Ребята украсили шатёр и спрятали торт в домике у костра. Очень тепло.' },
        ]} />
      </section>

      <footer className="gl-foot">Сосны · Киевская обл., Иванковский р-н · +380 00 000 00 00<br />© Сосны, {new Date().getFullYear()}</footer>
    </div>
  );
}
