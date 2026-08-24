# Error Handling

## Standard Error Response
```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Human-readable error description",
  "errors": []
}
```

## Error Codes
| Code | HTTP Status | Description |
|------|------------|-------------|
| `VALIDATION_ERROR` | 400 | Request body/params failed validation |
| `AUTH_REQUIRED` | 401 | Missing or invalid authentication token |
| `AUTH_INVALID_CREDENTIALS` | 401 | Wrong email/password combination |
| `AUTH_FORBIDDEN` | 403 | Authenticated but insufficient permissions |
| `NOT_FOUND` | 404 | Requested resource does not exist |
| `DUPLICATE_ENTRY` | 409 | Resource already exists (e.g. duplicate registration) |
| `CAPACITY_FULL` | 409 | Event has reached maximum capacity |
| `PASS_ALREADY_REDEEMED` | 409 | Pass was already checked in at gate |
| `PASS_WRONG_EVENT` | 400 | Pass belongs to a different event |
| `PASS_INVALID_SIGNATURE` | 400 | QR signature verification failed |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## Implementation
- Centralized `errorHandler` middleware catches all errors
- Custom `AppError` class with `statusCode`, `code`, and `message`
- Stack traces logged server-side only, never sent to client
- Validation errors include field-level detail in `errors` array
