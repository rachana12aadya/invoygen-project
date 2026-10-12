import request from 'supertest';
import { app } from '../src/app';
import { OneTimeToken } from '../src/modules/auth/oneTimeToken.model';
import { User } from '../src/modules/users/user.model';
import { sha256 } from '../src/utils/tokenCompare';
import { signup } from './helpers';

describe('auth', () => {
  test('signup and login happy path', async () => {
    const { res, email, password } = await signup();
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeTruthy();
    expect(res.headers['set-cookie']).toBeDefined();

    const login = await request(app).post('/api/v1/auth/login').send({ email, password });
    expect(login.status).toBe(200);
    expect(login.body.data.accessToken).toBeTruthy();
  });

  test('login errors are generic', async () => {
    const missing = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@example.com', password: 'supersecret1' });
    expect(missing.status).toBe(401);
    expect(missing.body.error.message).toBe('Invalid email or password');
  });

  test('lockout after five failed attempts', async () => {
    const { email, password } = await signup();
    for (let i = 0; i < 5; i += 1) {
      const fail = await request(app)
        .post('/api/v1/auth/login')
        .send({ email, password: 'wrong-password' });
      expect(fail.status).toBe(401);
    }
    const locked = await request(app).post('/api/v1/auth/login').send({ email, password });
    expect(locked.status).toBe(401);
  });

  test('verify email token', async () => {
    const { email, res } = await signup();
    const user = await User.findOne({ email });
    await OneTimeToken.deleteMany({ userId: user!._id });
    const raw = 'a'.repeat(64);
    await OneTimeToken.create({
      userId: user!._id,
      type: 'email_verify',
      tokenHash: sha256(raw),
      expiresAt: new Date(Date.now() + 60_000),
    });
    const verify = await request(app).post('/api/v1/auth/verify-email').send({ token: raw });
    expect(verify.status).toBe(200);
    expect(verify.body.data.user.emailVerified).toBe(true);

    const me = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${res.body.data.accessToken}`);
    expect(me.body.data.user.emailVerified).toBe(true);
  });

  test('refresh rotates cookie', async () => {
    const { res } = await signup();
    const cookie = res.headers['set-cookie'];
    const refresh = await request(app).post('/api/v1/auth/refresh').set('Cookie', cookie);
    expect(refresh.status).toBe(200);
    expect(refresh.body.data.accessToken).toBeTruthy();

    const reuse = await request(app).post('/api/v1/auth/refresh').set('Cookie', cookie);
    expect(reuse.status).toBe(401);
    expect(reuse.body.error.code).toBe('REFRESH_TOKEN_INVALID');
  });
});
