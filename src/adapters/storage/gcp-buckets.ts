// GCP STORAGE
import { Storage } from '@google-cloud/storage';
// Zod
import { z } from 'zod';
// CONSTANTS
import {
  GCP_STORAGE_PROJECT_ID as projectId,
  GCP_STORAGE_BUCKET_NAME as bucketName,
} from '@/utils/constants';
// HELPERS
import { getConfig } from '@/utils/helpers';
// LOGGER
import { logger } from '@/utils/logger';

const gcpStorageClient = new Storage({
  projectId,
});

const gcpStorage = () => {
  if (getConfig<boolean>('gcpStorageEnabled')) {
    return gcpStorageClient;
  }
  logger.warn('GCP Storage is not enabled');
  return undefined;
};

export const getBucket = () => {
  const storage = gcpStorage();
  if (storage && bucketName) {
    return storage.bucket(bucketName);
  }
  logger.warn('GCP Storage bucket is not configured');
  return undefined;
};

export default gcpStorage;

export const GCP_STORAGE_CONFIG = z
  .object({
    gcpStorageEnabled: z.boolean(),
    gcpStorageProjectId: z.string().optional(),
    gcpStorageBucketName: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.gcpStorageEnabled) {
      if (!data.gcpStorageProjectId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'GCP Storage project ID is required when GCP Storage is enabled',
          path: ['gcpStorageProjectId'],
        });
      }
      if (!data.gcpStorageBucketName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'GCP Storage bucket name is required when GCP Storage is enabled',
          path: ['gcpStorageBucketName'],
        });
      }
    }
  });
