import { AppError } from '../middleware/errorHandler';

export function assertOwnership<T extends { userId: unknown }>(doc: T | null, userId: string): T {
  if (!doc || String(doc.userId) !== userId) {
    throw new AppError(404, 'NOT_FOUND', 'Resource not found');
  }
  return doc;
}

export function notFound(): never {
  throw new AppError(404, 'NOT_FOUND', 'Resource not found');
}
