import env from './env.js';

const SENSITIVE_FIELDS = ['password', 'token', 'secret', 'authorization', 'passwordHash'];

function sanitize(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_FIELDS.some(f => key.toLowerCase().includes(f))) {
      clean[key] = '[REDACTED]';
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

const logger = {
  info: (message, meta = {}) => {
    console.log(JSON.stringify({ level: 'info', message, ...sanitize(meta), timestamp: new Date().toISOString() }));
  },
  warn: (message, meta = {}) => {
    console.warn(JSON.stringify({ level: 'warn', message, ...sanitize(meta), timestamp: new Date().toISOString() }));
  },
  error: (message, meta = {}) => {
    const entry = { level: 'error', message, timestamp: new Date().toISOString() };
    if (meta.stack && env.isDev) entry.stack = meta.stack;
    if (meta.code) entry.code = meta.code;
    console.error(JSON.stringify({ ...entry, ...sanitize(meta) }));
  },
  request: (req) => {
    if (env.isProd) return;
    console.log(`${req.method} ${req.originalUrl} [${req.ip}]`);
  },
};

export default logger;
