import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Cormorant_Garamond, Instrument_Sans, Noto_Sans_Ethiopic, Noto_Serif_Ethiopic } from 'next/font/google';
import Cursor from '@/components/layout/Cursor';
import Header from '@/components/layout/Header';
import Preloader from '@/components/layout/Preloader';
import StickyBook from '@/components/layout/StickyBook';
import BookingProvider from '@/components/providers/BookingProvider';
import SmoothScroll from '@/components/providers/SmoothScroll';
import { getDictionary, isLocale, LOCALES } from '@/content';
import { SITE_URL } from '@/content/site';
import '../globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});
const instrument = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument', display: 'swap' });
// Ge'ez script fonts load only when Amharic text is on the page
const notoSansEthiopic = Noto_Sans_Ethiopic({
  subsets: ['ethiopic'],
  weight: ['400'],
  variable: '--font-noto-sans-ethiopic',
  display: 'swap',
  preload: false,
});
const notoSerifEthiopic = Noto_Serif_Ethiopic({
  subsets: ['ethiopic'],
  weight: ['500'],
  variable: '--font-noto-serif-ethiopic',
  display: 'swap',
  preload: false,
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `/${lang}`,
      languages: { en: '/en', am: '/am', 'x-default': '/en' },
    },
    openGraph: {
      type: 'website',
      siteName: 'Dani Lodge',
      title: meta.title,
      description: meta.description,
      url: `/${lang}`,
      locale: lang === 'am' ? 'am_ET' : 'en_US',
      alternateLocale: lang === 'am' ? 'en_US' : 'am_ET',
    },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.description },
    icons: { icon: '/icon.svg' },
  };
}

export const viewport: Viewport = {
  themeColor: '#12231a',
  viewportFit: 'cover',
};

/**
 * Runs before first paint: skips the preloader on repeat visits this session,
 * and only enables scroll reveals when motion is allowed.
 */
const BOOT_SCRIPT = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem('dl-seen'))d.classList.add('seen');sessionStorage.setItem('dl-seen','1')}catch(e){}if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('motion-ok')})()`;

export default async function LocaleLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${cormorant.variable} ${instrument.variable} ${notoSansEthiopic.variable} ${notoSerifEthiopic.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body className="grain">
        <Preloader label={dict.preloader.label} />
        <SmoothScroll>
          <BookingProvider>
            <Header locale={lang} nav={dict.nav} common={dict.common} />
            {children}
            <StickyBook common={dict.common} whatsappGreeting={dict.booking.message.greeting} />
          </BookingProvider>
        </SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
