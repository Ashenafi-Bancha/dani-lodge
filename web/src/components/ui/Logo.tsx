import Weave from '@/components/ui/Weave';

export default function Logo({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <span className="flex items-center gap-2.5 whitespace-nowrap">
      <Weave className="h-9 w-9 text-thatch" strokeWidth={2} />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.45rem] font-semibold tracking-wide ${tone === 'light' ? 'text-white' : 'text-canopy'}`}>
          Dani Lodge
        </span>
        <span className="mt-1 text-[0.55rem] font-semibold tracking-[0.3em] text-thatch uppercase">Wolaita Sodo</span>
      </span>
    </span>
  );
}
