import Counter from '@/components/ui/Counter';
import SampleBadge from '@/components/ui/SampleBadge';
import SectionHeading from '@/components/ui/SectionHeading';
import Visual from '@/components/ui/Visual';
import Weave from '@/components/ui/Weave';
import type { Dictionary, Locale } from '@/content';

/** Morning light: the lodge's story, layered parallax photos, counters and a slow marquee. */
export default function Story({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { story, common } = dict;
  // Two copies side by side make the loop seamless
  const words = [...story.marquee, ...story.marquee];

  return (
    <section id="story" className="relative overflow-hidden bg-paper pt-24 sm:pt-32 lg:pt-40">
      <div className="container-wide grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 lg:pr-10">
          <SectionHeading eyebrow={story.eyebrow} title={story.title} />
          <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/75 sm:text-lg">
            {story.paragraphs.map((p) => (
              <p key={p} data-reveal>
                {p}
              </p>
            ))}
          </div>
          <p data-reveal className="mt-10 font-display text-3xl text-thatch-deep italic sm:text-4xl">
            “{story.quote}”
          </p>
        </div>

        {/* Three depths: the large photo drifts slowly, the inset faster the other way, the ornament fastest */}
        <div className="relative lg:col-span-6">
          <div data-reveal-mask className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[var(--shadow-soft)] sm:ml-16">
            <div data-parallax="0.18" className="absolute inset-x-0 -top-[12%] h-[124%]">
              <Visual visual={{ photo: 'garden' }} locale={locale} photoSoon={common.photoSoon} sizes="(min-width: 1024px) 45vw, 90vw" />
            </div>
          </div>
          <div
            data-parallax="-0.35"
            className="absolute -bottom-10 -left-2 w-[46%] overflow-hidden rounded-[1.5rem] border-[6px] border-paper shadow-[var(--shadow-lift)] sm:left-0"
          >
            <div className="relative aspect-square">
              <Visual visual={{ photo: 'courtyard' }} locale={locale} photoSoon={common.photoSoon} sizes="(min-width: 1024px) 22vw, 45vw" />
            </div>
          </div>
          <div data-parallax="-0.6" className="absolute -top-10 -right-6 w-32 text-thatch/50 sm:w-40">
            <Weave strokeWidth={0.9} />
          </div>
        </div>
      </div>

      <dl className="container-wide mt-28 grid gap-10 border-t border-canopy/10 pt-12 sm:grid-cols-3">
        {story.counters.map((c) => (
          // Label first in the markup (as <dl> requires), number first on screen
          <div key={c.label} data-reveal className="flex flex-col-reverse">
            <dt className="mt-3 flex flex-wrap items-center gap-2 text-sm tracking-wide text-ink/65">
              {c.label}
              {c.sample && <SampleBadge label={common.sample} note={common.sampleNote} />}
            </dt>
            <dd className="font-display text-6xl text-canopy sm:text-7xl">
              <Counter value={c.value} intlLocale={dict.intlLocale} />
              {c.suffix && <span className="text-4xl text-thatch-deep">{c.suffix}</span>}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-24 overflow-hidden border-y border-canopy/10 bg-cream py-6 sm:py-8" aria-hidden="true">
        <div className="marquee-track flex w-max">
          {words.map((word, i) => (
            <span key={i} className="flex items-center font-display text-5xl text-canopy/80 italic sm:text-7xl">
              <span className="px-8 sm:px-12">{word}</span>
              <Weave className="h-6 w-6 text-thatch sm:h-8 sm:w-8" strokeWidth={3} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
