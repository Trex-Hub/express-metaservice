// ADAPTERS
import { shutdownPostgres } from '@/adapters/database/postgress';
import { shutdownRedis } from '@/adapters/cache/redis';
import postgres from '@/adapters/database/postgress';
import redis from '@/adapters/cache/redis';

/**
 * Shuts down all adapters gracefully
 * All adapter shutdowns are executed in parallel using Promise.allSettled
 * to ensure all adapters are closed even if one fails
 */
export const shutdownAdapters = async (): Promise<void> => {
  await Promise.allSettled([shutdownPostgres(), shutdownRedis()]);
};

export const initializeAdapters = async (): Promise<void> => {
  await Promise.allSettled([postgres(), redis()]);
};
