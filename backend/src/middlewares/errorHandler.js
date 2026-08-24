import logger from '../config/logger.js';
import { errorResponse } from '../utils/response.js';
import { AppError } from '../utils/response.js';
import env from '../config/env.js';

export function errorHandler(err, req, res, _next) {
  // Log the error
  logger.error(err.message, { stack: err.stack, code: err.code, statusCode: err.statusCode });

  // Known operational error
  if (err instanceof AppError) {
    return errorResponse(res, err.message, err.statusCode, err.code);
  }

  // JWT specific errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401, 'AUTH_REQUIRED');
  }
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token has expired', 401, 'AUTH_REQUIRED');
  }

  // Default 500
  const message = env.isDev ? err.message : 'Internal server error';
  return errorResponse(res, message, 500, 'INTERNAL_ERROR');
}
