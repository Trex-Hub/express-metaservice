// EXPRESS
import { Router } from 'express';
// CONTROLLERS
import getHealthController from '@/controllers/health';

const healthRouter: Router = Router();

healthRouter.get('/', getHealthController);

export default healthRouter;
