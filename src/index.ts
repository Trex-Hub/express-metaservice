// UTILS
import cors from 'cors';
import express from 'express';
// CONFIG
import { getConfig } from '@/utils/helpers';
// LOGGERS
import { logger } from '@/utils/logger';
// ROUTES
import router from '@/routes';
// MIDDLEWARES
import loggingMiddleware from '@/middlewares/logging';
// SHUTDOWN
import { setupGracefulShutdown } from '@/utils/shutdown';
// DOCUMENTATION
import { specs, swaggerUi } from '@/adapters/documentation/swagger';

const app = express();

app.use(express.json());

app.use(loggingMiddleware);

app.use(
  cors({
    origin: getConfig('allowedOrigins'),
    methods: getConfig('allowedMethods'),
  })
);

app.get('/', (_req, res) => {
  res.status(200).send('OK');
});

if (getConfig('isMicroservice')) {
  app.use(`/${getConfig('microserviceName')}`, router);
} else {
  app.use('/api/v1', router);
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

setupGracefulShutdown(
  app.listen(getConfig('port'), () => {
    logger.info(`Server is running on port ${getConfig('port')}`);
    logger.info(`Server URL: http://localhost:${getConfig('port')}`);
  })
);
