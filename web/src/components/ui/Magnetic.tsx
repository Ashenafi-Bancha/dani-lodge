'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '@/lib/animations';

interface MagneticProps {
  children: ReactNode;
  /** How far the content follows the pointer, as a share of its offset. */
  strength?: number;
  className?: string;
}

/**
 * Lets a button lean gently toward the pointer. Mouse and trackpad only;
 * touch screens and reduced-motion users get a normal, still button.
 */
export default function Magnetic({ children, strength = 0.3, className = '' }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const toX = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const toY = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      toX((e.clientX - (rect.left + rect.width / 2)) * strength);
      toY((e.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const onLeave = () => {
      toX(0);
      toY(0);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  );
}
