# PROJECT MEMORY

## Current State
- Current backend status: **COMPLETE & VERIFIED** (11/11 automated integration tests passing)
- Current module: Core Platform Subsystems (Auth, Events, Passes, Gate Scanner, Broadcasts, Community, Admin)
- Current implementation phase: Production-Ready & Synchronized

## Completed
- Configuration & Security Layer: `env.js`, `database.js` (seed state), `logger.js`, `rateLimiter.js`, `errorHandler.js`
- Cryptographic Utilities: `jwt.js`, `password.js` (bcrypt), `qrCrypto.js` (HMAC-SHA256 & SHA-256 audit chaining), `response.js`
- Authentication & RBAC: Student login (email/PRN), Organizer passkey gate, registration, profile retrieval (`GET /me`), and profile updates (`PUT /profile`)
- Event Management: Public filtering, pagination, search, organizer ownership check, soft-deletion
- Digital Passes & Ticketing: Instant issuance, duplicate registration prevention, capacity guard, HMAC-signed QR passes
- Gate Scanner: Cryptographic QR verification with statuses (VALID, ALREADY_USED, WRONG_EVENT, TICKET_NOT_FOUND) and check-in redemption
- Community & Broadcasts: Attendee broadcasts, student club directory, live activity feed
- Admin Console: Moderation, organization trust badge toggling, tamper-evident audit trail
- Test Suite: Automated suite (`backend/tests/runAllTests.js`) passing 100%

## In Progress
- Backend complete; ready for frontend connection or production deployment.

## Important Decisions
- DEC-001: Express.js + Native ES Modules runtime
- DEC-002: Stateless JWT Bearer authentication + bcrypt password hashing
- DEC-003: Controller-Service-Repository 3-tier layered architecture
- DEC-004: In-memory store with seed data abstracted behind repository interfaces
- DEC-005: HMAC-SHA256 signatures for QR digital pass integrity
- DEC-006: Standard JSON response envelope `{ success, message, data/code/errors }`
- DEC-007: API versioning under `/api/v1/` prefix
- DEC-008: Soft-delete for events; pass records preserved for financial audit

## Important Constraints
- Node.js ≥ 18 required (tested on Node.js v24.19.0 LTS)
- Run tests with: `node --env-file=.env.test tests/runAllTests.js`
- Ephemeral in-memory store resets on server restart unless repository layer is bound to MongoDB/PostgreSQL
- `passwordHash` is stripped from all user-facing responses

## Known Issues
- None (0 active bugs, 0 failing tests)

## Next Actions
- Connect frontend API client directly to `http://localhost:5000/api/v1`
- Containerize with Docker / Docker Compose for multi-environment cloud deployment

## Important Files
- `backend/src/server.js`: Server entry point & DB seeder
- `backend/src/app.js`: Express app, middleware pipeline & route mounts
- `backend/src/config/database.js`: In-memory data store with realistic seed datasets
- `backend/src/utils/qrCrypto.js`: HMAC-SHA256 signature generator & verify
- `backend/tests/runAllTests.js`: 11-test automated suite
- `docs/API_CONTRACT.md`: Full REST API contract documentation
