import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import type { Config } from '../config.js';
import { adminAuth } from '../middleware/adminAuth.js';
import type { Notifier } from '../notify.js';
import type { InquiryRepository } from './repository.js';
import { fieldErrors, inquirySchema, statusSchema } from './schema.js';

/** Public: the website's enquiry form posts here. */
export function publicInquiryRoutes(config: Config, inquiries: InquiryRepository, notify: Notifier) {
  const router = Router();

  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: config.inquiryRateLimit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many enquiries from this device. Please try again later or call us.' },
  });

  router.post('/', limiter, (req, res) => {
    const body: Record<string, unknown> = req.body ?? {};

    // Honeypot: real visitors never see or fill the "website" field. Pretend it
    // worked so bots do not learn to avoid it, but store nothing.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      res.status(201).json({ ok: true });
      return;
    }

    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Please check the form.', fields: fieldErrors(parsed.error) });
      return;
    }

    const inquiry = inquiries.create(parsed.data);
    notify(inquiry);
    res.status(201).json({ ok: true, id: inquiry.id });
  });

  return router;
}

/** Owner only: read enquiries and mark them handled. */
export function adminInquiryRoutes(config: Config, inquiries: InquiryRepository) {
  const router = Router();

  // Slows down anyone guessing the admin key
  router.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: { error: 'Too many requests. Please wait a few minutes.' },
    })
  );
  router.use(adminAuth(config.adminToken));

  router.get('/', (req, res) => {
    const status = statusSchema.shape.status.safeParse(req.query.status);
    res.json({
      inquiries: inquiries.list(status.success ? status.data : undefined),
      newCount: inquiries.countNew(),
    });
  });

  router.patch('/:id', (req, res) => {
    const id = Number(req.params.id);
    const parsed = statusSchema.safeParse(req.body);
    if (!Number.isInteger(id) || !parsed.success) {
      res.status(400).json({ error: 'Invalid request.' });
      return;
    }
    const inquiry = inquiries.setStatus(id, parsed.data.status);
    if (!inquiry) {
      res.status(404).json({ error: 'Enquiry not found.' });
      return;
    }
    res.json({ inquiry, newCount: inquiries.countNew() });
  });

  return router;
}
