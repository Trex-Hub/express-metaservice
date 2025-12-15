import '@/types/route/init';
import { z } from 'zod';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';

// POST /upload
export const UploadRequestSchema = z
  .object({
    files: z
      .array(z.any())
      .optional()
      .openapi({
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      }),
  })
  .openapi('UploadRequest');

export type UploadRequest = z.infer<typeof UploadRequestSchema>;

export const UploadedFileSchema = z
  .object({
    fieldname: z.string(),
    filename: z.string(),
    mimeType: z.string(),
    encoding: z.string(),
  })
  .openapi('UploadedFile');

export type UploadedFile = z.infer<typeof UploadedFileSchema>;

export const UploadResponseSchema = z
  .object({
    message: z.string(),
    timestamp: z.string(),
    files: z.array(UploadedFileSchema),
    count: z.number(),
  })
  .openapi('UploadResponse');

export type UploadResponse = z.infer<typeof UploadResponseSchema>;

// REGISTRY DEFINATIONS
export const UploadResponseRegistrySchema: RouteConfig = {
  method: 'post',
  path: '/upload',
  tags: ['Upload'],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: UploadRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Files uploaded successfully.',
      content: {
        'application/json': {
          schema: UploadResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid request payload or file type.',
    },
    500: {
      description: 'Internal server error.',
    },
  },
};
