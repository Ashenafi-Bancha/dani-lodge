'use client';

import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useScroller } from '@/components/providers/SmoothScroll';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface PopoverProps {
  open: boolean;
  onClose: () => void;
  /** The element the popover belongs to; clicks inside it do not close it. */
  anchorRef: RefObject<HTMLElement | null>;
  label: string;
  children: ReactNode;
  className?: string;
  /** Open above the trigger (for controls near the bottom of the screen). */
  side?: 'top' | 'bottom';
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A panel that opens below its trigger on larger screens and as a bottom
 * sheet on phones (rendered at the page root so transformed parents cannot
 * clip it). Closes on Escape and on clicks outside.
 */
export default function Popover({ open, onClose, anchorRef, label, children, className = '', side = 'bottom' }: PopoverProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const panelRef = useRef<HTMLDivElement>(null);
  const { lock } = useScroller();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (anchorRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      onClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [open, onClose, anchorRef]);

  // Phones: stop the page scrolling behind the sheet
  useEffect(() => {
    if (!open || isDesktop) return;
    lock(true);
    return () => lock(false);
  }, [open, isDesktop, lock]);

  if (isDesktop) {
    return (
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label={label}
            data-lenis-prevent
            initial={{ opacity: 0, y: side === 'top' ? -10 : 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === 'top' ? -6 : 6, scale: 0.98 }}
            transition={{ duration: 0.28, ease: EASE }}
            className={`absolute z-50 rounded-3xl ${side === 'top' ? 'bottom-full mb-3 origin-bottom' : 'top-full mt-3 origin-top'} bg-paper p-5 text-ink shadow-[var(--shadow-lift)] ring-1 ring-canopy/10 ${className}`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] bg-canopy/50 backdrop-blur-[2px]"
            aria-hidden="true"
          />
          <motion.div
            key="sheet"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            data-lenis-prevent
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.45, ease: EASE }}
            className="pb-safe fixed inset-x-0 bottom-0 z-[81] max-h-[88svh] overflow-y-auto rounded-t-[1.75rem] bg-paper px-5 pt-3 text-ink"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-canopy/15" aria-hidden="true" />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
