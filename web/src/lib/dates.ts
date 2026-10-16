/** Dates are handled as local calendar days in YYYY-MM-DD form, never as times. */

const pad = (n: number) => String(n).padStart(2, '0');

export function toIso(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayIso(): string {
  return toIso(new Date());
}

export function addDays(iso: string, days: number): string {
  const date = fromIso(iso);
  date.setDate(date.getDate() + days);
  return toIso(date);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const ms = fromIso(checkOut).getTime() - fromIso(checkIn).getTime();
  return Math.round(ms / 86_400_000);
}

/** e.g. "14 Nov" — always the Gregorian calendar, in the visitor's language. */
export function formatShort(iso: string, intlLocale: string): string {
  return new Intl.DateTimeFormat(intlLocale, { day: 'numeric', month: 'short', calendar: 'gregory' }).format(
    fromIso(iso)
  );
}

export function formatLong(iso: string, intlLocale: string): string {
  return new Intl.DateTimeFormat(intlLocale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    calendar: 'gregory',
  }).format(fromIso(iso));
}

/** Replaces {n} in a dictionary string. */
export function fill(template: string, n: number | string): string {
  return template.replace('{n}', String(n));
}
