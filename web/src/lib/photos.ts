import type { StaticImageData } from 'next/image';
import type { Locale } from '@/content';
import type { PhotoId } from '@/content/types';
import courtyard from '@/assets/photos/courtyard.jpg';
import garden from '@/assets/photos/garden.jpg';
import pavilion from '@/assets/photos/pavilion.jpg';

/**
 * The real photographs of Dani Lodge. To add one: put the JPEG in
 * src/assets/photos, import it here, and add its id to PhotoId in
 * content/types.ts. next/image makes the AVIF/WebP sizes automatically.
 */
export const PHOTOS: Record<PhotoId, { src: StaticImageData; alt: Record<Locale, string> }> = {
  pavilion: {
    src: pavilion,
    alt: {
      en: 'Open thatched-roof pavilion with timber posts and woven lamps among green trees at Dani Lodge',
      am: 'በዳኒ ሎጅ በአረንጓዴ ዛፎች መካከል ያለ የእንጨት ምሰሶዎችና የተሸመኑ መብራቶች ያሉት የሳር ክዳን ዳስ',
    },
  },
  garden: {
    src: garden,
    alt: {
      en: 'Shaded lawn and garden paths under mature trees at Dani Lodge',
      am: 'በዳኒ ሎጅ ከግዙፍ ዛፎች ሥር ያሉ ጥላማ የሳር ሜዳና የአትክልት ስፍራ መንገዶች',
    },
  },
  courtyard: {
    src: courtyard,
    alt: {
      en: 'Cobblestone courtyard shaded by tall trees and trimmed hedges at Dani Lodge',
      am: 'በዳኒ ሎጅ በረጃጅም ዛፎችና በተከረከሙ አጥሮች የተከበበ የድንጋይ ንጣፍ አደባባይ',
    },
  },
};
