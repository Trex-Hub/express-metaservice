// EXPRESS
import { Router } from 'express';
// CONTROLLERS
import getHealthController from '@/controllers/health';

const healthRouter: Router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     description: Returns the health status of the service.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service is healthy.
 */
healthRouter.get('/', getHealthController);

export default healthRouter;
