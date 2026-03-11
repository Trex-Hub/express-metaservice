// DATE-FNS
import { formatISO } from 'date-fns';
// CONFIG
import { getConfig } from '@/utils/helpers';

export const PORT = getConfig<number>('port');
export const TIMESTAMP = formatISO(new Date());
export const IS_DEVELOPMENT = getConfig<boolean>('isDevelopment');

// REDIS
export const REDIS_URL = process.env.REDIS_URL ?? getConfig<string>('redisUrl');

// POSTGRES
export const POSTGRES_URL =
  process.env.POSTGRES_URL ?? getConfig<string>('postgresUrl');

// GCP STORAGE
export const GCP_STORAGE_PROJECT_ID = getConfig<string>('gcpStorageProjectId');
export const GCP_STORAGE_BUCKET_NAME = getConfig<string>(
  'gcpStorageBucketName'
);
