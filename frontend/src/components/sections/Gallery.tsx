import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import Picture from '@/components/ui/Picture';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { GALLERY } from '@/lib/photos';

// First photo is the tall feature tile on desktop; the rest stack beside it.
const TILE_LAYOUT = ['lg:col-span-2 lg:row-span-2', '', ''];

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((i) => (i === null ? i : (i + delta + GALLERY.length) % GALLERY.length)),
    []
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, step]);

  return (
    <section id="gallery" className="section bg-cream">
      <div className="container-page">
        <SectionHeading eyebrow="Gallery" title="A look around the grounds.">
          Real views from Dani Lodge. Tap any photo to see it larger.
        </SectionHeading>
      </div>

      {/* Swipeable strip on phones, editorial grid from lg up */}
      <RevealGroup className="hide-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:px-8 lg:container-page lg:mt-14 lg:grid lg:grid-cols-3 lg:grid-rows-2 lg:overflow-visible">
        {GALLERY.map((photo, i) => (
          <RevealItem
            key={photo.id}
            className={`w-[82%] shrink-0 snap-center sm:w-[60%] lg:w-auto ${TILE_LAYOUT[i] ?? ''}`}
          >
            <button
              onClick={() => setOpenIndex(i)}
              className="group relative block h-full w-full overflow-hidden rounded-[1.25rem]"
              aria-label={`View larger: ${photo.caption}`}
            >
              <Picture
                photo={photo}
                sizes="(min-width: 1024px) 60vw, 82vw"
                className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 ease-smooth-out group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-forest-deep/80 to-transparent p-4 pt-12 text-left text-sm text-cream">
                {photo.caption}
                <Expand size={16} aria-hidden="true" className="opacity-80" />
              </span>
            </button>
          </RevealItem>
        ))}
      </RevealGroup>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-forest-deep/95 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={GALLERY[openIndex].caption}
            onClick={() => setOpenIndex(null)}
          >
            <button
              className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full text-cream hover:text-gold-light"
              aria-label="Close"
            >
              <X size={26} />
            </button>

            <figure className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <Picture
                key={GALLERY[openIndex].id}
                photo={GALLERY[openIndex]}
                sizes="100vw"
                priority
                className="max-h-[78svh] w-auto rounded-xl object-contain"
              />
              <figcaption className="mt-4 flex items-center justify-between text-sm text-cream/80">
                <span>{GALLERY[openIndex].caption}</span>
                <span className="flex items-center gap-2">
                  <button
                    onClick={() => step(-1)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 hover:border-gold-light hover:text-gold-light"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="tabular-nums">
                    {openIndex + 1} / {GALLERY.length}
                  </span>
                  <button
                    onClick={() => step(1)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 hover:border-gold-light hover:text-gold-light"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={20} />
                  </button>
                </span>
              </figcaption>
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
