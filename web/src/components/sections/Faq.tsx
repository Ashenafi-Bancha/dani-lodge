import { Plus } from 'lucide-react';
import SampleBadge from '@/components/ui/SampleBadge';
import SectionHeading from '@/components/ui/SectionHeading';
import type { Dictionary } from '@/content';

/** Native <details> elements: keyboard and screen-reader friendly with no JavaScript. */
export default function Faq({ dict }: { dict: Dictionary }) {
  const { faq, common } = dict;

  return (
    <section id="faq" className="relative bg-dusk py-24 text-cream sm:py-32">
      <div className="container-wide grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading tone="dark" eyebrow={faq.eyebrow} title={faq.title} />
        </div>

        <div className="lg:col-span-8">
          {faq.items.map((item) => (
            <details key={item.q} data-reveal className="faq group border-b border-white/10">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-display text-2xl text-cream transition-colors hover:text-thatch-light sm:text-3xl [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus size={22} aria-hidden="true" className="shrink-0 text-thatch transition-transform duration-500 ease-[var(--ease-soft)] group-open:rotate-45" />
              </summary>
              <div className="pb-6">
                <p className="max-w-2xl leading-relaxed text-cream/70">{item.a}</p>
                {item.sample && <SampleBadge label={common.sample} note={common.sampleNote} tone="dark" className="mt-4" />}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
