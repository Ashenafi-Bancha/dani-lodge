'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import Popover from '@/components/ui/Popover';
import type { Dictionary } from '@/content/types';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { addDays, fill, formatLong, formatShort, fromIso, nightsBetween, toIso, todayIso } from '@/lib/dates';

interface DateRangePickerProps {
  checkIn: string | null;
  checkOut: string | null;
  onChange: (range: { checkIn: string | null; checkOut: string | null }) => void;
  labels: Dictionary['dates'];
  intlLocale: string;
  /** Unique per picker on the page. */
  id: string;
  tone?: 'dark' | 'light';
  side?: 'top' | 'bottom';
  invalid?: boolean;
}

const noopSubscribe = () => () => {};

function monthStart(iso: string): string {
  const d = fromIso(iso);
  return toIso(new Date(d.getFullYear(), d.getMonth(), 1));
}

function shiftMonth(iso: string, by: number): string {
  const d = fromIso(iso);
  return toIso(new Date(d.getFullYear(), d.getMonth() + by, 1));
}

/** Days of one month laid out Monday-first, with nulls for the leading blanks. */
function monthGrid(firstOfMonth: string): (string | null)[] {
  const first = fromIso(firstOfMonth);
  const lead = (first.getDay() + 6) % 7;
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= days; d++) cells.push(toIso(new Date(first.getFullYear(), first.getMonth(), d)));
  return cells;
}

/**
 * Check-in / check-out picker. Two months side by side on larger screens,
 * one month in a bottom sheet on phones. Arrow keys move between days,
 * Enter picks, Escape closes.
 */
export default function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
  labels,
  intlLocale,
  id,
  tone = 'light',
  invalid = false,
  side = 'bottom',
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  // Set properly in openAt(); reading the clock here would break static prerendering
  const [view, setView] = useState('');
  const [focusDay, setFocusDay] = useState('');
  const [hoverDay, setHoverDay] = useState<string | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  // Empty during server rendering, the real date in the browser
  const today = useSyncExternalStore(noopSubscribe, todayIso, () => '');

  const close = useCallback(() => setOpen(false), []);

  const openAt = (day: string | null) => {
    const start = day ?? checkIn ?? today;
    setView(monthStart(start));
    setFocusDay(start);
    setOpen(true);
  };

  // Keep keyboard focus on the active day while the panel is open
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => document.getElementById(`${id}-${focusDay}`)?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [open, focusDay, id, view]);

  const pick = (day: string) => {
    if (!checkIn || checkOut || day <= checkIn) {
      onChange({ checkIn: day, checkOut: null });
      return;
    }
    onChange({ checkIn, checkOut: day });
    // Close softly once a full range is chosen on larger screens
    if (isDesktop) window.setTimeout(close, 280);
  };

  const onGridKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    const delta = moves[e.key];
    if (delta === undefined) return;
    e.preventDefault();
    const next = addDays(focusDay, delta);
    if (next < today) return;
    setFocusDay(next);
    const months = isDesktop ? 2 : 1;
    if (next < view) setView(monthStart(next));
    else if (next >= shiftMonth(view, months)) setView(shiftMonth(monthStart(next), -(months - 1)));
  };

  const weekdays = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(intlLocale, { weekday: 'narrow', calendar: 'gregory' });
    // 2024-01-01 was a Monday
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 1 + i)));
  }, [intlLocale]);

  const monthTitle = (iso: string) =>
    new Intl.DateTimeFormat(intlLocale, { month: 'long', year: 'numeric', calendar: 'gregory' }).format(fromIso(iso));

  const rangeEnd = checkOut ?? (checkIn && hoverDay && hoverDay > checkIn ? hoverDay : null);
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const status = !checkIn
    ? labels.pickCheckIn
    : !checkOut
      ? labels.pickCheckOut
      : nights === 1
        ? labels.oneNight
        : fill(labels.nights, nights);

  const dark = tone === 'dark';
  const fieldClass = dark
    ? 'border-white/20 bg-white/10 text-white hover:border-thatch-light/70'
    : `bg-white text-ink hover:border-thatch ${invalid ? 'border-red-600/60' : 'border-canopy/15'}`;
  const labelClass = dark ? 'text-white/65' : 'text-ink/70';

  const field = (which: 'checkIn' | 'checkOut') => {
    const value = which === 'checkIn' ? checkIn : checkOut;
    return (
      <button
        type="button"
        onClick={() => (open ? close() : openAt(which === 'checkOut' ? (checkOut ?? checkIn) : checkIn))}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`flex min-h-[3.4rem] w-full flex-col items-start justify-center rounded-2xl border px-4 py-2 text-left transition-colors ${fieldClass}`}
      >
        <span className={`text-[0.65rem] font-semibold tracking-[0.14em] uppercase ${labelClass}`}>
          {labels[which]}
        </span>
        <span className="flex items-center gap-2 text-[0.95rem]">
          <CalendarDays size={15} aria-hidden="true" className={dark ? 'text-thatch-light' : 'text-thatch-deep'} />
          {value ? formatShort(value, intlLocale) : <span className="opacity-60">{labels.addDate}</span>}
        </span>
      </button>
    );
  };

  const months = !view ? [] : isDesktop ? [view, shiftMonth(view, 1)] : [view];

  return (
    <div ref={anchorRef} className="relative">
      <div className="grid grid-cols-2 gap-2">
        {field('checkIn')}
        {field('checkOut')}
      </div>

      <Popover open={open} onClose={close} anchorRef={anchorRef} side={side} label={labels.pickCheckIn} className="left-0 w-[min(44rem,calc(100vw-2.5rem))]">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setView((v) => shiftMonth(v, -1))}
            disabled={view <= monthStart(today)}
            aria-label={labels.prevMonth}
            className="flex h-10 w-10 items-center justify-center rounded-full text-forest transition-colors hover:bg-forest/10 disabled:opacity-25"
          >
            <ChevronLeft size={18} />
          </button>
          <p className="text-sm text-ink/70" aria-live="polite">
            {status}
          </p>
          <button
            type="button"
            onClick={() => setView((v) => shiftMonth(v, 1))}
            aria-label={labels.nextMonth}
            className="flex h-10 w-10 items-center justify-center rounded-full text-forest transition-colors hover:bg-forest/10"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="mt-2 grid gap-6 md:grid-cols-2" onKeyDown={onGridKey}>
          {months.map((month) => (
            <div key={month}>
              <p className="mb-3 text-center font-display text-xl text-forest">{monthTitle(month)}</p>
              <div className="grid grid-cols-7 text-center text-[0.7rem] font-semibold text-ink/45" aria-hidden="true">
                {weekdays.map((w, i) => (
                  <span key={i} className="py-1">
                    {w}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7" role="grid">
                {monthGrid(month).map((day, i) => {
                  if (!day) return <span key={`blank-${i}`} />;
                  const disabled = day < today;
                  const isStart = day === checkIn;
                  const isEnd = day === checkOut;
                  const inRange = Boolean(checkIn && rangeEnd && day > checkIn && day < rangeEnd);
                  const selected = isStart || isEnd;
                  return (
                    <button
                      key={day}
                      id={`${id}-${day}`}
                      type="button"
                      disabled={disabled}
                      tabIndex={day === focusDay ? 0 : -1}
                      aria-label={formatLong(day, intlLocale)}
                      aria-pressed={selected}
                      onClick={() => {
                        setFocusDay(day);
                        pick(day);
                      }}
                      onPointerEnter={() => setHoverDay(day)}
                      className={`relative my-0.5 flex h-10 items-center justify-center text-sm transition-colors duration-200 ${
                        inRange ? 'bg-thatch/20' : ''
                      } ${isStart && rangeEnd ? 'rounded-l-full bg-thatch/20' : ''} ${isEnd ? 'rounded-r-full bg-thatch/20' : ''} ${
                        disabled ? 'cursor-not-allowed text-ink/25' : 'text-ink'
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 ${
                          selected ? 'bg-forest font-semibold text-cream' : disabled ? '' : 'hover:bg-forest/10'
                        } ${day === today && !selected ? 'ring-1 ring-thatch' : ''}`}
                      >
                        {fromIso(day).getDate()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-canopy/10 pt-4">
          <button
            type="button"
            onClick={() => onChange({ checkIn: null, checkOut: null })}
            className="min-h-11 px-2 text-sm text-ink/70 underline underline-offset-4 hover:text-ink"
          >
            {labels.clear}
          </button>
          <button type="button" onClick={close} className="btn btn-forest !min-h-11">
            {labels.done}
          </button>
        </div>
      </Popover>
    </div>
  );
}
