// EXPRESS
import type { Request, Response, NextFunction } from 'express';
// LOGGER
import { logger } from '@/utils/logger';
// CONSTANT
import { IS_DEVELOPMENT } from '@/utils/constants';

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    const logLevel =
      res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

    if (IS_DEVELOPMENT) {
      logger.log({
        level: logLevel,
        message: 'HTTP request',
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
      });
    } else {
      logger.log({
        level: logLevel,
        message: 'HTTP request',
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Number(durationMs.toFixed(2)),
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        contentLength: res.getHeader('content-length'),
      });
    }
  });

  next();
};

export default loggingMiddleware;
