'use client';

import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/animations';

const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

/** Header height, so anchored sections are not hidden behind it. */
const OFFSET = -72;

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis
 * stay in lockstep. Skipped entirely for reduced-motion users, who get the
 * browser's own scrolling.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.9,
      anchors: { offset: OFFSET, duration: 1.6 },
      autoRaf: false,
    });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}

/**
 * Scroll helpers that work with or without Lenis. Read at call time, so
 * callers always get the live instance.
 */
export function useScroller() {
  const ref = useContext(LenisContext);

  return useMemo(() => ({
    scrollTo(target: string | HTMLElement) {
      const lenis = ref?.current;
      if (lenis) {
        lenis.scrollTo(target, { offset: OFFSET, duration: 1.6 });
        return;
      }
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      el?.scrollIntoView({ behavior: 'smooth' });
    },
    /** Freeze page scrolling while an overlay (menu, lightbox) is open. */
    lock(locked: boolean) {
      const lenis = ref?.current;
      if (lenis) {
        if (locked) lenis.stop();
        else lenis.start();
      }
      document.documentElement.style.overflow = locked ? 'hidden' : '';
    },
  }), [ref]);
}
