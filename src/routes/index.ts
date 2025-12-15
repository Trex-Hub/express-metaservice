import { Router } from 'express';
// ROUTES
import healthRouter from '@/routes/health';
import uploadRouter from '@/routes/upload';

const router: Router = Router();

router.use('/health', healthRouter);
router.use('/upload', uploadRouter);

export default router;
