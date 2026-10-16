'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CheckCircle2, MessageCircle, Phone } from 'lucide-react';
import { useBooking } from '@/components/providers/BookingProvider';
import DateRangePicker from '@/components/ui/DateRangePicker';
import GuestSelector from '@/components/ui/GuestSelector';
import { SITE } from '@/content/site';
import { submitBooking, validateBooking, type BookingCopy, type BookingErrors, type Guest } from '@/lib/booking';

const EMPTY_GUEST: Guest = { name: '', phone: '', email: '', requests: '' };

/**
 * The full booking request. Dates, guests and room are shared with the hero
 * bar and room cards; this form adds who is booking and sends it all to the
 * lodge (on WhatsApp today — see lib/booking.ts).
 */
export default function BookingForm({ dict }: { dict: BookingCopy }) {
  const { booking, rooms, dates, guests, intlLocale } = dict;
  const { stay, updateStay, openCount } = useBooking();
  const [guest, setGuest] = useState<Guest>(EMPTY_GUEST);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [status, setStatus] = useState<'idle' | 'prefilled' | 'sent'>('idle');
  const nameRef = useRef<HTMLInputElement>(null);

  // Arriving from a "Book" button elsewhere: point the visitor at what is left to fill
  useEffect(() => {
    if (openCount === 0) return;
    const id = window.setTimeout(() => {
      setStatus('prefilled');
      nameRef.current?.focus({ preventScroll: true });
    }, 900);
    return () => window.clearTimeout(id);
  }, [openCount]);

  const set = (key: keyof Guest, value: string) => {
    setGuest((g) => ({ ...g, [key]: value }));
    if (status === 'sent') setStatus('idle');
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const request = { ...stay, ...guest };
    const found = validateBooking(request, booking);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('idle');
      return;
    }
    submitBooking(request, dict);
    setStatus('sent');
  };

  const errorText = (key: keyof BookingErrors) =>
    errors[key] ? (
      <p id={`book-${key}-error`} className="mt-1.5 text-sm text-red-700">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-[2rem] bg-paper p-6 text-ink shadow-[var(--shadow-lift)] sm:p-8">
      <div className="grid gap-5">
        <div>
          <DateRangePicker
            id="form-dates"
            checkIn={stay.checkIn}
            checkOut={stay.checkOut}
            onChange={(range) => {
              updateStay(range);
              setErrors((e) => ({ ...e, dates: undefined }));
            }}
            labels={dates}
            intlLocale={intlLocale}
            invalid={Boolean(errors.dates)}
          />
          {errorText('dates')}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <GuestSelector guests={{ adults: stay.adults, children: stay.children }} onChange={updateStay} labels={guests} doneLabel={dates.done} />
          <div>
            <label htmlFor="book-room" className="sr-only">
              {booking.roomType}
            </label>
            <div className="relative flex min-h-[3.4rem] flex-col justify-center rounded-2xl border border-canopy/15 bg-white px-4 py-2 focus-within:border-thatch">
              <span className="text-[0.65rem] font-semibold tracking-[0.14em] text-ink/70 uppercase" aria-hidden="true">
                {booking.roomType}
              </span>
              <select
                id="book-room"
                value={stay.room}
                onChange={(e) => updateStay({ room: e.target.value })}
                className="w-full appearance-none bg-transparent text-[0.95rem] focus:outline-none"
              >
                <option value="any">{booking.roomAny}</option>
                {rooms.items.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
                <option value="event">{booking.roomEvent}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="book-name" className="field-label">
              {booking.name}
            </label>
            <input
              ref={nameRef}
              id="book-name"
              autoComplete="name"
              value={guest.name}
              onChange={(e) => set('name', e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'book-name-error' : undefined}
              className="field"
            />
            {errorText('name')}
          </div>
          <div>
            <label htmlFor="book-phone" className="field-label">
              {booking.phone}
            </label>
            <input
              id="book-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={booking.phonePlaceholder}
              value={guest.phone}
              onChange={(e) => set('phone', e.target.value)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'book-phone-error' : undefined}
              className="field"
            />
            {errorText('phone')}
          </div>
        </div>

        <div>
          <label htmlFor="book-email" className="field-label">
            {booking.email} <span className="normal-case opacity-60">({booking.optional})</span>
          </label>
          <input
            id="book-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={guest.email}
            onChange={(e) => set('email', e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'book-email-error' : undefined}
            className="field"
          />
          {errorText('email')}
        </div>

        <div>
          <label htmlFor="book-requests" className="field-label">
            {booking.requests} <span className="normal-case opacity-60">({booking.optional})</span>
          </label>
          <textarea
            id="book-requests"
            rows={3}
            placeholder={booking.requestsPlaceholder}
            value={guest.requests}
            onChange={(e) => set('requests', e.target.value)}
            className="field resize-none"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-forest mt-6 w-full !min-h-14 text-base">
        <MessageCircle size={18} aria-hidden="true" /> {booking.submit}
      </button>

      <p className="mt-4 text-center text-sm text-ink/70">
        {booking.orCall}{' '}
        <a href={SITE.phoneHref} className="inline-flex items-center gap-1 font-medium text-forest underline-offset-4 hover:underline">
          <Phone size={14} aria-hidden="true" /> {SITE.phone}
        </a>
      </p>
      <p className="mt-3 text-center text-xs text-ink/70">{booking.note}</p>

      <div role="status" className="mt-4 min-h-6 text-sm text-forest">
        {status !== 'idle' && (
          <p className="flex items-start justify-center gap-2 text-center">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            {status === 'sent' ? booking.sent : booking.prefilled}
          </p>
        )}
      </div>
    </form>
  );
}
