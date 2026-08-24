# SYSTEM ARCHITECTURE

## Architectural Overview

YouthConnect follows a clean, decoupled **Layered Architecture** adhering to the **Controller-Service-Repository** pattern.

```
Client (Web / Mobile Browser / PWA)
                ↓ HTTPS / JSON
        [ Security & Middlewares ]
(Helmet, CORS, RateLimiter, JWT Auth, RoleAuth, Validation)
                ↓
           [ Routes ]
(Express Routers: /api/v1/...)
                ↓
         [ Controllers ]
(Input Parsing, HTTP Status Resolution, Response Envelope)
                ↓
          [ Services ]
(Business Logic, RBAC, Ownership Checks, HMAC QR Signing, Audit Logging)
                ↓
        [ Repositories ]
(Data Abstraction Layer: Store Queries, Filtering, Sorting, Soft Deletion)
                ↓
       [ Data Storage Layer ]
(In-Memory Store with Seed Data / Future: MongoDB / PostgreSQL)
```

---

## Layer Responsibilities

### 1. Route Layer (`src/routes/`)
- Maps HTTP method and URI paths under `/api/v1/`.
- Mounts endpoint-specific middlewares (`authMiddleware`, `requireRole`, `validate`, `authLimiter`).
- Strictly contains no business logic.

### 2. Controller Layer (`src/controllers/`)
- Extracts parameters, headers, query strings, and body payload.
- Passes validated data into corresponding domain services.
- Formats HTTP responses using standard envelopes (`successResponse`, `createdResponse`, `errorResponse`).

### 3. Service Layer (`src/services/`)
- Core business logic and rule enforcement.
- Performs object-level permission and multi-tenant resource ownership checks.
- Generates cryptographically secure tokens, hashes, and HMAC signatures.
- Emits audit log events.

### 4. Repository Layer (`src/repositories/`)
- Encapsulates direct data access and storage operations.
- Provides standard CRUD, pagination, and multi-field filtering interfaces.
- Decouples business logic from persistence implementation.

---

## Data Flow Examples

### Event Registration & Pass Issuance Flow:
1. **POST `/api/v1/passes`** &rarr; `authMiddleware` validates Student JWT.
2. `passController` forwards `eventId` and `user.id` to `passService.createPass()`.
3. `passService` queries `eventRepository` to verify event exists and is `Published`.
4. `passService` checks for existing registrations to prevent duplicates (BR-004).
5. `passService` checks if `registeredCount < capacity` (BR-005).
6. `passService` calls `qrCrypto.signPass()` to compute HMAC-SHA256 signature on ticket data.
7. `passService` saves record via `passRepository` and increments event attendee counter.
8. `passController` returns `201 Created` with pass details and HMAC signature.

### Gate QR Scan & Check-in Flow:
1. **POST `/api/v1/gate/scan`** &rarr; `authMiddleware` verifies Organizer or Gate Staff role.
2. `gateScannerController` forwards ticket payload to `gateScannerService.verifyAndRedeemPass()`.
3. `gateScannerService` verifies HMAC-SHA256 signature using `QR_HMAC_SECRET`.
4. `gateScannerService` checks pass status:
   - If already checked in &rarr; returns status `ALREADY_USED`.
   - If wrong event &rarr; returns status `WRONG_EVENT`.
   - If valid &rarr; updates status to `Redeemed`, stamps timestamp, and returns status `VALID`.
