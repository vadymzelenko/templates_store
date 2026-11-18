import './folder.css';
import DemoBar from '@/components/demo/DemoBar';
import Folder from './Folder';

export const metadata = { title: 'Мороз и партнёры — адвокаты · демо', description: 'Демо-сайт адвокатов в виде папки-дела: ситуация, адвокат, цена и заявление на консультацию' };

export default function Lawyer() {
  return (
    <div className="lw">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400&family=PT+Mono&family=Caveat:wght@600&display=swap" />
      <DemoBar slug="lawyer" />
      <main className="lw-desk">
        <Folder />
        <p className="lw-foot">ул. Владимирская, 40, офис 12 · +380 00 000 00 00 · пн–пт 10:00–18:00<br />Демо-проект Template Store. Объединение, адвокаты и цены вымышлены.</p>
      </main>
    </div>
  );
}
