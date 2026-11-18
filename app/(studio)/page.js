import config from '@/engine.config';
import Catalog from '@/components/store/Catalog';
import BookingForm from '@/components/BookingForm';
import PickButton from '@/components/PickButton';
// Список снятых превью пишет `npm run previews` (на Vercel папки public/ у сервера нет, поэтому не читаем диск)
import previews from '@/store/previews.json';

const L = config.landing;

const faq = [
  { q: 'Это шаблон или сайт под меня?', a: 'Сайт под вас. Готовый проект — это основа: структура, вёрстка и логика уже проверены. Мы меняем тексты, услуги, цены, фото, цвета и поля записи под ваш бизнес. Поэтому выходит быстрее и дешевле, чем с нуля.' },
  { q: 'Как работает онлайн-запись?', a: 'Клиент выбирает услугу и свободное время, оставляет почту и подтверждает запись по ссылке из письма. Пароли не нужны ни клиенту, ни вам. У клиента появляется кабинет, где можно перенести или отменить запись, у вас — CRM со статусами и журналом.' },
  { q: 'Сколько стоит содержание сайта?', a: 'Для небольшого бизнеса обычно хватает бесплатных тарифов хостинга и базы данных. Платите только за домен. Поможем всё подключить на ваше имя.' },
  { q: 'Смогу сам менять цены и тексты?', a: 'Да. В проектах с админкой — прямо в браузере. В остальных правки занимают минуты, и первые две недели после запуска мы вносим их бесплатно.' },
  { q: 'Кому принадлежит сайт и код?', a: 'Вам. Домен, хостинг и база регистрируются на вас, код передаём целиком.' },
  { q: 'Моей ниши нет в каталоге. Что делать?', a: 'Наберите её в поиске: покажем ближайшие проекты из вашей отрасли. Или оставьте заявку с пометкой «Свой проект» — обсудим на созвоне.' },
];

const steps = [
  { t: 'Созвон', d: '20 минут', x: 'Смотрим, какой проект ближе, что нужно от записи и сколько это стоит.' },
  { t: 'Бриф', d: '1 день', x: 'Вы присылаете услуги, цены, фото и контакты. Шаблон брифа дадим, писать с нуля не придётся.' },
  { t: 'Сборка', d: '3–6 дней', x: 'Переносим ваш контент, перекрашиваем под бренд, настраиваем поля и часы записи.' },
  { t: 'Запуск', d: '1 день', x: 'Подключаем домен, почту и CRM, показываем, как принимать записи. Две недели правок бесплатно.' },
];

function Engine() {
  return (
    <section id="engine" className="st-sec st-engine">
      <div className="st-sec-head">
        <p className="st-eyebrow">Booking engine</p>
        <h2>Запись, которая работает сама</h2>
        <p className="st-sec-lead">Наш движок записи встраивается в любой проект каталога. Попробовать можно прямо на этой странице: форма внизу — он самый.</p>
      </div>
      <ol className="eng">
        <li>
          <div className="eng-ui">
            <p className="eng-cap">Чт, 21 ноября</p>
            <div className="eng-slots">
              {['10:00', '11:00', '12:00', '13:00', '15:00', '16:00'].map((t, i) => (
                <span key={t} className={i === 1 || i === 4 ? 'busy' : i === 2 ? 'pick' : ''}>{t}</span>
              ))}
            </div>
          </div>
          <h3>Клиент выбирает время</h3>
          <p>Видны только свободные слоты. Занятые часы не выбрать, двойной записи не будет.</p>
        </li>
        <li>
          <div className="eng-ui eng-mail">
            <p className="eng-cap">Входящие</p>
            <b>Подтвердите запись</b>
            <span className="eng-btn">Подтвердить</span>
          </div>
          <h3>Подтверждает по почте</h3>
          <p>Письмо со ссылкой вместо пароля. Ссылка одноразовая и живёт 15 минут.</p>
        </li>
        <li>
          <div className="eng-ui">
            <p className="eng-cap">Мой кабинет</p>
            <div className="eng-row"><span>Стрижка + борода</span><span className="eng-ok">подтверждено</span></div>
            <div className="eng-row muted"><span>Чт 12:00 · Артём</span><span>перенести</span></div>
          </div>
          <h3>Сам переносит и отменяет</h3>
          <p>Кабинет появляется автоматически. Вам не звонят, чтобы сдвинуть время.</p>
        </li>
        <li>
          <div className="eng-ui">
            <p className="eng-cap">CRM · сегодня</p>
            {[['Ирина К.', 'ok'], ['Марк Л.', 'new'], ['Олег П.', 'done']].map(([n, s]) => (
              <div className="eng-row" key={n}><span>{n}</span><span className={`eng-st ${s}`}>{s === 'ok' ? 'подтв.' : s === 'new' ? 'ждёт' : 'готово'}</span></div>
            ))}
          </div>
          <h3>Вы видите всё в CRM</h3>
          <p>Статусы, перенос, фильтры и журнал: кто, когда и что изменил.</p>
        </li>
      </ol>
    </section>
  );
}

function Prices() {
  return (
    <section id="prices" className="st-sec">
      <div className="st-sec-head">
        <p className="st-eyebrow">Цены</p>
        <h2>Три пакета, без мелкого шрифта</h2>
      </div>
      <div className="pk">
        {config.formats.map((f) => (
          <div key={f.name} className={`pk-item${f.featured ? ' featured' : ''}`}>
            <h3>{f.name}</h3>
            <p className="pk-price">{f.price}</p>
            <p className="pk-meta">{f.meta}</p>
            <p className="pk-desc">{f.description}</p>
            <ul>{f.items.map((i) => <li key={i}>{i}</li>)}</ul>
            <PickButton fieldKey={L.selectKey} value={f.name} target="order">Выбрать</PickButton>
          </div>
        ))}
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="st-sec">
      <div className="st-sec-head">
        <p className="st-eyebrow">Как работаем</p>
        <h2>От созвона до первой записи — около недели</h2>
      </div>
      <ol className="pr">
        {steps.map((s) => (
          <li key={s.t}><span className="pr-d">{s.d}</span><h3>{s.t}</h3><p>{s.x}</p></li>
        ))}
      </ol>
    </section>
  );
}

function Order() {
  return (
    <section id="order" className="st-sec st-order">
      <div className="st-order-text">
        <p className="st-eyebrow">Заявка</p>
        <h2>Запишитесь на&nbsp;созвон</h2>
        <p className="st-sec-lead">Выберите удобные 20 минут. Покажем проекты, ответим на вопросы и назовём точную цену. Ни к чему не обязывает.</p>
        <dl className="st-contacts">
          {L.contacts.map((c) => (
            <div key={c.label}><dt>{c.label}</dt><dd>{c.href ? <a href={c.href} target="_blank" rel="noreferrer">{c.value}</a> : c.value}</dd></div>
          ))}
        </dl>
      </div>
      <div className="card st-order-card"><BookingForm /></div>
    </section>
  );
}

function Faq() {
  return (
    <section className="st-sec">
      <div className="st-sec-head"><p className="st-eyebrow">Вопросы</p><h2>Что обычно спрашивают</h2></div>
      <div className="faq">
        {faq.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <main>
        <Catalog previews={previews} />
        <Engine />
        <Prices />
        <Process />
        <Order />
        <Faq />
      </main>
      <footer className="st-footer">
        <span>{L.footer.text}</span>
        <a href="https://t.me/vzbbme" target="_blank" rel="noreferrer">Telegram @vzbbme</a>
        <span>{new Date().getFullYear()}</span>
      </footer>
    </>
  );
}
