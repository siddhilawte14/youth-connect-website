# PROJECT CONTEXT

## Project Overview
- **Project Name:** YouthConnect Campus Hub
- **Project Purpose:** Hyperlocal collegiate campus platform for discovering college hackathons, cultural fests, certified NGO volunteering drives, and technical workshops across Nashik and Pune campuses.
- **Target Users:**
  - **Students:** Browse events, register with 1-click verification, receive cryptographically signed digital QR passes, track community hours.
  - **Organizers / Campus Clubs:** Publish and manage events, broadcast announcements to attendees, verify and scan digital passes at entry gates.
  - **Platform Administrators:** Review and approve events, audit gate logs, verify student organizations, and monitor campus engagement.

## Technology Stack
- **Backend Runtime:** Node.js (v18+) with native ES Modules
- **Framework:** Express.js 4.x
- **Security:** Helmet, CORS, JWT (jsonwebtoken), Bcrypt.js, HMAC-SHA256 crypto for QR passes
- **Data Layer:** In-memory high performance store with seed data, abstracted behind Repository pattern interfaces for seamless future database migration (MongoDB/PostgreSQL)
- **Testing:** Node.js built-in test runner with zero third-party testing bloat

## Backend Architecture
- **Layered Architecture:** Controller-Service-Repository pattern
  - `Routes`: HTTP routing, rate limiting, validation & auth middleware attachment
  - `Controllers`: Request parsing, HTTP status resolution, response envelope formatting
  - `Services`: Core business logic, business rules enforcement, HMAC signing, audit logging
  - `Repositories`: Data access abstraction, filtering, pagination, soft-deletion
- **API Prefix:** `/api/v1/`
- **Response Envelope:** `{ success: true, message: "...", data: { ... } }`

## Core Modules
1. **Auth & Identity Module (`/api/v1/auth`):** Student verification, organizer passkey authentication, JWT issue & profile fetch.
2. **Events Module (`/api/v1/events`):** Full CRUD with category filters (Hackathon, Cultural, NGO Drives, Workshop), price filters, status management.
3. **Passes & Ticketing Module (`/api/v1/passes`):** Instant registration, duplicate prevention, capacity enforcement, HMAC-signed ticket generation.
4. **Gate Scanner Module (`/api/v1/gate`):** Ticket verification, status resolution (VALID, ALREADY_USED, WRONG_EVENT, NOT_FOUND), gate check-in redemption.
5. **Broadcasts Module (`/api/v1/broadcasts`):** Organizer-to-attendee message dispatch and channel logs.
6. **Community Clubs Module (`/api/v1/community`):** Student chapters, robotics societies, NGO foundations, and live activity feeds.
7. **Admin Module (`/api/v1/admin`):** Event moderation, organization trust badge toggling, tamper-evident SHA-256 audit logs.

## Current Status
- **Current Phase:** Production-Ready & Tested (11/11 automated integration tests passing)
- **Deployment Status:** Ready for containerization / server deployment with `.env.example` configurations.
