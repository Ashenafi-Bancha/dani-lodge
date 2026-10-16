import { SITE, whatsappLink } from '@/content/site';
import type { Dictionary } from '@/content/types';
import { formatShort, nightsBetween } from '@/lib/dates';

export interface Stay {
  checkIn: string | null;
  checkOut: string | null;
  adults: number;
  children: number;
  /** A room id from the content file, 'any', or 'event'. */
  room: string;
}

export interface Guest {
  name: string;
  phone: string;
  email: string;
  requests: string;
}

export interface BookingRequest extends Stay, Guest {}

/** The text the booking flow needs — kept small so client components only receive this. */
export type BookingCopy = Pick<Dictionary, 'booking' | 'rooms' | 'dates' | 'guests' | 'intlLocale'>;

export type BookingErrors = Partial<Record<'name' | 'phone' | 'dates' | 'email', string>>;

export const EMPTY_STAY: Stay = { checkIn: null, checkOut: null, adults: 2, children: 0, room: 'any' };

export function validateBooking(request: BookingRequest, copy: Dictionary['booking']): BookingErrors {
  const errors: BookingErrors = {};
  if (!request.name.trim()) errors.name = copy.errors.name;
  if (request.phone.replace(/\D/g, '').length < 9) errors.phone = copy.errors.phone;
  // Event enquiries may not have overnight dates
  if (request.room !== 'event' && (!request.checkIn || !request.checkOut)) errors.dates = copy.errors.dates;
  if (request.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) errors.email = copy.errors.email;
  return errors;
}

function roomLabel(room: string, dict: BookingCopy): string {
  if (room === 'any') return dict.booking.roomAny;
  if (room === 'event') return dict.booking.roomEvent;
  return dict.rooms.items.find((r) => r.id === room)?.name ?? room;
}

/** The WhatsApp message the lodge receives, in the visitor's language. */
export function buildBookingMessage(request: BookingRequest, dict: BookingCopy): string {
  const m = dict.booking.message;
  const lines = [m.greeting, '', `${m.name}: ${request.name}`, `${m.phone}: ${request.phone}`];
  if (request.email) lines.push(`${m.email}: ${request.email}`);
  if (request.checkIn && request.checkOut) {
    lines.push(
      `${m.dates}: ${formatShort(request.checkIn, dict.intlLocale)} → ${formatShort(request.checkOut, dict.intlLocale)} (${request.checkIn} → ${request.checkOut})`,
      `${m.nights}: ${nightsBetween(request.checkIn, request.checkOut)}`
    );
  }
  lines.push(
    `${m.guests}: ${request.adults} + ${request.children}`,
    `${m.room}: ${roomLabel(request.room, dict)}`
  );
  if (request.requests.trim()) lines.push('', `${m.requests}: ${request.requests.trim()}`);
  return lines.join('\n');
}

/**
 * Where booking requests go. Today every request becomes a WhatsApp message
 * to the lodge. To add a booking engine or payments (Chapa, Stripe), add a
 * channel here and send the same BookingRequest to its API — the form does
 * not need to change.
 */
export type BookingChannel = 'whatsapp';

export const BOOKING_CHANNEL: BookingChannel = 'whatsapp';

export function submitBooking(request: BookingRequest, dict: BookingCopy): void {
  switch (BOOKING_CHANNEL) {
    case 'whatsapp':
      // Must run inside the click handler so browsers do not block the new tab
      window.open(whatsappLink(buildBookingMessage(request, dict)), '_blank', 'noopener');
      return;
  }
}

export const LODGE_PHONE = SITE.phoneHref;
