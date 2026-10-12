import request from 'supertest';
import { app } from '../src/app';
import { OneTimeToken } from '../src/modules/auth/oneTimeToken.model';
import { User } from '../src/modules/users/user.model';
import { sha256 } from '../src/utils/tokenCompare';
import { signup } from './helpers';

async function authHeaders() {
  const { res, email } = await signup();
  return { token: res.body.data.accessToken as string, email, cookie: res.headers['set-cookie'] };
}

describe('invoices', () => {
  test('users cannot see another user invoice (404)', async () => {
    const a = await authHeaders();
    const b = await authHeaders();
    const created = await request(app)
      .post('/api/v1/invoices')
      .set('Authorization', `Bearer ${a.token}`)
      .send({ templateId: 'classic', country: 'IN', currency: 'INR' });
    expect(created.status).toBe(201);
    const id = created.body.data.invoice.id;
    const peek = await request(app)
      .get(`/api/v1/invoices/${id}`)
      .set('Authorization', `Bearer ${b.token}`);
    expect(peek.status).toBe(404);
    expect(peek.body.error.code).toBe('NOT_FOUND');
  });

  test('creates sequential numbers and recalculates totals', async () => {
    const { token } = await authHeaders();
    const first = await request(app)
      .post('/api/v1/invoices')
      .set('Authorization', `Bearer ${token}`)
      .send({ templateId: 'classic', country: 'US', currency: 'USD' });
    const second = await request(app)
      .post('/api/v1/invoices')
      .set('Authorization', `Bearer ${token}`)
      .send({ templateId: 'classic', country: 'US', currency: 'USD' });
    expect(first.body.data.invoice.number).toBe('INV-0001');
    expect(second.body.data.invoice.number).toBe('INV-0002');

    const patched = await request(app)
      .patch(`/api/v1/invoices/${first.body.data.invoice.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        lineItems: [{ description: 'Design', quantity: 2, unitPriceMinor: 5000 }],
        taxRate: 10,
        discountMinor: 1000,
      });
    expect(patched.body.data.invoice.subtotalMinor).toBe(10000);
    expect(patched.body.data.invoice.taxTotalMinor).toBe(900);
    expect(patched.body.data.invoice.totalMinor).toBe(9900);
  });

  test('trash restore keeps number; download requires verification', async () => {
    const { token, email } = await authHeaders();
    const created = await request(app)
      .post('/api/v1/invoices')
      .set('Authorization', `Bearer ${token}`)
      .send({ templateId: 'classic', country: 'US', currency: 'USD' });
    const id = created.body.data.invoice.id;
    const number = created.body.data.invoice.number;

    const blocked = await request(app)
      .get(`/api/v1/invoices/${id}/download`)
      .set('Authorization', `Bearer ${token}`);
    expect(blocked.status).toBe(400);
    expect(blocked.body.error.code).toBe('INVALID_REQUEST');

    const user = await User.findOne({ email });
    const raw = 'b'.repeat(64);
    await OneTimeToken.create({
      userId: user!._id,
      type: 'email_verify',
      tokenHash: sha256(raw),
      expiresAt: new Date(Date.now() + 60_000),
    });
    await request(app).post('/api/v1/auth/verify-email').send({ token: raw });

    const trashed = await request(app).delete(`/api/v1/invoices/${id}`).set('Authorization', `Bearer ${token}`);
    expect(trashed.status).toBe(200);
    const trashList = await request(app)
      .get('/api/v1/invoices/trash')
      .set('Authorization', `Bearer ${token}`);
    expect(trashList.body.data.items).toHaveLength(1);

    const restored = await request(app)
      .post(`/api/v1/invoices/${id}/restore`)
      .set('Authorization', `Bearer ${token}`);
    expect(restored.body.data.invoice.number).toBe(number);
    expect(restored.body.data.invoice.isDeleted).toBe(false);

    const download = await request(app)
      .get(`/api/v1/invoices/${id}/download`)
      .set('Authorization', `Bearer ${token}`);
    expect(download.status).toBe(200);
    expect(download.headers['content-type']).toMatch(/pdf/);
  });

  test('published invoices are not editable', async () => {
    const { token } = await authHeaders();
    const created = await request(app)
      .post('/api/v1/invoices')
      .set('Authorization', `Bearer ${token}`)
      .send({ templateId: 'classic', country: 'US', currency: 'USD' });
    const id = created.body.data.invoice.id;
    await request(app)
      .patch(`/api/v1/invoices/${id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'published' });
    const edit = await request(app)
      .patch(`/api/v1/invoices/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ notes: 'nope' });
    expect(edit.status).toBe(400);
  });
});
