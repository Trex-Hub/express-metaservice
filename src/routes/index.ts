import { Router } from 'express';
// ROUTES
import healthRouter from '@/routes/health';

const router: Router = Router();

router.use('/health', healthRouter);

export default router;
