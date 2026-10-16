import { Star } from 'lucide-react';
import SampleBadge from '@/components/ui/SampleBadge';
import SectionHeading from '@/components/ui/SectionHeading';
import type { Dictionary } from '@/content';
import { SHOW_SAMPLE_REVIEWS } from '@/content/site';

/**
 * Guest reviews. The current reviews are samples, so the section only
 * renders in development (or when explicitly switched on) and never feeds
 * the search-engine data. Replace them with real Google reviews to launch it.
 */
export default function Reviews({ dict }: { dict: Dictionary }) {
  if (!SHOW_SAMPLE_REVIEWS) return null;
  const { reviews, common } = dict;

  return (
    <section id="reviews" className="relative bg-paper py-24 sm:py-32">
      <div className="container-wide">
        <SectionHeading eyebrow={reviews.eyebrow} title={reviews.title} />
        <p data-reveal className="mt-6 flex flex-wrap items-center gap-3 text-sm text-clay">
          <SampleBadge label={common.sample} note={common.sampleNote} />
          {reviews.sampleNote}
        </p>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {reviews.items.map((r, i) => (
            <li key={i} data-reveal className="flex flex-col rounded-[1.75rem] border border-dashed border-clay/35 bg-cream p-7">
              <div className="flex gap-1 text-thatch" aria-label={`${r.rating} / 5`}>
                {Array.from({ length: 5 }, (_, s) => (
                  <Star key={s} size={16} aria-hidden="true" fill={s < r.rating ? 'currentColor' : 'none'} />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 font-display text-2xl leading-snug text-canopy">“{r.text}”</blockquote>
              <p className="mt-6 text-sm text-ink/70">
                {r.name} · {r.origin}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
