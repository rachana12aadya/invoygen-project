import { initSentry } from './config/sentry';
import { env } from './config/env';
import { connectDb } from './config/db';
import { logger } from './config/logger';
import { app } from './app';

initSentry();

async function main() {
  await connectDb();
  app.listen(env.PORT, () => {
    logger.info(`invoygen API listening on port ${env.PORT}`);
  });
}

main().catch((err: unknown) => {
  logger.error('Failed to start server', { message: err instanceof Error ? err.message : 'unknown' });
  process.exit(1);
});
