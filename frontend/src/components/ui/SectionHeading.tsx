import type { ReactNode } from 'react';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  children,
  tone = 'light',
  className = '',
}: SectionHeadingProps) {
  const onDark = tone === 'dark';
  return (
    <RevealGroup className={`max-w-2xl ${className}`}>
      <RevealItem>
        <p className={`eyebrow ${onDark ? '!text-gold' : ''}`}>{eyebrow}</p>
      </RevealItem>
      <RevealItem>
        <h2
          className={`display mt-4 text-4xl sm:text-5xl ${onDark ? 'text-cream' : 'text-forest-deep'}`}
        >
          {title}
        </h2>
      </RevealItem>
      {children && (
        <RevealItem>
          <p
            className={`mt-5 text-base leading-relaxed sm:text-lg ${
              onDark ? 'text-cream/70' : 'text-ink/70'
            }`}
          >
            {children}
          </p>
        </RevealItem>
      )}
    </RevealGroup>
  );
}
