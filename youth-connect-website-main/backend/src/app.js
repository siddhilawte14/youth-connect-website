import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import env from './config/env.js';
import logger from './config/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import { successResponse } from './utils/response.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import passRoutes from './routes/passRoutes.js';
import gateScannerRoutes from './routes/gateScannerRoutes.js';
import broadcastRoutes from './routes/broadcastRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

// Request logging (in dev)
app.use((req, res, next) => {
  logger.request(req);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  return successResponse(res, {
    status: 'UP',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString()
  }, 'Youth Connect API is running');
});

// Apply global rate limiting to all general routes
app.use('/api', generalLimiter);

// Register API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/passes', passRoutes);
app.use('/api/v1/gate', gateScannerRoutes);
app.use('/api/v1/broadcasts', broadcastRoutes);
app.use('/api/v1/community', communityRoutes);
app.use('/api/v1/admin', adminRoutes);

// Fallback 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
