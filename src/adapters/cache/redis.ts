// REDIS
import Redis from 'ioredis';
// Zod
import { z } from 'zod';
// CONSTANTS
import { REDIS_URL } from '@/utils/constants';
// HELPERS
import { getConfig } from '@/utils/helpers';
// LOGGER
import { logger } from '@/utils/logger';

const redisClient = new Redis(REDIS_URL);

const redis = () => {
  if (getConfig<boolean>('redisEnabled')) {
    logger.info('Redis connection pool created');
    return redisClient;
  }
  logger.warn('Redis is not enabled');
  return undefined;
};

export const shutdownRedis = async (): Promise<void> => {
  try {
    const redisClient = redis();
    if (redisClient) {
      await redisClient.quit();
      logger.info('Redis connection closed');
    }
  } catch (error) {
    logger.error('Error closing Redis connection:', error);
    throw error;
  }
};

export default redis;

export const REDIS_CONFIG = z
  .object({
    redisEnabled: z.boolean(),
    redisUrl: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.redisEnabled) {
      if (!data.redisUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Redis URL is required when Redis is enabled',
          path: ['redisUrl'],
        });
      }
    }
  });
