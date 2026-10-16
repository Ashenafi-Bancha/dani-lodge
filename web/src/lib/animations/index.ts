'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Motion language: slow, soft, never bouncy. Reveals sit in the 0.9–1.4 s
 * range; micro-interactions in the 0.2–0.3 s range.
 */
export const EASE = {
  reveal: 'expo.out',
  soft: 'power3.out',
  inOut: 'power2.inOut',
} as const;

export const DURATION = {
  reveal: 1.2,
  mask: 1.4,
  micro: 0.25,
} as const;

export { gsap, ScrollTrigger, useGSAP };
