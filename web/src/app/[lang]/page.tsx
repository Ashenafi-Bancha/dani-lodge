import { notFound } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import Reveals from '@/components/providers/Reveals';
import DayAtLodge from '@/components/sections/DayAtLodge';
import Dining from '@/components/sections/Dining';
import Faq from '@/components/sections/Faq';
import FinalCta from '@/components/sections/FinalCta';
import Gallery from '@/components/sections/Gallery';
import Hero from '@/components/sections/Hero';
import Location from '@/components/sections/Location';
import Meetings from '@/components/sections/Meetings';
import Offers from '@/components/sections/Offers';
import Reviews from '@/components/sections/Reviews';
import Rooms from '@/components/sections/Rooms';
import Story from '@/components/sections/Story';
import { getDictionary, isLocale, type Dictionary } from '@/content';
import { SITE, SITE_URL } from '@/content/site';

/**
 * Structured data for search engines. Only confirmed facts go here — no
 * sample rooms, prices or reviews.
 */
function lodgingJsonLd(dict: Dictionary, lang: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': `${SITE_URL}/#lodge`,
    name: SITE.name,
    description: dict.meta.description,
    url: `${SITE_URL}/${lang}`,
    image: `${SITE_URL}/opengraph-image.jpg`,
    telephone: SITE.phoneHref.replace('tel:', ''),
    inLanguage: lang,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      postalCode: SITE.address.postalCode,
      addressRegion: 'Wolaita',
      addressCountry: SITE.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    hasMap: SITE.mapsUrl,
    amenityFeature: ['Meeting hall', 'Café', 'Parking', 'Garden'].map((name) => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true,
    })),
  };
}

export default async function Home({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const { common } = dict;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingJsonLd(dict, lang)).replace(/</g, '\\u003c') }}
      />
      <main id="main">
        <Hero dict={dict} locale={lang} />
        <Story dict={dict} locale={lang} />
        <DayAtLodge day={dict.day} common={common} locale={lang} />
        <Rooms rooms={dict.rooms} common={common} locale={lang} intlLocale={dict.intlLocale} />
        <Dining dict={dict} locale={lang} />
        <Meetings dict={dict} locale={lang} />
        <Offers dict={dict} />
        <Gallery gallery={dict.gallery} common={common} locale={lang} />
        <Reviews dict={dict} />
        <Location dict={dict} />
        <Faq dict={dict} />
        <FinalCta dict={dict} locale={lang} />
      </main>
      <Footer dict={dict} />
      {/* Last, so it starts only after every section above has hydrated */}
      <Reveals />
    </>
  );
}
