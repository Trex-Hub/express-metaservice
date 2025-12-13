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
    return redisClient;
  }
  logger.warn('Redis is not enabled');
  return undefined;
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
