import { Unbounded, Onest } from 'next/font/google';
import { getContent } from '@/lib/store';
import { phoneHref } from '@/data/site';
import './globals.css';

const display = Unbounded({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '800'],
  variable: '--font-display',
  display: 'swap',
});

const text = Onest({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--font-text',
  display: 'swap',
});

export async function generateMetadata() {
  const { site } = await getContent();
  return {
    metadataBase: new URL(site.url),
    title: site.title,
    description: site.description,
    openGraph: {
      title: site.title,
      description: site.description,
      url: site.url,
      siteName: site.name,
      locale: 'ru_RU',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: site.title, description: site.description },
  };
}

export const viewport = {
  themeColor: '#ff7a1f',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const { site } = await getContent();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LanguageSchool',
    name: site.title,
    url: site.url,
    telephone: phoneHref(site.phone).replace('tel:', ''),
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
    },
    sameAs: [site.instagram, site.telegram].filter(Boolean),
  };
  return (
    <html lang="ru" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
