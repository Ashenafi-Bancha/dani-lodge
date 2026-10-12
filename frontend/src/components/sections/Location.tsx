import { ExternalLink, MapPin, Navigation, Phone } from 'lucide-react';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { SITE } from '@/lib/site';

export default function Location() {
  return (
    <section id="location" className="section bg-forest-deep">
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <SectionHeading tone="dark" eyebrow="Find us" title="Easy to find, hard to leave.">
            You will find us in Humbo Larena, Wolaita Sodo. Open the map for turn-by-turn
            directions straight to the gate.
          </SectionHeading>

          <RevealGroup className="mt-8 space-y-5 text-cream/85">
            <RevealItem className="flex gap-4">
              <MapPin size={20} className="mt-1 shrink-0 text-gold" aria-hidden="true" />
              <address className="not-italic leading-relaxed">
                {SITE.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <span className="mt-1 block text-sm text-cream/55">Plus code: {SITE.plusCode}</span>
              </address>
            </RevealItem>
            <RevealItem className="flex gap-4">
              <Phone size={20} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
              <a href={SITE.phoneHref} className="transition-colors hover:text-gold-light">
                {SITE.phone}
              </a>
            </RevealItem>
            <RevealItem className="flex flex-col gap-3 pt-3 sm:flex-row">
              <a
                href={SITE.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                <Navigation size={16} aria-hidden="true" /> Get directions
              </a>
              <a
                href={SITE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-light"
              >
                View on Google Maps <ExternalLink size={15} aria-hidden="true" />
              </a>
            </RevealItem>
          </RevealGroup>
        </div>

        <RevealGroup className="lg:col-span-7">
          <RevealItem className="overflow-hidden rounded-[1.5rem] border border-white/10">
            <iframe
              title="Map showing the location of Dani Lodge"
              src={SITE.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[340px] w-full border-0 sm:h-[420px] lg:h-[480px]"
            />
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
