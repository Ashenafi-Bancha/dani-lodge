'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useScroller } from '@/components/providers/SmoothScroll';
import Visual from '@/components/ui/Visual';
import type { Locale } from '@/content';
import type { Dictionary } from '@/content/types';

interface GalleryProps {
  gallery: Dictionary['gallery'];
  common: Dictionary['common'];
  locale: Locale;
}

// An editorial mosaic on large screens; a simple two-column grid on phones
const TILES = [
  'col-span-2 lg:col-span-7 lg:row-span-2 aspect-[4/3] lg:aspect-auto',
  'lg:col-span-5 aspect-square lg:aspect-[16/10]',
  'lg:col-span-5 aspect-square lg:aspect-[16/10]',
  'lg:col-span-4 aspect-square lg:aspect-[4/3]',
  'lg:col-span-4 aspect-square lg:aspect-[4/3]',
  'col-span-2 lg:col-span-4 aspect-[16/9] lg:aspect-[4/3]',
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Gallery({ gallery, common, locale }: GalleryProps) {
  const [index, setIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const { lock } = useScroller();
  const count = gallery.items.length;
  const open = index !== null;

  const step = useCallback(
    (delta: number) => {
      setDirection(delta);
      setIndex((i) => (i === null ? i : (i + delta + count) % count));
    },
    [count]
  );

  const close = useCallback(() => setIndex(null), []);

  useEffect(() => {
    if (!open) return;
    lock(true);
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lock(false);
      returnFocusRef.current?.focus();
    };
  }, [open, close, step, lock]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -400) step(1);
    else if (info.offset.x > 70 || info.velocity.x > 400) step(-1);
  };

  return (
    <section id="gallery" className="relative bg-canopy py-24 text-cream sm:py-32">
      <div className="container-wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p data-reveal className="eyebrow !text-thatch">
              {gallery.eyebrow}
            </p>
            <h2 data-reveal className="display mt-5 text-[clamp(2.5rem,6.2vw,5rem)] text-cream">
              {gallery.title}
            </h2>
          </div>
          <p data-reveal className="text-sm text-cream/60">
            {gallery.hint}
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:auto-rows-[minmax(0,1fr)] lg:grid-cols-12">
          {gallery.items.map((item, i) => (
            <li key={item.caption} data-reveal className={`relative ${TILES[i % TILES.length]}`}>
              <button
                type="button"
                onClick={(e) => {
                  returnFocusRef.current = e.currentTarget;
                  setDirection(1);
                  setIndex(i);
                }}
                data-cursor={common.cursorView}
                className="group absolute inset-0 overflow-hidden rounded-[1.25rem] text-left sm:rounded-[1.5rem]"
                aria-label={item.caption}
              >
                <div className="absolute inset-0 transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-105">
                  <Visual visual={item.visual} locale={locale} photoSoon={common.photoSoon} sizes="(min-width: 1024px) 50vw, 50vw" />
                </div>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-canopy/80 to-transparent p-4 pt-14 text-sm text-cream opacity-90 transition-opacity duration-500 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                  {item.caption}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={gallery.items[index].caption}
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[85] flex flex-col bg-night/95 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between px-4 py-3 sm:px-8">
              <span className="text-sm text-cream/70 tabular-nums">
                {index + 1} / {count}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="flex min-h-11 items-center gap-2 rounded-full px-3 text-cream hover:text-thatch-light"
              >
                {common.close} <X size={22} aria-hidden="true" />
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 sm:px-20">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.figure
                  key={index}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ x: d * 80, opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (d: number) => ({ x: d * -80, opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: EASE }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={onDragEnd}
                  className="w-full max-w-5xl cursor-grab touch-pan-y active:cursor-grabbing"
                >
                  <div className="relative aspect-[4/3] max-h-[75svh] overflow-hidden rounded-2xl">
                    <Visual visual={gallery.items[index].visual} locale={locale} photoSoon={common.photoSoon} sizes="(min-width: 1024px) 64rem, 100vw" className="pointer-events-none" />
                  </div>
                  <figcaption className="mt-4 text-center font-display text-2xl text-cream/90">{gallery.items[index].caption}</figcaption>
                </motion.figure>
              </AnimatePresence>

              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={common.previous}
                className="absolute left-3 hidden h-12 w-12 items-center justify-center rounded-full border border-white/20 text-cream hover:border-thatch-light hover:text-thatch-light sm:flex"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={common.next}
                className="absolute right-3 hidden h-12 w-12 items-center justify-center rounded-full border border-white/20 text-cream hover:border-thatch-light hover:text-thatch-light sm:flex"
              >
                <ChevronRight size={22} />
              </button>
            </div>
            <div className="h-6 sm:h-10" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
