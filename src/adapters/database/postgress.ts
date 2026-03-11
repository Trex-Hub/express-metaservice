// POSTGRES
import { Pool } from 'pg';
// Zod
import { z } from 'zod';
// CONSTANTS
import { POSTGRES_URL } from '@/utils/constants';
// HELPERS
import { getConfig } from '@/utils/helpers';
// LOGGER
import { logger } from '@/utils/logger';

const postgresClient = new Pool({
  connectionString: POSTGRES_URL,
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

const verifyConnection = async (): Promise<void> => {
  try {
    await postgresClient.query('SELECT 1');
    logger.info('PostgreSQL connection verified');
  } catch (error) {
    logger.error('PostgreSQL connection verification failed:', error);
    throw error;
  }
};

/** Initializes and verifies the PostgreSQL connection when enabled. */
export const initPostgres = async (): Promise<void> => {
  if (getConfig<boolean>('postgresEnabled')) {
    await verifyConnection();
  }
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
    postgresUrl: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.postgresEnabled) {
      if (!data.postgresUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Database URL is required when PostgreSQL is enabled',
          path: ['postgresUrl'],
        });
      }
    }
  });
