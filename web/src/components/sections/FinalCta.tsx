import { Check } from 'lucide-react';
import BookingForm from '@/components/sections/BookingForm';
import Fireflies from '@/components/sections/Fireflies';
import Visual from '@/components/ui/Visual';
import type { Dictionary, Locale } from '@/content';

/**
 * Night: the emotional close. The pavilion photo in evening tones under
 * fireflies, then the booking form itself.
 */
export default function FinalCta({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { finalCta, booking, common } = dict;

  return (
    <section id="book" className="relative overflow-hidden bg-night text-cream">
      <div className="absolute inset-x-0 top-0 h-[85svh] min-h-[36rem]">
        <div data-parallax="0.12" className="absolute inset-x-0 -top-[8%] h-[116%] opacity-60 [filter:brightness(0.55)_saturate(0.7)_hue-rotate(15deg)]">
          <Visual visual={{ photo: 'pavilion' }} locale={locale} photoSoon={common.photoSoon} sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1b2233_0%,rgb(13_18_32/0.35)_35%,rgb(13_18_32/0.75)_70%,#0d1220_100%)]" />
        <Fireflies />
      </div>

      <div className="container-wide relative pt-32 pb-24 sm:pt-40 lg:pb-32">
        <div className="max-w-4xl">
          <p data-reveal className="eyebrow !text-thatch">
            {finalCta.eyebrow}
          </p>
          <h2 data-reveal className="display mt-5 text-[clamp(3rem,9vw,7.5rem)] text-cream">
            {finalCta.title}
          </h2>
          <p data-reveal className="mt-6 max-w-xl text-lg text-cream/75">
            {finalCta.lead}
          </p>
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <p data-reveal className="eyebrow !text-thatch">
              {booking.eyebrow}
            </p>
            <h3 data-reveal className="display mt-4 text-4xl text-cream sm:text-5xl">
              {booking.title}
            </h3>
            <p data-reveal className="mt-5 leading-relaxed text-cream/70">
              {booking.lead}
            </p>
            <ul className="mt-8 space-y-3">
              {booking.perks.map((perk) => (
                <li key={perk} data-reveal className="flex items-center gap-3 text-cream/85">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-thatch/20 text-thatch">
                    <Check size={14} aria-hidden="true" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="lg:col-span-7">
            <BookingForm
              dict={{ booking, rooms: dict.rooms, dates: dict.dates, guests: dict.guests, intlLocale: dict.intlLocale }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
