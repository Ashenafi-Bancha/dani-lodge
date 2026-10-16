import Weave from '@/components/ui/Weave';

/**
 * First-visit opening: a basket-weave ring draws itself as a sun rises
 * behind it, then the whole layer fades away. Pure CSS (see globals.css),
 * so it never waits for JavaScript; skipped on repeat visits in the same
 * session and for reduced-motion users.
 */
export default function Preloader({ label }: { label: string }) {
  return (
    <div
      className="preloader pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-canopy"
      role="status"
      aria-label={label}
    >
      <div className="relative flex flex-col items-center">
        <div className="relative h-28 w-28 overflow-hidden">
          <span
            className="sun absolute inset-x-6 top-6 aspect-square rounded-full bg-[radial-gradient(circle,#f3d58f_0%,#c8a45a_55%,transparent_72%)] blur-[2px]"
            aria-hidden="true"
          />
          <Weave animated className="relative h-full w-full text-thatch" strokeWidth={1.4} />
        </div>
        <p className="word mt-6 font-display text-3xl tracking-wide text-cream">Dani Lodge</p>
      </div>
    </div>
  );
}
