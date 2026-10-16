import { ExternalLink, MapPin, Navigation, Phone } from 'lucide-react';
import MapEmbed from '@/components/sections/MapEmbed';
import SampleBadge from '@/components/ui/SampleBadge';
import SectionHeading from '@/components/ui/SectionHeading';
import type { Dictionary } from '@/content';
import { SITE } from '@/content/site';

/** Dusk: where the lodge is and how to get there. */
export default function Location({ dict }: { dict: Dictionary }) {
  const { location, common } = dict;

  return (
    <section id="location" className="relative overflow-hidden bg-[linear-gradient(180deg,#1f3a2b_0%,#1b2a2c_100%)] py-24 text-cream sm:py-32">
      <div className="container-wide grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading tone="dark" eyebrow={location.eyebrow} title={location.title} lead={location.lead} />

          <address data-reveal className="mt-10 flex gap-4 text-cream/85 not-italic">
            <MapPin size={20} className="mt-1 shrink-0 text-thatch" aria-hidden="true" />
            <span>
              {location.addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
              <span className="mt-1 block text-sm text-cream/55">
                {location.plusCodeLabel}: {SITE.plusCode}
              </span>
              <a href={SITE.phoneHref} className="mt-3 inline-flex items-center gap-2 transition-colors hover:text-thatch-light">
                <Phone size={16} aria-hidden="true" /> {SITE.phone}
              </a>
            </span>
          </address>

          <h3 data-reveal className="eyebrow mt-12 !text-thatch">
            {location.distancesTitle}
          </h3>
          <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
            {location.distances.map((d) => (
              <li key={d.place} data-reveal className="flex flex-wrap items-center justify-between gap-2 py-3.5">
                <span className="text-cream/85">{d.place}</span>
                <span className="flex items-center gap-2 text-sm text-cream/60">
                  {d.value}
                  {d.sample && <SampleBadge label={common.sample} note={common.sampleNote} tone="dark" />}
                </span>
              </li>
            ))}
          </ul>

          <div data-reveal className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={SITE.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              <Navigation size={16} aria-hidden="true" /> {location.directions}
            </a>
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
              {location.openMaps} <ExternalLink size={15} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div data-reveal className="lg:col-span-7">
          <MapEmbed loadLabel={location.loadMap} note={location.mapNote} title={location.mapTitle} />
        </div>
      </div>
    </section>
  );
}
