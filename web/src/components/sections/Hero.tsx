import { ArrowDown } from 'lucide-react';
import BookingBar from '@/components/sections/BookingBar';
import HeroBackdrop from '@/components/sections/HeroBackdrop';
import type { Dictionary, Locale } from '@/content';

/**
 * Entrance animations here are CSS (see .hero-in / .line-in in globals.css)
 * so the headline never waits for JavaScript to appear.
 */
export default function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { hero, common } = dict;

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-canopy text-white">
      <HeroBackdrop locale={locale} photoSoon={common.photoSoon} />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgb(18_35_26/0.55)_0%,rgb(18_35_26/0.18)_22%,rgb(18_35_26/0.55)_48%,rgb(18_35_26/0.94)_100%)] lg:bg-[linear-gradient(100deg,rgb(18_35_26/0.78)_0%,rgb(18_35_26/0.45)_45%,rgb(18_35_26/0.1)_75%),linear-gradient(to_bottom,rgb(18_35_26/0.5)_0%,transparent_25%,transparent_60%,rgb(18_35_26/0.85)_100%)]" />

      <div className="container-wide relative z-10 pt-32 pb-8 sm:pb-12">
        <p className="hero-in eyebrow !text-thatch-light [text-shadow:0_1px_12px_rgb(18_35_26/0.6)]" style={{ ['--d' as string]: '0s' }}>
          {hero.eyebrow}
        </p>

        <h1 className="display mt-5 text-[clamp(3.1rem,11vw,9rem)] text-white">
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="line-in block" style={{ ['--d' as string]: '0.05s' }}>
              {hero.titleA}
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.12em]">
            <em className="line-in block font-normal text-thatch-light" style={{ ['--d' as string]: '0.18s' }}>
              {hero.titleB}
            </em>
          </span>
        </h1>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="hero-in max-w-xl text-base leading-relaxed text-white/85 sm:text-lg" style={{ ['--d' as string]: '0.35s' }}>
            {hero.lead}
          </p>
          <a
            href="#story"
            className="hero-in hidden items-center gap-2 text-xs tracking-[0.24em] text-white/70 uppercase transition-colors hover:text-thatch-light lg:flex"
            style={{ ['--d' as string]: '0.6s' }}
          >
            {hero.scroll}
            <ArrowDown size={14} className="breathe" aria-hidden="true" />
          </a>
        </div>

        <div className="hero-in mt-8 max-w-5xl" style={{ ['--d' as string]: '0.5s' }}>
          <BookingBar
            dict={{ dates: dict.dates, guests: dict.guests, bookingBar: dict.bookingBar, common, intlLocale: dict.intlLocale }}
          />
        </div>
      </div>
    </section>
  );
}
