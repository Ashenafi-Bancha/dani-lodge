'use client';

import { useCallback, useRef, useState } from 'react';
import { Minus, Plus, Users } from 'lucide-react';
import Popover from '@/components/ui/Popover';
import type { Dictionary } from '@/content/types';
import { fill } from '@/lib/dates';

interface GuestSelectorProps {
  guests: { adults: number; children: number };
  onChange: (guests: { adults: number; children: number }) => void;
  labels: Dictionary['guests'];
  doneLabel: string;
  tone?: 'dark' | 'light';
  side?: 'top' | 'bottom';
}

const LIMITS = { adults: [1, 20], children: [0, 10] } as const;

export default function GuestSelector({ guests, onChange, labels, doneLabel, tone = 'light', side = 'bottom' }: GuestSelectorProps) {
  const { adults, children } = guests;
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const total = adults + children;
  const dark = tone === 'dark';

  const row = (key: 'adults' | 'children', value: number, title: string, hint: string) => {
    const [min, max] = LIMITS[key];
    const set = (next: number) => onChange({ adults, children, [key]: Math.min(max, Math.max(min, next)) });
    return (
      <div className="flex items-center justify-between gap-6 py-3">
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-ink/70">{hint}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => set(value - 1)}
            disabled={value <= min}
            aria-label={`${labels.decrease}: ${title}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-canopy/20 text-forest transition-colors hover:border-forest disabled:opacity-30"
          >
            <Minus size={16} />
          </button>
          <span className="w-6 text-center text-lg tabular-nums" aria-live="polite">
            {value}
          </span>
          <button
            type="button"
            onClick={() => set(value + 1)}
            disabled={value >= max}
            aria-label={`${labels.increase}: ${title}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-canopy/20 text-forest transition-colors hover:border-forest disabled:opacity-30"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div ref={anchorRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`flex min-h-[3.4rem] w-full flex-col items-start justify-center rounded-2xl border px-4 py-2 text-left transition-colors ${
          dark ? 'border-white/20 bg-white/10 text-white hover:border-thatch-light/70' : 'border-canopy/15 bg-white text-ink hover:border-thatch'
        }`}
      >
        <span className={`text-[0.65rem] font-semibold tracking-[0.14em] uppercase ${dark ? 'text-white/65' : 'text-ink/70'}`}>
          {labels.label}
        </span>
        <span className="flex items-center gap-2 text-[0.95rem]">
          <Users size={15} aria-hidden="true" className={dark ? 'text-thatch-light' : 'text-thatch-deep'} />
          {total === 1 ? labels.summaryOne : fill(labels.summary, total)}
        </span>
      </button>

      <Popover open={open} onClose={close} anchorRef={anchorRef} side={side} label={labels.label} className="right-0 w-[min(24rem,calc(100vw-2.5rem))]">
        <div className="divide-y divide-canopy/10">
          {row('adults', adults, labels.adults, labels.adultsHint)}
          {row('children', children, labels.children, labels.childrenHint)}
        </div>
        <div className="mt-3 flex justify-end border-t border-canopy/10 pt-4">
          <button type="button" onClick={close} className="btn btn-forest !min-h-11">
            {doneLabel}
          </button>
        </div>
      </Popover>
    </div>
  );
}
