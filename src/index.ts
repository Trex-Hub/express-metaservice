// UTILS
import cors from 'cors';
import express from 'express';
// CONSTANTS
import { PORT } from '@/utils/constants';
// LOGGERS
import logger from '@/utils/logger';

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '',
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);

app.get('/', (_req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Server URL: http://localhost:${PORT}`);
});
