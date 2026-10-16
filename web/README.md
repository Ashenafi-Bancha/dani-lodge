# Dani Lodge — website (Next.js)

The premium, bilingual (English / Amharic) website for Dani Lodge in Humbo Larena, Wolaita Sodo.

```bash
npm install
npm run dev      # http://localhost:3000 → redirects to /en
npm run build    # production build
npm run lint
```

## Where to edit things

| What | File |
| --- | --- |
| Every word on the site, in both languages | `src/content/en.ts`, `src/content/am.ts` |
| Phone, WhatsApp, address, map, social links | `src/content/site.ts` |
| Photos | `src/assets/photos/` + `src/lib/photos.ts` |
| Colours, fonts, motion tokens | `src/app/globals.css` (`@theme`) |
| Where booking requests go (WhatsApp today; Chapa/Stripe later) | `src/lib/booking.ts` |

Anything marked `sample: true` in the content files shows a visible **Sample** label on the site. Replace it with confirmed facts from the lodge and set `sample: false`.
Sample reviews only appear in development (or with `NEXT_PUBLIC_SHOW_SAMPLE_REVIEWS=true`) and are never sent to search engines.

## Structure

```
src/
├── app/[lang]/        layout (fonts, metadata, providers) and the page
├── components/
│   ├── sections/      one file per page section, in page order
│   ├── layout/        preloader, header + full-screen menu, cursor, sticky booking, footer
│   ├── ui/            date picker, guest selector, popover, magnetic button, visuals…
│   ├── three/         the WebGL hero scene (loaded only on capable desktops)
│   └── providers/     smooth scroll (Lenis + GSAP), scroll reveals, shared booking state
├── content/           all text and facts
├── hooks/             media-query hooks
└── lib/               animations, booking, dates, photos, device checks
```

## Performance notes

- The hero photo always loads first. The 3D scene is a separate download that only desktops with a fine pointer, enough CPU/memory and a fast connection fetch; add `?scene=force` to the address to test it anywhere.
- Ge'ez fonts load only on the Amharic page. Google Maps loads only when the visitor taps it.
- Reduced-motion visitors get no preloader, no smooth scrolling and no scroll animations.

## Deploying to Vercel

Import the repository and set **Root Directory** to `web` (Next.js is detected automatically). Set `NEXT_PUBLIC_SITE_URL` to the final domain so share previews and the sitemap use it.
