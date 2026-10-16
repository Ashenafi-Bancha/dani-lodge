'use client';

import { useSyncExternalStore } from 'react';

/** Live result of a CSS media query. Always false during server rendering. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** A real mouse or trackpad: enables cursor effects, tilt and magnetic buttons. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');
