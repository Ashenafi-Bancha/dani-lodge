import { ArrowUpRight } from 'lucide-react';
import SampleBadge from '@/components/ui/SampleBadge';
import SectionHeading from '@/components/ui/SectionHeading';
import Weave from '@/components/ui/Weave';
import type { Dictionary } from '@/content';
import { whatsappLink } from '@/content/site';

export default function Offers({ dict }: { dict: Dictionary }) {
  const { offers, common } = dict;

  return (
    <section id="offers" className="relative overflow-hidden bg-cream py-24 sm:py-32">
      <div className="container-wide">
        <SectionHeading eyebrow={offers.eyebrow} title={offers.title} />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {offers.items.map((offer, i) => (
            <li
              key={offer.title}
              data-reveal
              className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-canopy/10 bg-paper p-7 transition-[border-color,transform] duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:border-thatch/60"
            >
              <Weave className="absolute -top-10 -right-10 w-32 text-thatch/15 transition-transform duration-[1200ms] ease-[var(--ease-expo)] group-hover:rotate-45" strokeWidth={1} />
              <span className="font-display text-5xl text-thatch-deep/50 italic">0{i + 1}</span>
              <p className="mt-6 text-[0.7rem] font-semibold tracking-[0.18em] text-thatch-deep uppercase">{offer.detail}</p>
              <h3 className="display mt-2 text-3xl text-canopy">{offer.title}</h3>
              <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink/65">{offer.text}</p>
              {offer.sample && <SampleBadge label={common.sample} note={common.sampleNote} className="mt-5 self-start" />}
              <a
                href={whatsappLink(`${common.hello} — ${offers.ask}: ${offer.title}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-forest underline-offset-4 hover:underline"
              >
                {offers.ask} <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
