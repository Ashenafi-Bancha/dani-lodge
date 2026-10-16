'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/animations';

/**
 * A soft ring that follows the mouse and names what is underneath it
 * ("View", "Explore", "Drag") — read from the nearest `data-cursor`
 * attribute. The normal pointer stays visible. Mouse and trackpad only.
 */
export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    const ring = ringRef.current;
    if (!ring) return;

    const toX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' });
    const toY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' });
    let current = '';
    let shown = false;

    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        setEnabled(true);
        gsap.set(ring, { x: e.clientX, y: e.clientY });
      }
      toX(e.clientX);
      toY(e.clientY);
      const next = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? '';
      if (next !== current) {
        current = next;
        setLabel(next);
      }
    };
    const onLeave = () => {
      shown = false;
      setEnabled(false);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-[95] hidden transition-opacity duration-300 lg:block ${enabled ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-300 ease-[var(--ease-soft)] ${
          label
            ? 'h-24 w-24 border-transparent bg-thatch/90 text-canopy backdrop-blur-sm'
            : 'h-8 w-8 border-thatch/70 bg-transparent'
        }`}
      >
        <span className={`text-[0.7rem] font-semibold tracking-[0.18em] uppercase transition-opacity duration-200 ${label ? 'opacity-100' : 'opacity-0'}`}>
          {label}
        </span>
      </div>
    </div>
  );
}
