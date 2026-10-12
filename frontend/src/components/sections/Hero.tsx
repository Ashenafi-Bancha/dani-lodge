import { motion } from 'motion/react';
import { ArrowDown, MapPin } from 'lucide-react';
import BookingBar from '@/components/sections/BookingBar';
import Picture from '@/components/ui/Picture';
import { fadeUp, stagger } from '@/lib/animations';
import type { StayRequest } from '@/lib/inquiry';
import { PHOTOS } from '@/lib/photos';
import { SITE } from '@/lib/site';

const HIGHLIGHTS = ['Lodge stay', 'Meeting hall', 'Café', 'Parking'];

interface HeroProps {
  onCheckAvailability: (request: StayRequest) => void;
}

export default function Hero({ onCheckAvailability }: HeroProps) {
  return (
    <section id="home" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-forest-deep">
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Picture
          photo={PHOTOS.pavilion}
          sizes="100vw"
          priority
          className="h-full w-full object-cover object-[35%_center]"
        />
      </motion.div>

      {/* Darkens the top for the navbar and the bottom for the copy */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(18,35,26,0.6)_0%,rgba(18,35,26,0.3)_15%,rgba(18,35,26,0.78)_36%,rgba(18,35,26,0.97)_100%)] lg:bg-[linear-gradient(to_bottom,rgba(18,35,26,0.6)_0%,rgba(18,35,26,0.1)_25%,rgba(18,35,26,0.6)_55%,rgba(18,35,26,0.96)_100%)]" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="container-page relative z-10 pb-8 pt-28 sm:pb-12 sm:pt-32 lg:pb-12"
      >
        <motion.p
          variants={fadeUp}
          className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-label text-gold-light"
        >
          <MapPin size={14} aria-hidden="true" />
          {SITE.tagline}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="display mt-5 text-[3.25rem] text-white sm:text-7xl lg:text-[5.5rem]"
        >
          Stay <br className="sm:hidden" />
          <em className="font-normal text-gold-light">close to nature.</em>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg"
        >
          Leave the city behind for fresh air, quiet gardens, and an unhurried stay in the green
          surroundings of Humbo Larena.
        </motion.p>

        {/* On phones the availability bar below takes the place of the second button */}
        <motion.div variants={fadeUp} className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a href="#services" className="btn-gold">
            Explore the lodge
          </a>
          <a href="#contact" className="btn-outline-light hidden sm:inline-flex">
            Plan your visit
          </a>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-8 max-w-4xl">
          <BookingBar onSubmit={onCheckAvailability} />
        </motion.div>

        {/* Phones already have a full screen by this point */}
        <motion.div
          variants={fadeUp}
          className="mt-8 hidden items-end justify-between gap-6 border-t border-white/15 pt-6 lg:flex"
        >
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/75">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gold" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <a
            href="#about"
            className="hidden shrink-0 items-center gap-2 text-xs uppercase tracking-label text-white/60 transition-colors hover:text-gold-light sm:flex"
          >
            Scroll <ArrowDown size={14} aria-hidden="true" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
