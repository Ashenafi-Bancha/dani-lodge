# Dani Lodge

Website for Dani Lodge — Humbo Larena, Wolaita Sodo, Ethiopia.

```
dani-lodge/
├── web/        The new premium website — Next.js, English + Amharic (see web/README.md)
├── frontend/   The first version of the site (Vite + React) — currently what Vercel deploys
└── backend/    API that stores enquiries + owner inbox at /admin (Express + SQLite)
```

To run the new site: `cd web && npm install && npm run dev`, then open http://localhost:3000.

## Run it

Two terminals, one for each part:

```bash
cd backend
npm install
cp .env.example .env   # set ADMIN_TOKEN (first time only)
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

- Website: http://localhost:5173
- Owner's enquiry inbox: http://localhost:4000/admin

The website still works if the backend is down: the form then offers to send the same enquiry on WhatsApp.

Frontend scripts: `npm run build`, `npm run typecheck`, `npm run lint`. Backend details are in [backend/README.md](backend/README.md).

## Where things live (frontend/src)

| Path | What it holds |
| --- | --- |
| `lib/site.ts` | Phone, address, map links, navigation — edit business details here |
| `lib/photos.ts` | The photo list used by the hero, sections and gallery |
| `lib/inquiry.ts` | Enquiry form logic — the one place that calls the backend |
| `components/sections/` | One file per page section, in page order (see `App.tsx`) |
| `components/layout/` | Navbar, footer, mobile quick-action bar |
| `components/ui/` | Small shared pieces (logo, picture, headings, scroll reveal) |

## Adding photos

1. Put the original in `frontend/source-photos/` (kept out of the deployed site).
2. Export two WebP sizes into `frontend/public/images/` named `<id>-768.webp` and `<id>-1440.webp`.
3. Add an entry to `frontend/src/lib/photos.ts`.
