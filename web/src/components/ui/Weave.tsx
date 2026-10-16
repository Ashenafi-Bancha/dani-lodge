/**
 * A ring ornament after Wolaita basketry: concentric bands with a woven
 * zig-zag between them. Used in the logo, preloader and section dividers.
 */
function zigzag(radiusInner: number, radiusOuter: number, teeth: number): string {
  const points: string[] = [];
  for (let i = 0; i <= teeth * 2; i++) {
    const angle = (i / (teeth * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? radiusOuter : radiusInner;
    points.push(`${(60 + r * Math.cos(angle)).toFixed(2)},${(60 + r * Math.sin(angle)).toFixed(2)}`);
  }
  return `M${points.join(' L')}Z`;
}

const OUTER_ZIGZAG = zigzag(40, 48, 24);
const INNER_ZIGZAG = zigzag(22, 28, 14);

interface WeaveProps {
  className?: string;
  /** Adds the class the preloader animates (stroke drawing). */
  animated?: boolean;
  strokeWidth?: number;
}

export default function Weave({ className, animated = false, strokeWidth = 1.2 }: WeaveProps) {
  const drawClass = animated ? 'weave' : undefined;
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className} aria-hidden="true">
      <circle cx="60" cy="60" r="54" className={drawClass} />
      <path d={OUTER_ZIGZAG} strokeLinejoin="round" className={drawClass} />
      <circle cx="60" cy="60" r="34" className={drawClass} />
      <path d={INNER_ZIGZAG} strokeLinejoin="round" className={drawClass} />
      <circle cx="60" cy="60" r="16" className={drawClass} />
    </svg>
  );
}
