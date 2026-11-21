import { getContent } from '@/lib/store';

export default async function robots() {
  const { site } = await getContent();
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
