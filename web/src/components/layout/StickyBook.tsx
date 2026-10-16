'use client';

import { useEffect, useState } from 'react';
import { CalendarCheck, MessageCircle, Phone } from 'lucide-react';
import { useBooking } from '@/components/providers/BookingProvider';
import Magnetic from '@/components/ui/Magnetic';
import { SITE, whatsappLink } from '@/content/site';
import type { Dictionary } from '@/content/types';

interface StickyBookProps {
  common: Dictionary['common'];
  whatsappGreeting: string;
}

/**
 * Appears once the hero has scrolled away and steps aside while the booking
 * form itself is on screen. Phones get a bottom bar (Book · WhatsApp · Call);
 * larger screens get a floating "Book now" with a WhatsApp button.
 */
export default function StickyBook({ common, whatsappGreeting }: StickyBookProps) {
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const { openBooking } = useBooking();

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const form = document.getElementById('book');
    const observer = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), { threshold: 0.15 });
    if (form) observer.observe(form);

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  const show = pastHero && !formVisible;
  const hiddenClass = show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-[120%] opacity-0';
  const whatsapp = whatsappLink(whatsappGreeting);

  return (
    <>
      <nav
        aria-label={common.bookNow}
        className={`pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-canopy/95 px-3 pt-3 backdrop-blur-md transition-all duration-500 ease-[var(--ease-soft)] lg:hidden ${hiddenClass}`}
      >
        <ul className="mx-auto grid max-w-md grid-cols-[1.4fr_1fr_1fr] gap-2 text-xs font-medium">
          <li>
            <button
              type="button"
              onClick={() => openBooking()}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-thatch text-sm text-canopy"
            >
              <CalendarCheck size={17} aria-hidden="true" /> {common.bookNow}
            </button>
          </li>
          <li>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-cream">
              <MessageCircle size={17} aria-hidden="true" /> {common.whatsapp}
            </a>
          </li>
          <li>
            <a href={SITE.phoneHref} className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-cream">
              <Phone size={17} aria-hidden="true" /> {common.call}
            </a>
          </li>
        </ul>
      </nav>

      <div className={`fixed right-6 bottom-6 z-40 hidden items-center gap-3 transition-all duration-500 ease-[var(--ease-soft)] lg:flex ${hiddenClass}`}>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={common.whatsapp}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-cream shadow-[var(--shadow-soft)] transition-colors hover:bg-forest-soft"
        >
          <MessageCircle size={22} aria-hidden="true" />
        </a>
        <Magnetic>
          <button
            type="button"
            onClick={() => openBooking()}
            className="btn btn-gold !min-h-14 !px-7 shadow-[var(--shadow-soft)]"
            data-cursor={common.cursorExplore}
          >
            <CalendarCheck size={18} aria-hidden="true" /> {common.bookNow}
          </button>
        </Magnetic>
      </div>
    </>
  );
}
