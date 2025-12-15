import '@/types/route/init';
import { z } from 'zod';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';

// GET /health
export const HealthResponseSchema = z
  .object({
    message: z.string(),
    status: z.string(),
    timestamp: z.string(),
  })
  .openapi('HealthResponse');

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

// REGISTRY DEFINATIONS

export const HealthResponseRegistrySchema: RouteConfig = {
  method: 'get',
  path: '/health',
  tags: ['Health'],
  responses: {
    200: {
      description: 'Service is healthy.',
      content: {
        'application/json': {
          schema: HealthResponseSchema,
        },
      },
    },
  },
};
