'use client';

import { useRef } from 'react';
import { EASE, gsap, useGSAP } from '@/lib/animations';

interface CounterProps {
  value: number;
  intlLocale: string;
}

/**
 * Counts up to `value` the first time it scrolls into view. The server
 * renders the final number, so it reads correctly without JavaScript; the
 * count only starts after this component has hydrated.
 */
export default function Counter({ value, intlLocale }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el || !document.documentElement.classList.contains('motion-ok')) return;
    const format = new Intl.NumberFormat(intlLocale);
    const state = { n: 0 };
    gsap.to(state, {
      n: value,
      duration: 2.2,
      ease: EASE.soft,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onStart: () => {
        el.textContent = format.format(0);
      },
      onUpdate: () => {
        el.textContent = format.format(Math.round(state.n));
      },
    });
  });

  return <span ref={ref}>{new Intl.NumberFormat(intlLocale).format(value)}</span>;
}
