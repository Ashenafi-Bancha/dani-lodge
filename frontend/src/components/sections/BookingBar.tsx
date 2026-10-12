import { useState, type FormEvent } from 'react';
import { CalendarCheck } from 'lucide-react';
import { todayIso, type StayRequest } from '@/lib/inquiry';

const GUEST_OPTIONS = [
  { value: '1', label: '1 guest' },
  { value: '2', label: '2 guests' },
  { value: '3', label: '3 guests' },
  { value: '4', label: '4 guests' },
  { value: '5', label: '5+ guests' },
];

const FIELD =
  'w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-base text-white [color-scheme:dark] focus:border-gold-light focus:outline-none';
const LABEL = 'mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-white/70';

interface BookingBarProps {
  /** Receives the chosen dates; the enquiry form picks them up from there. */
  onSubmit: (request: StayRequest) => void;
}

export default function BookingBar({ onSubmit }: BookingBarProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const today = todayIso();

  const changeCheckIn = (value: string) => {
    setCheckIn(value);
    // A check-out before the new check-in no longer makes sense
    if (checkOut && value && checkOut < value) setCheckOut('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ checkIn, checkOut, guests });
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Check availability"
      className="rounded-[1.25rem] border border-white/15 bg-forest-deep/65 p-4 backdrop-blur-md sm:p-5"
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-[1fr_1fr_0.8fr_auto] lg:items-end lg:gap-4">
        <div>
          <label htmlFor="bar-checkIn" className={LABEL}>
            Check-in
          </label>
          <input
            id="bar-checkIn"
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => changeCheckIn(e.target.value)}
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="bar-checkOut" className={LABEL}>
            Check-out
          </label>
          <input
            id="bar-checkOut"
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className={FIELD}
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <label htmlFor="bar-guests" className={LABEL}>
            Guests
          </label>
          <select
            id="bar-guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className={FIELD}
          >
            {GUEST_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value} className="text-ink">
                {label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-gold col-span-2 lg:col-span-1">
          <CalendarCheck size={17} aria-hidden="true" /> Check availability
        </button>
      </div>
      <p className="mt-3 text-xs text-white/60">
        No booking is made here — the lodge will contact you to confirm.
      </p>
    </form>
  );
}
