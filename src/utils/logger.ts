// WINSTON
import winston from 'winston';
// CONSTANT
import { IS_DEVELOPMENT } from '@/utils/constants';

const format = IS_DEVELOPMENT
  ? winston.format.json()
  : winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
      winston.format.json()
    );

export const logger = winston.createLogger({
  level: 'info',
  format,
  
  transports: [
    new winston.transports.Console(),
  ],
});
