import '@/styles/base.css';
import '@/styles/landing.css';
import '@/styles/crm.css';
import '@/styles/admin_page.css';
import config from '@/engine.config';
import Header from '@/components/Header';
import { getSession } from '@/lib/session';

export const metadata = { title: config.brand.name, description: config.brand.tagline };

export default async function RootLayout({ children }) {
  const session = await getSession();
  const { colors, fonts } = config.theme;
  // business/theme.js -> CSS-змінні
  const vars = {
    ...Object.fromEntries(Object.entries(colors).map(([k, v]) => [`--${k}`, v])),
    '--font-display': fonts.display,
    '--font-body': fonts.body,
  };
  return (
    <html lang={config.brand.locale} style={vars}>
      <head>
        {fonts.url && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link rel="stylesheet" href={fonts.url} />
          </>
        )}
      </head>
      <body>
        <div className="container">
          <Header session={session} />
          {children}
        </div>
      </body>
    </html>
  );
}
