'use client';

import { DURATION, EASE, gsap, ScrollTrigger, useGSAP } from '@/lib/animations';

/**
 * One place that wires every declarative animation on the page:
 *
 *   data-reveal         fade and rise into view
 *   data-reveal-mask    image uncovered from below with a soft clip
 *   data-parallax="n"   drifts at n × scroll speed (layered parallax)
 *
 * Sections only add attributes, so they can stay server components.
 */
export default function Reveals() {
  useGSAP(() => {
    const motionOk = document.documentElement.classList.contains('motion-ok');
    if (!motionOk) return;

    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 88%',
      once: true,
      onEnter: (elements) =>
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          duration: DURATION.reveal,
          ease: EASE.reveal,
          stagger: 0.09,
          overwrite: true,
        }),
    });

    gsap.utils.toArray<HTMLElement>('[data-reveal-mask]').forEach((el) => {
      gsap.to(el, {
        clipPath: 'inset(0% 0 0 0)',
        duration: DURATION.mask,
        ease: EASE.reveal,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      const speed = Number(el.dataset.parallax) || 0.1;
      gsap.fromTo(
        el,
        { yPercent: -speed * 50 },
        {
          yPercent: speed * 50,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );
    });

    // Pinned sections (the day story, rooms) are set up by their own
    // components and add scroll length; re-measure everything once they exist
    // so later reveals fire at the right place.
    const remeasure = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    const timer = window.setTimeout(remeasure, 600);
    window.addEventListener('load', remeasure);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('load', remeasure);
    };
  });

  return null;
}
