import { getContent } from '@/lib/store';

export default async function sitemap() {
  const { site } = await getContent();
  return [
    { url: site.url, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${site.url}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
