import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}

/** Eyebrow, large serif title and optional lead, revealed on scroll. */
export default function SectionHeading({ eyebrow, title, lead, tone = 'light', className = '' }: SectionHeadingProps) {
  const dark = tone === 'dark';
  return (
    <div className={`max-w-3xl ${className}`}>
      <p data-reveal className={`eyebrow ${dark ? '!text-thatch' : ''}`}>
        {eyebrow}
      </p>
      <h2
        data-reveal
        className={`display mt-5 text-[clamp(2.5rem,6.2vw,5rem)] ${dark ? 'text-cream' : 'text-canopy'}`}
      >
        {title}
      </h2>
      {lead && (
        <p data-reveal className={`mt-6 max-w-2xl text-base leading-relaxed sm:text-lg ${dark ? 'text-cream/70' : 'text-ink/70'}`}>
          {lead}
        </p>
      )}
    </div>
  );
}
