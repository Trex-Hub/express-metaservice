import '@/types/route/init';
import { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import { HealthResponseRegistrySchema } from '@/types/route/health/get';
import { UploadResponseRegistrySchema } from '@/types/route/upload/post';

export const registry = new OpenAPIRegistry();

const registerRoutePaths = (routes: RouteConfig[]) => {
  routes.forEach(route => {
    registry.registerPath(route);
  });
};

registerRoutePaths([
  HealthResponseRegistrySchema,
  UploadResponseRegistrySchema,
]);
