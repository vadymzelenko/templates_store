import Link from 'next/link';

export const metadata = { title: 'Рейс не найден — Вылет' };

export default function NotFound() {
  return (
    <main className="nf">
      <p className="nf__code">404</p>
      <h1 className="h2">Рейс отменён</h1>
      <p>Такой страницы нет. Возможно, она улетела без вас.</p>
      <Link className="btn" href="/">
        На главную
      </Link>
    </main>
  );
}
