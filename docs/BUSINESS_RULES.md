# Business Rules

## BR-001
Students must provide a valid PRN/College ID and password to authenticate.

## BR-002
Organizers must use a verified club/organization email to access the organizer dashboard. Student-format emails are rejected from organizer login.

## BR-003
Only authenticated users with role `organizer` or `admin` can create events.

## BR-004
Event registration is blocked when `registeredCount >= capacity`.

## BR-005
A student cannot register for the same event more than once.

## BR-006
Digital passes are generated with HMAC-SHA256 signatures. Gate scanners must verify this signature before admitting attendees.

## BR-007
A pass can only be redeemed once. Duplicate redemption attempts return `ALREADY_USED` status.

## BR-008
Gate scanner must detect passes issued for a different event (`WRONG_EVENT` status).

## BR-009
Only users with role `organizer` or `admin` can access the gate scanner terminal.

## BR-010
Only users with role `admin` can approve/reject events and toggle club verification badges.

## BR-011
Organizers can only manage events they created (object-level authorization). Admins can manage all events.

## BR-012
Broadcasts can only be sent by the event's organizer or an admin.

## BR-013
Audit logs are append-only and include SHA-256 integrity hashes. They cannot be modified or deleted.

## BR-014
Event deletion is soft-delete only (`isDeleted = true`). Pass records are never deleted.

## BR-015
All monetary amounts are in INR. Free events have `fee = 0`.
