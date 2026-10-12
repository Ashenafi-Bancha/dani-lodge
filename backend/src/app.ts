import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import type { Config } from './config.js';
import type { Db } from './db.js';
import { createInquiryRepository } from './inquiries/repository.js';
import { adminInquiryRoutes, publicInquiryRoutes } from './inquiries/routes.js';
import { createNotifier, type Notifier } from './notify.js';

const PUBLIC_DIR = fileURLToPath(new URL('../public', import.meta.url));

export function createApp(config: Config, db: Db, notify: Notifier = createNotifier(config)) {
  const app = express();
  const inquiries = createInquiryRepository(db);

  app.disable('x-powered-by');
  app.set('trust proxy', config.trustProxy);
  app.use(helmet());
  app.use(express.json({ limit: '20kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // Only the website may call the API from a browser; the admin page is same-origin
  app.use('/api/inquiries', cors({ origin: config.corsOrigins }), publicInquiryRoutes(config, inquiries, notify));
  app.use('/api/admin/inquiries', adminInquiryRoutes(config, inquiries));

  // Owner's page for reading enquiries, at /admin
  app.use('/admin', express.static(`${PUBLIC_DIR}/admin`));

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found.' });
  });

  const onError: ErrorRequestHandler = (err, _req, res, _next) => {
    // Malformed or oversized JSON from the client
    const status = typeof err?.status === 'number' && err.status < 500 ? err.status : 500;
    if (status === 500) console.error(err);
    res.status(status).json({ error: status === 500 ? 'Something went wrong. Please try again.' : 'Invalid request.' });
  };
  app.use(onError);

  return app;
}
