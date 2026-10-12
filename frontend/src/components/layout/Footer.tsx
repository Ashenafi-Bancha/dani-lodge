import { MapPin, Phone } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { NAV_LINKS, SITE, WHATSAPP_ENQUIRIES } from '@/lib/site';

const ENQUIRY_LINKS = [
  { label: 'Room availability', href: WHATSAPP_ENQUIRIES.rooms },
  { label: 'Meeting hall', href: WHATSAPP_ENQUIRIES.hall },
  { label: 'Café questions', href: WHATSAPP_ENQUIRIES.cafe },
];

export default function Footer() {
  return (
    // Extra bottom padding on small screens keeps content clear of the fixed action bar
    <footer className="bg-forest-deep pb-28 pt-16 text-cream/70 lg:pb-10">
      <div className="container-page border-t border-white/10 pt-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed">
              A garden lodge in Humbo Larena, Wolaita Sodo. Stay close to nature.
            </p>
            <p className="mt-3 font-ethiopic text-sm text-gold-light/70" lang="am">
              {SITE.taglineAmharic}
            </p>
          </div>

          <nav className="lg:col-span-2" aria-label="Footer">
            <h3 className="text-[11px] font-semibold uppercase tracking-label text-gold">Explore</h3>
            <ul className="mt-4 space-y-1">
              {[...NAV_LINKS, { label: 'Contact', href: '#contact' }].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-block py-1.5 text-[15px] transition-colors hover:text-gold-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-3" aria-label="Enquiries on WhatsApp">
            <h3 className="text-[11px] font-semibold uppercase tracking-label text-gold">
              Ask on WhatsApp
            </h3>
            <ul className="mt-4 space-y-1">
              {ENQUIRY_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-1.5 text-[15px] transition-colors hover:text-gold-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-label text-gold">Visit</h3>
            <address className="mt-4 space-y-3 text-[15px] not-italic">
              <p className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                <span>
                  {SITE.address[0]}
                  <br />
                  {SITE.address[1]}
                </span>
              </p>
              <p className="flex gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                <a href={SITE.phoneHref} className="transition-colors hover:text-gold-light">
                  {SITE.phone}
                </a>
              </p>
            </address>
          </div>
        </div>

        <p className="mt-12 border-t border-white/10 pt-6 text-xs text-cream/45">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
