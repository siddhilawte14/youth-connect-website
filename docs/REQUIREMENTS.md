# BACKEND REQUIREMENTS (PRD MAPPING)

This document translates the YouthConnect Product Requirements Document (PRD) into structured, testable backend engineering requirements.

---

### REQ-001: Student Authentication & Verification
- **Description:** Students can authenticate using their collegiate email address and receive a JWT session token.
- **Source:** PRD Section 3 (Student Passport)
- **Priority:** High
- **Backend Impact:** `authRoutes.js`, `authController.js`, `authService.js`, `userRepository.js`
- **Status:** Complete

### REQ-002: Organizer Passkey Gate Authentication
- **Description:** Authorized campus leads and club chairs can authenticate using their registered chapter email and security passkey.
- **Source:** PRD Section 4 (Organizer Portal)
- **Priority:** High
- **Backend Impact:** `authRoutes.js`, `authService.js`, `roleMiddleware.js`
- **Status:** Complete

### REQ-003: Public & Filtered Event Discovery
- **Description:** Public users and students can query published campus events with category filters (Hackathons, Cultural Fests, NGO Drives, Workshops), search query, and pagination.
- **Source:** PRD Section 2 (Discovery Rails)
- **Priority:** High
- **Backend Impact:** `eventRoutes.js`, `eventService.js`, `eventRepository.js`
- **Status:** Complete

### REQ-004: Event Creation & Management
- **Description:** Verified organizers can create, update, and soft-delete campus events. Organizers can only manage events they own.
- **Source:** PRD Section 4 (Event Publishing)
- **Priority:** High
- **Backend Impact:** `eventRoutes.js`, `eventService.js` (ownership verification)
- **Status:** Complete

### REQ-005: Digital Pass Generation with Cryptographic HMAC Signature
- **Description:** When a student books an event, a pass is issued with a unique ticket ID and HMAC-SHA256 signature to prevent counterfeit entry.
- **Source:** PRD Section 5 (Digital Ticketing & QR)
- **Priority:** High
- **Backend Impact:** `passRoutes.js`, `passService.js`, `qrCrypto.js`
- **Status:** Complete

### REQ-006: Duplicate Booking & Capacity Enforcement
- **Description:** Backend must reject duplicate registrations from the same student for the same event, and block bookings when capacity is reached.
- **Source:** Business Rules BR-004, BR-005
- **Priority:** High
- **Backend Impact:** `passService.js`, `passRepository.js`
- **Status:** Complete

### REQ-007: Gate Scanner QR Verification & Ticket Redemption
- **Description:** Gate staff can verify pass authenticity and check students in. Status codes must indicate VALID, ALREADY_USED, WRONG_EVENT, or NOT_FOUND.
- **Source:** PRD Section 5 (Gate Check-in)
- **Priority:** High
- **Backend Impact:** `gateScannerRoutes.js`, `gateScannerService.js`
- **Status:** Complete

### REQ-008: Attendee Broadcast Messaging
- **Description:** Event organizers can dispatch targeted broadcast announcements to all registered attendees of their events.
- **Source:** PRD Section 4 (Attendee Communication)
- **Priority:** Medium
- **Backend Impact:** `broadcastRoutes.js`, `broadcastService.js`
- **Status:** Complete

### REQ-009: Campus Community Clubs & Live Updates
- **Description:** Expose student chapter profiles, member counts, and live activity updates.
- **Source:** PRD Section 6 (Community Network)
- **Priority:** Medium
- **Backend Impact:** `communityRoutes.js`, `communityService.js`, `communityRepository.js`
- **Status:** Complete

### REQ-010: Platform Administration & Event Moderation
- **Description:** Admins can approve or reject event listings, toggle organization trust verification badges, and inspect platform KPIs.
- **Source:** PRD Section 7 (Admin Command)
- **Priority:** Medium
- **Backend Impact:** `adminRoutes.js`, `adminService.js`, `adminRepository.js`
- **Status:** Complete

### REQ-011: Cryptographic Audit Trail
- **Description:** Critical state-changing operations (moderation, verification toggles) must be appended to an immutable audit log with SHA-256 integrity hashing.
- **Source:** Security & Compliance Requirements
- **Priority:** Medium
- **Backend Impact:** `adminService.js`, `qrCrypto.js`, `adminRepository.js`
- **Status:** Complete

### REQ-012: Rate Limiting & Defense-in-Depth
- **Description:** Protect public and authenticated routes against brute-force attacks and volumetric spam via sliding window rate limiting.
- **Source:** Security Architecture
- **Priority:** High
- **Backend Impact:** `rateLimiter.js`, `errorHandler.js`
- **Status:** Complete
