import { randomBytes, randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { AppError } from '../../middleware/errorHandler';
import { User } from '../users/user.model';
import { serializeUser } from '../users/user.serializer';
import { RefreshSession } from './refreshSession.model';
import { OneTimeToken } from './oneTimeToken.model';
import { sha256, timingSafeEqualHex } from '../../utils/tokenCompare';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { sendPasswordResetEmail, sendVerificationEmail } from '../../services/email.service';

const BCRYPT_COST = 12;
const LOCK_MS = 15 * 60 * 1000;
const MAX_FAILED = 5;
const VERIFY_TTL_MS = 24 * 60 * 60 * 1000;
const RESET_TTL_MS = 60 * 60 * 1000;
const GENERIC_AUTH = 'Invalid email or password';
const GENERIC_RESET = 'If an account exists for that email, a reset link has been sent';

function publicUser(user: InstanceType<typeof User>) {
  return serializeUser(user);
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

async function issueRefresh(userId: string, familyId = randomUUID()) {
  const jti = randomUUID();
  const token = signRefreshToken({ sub: userId, jti, family: familyId });
  const decoded = verifyRefreshToken(token);
  const expMs = typeof decoded === 'object' ? Date.now() + 7 * 24 * 60 * 60 * 1000 : Date.now();
  await RefreshSession.create({
    userId,
    familyId,
    jti,
    tokenHash: sha256(token),
    expiresAt: new Date(expMs),
  });
  return token;
}

export async function issueAuthTokens(userId: string, familyId?: string) {
  const accessToken = signAccessToken(userId);
  const refreshToken = await issueRefresh(userId, familyId);
  return { accessToken, refreshToken };
}

async function createOneTimeToken(userId: string, type: 'email_verify' | 'password_reset', ttlMs: number) {
  const raw = randomBytes(32).toString('hex');
  await OneTimeToken.deleteMany({ userId, type });
  await OneTimeToken.create({
    userId,
    type,
    tokenHash: sha256(raw),
    expiresAt: new Date(Date.now() + ttlMs),
  });
  return raw;
}

async function consumeOneTimeToken(raw: string, type: 'email_verify' | 'password_reset') {
  const tokenHash = sha256(raw);
  const record = await OneTimeToken.findOne({ tokenHash, type });
  if (!record || record.expiresAt.getTime() < Date.now()) {
    throw new AppError(400, 'TOKEN_INVALID', 'Token is invalid or expired');
  }
  await record.deleteOne();
  return String(record.userId);
}

export async function signup(input: { name: string; email: string; password: string }) {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new AppError(409, 'CONFLICT', 'Unable to create account');
  }
  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash: await hashPassword(input.password),
  });
  const verifyToken = await createOneTimeToken(String(user._id), 'email_verify', VERIFY_TTL_MS);
  await sendVerificationEmail(user.email, verifyToken);
  const tokens = await issueAuthTokens(String(user._id));
  return { user: publicUser(user), ...tokens };
}

export async function login(input: { email: string; password: string }) {
  const user = await User.findOne({ email: input.email }).select('+passwordHash');
  if (!user) {
    throw new AppError(401, 'UNAUTHORIZED', GENERIC_AUTH);
  }
  if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
    throw new AppError(401, 'UNAUTHORIZED', GENERIC_AUTH);
  }
  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) {
    const failed = (user.failedLoginCount ?? 0) + 1;
    user.failedLoginCount = failed;
    if (failed >= MAX_FAILED) {
      user.lockUntil = new Date(Date.now() + LOCK_MS);
      user.failedLoginCount = 0;
    }
    await user.save();
    throw new AppError(401, 'UNAUTHORIZED', GENERIC_AUTH);
  }
  user.failedLoginCount = 0;
  user.lockUntil = undefined;
  await user.save();
  const tokens = await issueAuthTokens(String(user._id));
  return { user: publicUser(user), ...tokens };
}

export async function refresh(rawToken: string | undefined) {
  if (!rawToken) {
    throw new AppError(401, 'REFRESH_TOKEN_INVALID', 'Refresh token is invalid');
  }
  const payload = verifyRefreshToken(rawToken);
  const session = await RefreshSession.findOne({ jti: payload.jti, userId: payload.sub });
  if (!session || !timingSafeEqualHex(session.tokenHash, sha256(rawToken))) {
    await RefreshSession.deleteMany({ userId: payload.sub });
    throw new AppError(401, 'REFRESH_TOKEN_INVALID', 'Refresh token is invalid');
  }
  await session.deleteOne();
  return issueAuthTokens(payload.sub, payload.family);
}

export async function logout(userId?: string, rawToken?: string) {
  if (userId) {
    await RefreshSession.deleteMany({ userId });
    return;
  }
  if (!rawToken) return;
  try {
    const payload = verifyRefreshToken(rawToken);
    await RefreshSession.deleteMany({ userId: payload.sub });
  } catch {
    // Cookie may already be invalid; still succeed
  }
}

export async function verifyEmail(token: string) {
  const userId = await consumeOneTimeToken(token, 'email_verify');
  const user = await User.findByIdAndUpdate(userId, { emailVerified: true }, { new: true });
  if (!user) throw new AppError(400, 'TOKEN_INVALID', 'Token is invalid or expired');
  return publicUser(user);
}

export async function forgotPassword(email: string) {
  const user = await User.findOne({ email });
  if (user) {
    const token = await createOneTimeToken(String(user._id), 'password_reset', RESET_TTL_MS);
    await sendPasswordResetEmail(user.email, token);
  }
  return { message: GENERIC_RESET };
}

export async function resetPassword(token: string, password: string) {
  const userId = await consumeOneTimeToken(token, 'password_reset');
  const user = await User.findById(userId);
  if (!user) throw new AppError(400, 'TOKEN_INVALID', 'Token is invalid or expired');
  user.passwordHash = await hashPassword(password);
  user.failedLoginCount = 0;
  user.lockUntil = undefined;
  await user.save();
  await RefreshSession.deleteMany({ userId });
  return { message: 'Password updated' };
}
