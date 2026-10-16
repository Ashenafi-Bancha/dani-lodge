'use client';

import { ArrowRight } from 'lucide-react';
import { useBooking } from '@/components/providers/BookingProvider';
import DateRangePicker from '@/components/ui/DateRangePicker';
import GuestSelector from '@/components/ui/GuestSelector';
import Magnetic from '@/components/ui/Magnetic';
import type { Dictionary } from '@/content/types';

interface BookingBarProps {
  dict: Pick<Dictionary, 'dates' | 'guests' | 'bookingBar' | 'common' | 'intlLocale'>;
}

/** The hero's booking bar. Shares its dates and guests with the booking form. */
export default function BookingBar({ dict }: BookingBarProps) {
  const { stay, updateStay, openBooking } = useBooking();

  return (
    <div className="rounded-[1.75rem] border border-white/15 bg-canopy/55 p-3 backdrop-blur-md sm:p-4">
      <div className="grid gap-2 lg:grid-cols-[2fr_1fr_auto] lg:items-stretch">
        <DateRangePicker
          id="hero-dates"
          tone="dark"
          side="top"
          checkIn={stay.checkIn}
          checkOut={stay.checkOut}
          onChange={updateStay}
          labels={dict.dates}
          intlLocale={dict.intlLocale}
        />
        <GuestSelector
          tone="dark"
          side="top"
          guests={{ adults: stay.adults, children: stay.children }}
          onChange={updateStay}
          labels={dict.guests}
          doneLabel={dict.dates.done}
        />
        <Magnetic strength={0.2} className="w-full lg:w-auto">
          <button
            type="button"
            onClick={() => openBooking()}
            className="btn btn-gold h-full min-h-[3.4rem] w-full !rounded-2xl lg:!px-7"
            data-cursor={dict.common.cursorExplore}
          >
            {dict.common.checkAvailability}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </Magnetic>
      </div>
      <p className="mt-2.5 px-2 text-xs text-white/65">{dict.bookingBar.note}</p>
    </div>
  );
}
