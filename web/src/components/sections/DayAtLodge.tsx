'use client';

import { useRef } from 'react';
import SampleBadge from '@/components/ui/SampleBadge';
import Visual from '@/components/ui/Visual';
import type { Locale } from '@/content';
import type { Dictionary } from '@/content/types';
import { gsap, useGSAP } from '@/lib/animations';

// Morning, late morning, golden hour, night — the page's time of day in miniature
const SKIES = ['#f4ecdc', '#ece3cf', '#e8c98e', '#0d1220'];
const NIGHT = 3;

interface DayAtLodgeProps {
  day: Dictionary['day'];
  common: Dictionary['common'];
  locale: Locale;
}

/**
 * "A day at Dani Lodge". On larger screens the section pins and the scroll
 * scrubs from morning to night: the sky colour, photo, text and the sun's
 * arc all move together. Phones and reduced-motion visitors get the same
 * four moments as a calm vertical story.
 */
export default function DayAtLodge({ day, common, locale }: DayAtLodgeProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const stage = stageRef.current;
        if (!stage) return;
        const q = gsap.utils.selector(stage);
        const steps = day.moments.length - 1;

        gsap.set(q('[data-sky]:not(:first-child), [data-shot]:not(:first-child), [data-copy]:not(:first-child)'), { autoAlpha: 0 });
        gsap.set(q('[data-copy]:not(:first-child)'), { y: 40 });

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut', duration: 1 },
          scrollTrigger: { trigger: stage, start: 'top top', end: `+=${steps * 100}%`, scrub: 1, pin: true, invalidateOnRefresh: true },
        });

        for (let i = 1; i <= steps; i++) {
          const at = i - 1;
          tl.to(q('[data-sky]')[i], { autoAlpha: 1 }, at)
            .to(q('[data-shot]')[i - 1], { autoAlpha: 0, scale: 1.04 }, at)
            .fromTo(q('[data-shot]')[i], { autoAlpha: 0, scale: 1.1 }, { autoAlpha: 1, scale: 1 }, at)
            .to(q('[data-copy]')[i - 1], { autoAlpha: 0, y: -40 }, at)
            .to(q('[data-copy]')[i], { autoAlpha: 1, y: 0 }, at + 0.15)
            .to(q('[data-dot]')[i], { backgroundColor: '#c8a45a' }, at);
        }
        // The sun travels an arc across the whole timeline, then sets
        tl.fromTo(q('[data-sun]'), { x: 0 }, { x: () => window.innerWidth * 0.85, ease: 'none', duration: steps }, 0)
          .fromTo(q('[data-sun-y]'), { yPercent: 120 }, { yPercent: -60, ease: 'sine.out', duration: steps / 2 }, 0)
          .to(q('[data-sun-y]'), { yPercent: 160, ease: 'sine.in', duration: steps / 2 }, steps / 2)
          .to(q('[data-ink]'), { color: '#f6f1e6', duration: 0.6 }, steps - 0.8);
      });
      return () => mm.revert();
    },
    { dependencies: [day.moments.length] }
  );

  return (
    <section id="day" aria-label={day.eyebrow} className="relative bg-cream">
      <div className="container-wide pt-24 pb-12 sm:pt-32">
        <p data-reveal className="eyebrow">
          {day.eyebrow}
        </p>
        <h2 data-reveal className="display mt-5 max-w-4xl text-[clamp(2.5rem,6.2vw,5rem)] text-canopy">
          {day.title}
        </h2>
      </div>

      {/* Pinned stage: large screens with motion */}
      <div ref={stageRef} className="relative hidden h-svh overflow-hidden lg:motion-safe:block">
        {SKIES.map((color) => (
          <div key={color} data-sky className="absolute inset-0" style={{ backgroundColor: color }} />
        ))}

        <div data-sun className="pointer-events-none absolute top-[18%] left-[2%] h-20 w-20" aria-hidden="true">
          <div data-sun-y className="h-full w-full rounded-full bg-[radial-gradient(circle,#ffe2a0_0%,#e7b85e_45%,transparent_70%)] blur-[1px]" />
        </div>

        <div className="container-wide relative grid h-full grid-cols-12 items-center gap-10">
          <div data-ink className="relative col-span-5 h-72 text-canopy">
            {day.moments.map((m, i) => (
              <div key={m.time} data-copy className={`absolute inset-0 flex flex-col justify-center ${i === NIGHT ? 'text-cream' : ''}`}>
                <p className="font-display text-7xl text-thatch-deep italic tabular-nums">{m.time}</p>
                <h3 className="display mt-4 text-5xl">{m.title}</h3>
                <p className="mt-5 max-w-md text-lg leading-relaxed opacity-75">{m.text}</p>
                {m.sample && <SampleBadge label={common.sample} note={common.sampleNote} tone={i === NIGHT ? 'dark' : 'light'} className="mt-5 self-start" />}
              </div>
            ))}
          </div>

          <div className="relative col-span-7 aspect-[5/4] overflow-hidden rounded-[2rem] shadow-[var(--shadow-lift)]">
            {day.moments.map((m) => (
              <div key={m.time} data-shot className="absolute inset-0">
                <Visual visual={m.visual} locale={locale} photoSoon={common.photoSoon} sizes="55vw" />
              </div>
            ))}
          </div>
        </div>

        <ol className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-3" aria-hidden="true">
          {day.moments.map((m, i) => (
            <li key={m.time} data-dot className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-thatch' : 'bg-stone/50'}`} />
          ))}
        </ol>
      </div>

      {/* Stacked story: phones, tablets and reduced motion */}
      <ol className="container-wide grid gap-14 pb-24 sm:grid-cols-2 sm:gap-x-8 lg:motion-safe:hidden">
        {day.moments.map((m) => (
          <li key={m.time}>
            <div data-reveal-mask className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
              <Visual visual={m.visual} locale={locale} photoSoon={common.photoSoon} sizes="(min-width: 640px) 45vw, 90vw" />
            </div>
            <div data-reveal className="mt-6">
              <p className="font-display text-4xl text-thatch-deep italic tabular-nums">{m.time}</p>
              <h3 className="display mt-2 text-3xl text-canopy">{m.title}</h3>
              <p className="mt-3 leading-relaxed text-ink/70">{m.text}</p>
              {m.sample && <SampleBadge label={common.sample} note={common.sampleNote} className="mt-4" />}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
