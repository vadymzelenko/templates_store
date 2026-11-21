import { Cormorant, Manrope } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const display = Cormorant({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-display",
  display: "swap",
});

const text = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-text",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — ${site.role.toLowerCase()} в Киеве и Днепре`,
  description: site.description,
  openGraph: {
    title: `${site.name} — фотограф в Киеве и Днепре`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "ru_UA",
    type: "website",
  },
  alternates: { canonical: "/" },
};

export const viewport = {
  themeColor: "#0d0c0c",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: site.contacts.phone,
  email: site.contacts.email,
  areaServed: ["Киев", "Днепр"],
  sameAs: [site.contacts.instagram.href, site.contacts.telegram.href, site.contacts.youtube.href],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        {/* Помечаем, что JS есть: только тогда прячем элементы до анимации появления. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
