'use client';

import type { ReactNode } from 'react';
import { useBooking } from '@/components/providers/BookingProvider';
import Magnetic from '@/components/ui/Magnetic';
import type { Stay } from '@/lib/booking';

interface BookButtonProps {
  children: ReactNode;
  /** Choices to carry into the booking form, e.g. { room: 'event' }. */
  patch?: Partial<Stay>;
  className?: string;
  cursor?: string;
  magnetic?: boolean;
}

/** Any "Book" button on the page: applies its choice and opens the booking form. */
export default function BookButton({ children, patch, className = 'btn btn-gold', cursor, magnetic = true }: BookButtonProps) {
  const { openBooking } = useBooking();
  const button = (
    <button type="button" onClick={() => openBooking(patch)} className={className} data-cursor={cursor}>
      {children}
    </button>
  );
  return magnetic ? <Magnetic>{button}</Magnetic> : button;
}
