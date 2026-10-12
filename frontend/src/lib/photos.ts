/**
 * Real photographs of Dani Lodge. Optimised WebP files live in
 * public/images as `<id>-768.webp` and `<id>-1440.webp`; the untouched
 * originals are kept in /source-photos (outside the deployed bundle).
 *
 * To add a photo: export it at both widths, then add an entry here.
 */
export interface Photo {
  id: string;
  alt: string;
  caption: string;
}

export const PHOTOS = {
  pavilion: {
    id: 'dani-lodge-1',
    alt: 'Thatched-roof open pavilion with timber posts and woven lamps, set among green trees at Dani Lodge',
    caption: 'The thatched pavilion',
  },
  garden: {
    id: 'dani-lodge-2',
    alt: 'Shaded lawn and garden paths under mature trees at Dani Lodge',
    caption: 'Garden lawns',
  },
  courtyard: {
    id: 'dani-lodge-3',
    alt: 'Cobblestone courtyard shaded by tall trees and trimmed hedges at Dani Lodge',
    caption: 'The cobbled courtyard',
  },
} satisfies Record<string, Photo>;

export const GALLERY: Photo[] = [PHOTOS.pavilion, PHOTOS.garden, PHOTOS.courtyard];
