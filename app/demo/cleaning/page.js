import './cleaning.css';
import DemoBar from '@/components/demo/DemoBar';
import BeforeAfter from './BeforeAfter';
import Calc from './Calc';
import { Sparkle, Leaf, ListChecks, UserCheck } from 'lucide-react';
import Reveal from '@/components/demo/Reveal';
import Reviews from '@/components/demo/Reviews';
import Photo from '@/components/ui/Photo';
import { P } from '@/lib/photos';

export const metadata = { title: 'Блеск — клининг', description: 'Сайт клининга: слайдер до/после и калькулятор уборки' };

export default function Cleaning() {
  return (
    <div className="cl">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Rubik:wght@400;500;700&display=swap" />
      <DemoBar slug="cleaning" />
      <header className="cl-top">
        <p className="cl-logo">блеск<Sparkle className="cl-logo-ico" fill="currentColor" /></p>
        <a href="tel:+380000000000">+380 00 000 00 00</a>
      </header>
      <section className="cl-hero">
        <h1>Потяните <span>ручку</span> →</h1>
        <BeforeAfter />
        <p className="cl-lead">Уборка квартир в Киеве. Приезжаем со своей химией и пылесосом, работаем без перекуров, а если что-то не понравилось — переделаем бесплатно в течение суток.</p>
      </section>
      <Calc />
      <section className="cl-promise">
        <Reveal><ListChecks className="cl-p-ico" /><b>48 пунктов</b> в чек-листе уборки. Отдаём его вам — проверяйте.</Reveal>
        <Reveal delay={0.08}><Leaf className="cl-p-ico" /><b>Гипоаллергенная</b> химия, если дома дети или животные.</Reveal>
        <Reveal delay={0.16}><UserCheck className="cl-p-ico" /><b>Те же люди</b> приезжают каждый раз при регулярной уборке.</Reveal>
      </section>

      <section className="cl-team">
        <Reveal className="cl-team-photo"><Photo id={P.cleaning} w={1000} alt="Команда за уборкой" fallback="#bfe3f1" /></Reveal>
        <div>
          <h2>Нас 14 человек, и мы любим порядок</h2>
          <p>Каждый проходит неделю стажировки с бригадиром и проверку документов. Работаем по договору, у всех есть страховка — если что-то разобьём, возместим.</p>
          <Reveal className="cl-team-photo small"><Photo id={P.cleanRoom} w={800} alt="Чистая кухня" fallback="#bfe3f1" /></Reveal>
        </div>
      </section>

      <section className="cl-reviews">
        <h2>Что пишут после уборки</h2>
        <Reviews className="cl-rv" fallback="#bfe3f1" items={[
          { name: 'Юля', meta: 'раз в 2 недели', photo: P.face10, text: 'Девочки отмыли духовку, которую я считала безнадёжной. Теперь просто живу, а не убираю по выходным.' },
          { name: 'Артём', meta: 'после ремонта', photo: P.face1, text: 'Строительная пыль была везде, даже в розетках. Через шесть часов квартира как из каталога.' },
          { name: 'Наталья', meta: 'каждую неделю', photo: P.face12, text: 'Приезжает одна и та же Света, знает, где у меня что лежит, и что кот боится пылесоса.' },
        ]} />
      </section>
      <footer className="cl-foot">© Блеск, {new Date().getFullYear()} · Киев</footer>
    </div>
  );
}
