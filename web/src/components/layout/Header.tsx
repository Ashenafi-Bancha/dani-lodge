'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, Phone, X } from 'lucide-react';
import { useBooking } from '@/components/providers/BookingProvider';
import { useScroller } from '@/components/providers/SmoothScroll';
import Logo from '@/components/ui/Logo';
import Magnetic from '@/components/ui/Magnetic';
import Visual from '@/components/ui/Visual';
import type { Locale } from '@/content';
import { SITE } from '@/content/site';
import type { Dictionary } from '@/content/types';

interface HeaderProps {
  locale: Locale;
  nav: Dictionary['nav'];
  common: Dictionary['common'];
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Transparent over the hero, then a soft canopy bar. Slides away while
 * reading down the page and returns as soon as the visitor scrolls up.
 */
export default function Header({ locale, nav, common }: HeaderProps) {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [preview, setPreview] = useState(0);
  const { openBooking } = useBooking();
  const { lock, scrollTo } = useScroller();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const otherLocale = locale === 'en' ? 'am' : 'en';

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      // Small movements should not make the bar flicker
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 160);
        last = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    lock(menuOpen);
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeMenu();
    window.addEventListener('keydown', onKey);
    const focus = window.setTimeout(() => firstLinkRef.current?.focus(), 350);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(focus);
      lock(false);
    };
  }, [menuOpen, closeMenu, lock]);

  const goTo = (id: string) => {
    closeMenu();
    // Wait for the menu to start closing so scrolling is unlocked
    window.setTimeout(() => scrollTo(`#${id}`), 50);
  };

  const visible = !hidden || menuOpen;

  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[110] -translate-y-20 rounded-full bg-thatch px-4 py-2 text-sm font-medium text-canopy focus:translate-y-0"
      >
        {common.skipToContent}
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,padding] duration-500 ease-[var(--ease-soft)] ${
          visible ? 'translate-y-0' : '-translate-y-full'
        } ${solid ? 'bg-canopy/90 py-3 backdrop-blur-md' : 'bg-transparent py-4 sm:py-6'}`}
      >
        <nav className="container-wide flex items-center justify-between gap-4" aria-label="Main">
          <a href="#top" aria-label="Dani Lodge" onClick={(e) => (e.preventDefault(), scrollTo('#top'))}>
            <Logo />
          </a>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={SITE.phoneHref}
              className="hidden items-center gap-2 text-sm text-white/80 transition-colors hover:text-thatch-light xl:flex"
            >
              <Phone size={15} aria-hidden="true" />
              {SITE.phone}
            </a>
            <Link
              href={`/${otherLocale}`}
              hrefLang={otherLocale}
              lang={otherLocale}
              aria-label={common.switchLanguage}
              className="flex min-h-11 items-center rounded-full px-3 text-sm text-white/85 transition-colors hover:text-thatch-light"
            >
              {common.otherLanguageName}
            </Link>
            <div className="hidden sm:block">
              <Magnetic>
                <button type="button" onClick={() => openBooking()} className="btn btn-gold !min-h-11" data-cursor={common.cursorExplore}>
                  {common.bookNow}
                </button>
              </Magnetic>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              className="flex min-h-11 items-center gap-2 rounded-full px-3 text-white"
            >
              <span className="hidden text-sm sm:inline">{nav.menu}</span>
              <Menu size={24} aria-hidden="true" />
              <span className="sr-only sm:hidden">{nav.menu}</span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label={nav.menu}
            data-lenis-prevent
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-canopy text-cream"
          >
            <div className="container-wide flex items-center justify-between py-4 sm:py-6">
              <Logo />
              <button
                type="button"
                onClick={closeMenu}
                className="flex min-h-11 items-center gap-2 rounded-full px-3 text-white"
              >
                <span className="text-sm">{common.close}</span>
                <X size={24} aria-hidden="true" />
              </button>
            </div>

            <div className="container-wide grid flex-1 items-center gap-10 pb-10 lg:grid-cols-[1.1fr_1fr]">
              <ul className="flex flex-col">
                {nav.links.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.05, duration: 0.8, ease: EASE }}
                  >
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={`#${link.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        goTo(link.id);
                      }}
                      onPointerEnter={() => setPreview(i)}
                      onFocus={() => setPreview(i)}
                      className="group flex items-baseline gap-4 border-b border-white/10 py-3 sm:py-4"
                    >
                      <span className="w-6 text-xs text-thatch/80 tabular-nums">0{i + 1}</span>
                      <span className="font-display text-4xl transition-colors duration-300 group-hover:text-thatch-light sm:text-5xl lg:text-6xl">
                        {link.label}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="relative hidden aspect-[4/5] overflow-hidden rounded-[2rem] lg:block">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={preview}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <Visual visual={nav.links[preview].visual} locale={locale} photoSoon={common.photoSoon} sizes="40vw" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="container-wide flex flex-wrap items-center gap-3 border-t border-white/10 py-6">
              <button type="button" onClick={() => (closeMenu(), window.setTimeout(() => openBooking(), 50))} className="btn btn-gold">
                {common.bookNow}
              </button>
              <a href={SITE.phoneHref} className="btn btn-ghost-light">
                <Phone size={16} aria-hidden="true" /> {SITE.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
