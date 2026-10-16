import { Check } from 'lucide-react';
import BookButton from '@/components/ui/BookButton';
import SampleBadge from '@/components/ui/SampleBadge';
import SectionHeading from '@/components/ui/SectionHeading';
import Visual from '@/components/ui/Visual';
import type { Dictionary, Locale } from '@/content';

/** Late afternoon shade: the meeting hall, a confirmed facility. */
export default function Meetings({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { meetings, common } = dict;

  return (
    <section id="meetings" className="relative overflow-hidden bg-forest py-24 text-cream sm:py-32 lg:py-40">
      <div className="container-wide grid gap-16 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <SectionHeading tone="dark" eyebrow={meetings.eyebrow} title={meetings.title} lead={meetings.text} />

          <ul className="mt-10 space-y-4">
            {meetings.features.map((f) => (
              <li key={f} data-reveal className="flex items-start gap-3 text-cream/85">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-thatch/20 text-thatch">
                  <Check size={14} aria-hidden="true" />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <p data-reveal className="mt-8 flex flex-wrap items-center gap-3 font-display text-2xl text-thatch-light">
            {meetings.capacity}
            {meetings.capacitySample && <SampleBadge label={common.sample} note={common.sampleNote} tone="dark" />}
          </p>

          <div data-reveal className="mt-10">
            <BookButton patch={{ room: 'event' }} cursor={common.cursorExplore}>
              {meetings.cta}
            </BookButton>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div data-reveal-mask className="relative aspect-[16/11] overflow-hidden rounded-[2rem]">
            <Visual visual={{ placeholder: dict.nav.links.find((l) => l.id === 'meetings')?.label ?? meetings.eyebrow }} locale={locale} photoSoon={common.photoSoon} sizes="(min-width: 1024px) 55vw, 90vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
