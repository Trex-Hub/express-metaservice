// EXPRESS
import { Request, Response } from 'express';
// CONSTANTS
import { TIMESTAMP as timestamp } from '@/utils/constants';

const getHealthController = (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'OK',
    status: 'healthy',
    timestamp,
  });
};

export default getHealthController;
