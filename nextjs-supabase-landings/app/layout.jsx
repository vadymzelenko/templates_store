import "./globals.css";

export const metadata = {
  title: "Booking Sites",
  description: "Мультитенантная система записи клиентов",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
