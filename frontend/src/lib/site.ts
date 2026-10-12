/**
 * Single source of truth for business details.
 * Anything the lodge owner may want to change lives here.
 */
export const SITE = {
  name: 'Dani Lodge',
  tagline: 'Humbo Larena · Wolaita Sodo',
  taglineAmharic: 'ወላይታ ሶዶ ላሬና',
  address: ['Humbo Larena, Dani Lodge', 'Soddo 0055, Ethiopia'],
  phone: '+251 91 197 1599',
  phoneHref: 'tel:+251911971599',
  whatsappNumber: '251911971599',
  plusCode: 'VQ76+VW Soddo',
  mapsUrl: 'https://share.google/FJebx8YwKvWWeX7Ym',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=VQ76%2BVW+Soddo',
  mapEmbedUrl: 'https://www.google.com/maps?q=VQ76%2BVW+Soddo&z=15&output=embed',
} as const;

export const NAV_LINKS = [
  { label: 'The Lodge', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Experiences', href: '#experiences' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Location', href: '#location' },
] as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_ENQUIRIES = {
  rooms: whatsappLink('Hello Dani Lodge, I would like to ask about room availability and rates.'),
  hall: whatsappLink(
    'Hello Dani Lodge, I would like to ask about the meeting hall — capacity, availability and price.'
  ),
  cafe: whatsappLink('Hello Dani Lodge, I would like to ask about the café menu and opening hours.'),
} as const;

export const WHATSAPP_GENERAL = whatsappLink(
  'Hello Dani Lodge, I would like to know more about your lodge and services.'
);
