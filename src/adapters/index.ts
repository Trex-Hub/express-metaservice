// ADAPTERS
import { shutdownPostgres } from './database/postgress';
import { shutdownRedis } from './cache/redis';

/**
 * Shuts down all adapters gracefully
 * All adapter shutdowns are executed in parallel using Promise.allSettled
 * to ensure all adapters are closed even if one fails
 */
export const shutdownAdapters = async (): Promise<void> => {
  await Promise.allSettled([shutdownPostgres(), shutdownRedis()]);
};
