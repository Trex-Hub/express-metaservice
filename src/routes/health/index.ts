// EXPRESS
import { Router } from 'express';
// CONTROLLERS
import getHealthController from '@/controllers/health';
// TYPES
import { HealthResponse } from '@/types/route/health/get';

const healthRouter: Router = Router();

healthRouter.get<{}, HealthResponse, {}>('/', getHealthController);

export default healthRouter;
