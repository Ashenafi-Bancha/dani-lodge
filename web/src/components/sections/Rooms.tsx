'use client';

import { useId, useRef } from 'react';
import { ArrowRight, BedDouble, Eye, Maximize2 } from 'lucide-react';
import { useBooking } from '@/components/providers/BookingProvider';
import SampleBadge from '@/components/ui/SampleBadge';
import Visual from '@/components/ui/Visual';
import type { Locale } from '@/content';
import type { Dictionary, Room } from '@/content/types';
import { gsap, useGSAP } from '@/lib/animations';

interface RoomsProps {
  rooms: Dictionary['rooms'];
  common: Dictionary['common'];
  locale: Locale;
  intlLocale: string;
}

/**
 * Rooms & suites. On large screens the section pins and vertical scrolling
 * slides the cards sideways; on phones the row is a native swipe.
 */
export default function Rooms({ rooms, common, locale, intlLocale }: RoomsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const track = trackRef.current;
        const section = sectionRef.current;
        if (!track || !section) return;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  const price = new Intl.NumberFormat(intlLocale);

  return (
    <section ref={sectionRef} id="rooms" className="relative overflow-hidden bg-sand lg:flex lg:h-svh lg:flex-col lg:justify-start">
      <div className="container-wide pt-24 sm:pt-32 lg:pt-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p data-reveal className="eyebrow">
              {rooms.eyebrow}
            </p>
            <h2 data-reveal className="display mt-5 text-[clamp(2.5rem,6vw,4.5rem)] text-canopy lg:mt-3 lg:text-[clamp(2.5rem,4.2vw,3.75rem)]">
              {rooms.title}
            </h2>
          </div>
          <p data-reveal className="max-w-md text-sm leading-relaxed text-ink/65">
            <SampleBadge label={common.sample} note={common.sampleNote} className="mr-2 align-middle" />
            {rooms.lead}
          </p>
        </div>
      </div>

      <div
        ref={trackRef}
        className="hide-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-24 sm:px-10 lg:mt-8 lg:snap-none lg:overflow-visible lg:pb-0"
      >
        {rooms.items.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            labels={rooms}
            common={common}
            locale={locale}
            priceText={`${common.from} ${common.currency} ${price.format(room.priceFrom)}`}
          />
        ))}
      </div>
    </section>
  );
}

interface RoomCardProps {
  room: Room;
  labels: Dictionary['rooms'];
  common: Dictionary['common'];
  locale: Locale;
  priceText: string;
}

/** Leans gently toward the pointer; the photo ripples like water on hover. */
function RoomCard({ room, labels, common, locale, priceText }: RoomCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const displaceRef = useRef<SVGFEDisplacementMapElement>(null);
  const filterId = `ripple-${useId().replace(/:/g, '')}`;
  const { openBooking } = useBooking();

  useGSAP(() => {
    const card = cardRef.current;
    const media = mediaRef.current;
    const displace = displaceRef.current;
    if (!card || !media || !displace) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      rotY(((e.clientX - r.left) / r.width - 0.5) * 6);
      rotX(-((e.clientY - r.top) / r.height - 0.5) * 6);
    };
    const onEnter = () => {
      // The filter is only attached while it animates: free the rest of the time
      media.style.filter = `url(#${filterId})`;
      gsap.fromTo(
        displace,
        { attr: { scale: 0 } },
        {
          attr: { scale: 16 },
          duration: 0.5,
          ease: 'sine.out',
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            media.style.filter = '';
          },
        }
      );
    };
    const onLeave = () => {
      rotX(0);
      rotY(0);
    };

    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointerleave', onLeave);
    return () => {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerenter', onEnter);
      card.removeEventListener('pointerleave', onLeave);
    };
  });

  return (
    <div className="shrink-0 snap-center [perspective:1200px]">
      <article
        ref={cardRef}
        data-cursor={common.cursorView}
        className="group flex w-[82vw] flex-col overflow-hidden rounded-[1.75rem] bg-paper shadow-[var(--shadow-soft)] will-change-transform sm:w-[24rem] lg:w-[27rem]"
      >
        <svg className="absolute h-0 w-0" aria-hidden="true">
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.03" numOctaves="2" seed="4" />
            <feDisplacementMap ref={displaceRef} in="SourceGraphic" scale="0" />
          </filter>
        </svg>

        <div ref={mediaRef} className="relative aspect-[4/3] overflow-hidden lg:aspect-[16/9]">
          <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-expo)] group-hover:scale-[1.06]">
            <Visual visual={room.visual} locale={locale} photoSoon={common.photoSoon} sizes="(min-width: 1024px) 27rem, 82vw" />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6 lg:p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="display text-3xl text-canopy">{room.name}</h3>
            {room.sample && <SampleBadge label={common.sample} note={common.sampleNote} className="mt-2 shrink-0" />}
          </div>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/65 lg:hidden">{room.summary}</p>

          <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-canopy/10 py-4 text-sm lg:mt-4 lg:py-3">
            {[
              { icon: Maximize2, label: labels.sizeLabel, value: room.size },
              { icon: BedDouble, label: labels.bedsLabel, value: room.beds },
              { icon: Eye, label: labels.viewLabel, value: room.view },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <dt className="flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-[0.14em] text-ink/70 uppercase">
                  <Icon size={12} aria-hidden="true" /> {label}
                </dt>
                <dd className="mt-1 text-ink/85">{value}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-4 flex flex-wrap gap-2">
            {room.amenities.map((a) => (
              <li key={a} className="rounded-full bg-sand px-3 py-1 text-xs text-ink/70">
                {a}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-end justify-between gap-4 pt-2 lg:mt-4">
            <p>
              <span className="block font-display text-2xl text-canopy">{priceText}</span>
              <span className="text-xs text-ink/70">{common.perNight}</span>
            </p>
            <button
              type="button"
              onClick={() => openBooking({ room: room.id })}
              className="btn btn-forest !min-h-11 !px-4 text-sm"
            >
              {labels.bookRoom} <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
