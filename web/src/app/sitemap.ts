import type { MetadataRoute } from 'next';
import { LOCALES } from '@/content';
import { SITE_URL } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}`]));
  return LOCALES.map((lang) => ({
    url: `${SITE_URL}/${lang}`,
    changeFrequency: 'monthly',
    priority: lang === 'en' ? 1 : 0.9,
    alternates: { languages },
  }));
}
