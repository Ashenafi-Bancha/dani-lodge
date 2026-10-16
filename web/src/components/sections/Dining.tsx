import { ArrowUpRight } from 'lucide-react';
import SampleBadge from '@/components/ui/SampleBadge';
import SectionHeading from '@/components/ui/SectionHeading';
import Visual from '@/components/ui/Visual';
import type { Dictionary, Locale } from '@/content';
import { whatsappLink } from '@/content/site';

/** Golden hour: the café, coffee ceremony and food. */
export default function Dining({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { dining, common } = dict;

  return (
    <section id="dining" className="relative overflow-hidden bg-[#f1e2c4] py-24 sm:py-32 lg:py-40">
      <div className="container-wide grid gap-16 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="relative lg:col-span-6">
          <div data-reveal-mask className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[var(--shadow-lift)]">
            <div data-parallax="0.15" className="absolute inset-x-0 -top-[10%] h-[120%]">
              <Visual visual={{ photo: 'pavilion' }} locale={locale} photoSoon={common.photoSoon} sizes="(min-width: 1024px) 45vw, 90vw" />
            </div>
          </div>
          <div className="pointer-events-none absolute -right-6 -bottom-8 hidden h-40 w-40 rounded-full bg-[radial-gradient(circle,#ffd98a_0%,transparent_70%)] opacity-70 blur-2xl lg:block" />
        </div>

        <div className="lg:col-span-6 lg:pl-8">
          <SectionHeading eyebrow={dining.eyebrow} title={dining.title} lead={dining.text} />

          <ul className="mt-10 grid gap-px overflow-hidden rounded-[1.5rem] bg-canopy/10 sm:grid-cols-2">
            {dining.items.map((item) => (
              <li key={item.title} data-reveal className="bg-[#f6ead2] p-6">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="display text-2xl text-canopy">{item.title}</h3>
                  {item.sample && <SampleBadge label={common.sample} note={common.sampleNote} className="mt-1 shrink-0" />}
                </div>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/65">{item.text}</p>
              </li>
            ))}
          </ul>

          <a
            data-reveal
            href={whatsappLink(`${common.hello} — ${dining.cta}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-forest mt-10"
          >
            {dining.cta} <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
