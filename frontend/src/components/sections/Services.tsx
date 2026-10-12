import { ArrowUpRight, BedDouble, Car, Coffee, Users, type LucideIcon } from 'lucide-react';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { WHATSAPP_ENQUIRIES, whatsappLink } from '@/lib/site';

interface Service {
  icon: LucideIcon;
  title: string;
  amharic: string;
  text: string;
  cta: string;
  href: string;
}

const SERVICES: Service[] = [
  {
    icon: BedDouble,
    title: 'Lodge Stay',
    amharic: 'መኝታ ክፍሎች',
    text: 'Clean, comfortable rooms in a quiet garden setting. Wake up to birdsong instead of traffic.',
    cta: 'Ask about rooms',
    href: WHATSAPP_ENQUIRIES.rooms,
  },
  {
    icon: Users,
    title: 'Meeting Hall',
    amharic: 'የስብሰባ አዳራሽ',
    text: 'A dedicated hall for meetings, trainings and workshops, with the calm of the grounds just outside.',
    cta: 'Book the hall',
    href: WHATSAPP_ENQUIRIES.hall,
  },
  {
    icon: Coffee,
    title: 'Café',
    amharic: 'ካፌ',
    text: 'Coffee and refreshments served indoors or out in the open air — a calm spot to pause, meet or unwind.',
    cta: 'Ask about the café',
    href: WHATSAPP_ENQUIRIES.cafe,
  },
  {
    icon: Car,
    title: 'Parking',
    amharic: 'ፓርኪንግ',
    text: 'Spacious on-site parking inside the compound, so you can arrive and settle in without a worry.',
    cta: 'Get directions',
    href: whatsappLink('Hello Dani Lodge, could you share directions and parking information?'),
  },
];

export default function Services() {
  return (
    <section id="services" className="section bg-forest-deep">
      <div className="container-page">
        <SectionHeading tone="dark" eyebrow="Our services" title="Everything you need, in one green compound.">
          Whether you are staying the night, hosting a meeting or stopping by for coffee, it is all
          here. Rates and availability are shared on request.
        </SectionHeading>

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {SERVICES.map(({ icon: Icon, title, amharic, text, cta, href }) => (
            <RevealItem key={title} className="h-full">
              <article className="group flex h-full flex-col rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-6 transition-colors duration-300 hover:border-gold/50 hover:bg-white/[0.07]">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <p className="mt-6 font-ethiopic text-sm text-gold-light/80" lang="am">
                  {amharic}
                </p>
                <h3 className="mt-1 font-serif text-2xl font-semibold text-cream">{title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-cream/65">{text}</p>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-gold transition-colors hover:text-gold-light"
                >
                  {cta}
                  <ArrowUpRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
