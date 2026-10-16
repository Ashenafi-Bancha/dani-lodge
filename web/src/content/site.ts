/**
 * Facts about the lodge that do not change with language.
 * Edit this file when the phone number, address or links change.
 */
export const SITE = {
  name: 'Dani Lodge',
  phone: '+251 91 197 1599',
  phoneHref: 'tel:+251911971599',
  whatsappNumber: '251911971599',
  /** Leave empty until the lodge has an address to publish. */
  email: '',
  plusCode: 'VQ76+VW Soddo',
  // Decoded from the plus code above. Confirm against the real gate before launch.
  geo: { lat: 6.8646875, lng: 37.7623125 },
  address: {
    street: 'Humbo Larena',
    locality: 'Soddo',
    postalCode: '0055',
    country: 'ET',
  },
  mapsUrl: 'https://share.google/FJebx8YwKvWWeX7Ym',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=6.8646875,37.7623125',
  mapEmbedUrl: 'https://www.google.com/maps?q=6.8646875,37.7623125&z=15&output=embed',
  /** Add profile links when the lodge has them; empty ones are not shown. */
  social: {
    facebook: '',
    instagram: '',
    tiktok: '',
  },
} as const;

/**
 * The public address of the site, used for canonical links, the sitemap and
 * share previews. Set NEXT_PUBLIC_SITE_URL once the real domain is known.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

/**
 * Sample reviews exist only to show the layout. They are never shown on a
 * production build unless this is switched on deliberately, and they are
 * never added to the search-engine data.
 */
export const SHOW_SAMPLE_REVIEWS =
  process.env.NEXT_PUBLIC_SHOW_SAMPLE_REVIEWS === 'true' ||
  process.env.NODE_ENV === 'development';

export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
