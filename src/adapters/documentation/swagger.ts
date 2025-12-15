import swaggerUi from 'swagger-ui-express';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import type { OpenAPIObject } from 'openapi3-ts/oas30';
import { registry } from '@/types/route/register';

const generator = new OpenApiGeneratorV3(registry.definitions);

const specs: OpenAPIObject = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'Express MetaService API',
    version: '1.0.0',
    description:
      'A simple Express MetaService API with Swagger documentation (generated from Zod schemas)',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1',
    },
  ],
});

export { specs, swaggerUi };
