import request from 'supertest';
import { app } from '../src/app';
import { OneTimeToken } from '../src/modules/auth/oneTimeToken.model';
import { User } from '../src/modules/users/user.model';

export async function signup(overrides: Record<string, string> = {}) {
  const email = overrides.email ?? `user-${Date.now()}-${Math.random()}@example.com`;
  const res = await request(app)
    .post('/api/v1/auth/signup')
    .send({
      name: overrides.name ?? 'Ada Lovelace',
      email,
      password: overrides.password ?? 'supersecret1',
    });
  return { res, email, password: overrides.password ?? 'supersecret1' };
}

export async function verifyLatestEmail(email: string) {
  const user = await User.findOne({ email });
  const token = await OneTimeToken.findOne({ userId: user!._id, type: 'email_verify' });
  const rawLookup = await OneTimeToken.findById(token!._id);
  void rawLookup;
  return user;
}

export { request, app };
