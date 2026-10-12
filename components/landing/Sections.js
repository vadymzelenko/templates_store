// Секції лендингу. Весь контент береться з business/landing.js
import config from '@/engine.config';
import BookingForm from '../BookingForm';
import PickButton from '../PickButton';

const L = config.landing;

export function Hero() {
  return (
    <section className="hero">
      <div>
        <h1>{L.hero.title}</h1>
        <p className="hero-sub">{L.hero.subtitle}</p>
        <div className="hero-cta">
          <a className="btn" href="#book">{L.hero.cta}</a>
          <a className="btn ghost" href="#formats">{L.hero.ctaSecondary}</a>
        </div>
        <p className="hero-note">{L.hero.note}</p>
      </div>

      <div className="sheet" aria-hidden="true">
        <div className="sheet-title"><span>{config.brand.name}</span><span>{L.sheetTitle}</span></div>
        <div className="sheet-grid">
          {L.frames.map((f, i) => (
            <figure key={i} className={`frame${f.pick ? ' pick' : ''}`} style={{ '--a': f.a, '--b': f.b }}>
              <div className="shot-wrap">
                <div className="shot">{f.src && <img src={f.src} alt="" />}</div>
              </div>
              <figcaption><span>{String(i + 1).padStart(2, '0')}</span><span>{f.caption}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Formats() {
  return (
    <section id="formats" className="section">
      <h2>{L.formatsSection.title}</h2>
      <ul className="formats-list">
        {config.formats.map((f) => (
          <li key={f.name}>
            <div className="f-info">
              <h3 className="f-name">{f.name}</h3>
              <p className="f-desc">{f.description}</p>
            </div>
            <span className="f-meta">{f.meta}</span>
            <span className="f-price">{f.price}</span>
            <span className="f-pick">
              <PickButton fieldKey={L.selectKey} value={f.name}>{L.formatsSection.pick}</PickButton>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Steps() {
  return (
    <section className="section">
      <h2>{L.steps.title}</h2>
      <ol className="steps">
        {L.steps.items.map((s) => (
          <li key={s.title}><h3>{s.title}</h3><p>{s.text}</p></li>
        ))}
      </ol>
    </section>
  );
}

export function BookingSection() {
  return (
    <section id="book" className="section">
      <div className="book">
        <div>
          <h2>{L.book.title}</h2>
          <p className="muted">{L.book.text}</p>
          <dl className="book-info">
            {L.book.info.map((i) => (
              <div key={i.label}><dt>{i.label}</dt><dd>{i.value}</dd></div>
            ))}
          </dl>
        </div>
        <div className="card book-card"><BookingForm /></div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="section">
      <h2>{L.faq.title}</h2>
      <div className="faq">
        {L.faq.items.map((f) => (
          <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <span>{L.footer.text}</span>
      <span>{new Date().getFullYear()}</span>
    </footer>
  );
}
