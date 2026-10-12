import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';

export type AccessPayload = { sub: string; type: 'access' };
export type RefreshPayload = { sub: string; type: 'refresh'; jti: string; family: string };

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId, type: 'access' } satisfies AccessPayload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES as jwt.SignOptions['expiresIn'],
  });
}

export function signRefreshToken(payload: Omit<RefreshPayload, 'type'>): string {
  return jwt.sign(
    { ...payload, type: 'refresh' } satisfies RefreshPayload,
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES as jwt.SignOptions['expiresIn'] },
  );
}

export function verifyAccessToken(token: string): AccessPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
    if (decoded.type !== 'access' || !decoded.sub) {
      throw new AppError(401, 'TOKEN_INVALID', 'Authentication required');
    }
    return decoded;
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err instanceof jwt.TokenExpiredError) {
      throw new AppError(401, 'TOKEN_EXPIRED', 'Access token expired');
    }
    throw new AppError(401, 'TOKEN_INVALID', 'Authentication required');
  }
}

export function verifyRefreshToken(token: string): RefreshPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshPayload;
    if (decoded.type !== 'refresh' || !decoded.sub || !decoded.jti || !decoded.family) {
      throw new AppError(401, 'REFRESH_TOKEN_INVALID', 'Refresh token is invalid');
    }
    return decoded;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(401, 'REFRESH_TOKEN_INVALID', 'Refresh token is invalid');
  }
}
