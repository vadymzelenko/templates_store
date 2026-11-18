import './cleaning.css';
import DemoBar from '@/components/demo/DemoBar';
import BeforeAfter from './BeforeAfter';
import Calc from './Calc';

export const metadata = { title: 'Блеск — клининг · демо', description: 'Демо-лендинг клининга: слайдер до/после и калькулятор уборки' };

export default function Cleaning() {
  return (
    <div className="cl">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Rubik:wght@400;500;700&display=swap" />
      <DemoBar slug="cleaning" />
      <header className="cl-top">
        <p className="cl-logo">блеск<span>✦</span></p>
        <a href="tel:+380000000000">+380 00 000 00 00</a>
      </header>
      <section className="cl-hero">
        <h1>Потяните <span>ручку</span> →</h1>
        <BeforeAfter />
        <p className="cl-lead">Уборка квартир в Киеве. Приезжаем со своей химией и пылесосом, работаем без перекуров, а если что-то не понравилось — переделаем бесплатно в течение суток.</p>
      </section>
      <Calc />
      <section className="cl-promise">
        <div><b>48 пунктов</b> в чек-листе уборки. Отдаём его вам — проверяйте.</div>
        <div><b>Гипоаллергенная</b> химия, если дома дети или животные.</div>
        <div><b>Те же люди</b> приезжают каждый раз при регулярной уборке.</div>
      </section>
      <footer className="cl-foot">Демо-проект Template Store. Компания и цены вымышлены.</footer>
    </div>
  );
}
