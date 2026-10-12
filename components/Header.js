import Link from 'next/link';
import config from '@/engine.config';
import LoginButtons from './LoginButtons';

export default function Header({ session }) {
  return (
    <header className="top">
      <Link href="/" className="logo">{config.brand.name}</Link>
      <LoginButtons loggedIn={!!session} isAdmin={session?.role === 'admin'} />
    </header>
  );
}
