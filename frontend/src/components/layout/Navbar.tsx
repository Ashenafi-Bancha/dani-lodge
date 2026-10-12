import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, MessageCircle, Phone, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { NAV_LINKS, SITE, WHATSAPP_GENERAL } from '@/lib/site';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-smooth-out ${
          scrolled ? 'bg-forest-deep/95 py-3 shadow-soft backdrop-blur-md' : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <nav className="container-page flex items-center justify-between" aria-label="Main">
          <a href="#home" aria-label="Dani Lodge — back to top">
            <Logo />
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm tracking-wide text-white/80 transition-colors hover:text-gold-light"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href={SITE.phoneHref}
              className="flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-gold-light"
            >
              <Phone size={15} aria-hidden="true" />
              {SITE.phone}
            </a>
            <a href="#contact" className="btn-gold !min-h-[42px] !px-5">
              Enquire
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="-mr-2 flex h-11 w-11 items-center justify-center text-white lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu size={26} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-forest-deep lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="container-page flex items-center justify-between py-4">
              <Logo />
              <button
                onClick={closeMenu}
                className="-mr-2 flex h-11 w-11 items-center justify-center text-white"
                aria-label="Close menu"
              >
                <X size={26} />
              </button>
            </div>

            <ul className="container-page mt-6 flex flex-col">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
                >
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className="block border-b border-white/10 py-4 font-serif text-3xl text-cream"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="container-page mt-auto flex flex-col gap-3 pb-8 pt-10">
              <a href="#contact" onClick={closeMenu} className="btn-gold w-full">
                Send an enquiry
              </a>
              <div className="grid grid-cols-2 gap-3">
                <a href={SITE.phoneHref} className="btn-outline-light">
                  <Phone size={16} aria-hidden="true" /> Call
                </a>
                <a
                  href={WHATSAPP_GENERAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-light"
                >
                  <MessageCircle size={16} aria-hidden="true" /> WhatsApp
                </a>
              </div>
              <p className="mt-3 text-center font-ethiopic text-sm text-cream/50">
                {SITE.taglineAmharic}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
