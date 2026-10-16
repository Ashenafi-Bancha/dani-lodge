'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useScroller } from '@/components/providers/SmoothScroll';
import { EMPTY_STAY, type Stay } from '@/lib/booking';

interface BookingContextValue {
  stay: Stay;
  updateStay: (patch: Partial<Stay>) => void;
  /** Applies any choices (dates, room…) and takes the visitor to the booking form. */
  openBooking: (patch?: Partial<Stay>) => void;
  /** Increments each time openBooking runs, so the form can react (focus, message). */
  openCount: number;
}

const BookingContext = createContext<BookingContextValue | null>(null);

/**
 * One shared stay request for the whole page: the hero booking bar, room
 * cards, sticky "Book now" button and the booking form all read and write the
 * same dates, guests and room.
 */
export default function BookingProvider({ children }: { children: ReactNode }) {
  const [stay, setStay] = useState<Stay>(EMPTY_STAY);
  const [openCount, setOpenCount] = useState(0);
  const { scrollTo } = useScroller();

  const updateStay = useCallback((patch: Partial<Stay>) => setStay((s) => ({ ...s, ...patch })), []);

  const openBooking = useCallback(
    (patch?: Partial<Stay>) => {
      if (patch) setStay((s) => ({ ...s, ...patch }));
      setOpenCount((n) => n + 1);
      scrollTo('#book');
    },
    [scrollTo]
  );

  const value = useMemo(
    () => ({ stay, updateStay, openBooking, openCount }),
    [stay, updateStay, openBooking, openCount]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
  return ctx;
}
