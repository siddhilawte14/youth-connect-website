# Deployment

## Environment Variables
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-jwt-secret-min-32-chars
JWT_EXPIRES_IN=7d
QR_HMAC_SECRET=your-hmac-secret-min-32-chars
CORS_ORIGIN=http://localhost:3000
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## Development
```bash
cd backend
npm install
npm run dev
```
Server starts on `http://localhost:5000`.
Health check: `GET /health`

## Production
```bash
cd backend
npm install --production
npm start
```

## Health Check
- `GET /health` → `{ "success": true, "message": "Youth Connect API is running", "timestamp": "..." }`
