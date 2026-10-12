import { createHash, timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';

const digest = (value: string) => createHash('sha256').update(value).digest();

/** Requires `Authorization: Bearer <ADMIN_TOKEN>`. */
export function adminAuth(adminToken: string): RequestHandler {
  const expected = digest(adminToken);

  return (req, res, next) => {
    if (!adminToken) {
      res.status(503).json({ error: 'The admin area is not set up. Set ADMIN_TOKEN on the server.' });
      return;
    }
    const [scheme, token] = (req.headers.authorization ?? '').split(' ');
    // Hashing first gives equal-length buffers, so the comparison leaks nothing about the key
    if (scheme !== 'Bearer' || !token || !timingSafeEqual(digest(token), expected)) {
      res.status(401).json({ error: 'Wrong admin key.' });
      return;
    }
    next();
  };
}
