/**
 * The shape every language file must follow. TypeScript flags any text that
 * is missing from one language, so English and Amharic cannot drift apart.
 *
 * `sample: true` marks content that is a placeholder until the lodge confirms
 * it. The site shows a visible "Sample" label on it.
 */

export type PhotoId = 'pavilion' | 'garden' | 'courtyard';

/** A real photo, or a labelled placeholder frame until a photo exists. */
export type Visual = { photo: PhotoId } | { placeholder: string };

export interface Counter {
  value: number;
  suffix?: string;
  label: string;
  sample: boolean;
}

export interface Moment {
  time: string;
  title: string;
  text: string;
  visual: Visual;
  sample: boolean;
}

export interface Room {
  id: string;
  name: string;
  summary: string;
  size: string;
  beds: string;
  view: string;
  amenities: string[];
  /** Price per night in Ethiopian birr. */
  priceFrom: number;
  visual: Visual;
  sample: boolean;
}

export interface DiningItem {
  title: string;
  text: string;
  sample: boolean;
}

export interface Offer {
  title: string;
  text: string;
  detail: string;
  sample: boolean;
}

export interface Review {
  name: string;
  origin: string;
  rating: number;
  text: string;
}

export interface FaqItem {
  q: string;
  a: string;
  sample: boolean;
}

export interface Distance {
  place: string;
  value: string;
  sample: boolean;
}

export interface GalleryItem {
  visual: Visual;
  caption: string;
}

export interface Dictionary {
  locale: 'en' | 'am';
  /** BCP-47 tag used for dates and numbers. */
  intlLocale: string;
  meta: { title: string; description: string; keywords: string[] };
  common: {
    /** Opening of short WhatsApp messages, e.g. "Hello Dani Lodge". */
    hello: string;
    sample: string;
    sampleNote: string;
    photoSoon: string;
    bookNow: string;
    checkAvailability: string;
    whatsapp: string;
    call: string;
    from: string;
    perNight: string;
    currency: string;
    close: string;
    previous: string;
    next: string;
    cursorView: string;
    cursorExplore: string;
    cursorDrag: string;
    skipToContent: string;
    switchLanguage: string;
    otherLanguageName: string;
  };
  nav: {
    menu: string;
    links: { id: string; label: string; visual: Visual }[];
  };
  preloader: { label: string };
  hero: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    lead: string;
    explore: string;
    scroll: string;
  };
  bookingBar: {
    title: string;
    note: string;
  };
  dates: {
    checkIn: string;
    checkOut: string;
    addDate: string;
    nights: string;
    oneNight: string;
    clear: string;
    done: string;
    prevMonth: string;
    nextMonth: string;
    pickCheckIn: string;
    pickCheckOut: string;
  };
  guests: {
    label: string;
    adults: string;
    adultsHint: string;
    children: string;
    childrenHint: string;
    summary: string;
    summaryOne: string;
    increase: string;
    decrease: string;
  };
  story: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    quote: string;
    counters: Counter[];
    marquee: string[];
  };
  day: { eyebrow: string; title: string; moments: Moment[] };
  rooms: {
    eyebrow: string;
    title: string;
    lead: string;
    sizeLabel: string;
    bedsLabel: string;
    viewLabel: string;
    bookRoom: string;
    items: Room[];
  };
  meetings: {
    eyebrow: string;
    title: string;
    text: string;
    features: string[];
    capacity: string;
    capacitySample: boolean;
    cta: string;
  };
  dining: {
    eyebrow: string;
    title: string;
    text: string;
    items: DiningItem[];
    cta: string;
  };
  gallery: { eyebrow: string; title: string; hint: string; items: GalleryItem[] };
  location: {
    eyebrow: string;
    title: string;
    lead: string;
    addressLines: string[];
    plusCodeLabel: string;
    distancesTitle: string;
    distances: Distance[];
    directions: string;
    openMaps: string;
    loadMap: string;
    mapNote: string;
    mapTitle: string;
  };
  reviews: { eyebrow: string; title: string; sampleNote: string; items: Review[] };
  offers: { eyebrow: string; title: string; ask: string; items: Offer[] };
  faq: { eyebrow: string; title: string; items: FaqItem[] };
  finalCta: { eyebrow: string; title: string; lead: string };
  booking: {
    eyebrow: string;
    title: string;
    lead: string;
    perks: string[];
    roomType: string;
    roomAny: string;
    roomEvent: string;
    name: string;
    phone: string;
    phonePlaceholder: string;
    email: string;
    optional: string;
    requests: string;
    requestsPlaceholder: string;
    submit: string;
    orCall: string;
    note: string;
    sent: string;
    errors: { name: string; phone: string; dates: string; email: string };
    prefilled: string;
    message: {
      greeting: string;
      name: string;
      phone: string;
      email: string;
      dates: string;
      nights: string;
      guests: string;
      room: string;
      requests: string;
    };
  };
  footer: {
    tagline: string;
    explore: string;
    contact: string;
    follow: string;
    rights: string;
    madeWith: string;
  };
}
