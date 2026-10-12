import { Crown } from 'lucide-react';

interface LogoProps {
  tone?: 'light' | 'dark';
}

export default function Logo({ tone = 'light' }: LogoProps) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 text-gold">
        <Crown size={16} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-serif text-[1.35rem] font-semibold tracking-wide ${
            tone === 'light' ? 'text-white' : 'text-forest-deep'
          }`}
        >
          Dani Lodge
        </span>
        <span className="mt-1 text-[9px] font-medium uppercase tracking-label text-gold">
          Wolaita Sodo
        </span>
      </span>
    </span>
  );
}
