import './urgent.css';
import DemoBar from '@/components/demo/DemoBar';
import Emergency from './Emergency';

export const metadata = { title: 'Течёт? — сантехник 24/7 · демо', description: 'Демо-сайт аварийного сантехника: телефон, что делать сейчас и время приезда' };

export default function Plumber() {
  return (
    <div className="pl">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Days+One&family=PT+Sans:wght@400;700&display=swap" />
      <DemoBar slug="plumber" />
      <section className="pl-hero">
        <p className="pl-q">Течёт?</p>
        <a className="pl-phone" href="tel:+380000000000">+380 00 000 00 00</a>
        <p className="pl-meta"><b>24/7</b> · Киев · без выходных и ночных наценок · приезжаем за 25–50 минут</p>
      </section>
      <Emergency />
      <section className="pl-facts">
        <p><b>Цена — до начала работ.</b> Мастер называет сумму на месте, вы соглашаетесь, потом он работает.</p>
        <p><b>Гарантия 1 год</b> на замену труб и сантехники.</p>
        <p><b>Чек и акт</b> — для управляющей компании или страховой.</p>
      </section>
      <footer className="pl-foot">Демо-проект Template Store. Служба и номер вымышлены.</footer>
    </div>
  );
}
