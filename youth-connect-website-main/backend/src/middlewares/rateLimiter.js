import { errorResponse } from '../utils/response.js';
import env from '../config/env.js';

/**
 * In-memory rate limiter (no external dependencies).
 * Uses sliding window counter per IP address.
 * Disabled in test environment to allow automated test suites.
 */
const ipHitCounts = new Map();

function createRateLimiter(windowMs, maxRequests) {
  return (req, res, next) => {
    // Bypass rate limiting in test environment (check process.env directly for test-time override)
    if (process.env.NODE_ENV === 'test') return next();

    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    if (!ipHitCounts.has(ip)) {
      ipHitCounts.set(ip, []);
    }

    const hits = ipHitCounts.get(ip).filter(time => now - time < windowMs);
    hits.push(now);
    ipHitCounts.set(ip, hits);

    if (hits.length > maxRequests) {
      return errorResponse(res, 'Too many requests. Please try again later.', 429, 'RATE_LIMITED');
    }

    next();
  };
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, hits] of ipHitCounts.entries()) {
    const fresh = hits.filter(time => now - time < env.RATE_LIMIT_WINDOW_MS);
    if (fresh.length === 0) ipHitCounts.delete(ip);
    else ipHitCounts.set(ip, fresh);
  }
}, 300_000);

export const generalLimiter = createRateLimiter(env.RATE_LIMIT_WINDOW_MS, env.RATE_LIMIT_MAX);
export const authLimiter = createRateLimiter(env.RATE_LIMIT_WINDOW_MS, env.RATE_LIMIT_AUTH_MAX);
