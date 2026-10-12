# Dani Lodge — backend

A small API that receives enquiries from the website, stores them, and lets the owner read them.

Node 22+ · Express · TypeScript · SQLite (one file, no database server to run).

## Run it

```bash
cd backend
npm install
cp .env.example .env   # then set ADMIN_TOKEN
npm run dev
```

The API listens on `http://localhost:4000`. Start the frontend too (`npm run dev` in `frontend/`) — in development it forwards `/api` to this server automatically.

| Script | What it does |
| --- | --- |
| `npm run dev` | Start with auto-reload |
| `npm test` | Run the API tests |
| `npm run typecheck` | Type-check without building |
| `npm run build` then `npm start` | Compile and run for production |

## What it offers

| Route | Who | Purpose |
| --- | --- | --- |
| `POST /api/inquiries` | Website visitors | Save an enquiry from the contact form |
| `GET /api/admin/inquiries?status=new\|handled` | Owner | List enquiries, newest first |
| `PATCH /api/admin/inquiries/:id` | Owner | Mark an enquiry `handled` or `new` |
| `GET /admin` | Owner | The enquiry inbox page (asks for the admin key) |
| `GET /api/health` | Hosting | Health check |

Owner routes need the header `Authorization: Bearer <ADMIN_TOKEN>`. The `/admin` page handles that after the owner types the key once; the key is forgotten when the browser tab closes.

## Settings (`.env`)

| Variable | Meaning |
| --- | --- |
| `PORT` | Port to listen on (default 4000) |
| `CORS_ORIGIN` | Website address(es) allowed to send enquiries, comma-separated |
| `DATABASE_PATH` | Where the SQLite file lives (default `./data/dani-lodge.db`) |
| `ADMIN_TOKEN` | The owner's key for `/admin`. If empty, the admin area is switched off |
| `TRUST_PROXY` | Set to `1` behind a reverse proxy so rate limiting sees real visitor IPs |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Optional. When both are set, each new enquiry is also sent to that Telegram chat |

## Protection built in

- Input is validated on the server (same rules as the form) and size-limited.
- Each visitor can send 5 enquiries per 10 minutes.
- A hidden "website" field catches simple spam bots.
- Only the addresses in `CORS_ORIGIN` can post from a browser.
- The admin page shows visitor text as plain text, never as HTML.

## Going live

1. Host this folder on a Node service that offers **persistent disk** (the SQLite file must survive restarts), and point `DATABASE_PATH` at that disk.
2. Set `ADMIN_TOKEN` to a long random value, `CORS_ORIGIN` to the real website address, and `TRUST_PROXY=1`.
3. Serve over HTTPS — the admin key travels in a request header.
4. Build the frontend with `VITE_API_URL=https://<your-api-address>` so the form knows where to post.
5. Back up the database file now and then; it holds every enquiry.

## Code map

```
src/
├── server.ts            Starts the server
├── app.ts               Builds the Express app (security, routes, errors)
├── config.ts            Reads settings from .env
├── db.ts                Opens SQLite and creates the table
├── notify.ts            Optional Telegram message per enquiry
├── middleware/adminAuth.ts
└── inquiries/
    ├── schema.ts        Validation rules
    ├── repository.ts    Database queries
    └── routes.ts        Public and owner endpoints
public/admin/            The owner's inbox page (plain HTML/CSS/JS)
test/                    API tests
```
