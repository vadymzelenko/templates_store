import './vet.css';
import DemoBar from '@/components/demo/DemoBar';
import DemoBooking from '@/components/demo/DemoBooking';
import Services from './Services';

export const metadata = { title: 'Друг — ветклиника · демо', description: 'Демо-лендинг ветклиники: экстренная линия, услуги по видам животных, запись с кличкой питомца' };

const doctors = [
  { name: 'Елена Бойко', role: 'Терапевт, главврач', note: 'Ведёт хронических пациентов, особенно пожилых котов.' },
  { name: 'Тарас Гнатюк', role: 'Хирург', note: 'Стерилизации, травмы, плановые операции.' },
  { name: 'Ирина Шевчук', role: 'Экзотолог', note: 'Кролики, морские свинки, попугаи, черепахи.' },
];

export default function Vet() {
  return (
    <div className="vt">
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Caveat:wght@600&display=swap" />
      <DemoBar slug="vet" />

      <div className="vt-sos">
        <span>Экстренный приём 24/7</span>
        <a href="tel:+380000000000">+380 00 000 00 00</a>
        <span className="vt-sos-x">Звоните по дороге — подготовим кабинет</span>
      </div>

      <header className="vt-top">
        <a href="#" className="vt-logo">друг<small>ветеринарная клиника</small></a>
        <nav><a href="#services">Услуги</a><a href="#doctors">Врачи</a><a href="#book">Запись</a></nav>
        <a href="#book" className="vt-btn">Записаться</a>
      </header>

      <section className="vt-hero">
        <div>
          <h1>Лечим так, будто это наш <span>кот</span></h1>
          <p className="vt-lead">Без лишних анализов и с объяснением каждого назначения. Анализы крови — за 40 минут в нашей лаборатории, УЗИ и рентген на месте.</p>
          <div className="vt-hero-cta">
            <a href="#book" className="vt-btn lg">Записаться на приём</a>
            <span className="vt-note">приём терапевта — 450 ₴</span>
          </div>
        </div>
        <div className="vt-card" aria-hidden="true">
          <p className="vt-card-h">Карта пациента</p>
          <dl>
            <div><dt>Кличка</dt><dd className="vt-hand">Барсик</dd></div>
            <div><dt>Вид</dt><dd>Кот, 7 лет</dd></div>
            <div><dt>Прививка</dt><dd>до 12.2027</dd></div>
            <div><dt>Следующий визит</dt><dd className="vt-hand">чек-ап весной</dd></div>
          </dl>
          <svg className="vt-paw" viewBox="0 0 64 64" width="64"><g fill="currentColor"><ellipse cx="32" cy="42" rx="14" ry="12" /><circle cx="14" cy="26" r="6" /><circle cx="25" cy="15" r="6" /><circle cx="39" cy="15" r="6" /><circle cx="50" cy="26" r="6" /></g></svg>
        </div>
      </section>

      <section id="services" className="vt-sec">
        <h2>Услуги и цены</h2>
        <p className="vt-sub">Выберите, кто у вас дома, — покажем, что для него делаем.</p>
        <Services />
      </section>

      <section id="doctors" className="vt-sec">
        <h2>Врачи</h2>
        <div className="vt-docs">
          {doctors.map((d, i) => (
            <article key={d.name} className="vt-doc">
              <div className={`vt-doc-pic c${i}`} aria-hidden="true">{d.name.split(' ').map((w) => w[0]).join('')}</div>
              <h3>{d.name}</h3>
              <p className="vt-doc-role">{d.role}</p>
              <p>{d.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="book" className="vt-sec vt-book">
        <div>
          <h2>Запись на приём</h2>
          <p className="vt-sub">Укажите кличку и вид питомца — врач заранее откроет его карту. Напомним о визите и о следующей прививке.</p>
          <p className="vt-hand vt-hand-big">не забудьте ветпаспорт!</p>
        </div>
        <div className="vt-book-card">
          <DemoBooking
            services={[{ name: 'Приём терапевта', price: '450 ₴' }, { name: 'Вакцинация', price: 'от 600 ₴' }, { name: 'УЗИ', price: '700 ₴' }, { name: 'Консультация хирурга', price: '500 ₴' }]}
            serviceLabel="Услуга"
            resources={doctors.map((d) => ({ name: d.name }))}
            resourceLabel="Врач"
            anyResource="Любой свободный"
            hours={{ start: '09:00', end: '21:00', step: 30 }}
            busyRate={0.45}
            extra={[{ key: 'pet', label: 'Кличка питомца', placeholder: 'Барсик' }, { key: 'kind', label: 'Кто это', options: ['Кошка', 'Собака', 'Грызун', 'Птица', 'Другое'] }]}
            submitText="Записаться"
            doneTitle="Ждём вас с питомцем"
          />
        </div>
      </section>

      <footer className="vt-foot">
        <span className="vt-logo">друг</span>
        <span>ул. Садовая, 3 · ежедневно 9:00–21:00, ночью — экстренные</span>
        <span className="vt-foot-small">Демо-проект Template Store. Клиника и врачи вымышлены.</span>
      </footer>
    </div>
  );
}
