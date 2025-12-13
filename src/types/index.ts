// Zod
import { z } from 'zod';
// ADAPTER CONFIG
import { REDIS_CONFIG } from '@/adapters/cache/redis';
import { POSTGRES_CONFIG } from '@/adapters/database/postgress';
import { GCP_STORAGE_CONFIG } from '@/adapters/storage/gcp-buckets';

export const CONFIG = z
  .object({
    // BASE
    port: z.number(),
    isDevelopment: z.boolean(),
    // CORS
    allowedOrigins: z.array(z.string()),
    allowedMethods: z.array(z.string()),
    // LOGGING
    logLevel: z.string(),
    timestampFormat: z.string(),
    // MICROSERVICE
    isMicroservice: z.boolean(),
    microserviceName: z.string().optional(),
  })
  // ADAPTER CONFIGS
  .and(REDIS_CONFIG)
  .and(POSTGRES_CONFIG)
  .and(GCP_STORAGE_CONFIG);

export type Config = z.infer<typeof CONFIG>;
