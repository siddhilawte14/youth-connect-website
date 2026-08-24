import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production-min-32-chars',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  QR_HMAC_SECRET: process.env.QR_HMAC_SECRET || 'dev-hmac-secret-change-in-production-min-32-chars',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  RATE_LIMIT_AUTH_MAX: parseInt(process.env.RATE_LIMIT_AUTH_MAX, 10) || 20,
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',
};

export default env;
