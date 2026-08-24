import { verifyToken } from '../utils/jwt.js';
import { getStore } from '../config/database.js';
import { errorResponse } from '../utils/response.js';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Authentication required', 401, 'AUTH_REQUIRED');
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const user = getStore().users.find(u => u.id === decoded.id);
    if (!user) {
      return errorResponse(res, 'User not found', 401, 'AUTH_REQUIRED');
    }
    // Attach user to request (without passwordHash)
    const { passwordHash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    return errorResponse(res, 'Invalid or expired token', 401, 'AUTH_REQUIRED');
  }
}

/**
 * Optional auth - attaches user if token present, but doesn't block.
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const user = getStore().users.find(u => u.id === decoded.id);
    if (user) {
      const { passwordHash, ...safeUser } = user;
      req.user = safeUser;
    } else {
      req.user = null;
    }
  } catch {
    req.user = null;
  }
  next();
}
