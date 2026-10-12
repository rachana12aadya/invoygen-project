import * as Sentry from '@sentry/node';
import { env } from './env';

export function initSentry(): void {
  if (!env.SENTRY_DSN) return;
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    sendDefaultPii: false,
  });
}

export { Sentry };
