import './coffee.css';
import { Coffee, Croissant, Leaf, MapPin, Clock, Phone, AtSign } from 'lucide-react';
import DemoBar from '@/components/demo/DemoBar';
import Reveal from '@/components/demo/Reveal';
import Reviews from '@/components/demo/Reviews';
import Photo from '@/components/ui/Photo';
import { P } from '@/lib/photos';
import Header from './Header';
import Parallax from './Parallax';
import Shop from './Shop';
import { reviews } from './data';

export const metadata = { title: 'Угол — кофейня на Подоле', description: 'Кофейня «Угол»: своя обжарка, выпечка с 6 утра и предзаказ без очереди' };

export default function CoffeePage() {
  return (
    <div className="ug" id="top">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Source+Sans+3:wght@400;600;700&display=swap" />
      <DemoBar slug="coffee" />
      <Header />

      <section className="ug-hero">
        <Parallax />
        <div className="ug-hero-shade" />
        <div className="ug-hero-t">
          <p className="ug-kicker ug-anim" style={{ '--d': '.1s' }}>Кофейня · Подол · с 2019</p>
          <h1 className="ug-anim" style={{ '--d': '.25s' }}>Кофе на углу<br /><em>Ярославовой и Стрелецкой</em></h1>
          <p className="ug-anim" style={{ '--d': '.4s' }}>Обжариваем зерно сами раз в неделю, печём круассаны с шести утра. Закажите заранее — заберёте без очереди.</p>
          <div className="ug-hero-cta ug-anim" style={{ '--d': '.55s' }}><a href="#menu" className="ug-btn">Посмотреть меню</a><a href="#visit" className="ug-btn ghost">Как нас найти</a></div>
        </div>
      </section>

      <section className="ug-perks">
        {[[Coffee, 'Своя обжарка', 'Каждую среду — новое зерно из Эфиопии, Колумбии или Кении.'], [Croissant, 'Выпечка с 6 утра', 'Круассаны и синнабоны делаем на месте, а не размораживаем.'], [Leaf, 'Растительное молоко', 'Овсяное, кокосовое и миндальное — без доплаты.']].map(([Icon, t, x], i) => (
          <Reveal key={t} delay={i * 0.1} className="ug-perk"><span className="ug-perk-ico"><Icon strokeWidth={1.5} /></span><b>{t}</b><p>{x}</p></Reveal>
        ))}
      </section>

      <section className="ug-about" id="about">
        <Reveal className="ug-about-pics">
          <Photo id={P.barista} w={900} alt="Стойка бариста" className="ug-ap-a" fallback="#eadfce" />
          <Photo id={P.coffeeArt} w={600} alt="Латте-арт" className="ug-ap-b" fallback="#e0d2bd" />
        </Reveal>
        <Reveal className="ug-about-t" delay={0.1}>
          <p className="ug-kicker">О нас</p>
          <h2>Маленькая кофейня с большим окном</h2>
          <p>Мы открылись в 2019-м в бывшей мастерской часовщика. Сохранили старый паркет, поставили десять столиков и одну очень хорошую кофемашину.</p>
          <p>Утром здесь берут кофе с собой, днём работают с ноутбуком, по выходным завтракают семьями. Мы знаем большинство гостей по имени — и как они пьют кофе.</p>
          <dl className="ug-stats"><div><dt>6</dt><dd>сортов зерна в месяц</dd></div><div><dt>400+</dt><dd>чашек в день</dd></div><div><dt>4,9</dt><dd>на Google Maps</dd></div></dl>
        </Reveal>
      </section>

      <section className="ug-sec" id="menu">
        <Reveal className="ug-sec-h"><p className="ug-kicker">Меню</p><h2>Что у нас пьют и едят</h2><p>Нажмите «+» — соберём предзаказ, заберёте без очереди.</p></Reveal>
        <Shop />
      </section>

      <section className="ug-gallery" id="gallery">
        <Reveal className="ug-sec-h"><p className="ug-kicker">Атмосфера</p><h2>Заходите посидеть</h2></Reveal>
        <div className="ug-grid">
          {[['cafe', 'a'], ['latte', 'b'], ['croissant', 'c'], ['cups', 'd'], ['cafeDetail', 'e'], ['brew', 'f']].map(([k, c], i) => (
            <Reveal key={k} delay={i * 0.05} className={`ug-g ug-g-${c}`}><Photo id={P[k]} w={900} alt="" fallback="#eadfce" /></Reveal>
          ))}
        </div>
      </section>

      <section className="ug-sec">
        <Reveal className="ug-sec-h"><p className="ug-kicker">Отзывы</p><h2>Гости о нас</h2></Reveal>
        <Reviews className="ug-rv" fallback="#eadfce" items={reviews.map((r) => ({ ...r, photo: P[r.photo] }))} />
      </section>

      <section className="ug-visit" id="visit">
        <Reveal className="ug-visit-t">
          <p className="ug-kicker">Как найти</p>
          <h2>Угловая дверь с зелёной ручкой</h2>
          <ul>
            <li><MapPin /> ул. Ярославова, 1, Киев</li>
            <li><Clock /> Пн–пт 7:30–20:00 · Сб–вс 9:00–21:00</li>
            <li><Phone /> +380 00 000 00 00</li>
            <li><AtSign /> @ugol.coffee</li>
          </ul>
        </Reveal>
        <Reveal className="ug-map" delay={0.1}>
          <svg viewBox="0 0 600 420" aria-hidden="true">
            <rect width="600" height="420" fill="#efe5d6" />
            <g stroke="#fff" strokeWidth="38" fill="none"><path d="M-20 250 L620 200" /><path d="M300 -20 L360 440" /><path d="M-20 70 L620 40" strokeWidth="18" /><path d="M110 -20 L150 440" strokeWidth="18" /></g>
            <g fill="#dccfb9"><rect x="170" y="80" width="110" height="100" rx="6" /><rect x="390" y="70" width="170" height="110" rx="6" /><rect x="170" y="270" width="110" height="130" rx="6" /><rect x="400" y="250" width="160" height="150" rx="6" /></g>
            <text x="20" y="285" fontSize="15" fill="#8a735f" fontFamily="Source Sans 3">ул. Ярославова</text>
            <text x="372" y="40" fontSize="15" fill="#8a735f" fontFamily="Source Sans 3" transform="rotate(84 372 40)">ул. Стрелецкая</text>
            <circle cx="335" cy="226" r="34" fill="#b8562e" opacity=".18" className="ug-pulse" /><circle cx="335" cy="226" r="12" fill="#b8562e" /><circle cx="335" cy="226" r="4.5" fill="#fff" />
          </svg>
        </Reveal>
      </section>

      <footer className="ug-foot"><span className="ug-logo">Угол</span><span>Кофе и выпечка на Подоле</span><span>© Угол, {new Date().getFullYear()}</span></footer>
    </div>
  );
}
