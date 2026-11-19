import './forest.css';
import DemoBar from '@/components/demo/DemoBar';
import Stay from './Stay';
import { day, tents, seasons, faq } from './data';
import PickTent from './PickTent';
import { Flame, Bike, Waves, Dog, Car, Coffee, TreePine, Bath, Sailboat, Mountain, Users, MapPin, Train, Plus } from 'lucide-react';
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
      <section className="gl-intro">
        <Reveal className="gl-intro-t">
          <p className="gl-kicker">О месте</p>
          <h2>Двенадцать гектаров соснового бора и озеро, на котором никого</h2>
          <p>Мы купили этот участок в 2020-м, чтобы было куда сбегать самим. Поставили шесть шатров так, чтобы из одного не было видно другой, провели горячую воду и построили шале с кухней. Остальное сделал лес.</p>
        </Reveal>
        <dl className="gl-nums">
          {[['6', 'шатров на 12 га'], ['400 м', 'до озера'], ['90 км', 'от Киева'], ['4,9', 'на Booking']].map(([n, t], i) => <Reveal key={t} delay={i * 0.08}><dt>{n}</dt><dd>{t}</dd></Reveal>)}
        </dl>
      </section>

      <section className="gl-sec" id="tents">
        <h2>Шатры</h2>
        <p className="gl-sub">Во всех — настоящие кровати, бельё из хлопка и обогрев. Завтрак включён.</p>
        <div className="gl-tentcards">
          {tents.map((t, i) => (
            <Reveal key={t.key} delay={i * 0.1} className="gl-tc">
              <div className="gl-tc-pic"><Photo id={P[t.photo]} w={900} alt={t.name} fallback="#1d2c52" /><span>{t.size} · до {t.guests} гостей</span></div>
              <div className="gl-tc-b">
                <h3>{t.name}</h3>
                <ul>{t.perks.map((x) => <li key={x}><Plus size={14} />{x}</li>)}</ul>
                <div className="gl-tc-f"><p><b>{t.price.toLocaleString('ru-RU').replace(/,/g, ' ')} ₴</b> / ночь<br /><small>пт–сб {t.weekend.toLocaleString('ru-RU').replace(/,/g, ' ')} ₴</small></p><PickTent tent={t.key}>Выбрать даты</PickTent></div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="gl-sec">
        <h2>Что есть на территории</h2>
        <div className="gl-amen">
          {[[Bath, 'Банный чан', 'на дровах, с травами'], [Sailboat, 'Сап и каяки', 'бесплатно для гостей'], [Bike, 'Велосипеды', 'маршруты 5–25 км'], [Flame, 'Костровая', 'дрова и зефир — наши'], [Coffee, 'Шале-кухня', 'завтрак с 8:30 до 11:00'], [Dog, 'Можно с собакой', 'в двух шатрах'], [Car, 'Парковка', 'у въезда, бесплатно'], [TreePine, 'Тропа здоровья', '3 км по бору']].map(([Icon, t, x], i) => (
            <Reveal key={t} delay={(i % 4) * 0.06} className="gl-am"><Icon strokeWidth={1.4} /><b>{t}</b><span>{x}</span></Reveal>
          ))}
        </div>
      </section>

      <section className="gl-seasons">
        <div className="gl-sec-in"><h2>В любое время года</h2><p className="gl-sub">Работаем круглый год — у каждого сезона своё настроение.</p></div>
        <div className="gl-season-row" data-lenis-prevent>
          {seasons.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.06} className="gl-season">
              <Photo id={P[s.photo]} w={800} alt={s.name} fallback="#1d2c52" />
              <div><h3>{s.name}</h3><p>{s.text}</p></div>
            </Reveal>
          ))}
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

      <section className="gl-sec gl-road">
        <Reveal>
          <h2>Как добраться</h2>
          <ul>
            <li><Car /><div><b>На машине — 1 ч 20 мин</b>Варшавская трасса, поворот на Иванков, 6 км по грунтовке. Пришлём точку на карте после брони.</div></li>
            <li><Train /><div><b>Электричкой + трансфер</b>До станции Тетерев — 1 ч 40 мин, встретим на машине за 300 ₴.</div></li>
            <li><MapPin /><div><b>Координаты</b>50.94°N, 29.88°E · Иванковский район, Киевская область</div></li>
          </ul>
        </Reveal>
        <Reveal className="gl-roadmap" delay={0.1}>
          <svg viewBox="0 0 500 360" aria-hidden="true">
            <rect width="500" height="360" fill="#13213f" />
            <path d="M30 330 C 120 260, 160 280, 230 210 S 360 120, 440 60" stroke="#f0b45c" strokeWidth="3" strokeDasharray="8 8" fill="none" className="gl-route" />
            <circle cx="30" cy="330" r="8" fill="#f3ead6" /><text x="46" y="335" fill="#f3ead6" fontSize="14" fontFamily="Commissioner">Киев</text>
            <circle cx="440" cy="60" r="12" fill="#f0b45c" /><text x="330" y="40" fill="#f0b45c" fontSize="16" fontFamily="Prata">Сосны</text>
            {Array.from({ length: 18 }, (_, i) => <path key={i} d={`M${300 + (i * 37) % 180} ${90 + (i * 23) % 120} l6 16 h-12z`} fill="#2a3c66" />)}
          </svg>
        </Reveal>
      </section>

      <section className="gl-sec gl-faq">
        <h2>Вопросы</h2>
        <div>{faq.map(([q, a]) => <details key={q}><summary>{q}<Plus size={18} /></summary><p>{a}</p></details>)}</div>
      </section>

      <footer className="gl-foot">Сосны · Киевская обл., Иванковский р-н · +380 00 000 00 00<br />© Сосны, {new Date().getFullYear()}</footer>
    </div>
  );
}
