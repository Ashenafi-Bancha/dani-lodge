import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import { createApp } from '../src/app.js';
import type { Config } from '../src/config.js';
import { openDatabase } from '../src/db.js';
import type { Inquiry } from '../src/inquiries/repository.js';

const ADMIN_TOKEN = 'test-admin-token';

const config: Config = {
  port: 0,
  corsOrigins: ['http://localhost:5173'],
  databasePath: ':memory:',
  adminToken: ADMIN_TOKEN,
  trustProxy: 0,
  inquiryRateLimit: 1000,
  telegram: null,
};

const valid = {
  name: 'Abebe Kebede',
  phone: '0911 971 599',
  interest: 'stay',
  checkIn: '2026-11-01',
  checkOut: '2026-11-03',
  guests: '2',
  message: 'Do you have a room for two nights?',
};

function start(overrides: Partial<Config> = {}) {
  const notified: Inquiry[] = [];
  const db = openDatabase(':memory:');
  const server = createApp({ ...config, ...overrides }, db, (i) => notified.push(i)).listen(0);
  const base = `http://localhost:${(server.address() as AddressInfo).port}`;

  const request = (path: string, init: RequestInit & { token?: string } = {}) =>
    fetch(base + path, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init.token ? { Authorization: `Bearer ${init.token}` } : {}),
      },
    });

  return {
    notified,
    request,
    post: (body: unknown) => request('/api/inquiries', { method: 'POST', body: JSON.stringify(body) }),
    close: () => {
      server.close();
      db.close();
    },
  };
}

describe('POST /api/inquiries', () => {
  let api: ReturnType<typeof start>;
  before(() => {
    api = start();
  });
  after(() => api.close());

  it('stores a valid enquiry and notifies the lodge', async () => {
    const res = await api.post(valid);
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.ok, true);
    assert.equal(typeof body.id, 'number');
    assert.equal(api.notified.length, 1);
    assert.equal(api.notified[0].guests, 2);
    assert.equal(api.notified[0].status, 'new');
  });

  it('rejects missing fields with per-field messages', async () => {
    const res = await api.post({ ...valid, name: '  ', phone: '123', message: '' });
    assert.equal(res.status, 400);
    const { fields } = await res.json();
    assert.deepEqual(Object.keys(fields).sort(), ['message', 'name', 'phone']);
  });

  it('rejects an unknown interest and a check-out before check-in', async () => {
    assert.equal((await api.post({ ...valid, interest: 'spa' })).status, 400);
    const res = await api.post({ ...valid, checkIn: '2026-11-05', checkOut: '2026-11-01' });
    assert.equal(res.status, 400);
    assert.ok((await res.json()).fields.checkOut);
  });

  it('accepts blank optional fields and drops stay details for other interests', async () => {
    const before = api.notified.length;
    const res = await api.post({ ...valid, interest: 'cafe', checkOut: '', guests: '' });
    assert.equal(res.status, 201);
    const saved = api.notified[before];
    assert.equal(saved.checkIn, null);
    assert.equal(saved.guests, null);
  });

  it('silently discards honeypot submissions', async () => {
    const before = api.notified.length;
    const res = await api.post({ ...valid, website: 'http://spam.example' });
    assert.equal(res.status, 201);
    assert.equal(api.notified.length, before);
  });

  it('answers malformed JSON with 400, not 500', async () => {
    const res = await api.request('/api/inquiries', { method: 'POST', body: '{nope' });
    assert.equal(res.status, 400);
  });

  it('rate limits repeated submissions', async () => {
    const limited = start({ inquiryRateLimit: 2 });
    try {
      assert.equal((await limited.post(valid)).status, 201);
      assert.equal((await limited.post(valid)).status, 201);
      assert.equal((await limited.post(valid)).status, 429);
    } finally {
      limited.close();
    }
  });
});

describe('admin API', () => {
  let api: ReturnType<typeof start>;
  before(async () => {
    api = start();
    await api.post(valid);
    await api.post({ ...valid, name: 'Second Guest', interest: 'meeting' });
  });
  after(() => api.close());

  it('refuses requests without the right key', async () => {
    assert.equal((await api.request('/api/admin/inquiries')).status, 401);
    assert.equal((await api.request('/api/admin/inquiries', { token: 'wrong' })).status, 401);
  });

  it('is switched off when no ADMIN_TOKEN is configured', async () => {
    const open = start({ adminToken: '' });
    try {
      assert.equal((await open.request('/api/admin/inquiries', { token: '' })).status, 503);
      assert.equal((await open.request('/api/admin/inquiries', { token: 'anything' })).status, 503);
    } finally {
      open.close();
    }
  });

  it('lists enquiries newest first', async () => {
    const res = await api.request('/api/admin/inquiries', { token: ADMIN_TOKEN });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.newCount, 2);
    assert.deepEqual(
      body.inquiries.map((i: Inquiry) => i.name),
      ['Second Guest', 'Abebe Kebede']
    );
  });

  it('marks an enquiry handled and filters by status', async () => {
    const patch = await api.request('/api/admin/inquiries/1', {
      method: 'PATCH',
      token: ADMIN_TOKEN,
      body: JSON.stringify({ status: 'handled' }),
    });
    assert.equal(patch.status, 200);
    const patched = await patch.json();
    assert.equal(patched.inquiry.status, 'handled');
    assert.ok(patched.inquiry.handledAt);
    assert.equal(patched.newCount, 1);

    const handled = await (await api.request('/api/admin/inquiries?status=handled', { token: ADMIN_TOKEN })).json();
    assert.deepEqual(handled.inquiries.map((i: Inquiry) => i.id), [1]);
  });

  it('returns 404 for an unknown enquiry and 400 for a bad status', async () => {
    const missing = await api.request('/api/admin/inquiries/999', {
      method: 'PATCH',
      token: ADMIN_TOKEN,
      body: JSON.stringify({ status: 'handled' }),
    });
    assert.equal(missing.status, 404);
    const bad = await api.request('/api/admin/inquiries/1', {
      method: 'PATCH',
      token: ADMIN_TOKEN,
      body: JSON.stringify({ status: 'deleted' }),
    });
    assert.equal(bad.status, 400);
  });
});
