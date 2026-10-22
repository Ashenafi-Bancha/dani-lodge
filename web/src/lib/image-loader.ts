/**
 * next/image loader that serves pre-generated WebP files from public/photos
 * instead of the on-demand /_next/image service (which the Vercel
 * multi-service setup does not provide).
 *
 * For a photo imported from src/assets/photos/<name>.jpg, keep
 * public/photos/<name>-640.webp, -1080.webp and -1440.webp next to it
 * (see web/README.md for the one-line command that makes them).
 */
const WIDTHS = [640, 1080, 1440];

export default function photoLoader({ src, width }: { src: string; width: number }): string {
  // Static imports look like /_next/static/media/pavilion.0m9zmyjyeynk_.jpg
  const file = src.split('/').pop() ?? '';
  const name = file.split('.')[0];
  if (!src.startsWith('/_next/static/media/') || !name) return src;
  const best = WIDTHS.find((w) => w >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `/photos/${name}-${best}.webp`;
}
