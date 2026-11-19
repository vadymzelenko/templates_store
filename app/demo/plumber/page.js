import './urgent.css';
import DemoBar from '@/components/demo/DemoBar';
import Emergency from './Emergency';
import { BadgeDollarSign, ShieldCheck, FileCheck2 } from 'lucide-react';
import Reveal from '@/components/demo/Reveal';
import Reviews from '@/components/demo/Reviews';
import Photo from '@/components/ui/Photo';
import { P } from '@/lib/photos';

export const metadata = { title: 'Течёт? — сантехник 24/7', description: 'Сайт аварийного сантехника: телефон, что делать сейчас и время приезда' };

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
        <Reveal><BadgeDollarSign className="pl-ico" /><b>Цена — до начала работ.</b> Мастер называет сумму на месте, вы соглашаетесь, потом он работает.</Reveal>
        <Reveal delay={0.08}><ShieldCheck className="pl-ico" /><b>Гарантия 1 год</b> на замену труб и сантехники.</Reveal>
        <Reveal delay={0.16}><FileCheck2 className="pl-ico" /><b>Чек и акт</b> — для управляющей компании или страховой.</Reveal>
      </section>

      <section className="pl-crew">
        <Reveal className="pl-crew-photo"><Photo id={P.plumbing} w={1000} alt="Мастер за работой" fallback="#2d55ff" /></Reveal>
        <div>
          <h2>12 мастеров, 6 машин, весь Киев</h2>
          <p>Машины стоят в разных районах, поэтому едем не через весь город. В каждой — трубы, фитинги, сифоны и смесители: в 9 случаях из 10 чиним за один визит.</p>
          <Reviews className="pl-rv" fallback="#2d55ff" items={[
            { name: 'Ирина, Оболонь', meta: 'прорвало трубу в 3 ночи', photo: P.face4, text: 'Сказали по телефону, где перекрыть воду, мастер был через 28 минут. Соседей снизу почти не залило.' },
            { name: 'Богдан, Печерск', meta: 'засор', photo: P.face7, text: 'Цену назвали до начала: 600 ₴. Ровно столько и заплатил, плюс показали, почему засорилось.' },
          ]} />
        </div>
      </section>
      <footer className="pl-foot">© Течёт? Аварийная сантехническая служба, {new Date().getFullYear()}</footer>
    </div>
  );
}
