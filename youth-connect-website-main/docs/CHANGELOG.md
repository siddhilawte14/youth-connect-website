# Changelog

## [2026-08-21]

### Added:
- Complete /docs AI context system (14 files)
- Backend project scaffolding with Controller-Service-Repository architecture
- Authentication module (student login, organizer login, register, JWT)
- Event discovery & management module (CRUD, filtering, pagination)
- Pass registration & ticketing module (QR generation, HMAC signatures)
- Gate scanner verification & redemption module
- Broadcast dispatch module
- Community clubs & feed module
- Admin moderation & audit log module
- Centralized error handling, validation, rate limiting
- Seed data matching frontend mock data
- Automated test suite

## [2026-08-21] — Backend Verification

### Fixed:
- Rate limiter bypasses when `NODE_ENV=test` (checked via `process.env.NODE_ENV` at runtime, not cached env module)
- Test runner sets `NODE_ENV=test` via `--env-file=.env.test` to ensure rate limiter is disabled before module load

### Added:
- `.env.test` — test environment config (NODE_ENV=test, BCRYPT_SALT_ROUNDS=4 for fast hashing)
- `MEMORY.md` — compact AI working memory for future sessions

### Verified:
- 11/11 automated tests pass (auth, events, passes, gate scanner, admin)
- All business rules BR-001 through BR-015 covered by implementation
- All security requirements from SECURITY.md implemented
