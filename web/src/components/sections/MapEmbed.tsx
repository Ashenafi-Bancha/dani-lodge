'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import Weave from '@/components/ui/Weave';
import { SITE } from '@/content/site';

interface MapEmbedProps {
  loadLabel: string;
  note: string;
  title: string;
}

/**
 * Google Maps only loads when the visitor asks for it: no heavy third-party
 * page on slow connections, and no map stealing the scroll while reading.
 */
export default function MapEmbed({ loadLabel, note, title }: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 bg-forest lg:aspect-auto lg:h-full lg:min-h-[32rem]">
      {loaded ? (
        <iframe title={title} src={SITE.mapEmbedUrl} className="absolute inset-0 h-full w-full border-0" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center">
          {/* A quiet stand-in: contour rings around the lodge's pin */}
          <Weave className="absolute w-[90%] max-w-[34rem] text-white/[0.07]" strokeWidth={0.5} />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-thatch text-canopy shadow-[var(--shadow-lift)]">
            <MapPin size={26} aria-hidden="true" />
          </span>
          <button type="button" onClick={() => setLoaded(true)} className="btn btn-ghost-light relative">
            {loadLabel}
          </button>
          <p className="relative max-w-xs text-xs text-cream/55">{note}</p>
        </div>
      )}
    </div>
  );
}
