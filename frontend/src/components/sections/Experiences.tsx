import Picture from '@/components/ui/Picture';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { PHOTOS } from '@/lib/photos';

const EXPERIENCES = [
  {
    title: 'Slow mornings in the garden',
    text: 'Start the day on the lawn with cool air, dappled light and nowhere you need to be.',
  },
  {
    title: 'Coffee under the thatch',
    text: 'Take a table in the open pavilion and let the afternoon stretch out over a fresh cup.',
  },
  {
    title: 'Gatherings among the trees',
    text: 'Bring family, friends or colleagues together in a setting that already feels like a celebration.',
  },
  {
    title: 'Meetings with room to think',
    text: 'Step out of the hall and into the green between sessions. Good ideas like fresh air.',
  },
];

export default function Experiences() {
  return (
    <section id="experiences" className="section bg-cream-dark">
      <div className="container-page">
        <SectionHeading eyebrow="Experiences" title="Days that move at garden pace.">
          There is no rush here. These are a few of the simple pleasures waiting for you.
        </SectionHeading>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <RevealGroup className="lg:col-span-7">
            <RevealItem>
              <figure className="relative overflow-hidden rounded-[1.5rem] shadow-soft">
                <Picture
                  photo={PHOTOS.courtyard}
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-deep/85 to-transparent p-5 pt-16 text-sm text-cream/90">
                  The cobbled courtyard, shaded all day by the trees.
                </figcaption>
              </figure>
            </RevealItem>
          </RevealGroup>

          <RevealGroup className="lg:col-span-5">
            <ol>
              {EXPERIENCES.map(({ title, text }, i) => (
                <li key={title}>
                  <RevealItem className="flex gap-5 border-b border-forest/15 py-6 first:pt-0 lg:first:pt-2">
                    <span className="font-serif text-2xl text-gold-deep" aria-hidden="true">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="font-serif text-2xl font-semibold leading-tight text-forest-deep">
                        {title}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-ink/70">{text}</p>
                    </div>
                  </RevealItem>
                </li>
              ))}
            </ol>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
