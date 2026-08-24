# TODO

## Backend Implementation

### Infrastructure
- [x] /docs AI context system (14 files)
- [x] Backend project scaffolding (package.json, folder structure)
- [x] Configuration layer (env, database, logger)
- [x] Centralized error handling & response utilities
- [x] Middleware (auth, role, validation, rate limiter)

### Authentication Module
- [x] User model & repository
- [x] Auth service (student login, organizer login, register)
- [x] Auth controller & routes
- [x] JWT utilities
- [x] Password hashing

### Event Module
- [x] Event model & repository
- [x] Event service (CRUD, filtering, pagination)
- [x] Event controller & routes

### Pass & Ticketing Module
- [x] Pass model & repository
- [x] Pass service (registration, QR generation, HMAC signing)
- [x] Pass controller & routes

### Gate Scanner Module
- [x] Gate scanner service (verify, redeem)
- [x] Gate scanner controller & routes

### Broadcast Module
- [x] Broadcast service
- [x] Broadcast controller & routes

### Community Module
- [x] Club & Update repositories
- [x] Community service
- [x] Community controller & routes

### Admin Module
- [x] Admin service (moderation, audit)
- [x] Admin controller & routes
- [x] Audit log repository

### Verification
- [x] Automated test suite — 11/11 tests pass
- [x] Rate limiter test-mode bypass (.env.test + NODE_ENV=test)
- [x] MEMORY.md created for future AI sessions

## Remaining / Future Work
- [ ] Frontend integration test (manual — start backend, verify frontend API calls succeed)
- [ ] Persistent database (swap in-memory repositories for MongoDB/PostgreSQL when needed)
- [ ] User profile update endpoint (`PUT /api/v1/auth/profile`)
- [ ] Admin user management endpoints (list users, deactivate accounts)
