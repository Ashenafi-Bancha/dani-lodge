import { Leaf, Sun, TreePine } from 'lucide-react';
import Picture from '@/components/ui/Picture';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { PHOTOS } from '@/lib/photos';
import { SITE } from '@/lib/site';

const PILLARS = [
  {
    icon: TreePine,
    title: 'Shaded gardens',
    text: 'Mature trees, trimmed hedges and soft lawns to walk, sit and breathe in.',
  },
  {
    icon: Sun,
    title: 'Open-air living',
    text: 'A thatched pavilion and cobbled courtyards made for long, easy afternoons.',
  },
  {
    icon: Leaf,
    title: 'Everything in one place',
    text: 'Rooms, a café, a meeting hall and parking, all inside the same green compound.',
  },
];

export default function About() {
  return (
    <section id="about" className="section bg-cream">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <RevealGroup className="relative">
          <RevealItem>
            <Picture
              photo={PHOTOS.garden}
              sizes="(min-width: 1024px) 540px, 100vw"
              className="aspect-[4/5] w-full rounded-[1.5rem] object-cover shadow-soft"
            />
          </RevealItem>
          <RevealItem className="absolute -bottom-6 right-4 max-w-[13rem] rounded-2xl bg-forest p-5 text-cream shadow-soft sm:right-8">
            <p className="font-ethiopic text-sm text-gold-light">{SITE.taglineAmharic}</p>
            <p className="mt-2 font-serif text-xl leading-snug">
              A green corner of Wolaita, kept calm on purpose.
            </p>
          </RevealItem>
        </RevealGroup>

        <div className="pt-6 lg:pt-0">
          <SectionHeading eyebrow="Welcome to Dani Lodge" title="A garden lodge in the heart of Wolaita.">
            Dani Lodge sits among the trees of Humbo Larena, just outside the bustle of Wolaita
            Sodo. Come for a night, a meeting, or simply a good coffee in the shade — and stay a
            little longer than you planned.
          </SectionHeading>

          <RevealGroup className="mt-10 space-y-6">
            {PILLARS.map(({ icon: Icon, title, text }) => (
              <RevealItem key={title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                  <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-forest-deep">{title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink/70">{text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
