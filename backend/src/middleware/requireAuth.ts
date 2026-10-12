import type { RequestHandler } from 'express';
import { AppError } from './errorHandler';
import { verifyAccessToken } from '../utils/jwt';

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
  }
  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
  }
  const payload = verifyAccessToken(token);
  req.userId = payload.sub;
  next();
};
