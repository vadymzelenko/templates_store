// Корневой каркас. Стили и шапка у витрины — в app/(studio)/layout.js, у каждого демо — свои.
export const metadata = {
  title: { default: 'Прилавок — веб-студия', template: '%s' },
  description: 'Лендинги и сайты с онлайн-записью для малого бизнеса',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
