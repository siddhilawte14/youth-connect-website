# Architecture Decision Log

## DEC-001
- **Decision:** Use Express.js with ES Modules for backend runtime
- **Why:** Express already present in project dependencies; lightweight, mature, widely understood
- **Alternatives:** Fastify, Koa, Hono
- **Impact:** Entire backend framework choice
- **Date:** 2026-08-21

## DEC-002
- **Decision:** JWT Bearer token authentication with bcrypt password hashing
- **Why:** Frontend uses localStorage for auth state; JWT is stateless, scalable, standard for SPAs
- **Alternatives:** Session-based auth, OAuth2
- **Impact:** Auth middleware, token handling, security model
- **Date:** 2026-08-21

## DEC-003
- **Decision:** Controller-Service-Repository layered architecture
- **Why:** Clear separation of concerns; testable; easy to swap data layer later
- **Alternatives:** Flat route handlers, MVC
- **Impact:** Code organization, maintainability
- **Date:** 2026-08-21

## DEC-004
- **Decision:** In-memory data store with JSON seed data, abstracted behind Repository interfaces
- **Why:** Allows immediate development without database setup; repository pattern makes future MongoDB/PostgreSQL migration trivial
- **Alternatives:** SQLite, direct MongoDB
- **Impact:** Data persistence (ephemeral until DB added), zero infrastructure requirement for dev
- **Date:** 2026-08-21

## DEC-005
- **Decision:** HMAC-SHA256 signatures for QR digital pass integrity verification
- **Why:** Gate scanner must detect forged/tampered QR codes; HMAC provides cryptographic proof of authenticity without requiring database lookup for validation
- **Alternatives:** Simple UUID lookup only, asymmetric RSA signatures
- **Impact:** Pass generation, gate scanner verification flow
- **Date:** 2026-08-21

## DEC-006
- **Decision:** Consistent JSON response envelope `{ success, message, data/code/errors }`
- **Why:** Frontend expects uniform response shapes; simplifies error handling
- **Alternatives:** HTTP status codes only, GraphQL errors
- **Impact:** All API responses
- **Date:** 2026-08-21

## DEC-007
- **Decision:** API versioning under `/api/v1/` prefix
- **Why:** Standard practice for breaking change management
- **Alternatives:** No versioning, header-based versioning
- **Impact:** All route definitions
- **Date:** 2026-08-21

## DEC-008
- **Decision:** Soft deletion for Events and Users; status-based archival for Passes
- **Why:** Preserves financial audit trail and attendance records
- **Alternatives:** Hard delete, archive tables
- **Impact:** Delete operations, query filters
- **Date:** 2026-08-21
