'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Visual from '@/components/ui/Visual';
import type { Locale } from '@/content';
import { canRunHeroScene } from '@/lib/device';
import { PHOTOS } from '@/lib/photos';

// The 3D code is a separate download that only capable desktops ever fetch
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

/**
 * The still photo is always rendered first (it is the page's largest paint).
 * On capable desktops the WebGL scene is fetched once the page is idle and
 * fades in over the photo after its first frame.
 */
export default function HeroBackdrop({ locale, photoSoon }: { locale: Locale; photoSoon: string }) {
  const [useScene, setUseScene] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    if (!canRunHeroScene()) return;
    const start = () => setUseScene(true);
    const idle = window.requestIdleCallback?.(start, { timeout: 2500 });
    const fallback = idle === undefined ? window.setTimeout(start, 1200) : undefined;
    return () => {
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (fallback !== undefined) window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden={sceneReady || undefined}>
      <Visual
        visual={{ photo: 'pavilion' }}
        locale={locale}
        photoSoon={photoSoon}
        sizes="100vw"
        priority
        className="object-[35%_center] lg:object-center"
      />

      {/* Soft mist for every device; the WebGL scene draws its own on top */}
      <div className="mist pointer-events-none absolute inset-x-[-20%] bottom-[18%] h-[45%] bg-[radial-gradient(50%_50%_at_50%_50%,rgb(240_244_236/0.22),transparent_70%)]" />

      {useScene && (
        <div className={`absolute inset-0 transition-opacity duration-[1400ms] ease-[var(--ease-soft)] ${sceneReady ? 'opacity-100' : 'opacity-0'}`}>
          <HeroScene imageSrc={PHOTOS.pavilion.src.src} onReady={() => setSceneReady(true)} />
        </div>
      )}
    </div>
  );
}
