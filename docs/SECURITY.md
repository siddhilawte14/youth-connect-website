# Security

## Authentication
- JWT Bearer tokens with configurable expiration (default: 7 days)
- Bcrypt password hashing with salt rounds = 12
- Token transmitted via `Authorization: Bearer <token>` header

## Authorization
- RBAC with four roles: `student`, `organizer`, `tenant_admin`, `admin`
- Object-level authorization: organizers can only manage their own events
- Admin role has full access to moderation and audit endpoints

## Password Security
- Minimum 6 characters enforced server-side
- Bcrypt hashing; raw passwords never stored or logged
- Password comparison via `bcrypt.compare()`

## Input Validation
- All request bodies validated before reaching controllers
- SQL/NoSQL injection prevention via parameterized access patterns
- XSS prevention via JSON-only responses (no HTML rendering on backend)

## Rate Limiting
- Auth endpoints: 20 requests per 15 minutes per IP
- General API: 100 requests per 15 minutes per IP

## CORS
- Configurable allowed origins via `CORS_ORIGIN` environment variable
- Default: `http://localhost:3000`

## Security Headers
- Helmet middleware for HTTP security headers

## Sensitive Data
- Never expose: `passwordHash`, JWT secrets, DB credentials
- User responses strip `passwordHash` field
- Errors never expose stack traces in production

## QR Pass Integrity
- HMAC-SHA256 signature on `ticketId:eventId:userId` payload
- Gate scanner verifies signature before admission
- Secret key stored in environment variable `QR_HMAC_SECRET`
