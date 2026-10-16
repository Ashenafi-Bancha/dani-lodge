import Image from 'next/image';
import type { Locale } from '@/content';
import type { Visual as VisualData } from '@/content/types';
import Weave from '@/components/ui/Weave';
import { PHOTOS } from '@/lib/photos';

interface VisualProps {
  visual: VisualData;
  locale: Locale;
  /** "Photo coming soon" in the page language. */
  photoSoon: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * Renders a real lodge photo, or — until one exists — a clearly labelled
 * placeholder frame in the lodge palette. Fills its positioned parent.
 */
export default function Visual({ visual, locale, photoSoon, sizes, priority, className = '' }: VisualProps) {
  if ('photo' in visual) {
    const photo = PHOTOS[visual.photo];
    return (
      <Image
        src={photo.src}
        alt={photo.alt[locale]}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${photoSoon}: ${visual.placeholder}`}
      className={`absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden bg-[radial-gradient(120%_90%_at_30%_20%,#e9dcc2_0%,#cdb68b_45%,#8f7a52_100%)] p-6 text-center ${className}`}
    >
      <Weave className="absolute -right-[18%] -bottom-[22%] w-[75%] text-white/25" strokeWidth={0.8} />
      <Weave className="absolute -left-[12%] -top-[16%] w-[38%] text-white/20" strokeWidth={0.8} />
      <span className="relative rounded-full border border-canopy/25 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.2em] text-canopy/70 uppercase">
        {photoSoon}
      </span>
      <span className="relative font-display text-2xl text-canopy/85 sm:text-3xl">{visual.placeholder}</span>
    </div>
  );
}
