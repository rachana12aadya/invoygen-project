import request from 'supertest';
import { app } from '../src/app';

test('health is ok without auth', async () => {
  const res = await request(app).get('/health');
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ success: true, data: { status: 'ok' } });
});

test('ready succeeds when the database is up', async () => {
  const res = await request(app).get('/ready');
  expect(res.status).toBe(200);
  expect(res.body.data.status).toBe('ready');
});
