// TYPES
import type { Server } from 'http';
// LOGGER
import { logger } from '@/utils/logger';
// ADAPTERS
import { shutdownAdapters } from '@/adapters';

const SHUTDOWN_TIMEOUT = 30000; // 30 seconds
let shutdownTimer: NodeJS.Timeout | null = null;

const startShutdownTimer = () => {
  if (shutdownTimer) return;

  shutdownTimer = setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);
};

const gracefulShutdown = async (server: Server, signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  // Stop accepting new connections
  server.close(() => {
    logger.info('HTTP server closed');
  });

  // Close all adapters
  await shutdownAdapters();

  logger.info('Graceful shutdown completed');
  process.exit(0);
};

export const setupGracefulShutdown = (server: Server) => {
  // Handle termination signals
  process.on('SIGTERM', () => {
    startShutdownTimer();
    gracefulShutdown(server, 'SIGTERM');
  });

  process.on('SIGINT', () => {
    startShutdownTimer();
    gracefulShutdown(server, 'SIGINT');
  });

  // Handle uncaught exceptions and unhandled rejections
  process.on('uncaughtException', error => {
    logger.error('Uncaught Exception:', error);
    startShutdownTimer();
    gracefulShutdown(server, 'uncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    startShutdownTimer();
    gracefulShutdown(server, 'unhandledRejection');
  });
};
