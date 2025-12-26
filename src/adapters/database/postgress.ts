// POSTGRES
import { Pool } from 'pg';
// Zod
import { z } from 'zod';
// CONSTANTS
import { DATABASE_URL } from '@/utils/constants';
// HELPERS
import { getConfig } from '@/utils/helpers';
// LOGGER
import { logger } from '@/utils/logger';

const postgresClient = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const postgres = () => {
  if (getConfig<boolean>('postgresEnabled')) {
    logger.info('PostgreSQL connection pool created');
    return postgresClient;
  }
  logger.warn('PostgreSQL is not enabled');
  return undefined;
};

export const shutdownPostgres = async (): Promise<void> => {
  try {
    const postgresClient = postgres();
    if (postgresClient) {
      await postgresClient.end();
      logger.info('PostgreSQL connection pool closed');
    }
  } catch (error) {
    logger.error('Error closing PostgreSQL connection:', error);
    throw error;
  }
};

export default postgres;

export const POSTGRES_CONFIG = z
  .object({
    postgresEnabled: z.boolean(),
    databaseUrl: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.postgresEnabled) {
      if (!data.databaseUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Database URL is required when PostgreSQL is enabled',
          path: ['databaseUrl'],
        });
      }
    }
  });
