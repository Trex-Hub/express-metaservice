// ADAPTERS
import { initPostgres, shutdownPostgres } from '@/adapters/database/postgress';
import { initRedis, shutdownRedis } from '@/adapters/cache/redis';

/**
 * Shuts down all adapters gracefully
 * All adapter shutdowns are executed in parallel using Promise.allSettled
 * to ensure all adapters are closed even if one fails
 */
export const shutdownAdapters = async (): Promise<void> => {
  await Promise.allSettled([shutdownPostgres(), shutdownRedis()]);
};

export const initializeAdapters = async (): Promise<void> => {
  await Promise.all([initPostgres(), initRedis()]);
};
