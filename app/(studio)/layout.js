import '@/styles/base.css';
import '@/styles/landing.css';
import '@/styles/crm.css';
import '@/styles/admin_page.css';
import '@/styles/store.css';
import config from '@/engine.config';
import Header from '@/components/Header';
import { getSession } from '@/lib/session';

export const metadata = { title: `${config.brand.name} — ${config.brand.tagline}`, description: config.brand.description };

export default async function StudioLayout({ children }) {
  const session = await getSession();
  const { colors, fonts } = config.theme;
  // business/theme.js -> CSS-переменные
  const vars = {
    ...Object.fromEntries(Object.entries(colors).map(([k, v]) => [`--${k}`, v])),
    '--font-display': fonts.display,
    '--font-body': fonts.body,
    '--font-mono': fonts.mono,
  };
  return (
    <div className="studio" style={vars}>
      {fonts.url && <link rel="stylesheet" href={fonts.url} precedence="default" />}
      <Header session={session} />
      <div className="container">{children}</div>
    </div>
  );
}
