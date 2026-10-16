interface SampleBadgeProps {
  label: string;
  /** Explains what the badge means; shown as a tooltip and read by screen readers. */
  note: string;
  tone?: 'light' | 'dark';
  className?: string;
}

/** Marks placeholder content so nobody mistakes it for confirmed facts. */
export default function SampleBadge({ label, note, tone = 'light', className = '' }: SampleBadgeProps) {
  const colors =
    tone === 'light'
      ? 'border-clay/40 bg-clay/10 text-clay-deep'
      : 'border-thatch-light/40 bg-thatch/15 text-thatch-light';
  return (
    <span
      title={note}
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.62rem] font-semibold tracking-[0.14em] uppercase ${colors} ${className}`}
    >
      <span aria-hidden="true">●</span>
      {label}
      <span className="sr-only">— {note}</span>
    </span>
  );
}
