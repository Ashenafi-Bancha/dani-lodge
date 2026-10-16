import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Weave from '@/components/ui/Weave';
import { SITE, whatsappLink } from '@/content/site';
import type { Dictionary } from '@/content/types';

export default function Footer({ dict }: { dict: Dictionary }) {
  const { footer, nav, location, common } = dict;
  const socials = Object.entries(SITE.social).filter(([, url]) => url);

  return (
    // Extra bottom space on phones keeps content clear of the sticky booking bar
    <footer className="relative overflow-hidden bg-night pt-20 pb-32 text-cream/70 lg:pb-12">
      <Weave className="pointer-events-none absolute -right-24 -bottom-24 w-[28rem] text-white/[0.04]" strokeWidth={0.6} />
      <div className="container-wide relative">
        <div className="grid gap-12 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed">{footer.tagline}</p>
            <p className="mt-3 font-display text-xl text-thatch-light/80">{footer.madeWith}</p>
          </div>

          <nav className="lg:col-span-3" aria-label={footer.explore}>
            <h2 className="eyebrow !text-thatch">{footer.explore}</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1 lg:grid-cols-1">
              {nav.links.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className="inline-block py-1.5 text-[0.95rem] transition-colors hover:text-thatch-light">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="eyebrow !text-thatch">{footer.contact}</h2>
            <address className="mt-5 space-y-3 text-[0.95rem] not-italic">
              <p className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-thatch" aria-hidden="true" />
                <span>
                  {location.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </p>
              <p className="flex gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-thatch" aria-hidden="true" />
                <a href={SITE.phoneHref} className="transition-colors hover:text-thatch-light">
                  {SITE.phone}
                </a>
              </p>
              <p className="flex gap-3">
                <MessageCircle size={18} className="mt-0.5 shrink-0 text-thatch" aria-hidden="true" />
                <a
                  href={whatsappLink(dict.booking.message.greeting)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-thatch-light"
                >
                  {common.whatsapp}
                </a>
              </p>
              {SITE.email && (
                <p className="flex gap-3">
                  <Mail size={18} className="mt-0.5 shrink-0 text-thatch" aria-hidden="true" />
                  <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-thatch-light">
                    {SITE.email}
                  </a>
                </p>
              )}
            </address>

            {socials.length > 0 && (
              <div className="mt-8">
                <h2 className="eyebrow !text-thatch">{footer.follow}</h2>
                <ul className="mt-4 flex gap-4">
                  {socials.map(([name, url]) => (
                    <li key={name}>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="capitalize transition-colors hover:text-thatch-light">
                        {name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <p className="pt-8 text-xs text-cream/45">
          © {SITE.name}. {footer.rights}
        </p>
      </div>
    </footer>
  );
}
