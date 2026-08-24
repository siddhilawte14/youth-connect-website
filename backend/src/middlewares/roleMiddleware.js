import { errorResponse } from '../utils/response.js';

/**
 * Creates middleware that checks if the authenticated user has one of the required roles.
 * Usage: requireRole('organizer', 'admin')
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    }
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, `Access denied. Required role: ${roles.join(' or ')}`, 403, 'AUTH_FORBIDDEN');
    }
    next();
  };
}
