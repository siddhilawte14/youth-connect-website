# Testing Strategy

## Approach
- Standalone test runner with zero external test framework dependencies
- Tests run via `node backend/tests/runAllTests.js`

## Test Categories

### Auth Tests
- Student login with valid credentials
- Organizer login with valid credentials
- Login with invalid password returns 401
- Student PRN rejected at organizer login
- Register new user returns token
- Access protected endpoint without token returns 401

### Event Tests
- List public events returns paginated results
- Get single event by ID
- Create event as organizer succeeds
- Create event as student returns 403
- Filter events by category and area

### Pass Tests
- Register for event creates digital pass with QR
- Duplicate registration returns 409
- Registration when capacity full returns 409
- Get my passes returns only authenticated user's passes

### Gate Scanner Tests
- Verify valid ticket returns VALID_TICKET
- Verify already redeemed ticket returns ALREADY_USED
- Verify ticket for wrong event returns WRONG_EVENT
- Verify non-existent ticket returns TICKET_NOT_FOUND
- Redeem valid ticket updates status to Redeemed

### Admin Tests
- Approve draft event changes status to Published
- Toggle club verification badge
- Retrieve audit logs
- Non-admin access to admin endpoints returns 403
