import app from './app.js';
import env from './config/env.js';
import logger from './config/logger.js';
import { seedDatabase } from './config/database.js';

async function startServer() {
  try {
    logger.info('Initializing data store...');
    await seedDatabase();
    logger.info('Data store seeded successfully with mock data.');

    const server = app.listen(env.PORT, () => {
      logger.info(`Server successfully started in ${env.NODE_ENV} mode`, {
        port: env.PORT,
        baseUrl: `http://localhost:${env.PORT}`
      });
    });

    // Graceful shutdown handling
    const shutdown = (signal) => {
      logger.info(`${signal} received. Closing HTTP server gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (err) {
    logger.error('Failed to start server', { error: err.message, stack: err.stack });
    process.exit(1);
  }
}

startServer();
