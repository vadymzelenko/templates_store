import config from '@/engine.config';
import LoginButtons from './LoginButtons';

export default function Header({ session }) {
  return (
    <header className="st-top">
      <div className="st-top-in">
        <a href="/" className="st-logo">
          <span className="st-logo-mark" aria-hidden="true" />
          {config.brand.name}<span className="st-logo-sub">{config.brand.tagline}</span>
        </a>
        <nav className="st-menu" aria-label="Разделы">
          <a href="/#catalog">Каталог</a>
          <a href="/#engine">Запись и CRM</a>
          <a href="/#prices">Цены</a>
          <a href="/#order">Заявка</a>
        </nav>
        <LoginButtons loggedIn={!!session} isAdmin={session?.role === 'admin'} />
      </div>
    </header>
  );
}
