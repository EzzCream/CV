import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const languages = { es: `${base}/es`, en: `${base}/en` };
  return [
    { url: `${base}/es`, lastModified: new Date(), alternates: { languages } },
    { url: `${base}/en`, lastModified: new Date(), alternates: { languages } },
  ];
}
