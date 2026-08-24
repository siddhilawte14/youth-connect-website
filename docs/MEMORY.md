# PROJECT MEMORY

## Current State
- Backend: **COMPLETE & VERIFIED** — 11/11 automated tests pass
- Architecture: Express.js + ES Modules, in-memory store, Controller-Service-Repository
- All modules implemented, connected, and tested

## Completed
- Config layer: env.js, database.js (in-memory seed), logger.js
- Utilities: jwt.js, password.js, qrCrypto.js, response.js
- Middleware: authMiddleware, errorHandler, rateLimiter, roleMiddleware, validatorMiddleware
- Auth module: student login (email/PRN), organizer login, register, profile
- Event module: CRUD, filtering, pagination, soft delete, organizer ownership check
- Pass/Ticketing module: registration, HMAC-SHA256 QR signing, duplicate check, capacity check
- Gate scanner module: verify (VALID/ALREADY_USED/WRONG_EVENT/TICKET_NOT_FOUND), redeem
- Broadcast module: send to event attendees, get event broadcasts
- Community module: clubs list/detail, community feed updates
- Admin module: approve/reject events, toggle club verification, audit logs, dashboard stats
- Audit log: append-only, SHA-256 integrity hash on every entry
- Test suite: `backend/tests/runAllTests.js` — 11 tests, run with `node --env-file=.env.test tests/runAllTests.js`

## In Progress
- Nothing — backend is complete

## Important Decisions
- DEC-004: In-memory data store (no DB required) — repository pattern abstracts it for future migration
- DEC-005: HMAC-SHA256 QR signatures using `QR_HMAC_SECRET` env var
- DEC-007: All routes under `/api/v1/` prefix
- DEC-008: Soft delete only for events; pass records never deleted
- Rate limiter bypassed when `NODE_ENV=test` (checked via `process.env.NODE_ENV` at runtime)

## Important Constraints
- Node.js ≥ 18 required (uses native fetch in tests, ES Modules)
- Test command MUST set `NODE_ENV=test` before module load: `node --env-file=.env.test tests/runAllTests.js`
- No external database — all data is in-memory and resets on server restart
- BCRYPT_SALT_ROUNDS=4 in `.env.test` for fast test hashing; production uses 12
- `passwordHash` is stripped from all user API responses in authMiddleware and authService

## Known Issues
- None — all 11 tests pass

## Next Actions
- Frontend integration test (manually verify frontend can communicate with backend)
- If persistent data is needed: swap repository implementations for MongoDB/PostgreSQL (DEC-004)
- Consider adding `GET /api/v1/users/:id` profile endpoint for admin use
- Consider adding `PUT /api/v1/auth/profile` for user profile updates

## Important Files
```
backend/src/server.js          — Entry point, seeds DB, starts HTTP server
backend/src/app.js             — Express app, middleware stack, route registration
backend/src/config/database.js — In-memory store + seed data (matches frontend mockData)
backend/src/config/env.js      — All env vars with safe defaults
backend/src/utils/qrCrypto.js  — HMAC sign/verify, ticketId generator, SHA-256 for audit
backend/src/utils/response.js  — AppError class, successResponse, errorResponse, createdResponse
backend/src/middlewares/authMiddleware.js  — JWT verification, user lookup, optionalAuth
backend/src/middlewares/rateLimiter.js     — In-memory sliding window, bypassed in test mode
backend/src/constants/index.js            — ROLES, EVENT_CATEGORIES, SCAN_STATUSES enums
backend/tests/runAllTests.js              — 11-test automated suite (no external test runner)
backend/.env.example                      — Production env template
backend/.env.test                         — Test env (NODE_ENV=test, BCRYPT=4, fast secrets)
```

## Seed Credentials
```
Student:   21bce045@kkwieer.edu.in / password123  (also: PRN 21BCE045)
Organizer: organizers@techsprint2026.org / password123
Admin:     admin@youthconnect.in / admin123
```
