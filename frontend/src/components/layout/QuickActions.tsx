import { useEffect, useState } from 'react';
import { MessageCircle, Navigation, Phone } from 'lucide-react';
import { SITE, WHATSAPP_GENERAL } from '@/lib/site';

/**
 * The three things a visitor on a phone most wants to do: call, message, or
 * get directions. A bottom bar on small screens, a floating button on desktop.
 * Hidden until the hero has scrolled away so it never covers the headline.
 */
export default function QuickActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const hiddenState = visible ? '' : 'pointer-events-none translate-y-full opacity-0';

  return (
    <>
      <nav
        aria-label="Quick contact"
        className={`pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-forest-deep/95 px-3 pt-3 backdrop-blur-md transition-all duration-500 ease-smooth-out lg:hidden ${hiddenState}`}
      >
        <ul className="mx-auto grid max-w-md grid-cols-3 gap-2 text-xs font-medium">
          <li>
            <a
              href={SITE.phoneHref}
              className="flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl text-cream"
            >
              <Phone size={18} aria-hidden="true" /> Call
            </a>
          </li>
          <li>
            <a
              href={WHATSAPP_GENERAL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl bg-gold text-forest-deep"
            >
              <MessageCircle size={18} aria-hidden="true" /> WhatsApp
            </a>
          </li>
          <li>
            <a
              href={SITE.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl text-cream"
            >
              <Navigation size={18} aria-hidden="true" /> Directions
            </a>
          </li>
        </ul>
      </nav>

      <a
        href={WHATSAPP_GENERAL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Dani Lodge on WhatsApp"
        className={`fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-gold text-forest-deep shadow-soft transition-all duration-500 ease-smooth-out hover:bg-gold-light lg:flex ${hiddenState}`}
      >
        <MessageCircle size={24} aria-hidden="true" />
      </a>
    </>
  );
}
