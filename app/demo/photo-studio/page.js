// Первый лендинг на booking engine. Вёрстка — components/landing/Sections, контент — demos/photo-studio.js
import '@/styles/base.css';
import '@/styles/landing.css';
import DemoBar from '@/components/demo/DemoBar';
import DemoBooking from '@/components/demo/DemoBooking';
import { Hero, Formats, Steps, BookingSection, Faq, Footer } from '@/components/landing/Sections';
import { landing as L, formats, brand } from '@/demos/photo-studio';

export const metadata = { title: 'Studio Light — фотостудия', description: 'Сайт фотостудии на booking engine' };

const vars = {
  '--accent': '#236a8c', '--accentInk': '#fff', '--bg': '#f3f6f8', '--card': '#fff', '--text': '#13202b', '--muted': '#62717d',
  '--line': '#dbe3e8', '--soft': '#e6eef3', '--mark': '#d9483b', '--danger': '#b03a2e',
  '--font-display': "'Geologica', system-ui, sans-serif", '--font-body': "'Geologica', system-ui, sans-serif",
};

export default function PhotoStudio() {
  const Lx = { ...L, selectKey: 'service' };
  return (
    <div className="ps" style={vars}>
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Geologica:wght@300..700&display=swap" />
      <DemoBar slug="photo-studio" />
      <div className="container">
        <header className="top"><a href="#" className="logo">{brand.name}</a><a className="btn sm" href="#book">{L.hero.cta}</a></header>
        <main>
          <Hero L={Lx} brandName={brand.name} />
          <Formats L={Lx} formats={formats} />
          <Steps L={Lx} />
          <BookingSection L={Lx} form={
            <DemoBooking services={formats.map((f) => ({ name: f.name, price: f.price }))} serviceLabel="Формат зйомки"
              hours={{ start: '10:00', end: '20:00', step: 60 }} submitText="Записатися" doneTitle="Запис прийнято" />
          } />
          <Faq L={Lx} />
        </main>
        <Footer L={Lx} />
      </div>
    </div>
  );
}
