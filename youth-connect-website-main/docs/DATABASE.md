# DATABASE & ENTITY MODELS SPECIFICATION

YouthConnect models are derived directly from the collegiate product requirements and abstracted behind repository interfaces.

---

## 1. User Entity (`users`)

| Field | Type | Required | Constraints / Notes |
| :--- | :--- | :--- | :--- |
| `id` | String | Yes | Unique identifier (e.g. `usr_...` / UUID) |
| `name` | String | Yes | Student / Organizer full name |
| `email` | String | Yes | Unique index, lowercase |
| `passwordHash` | String | Yes | Bcrypt hash (never exposed in API) |
| `role` | Enum | Yes | `student` \| `organizer` \| `admin` |
| `college` | String | Yes | Collegiate campus affiliation |
| `department` | String | No | Department / Branch |
| `prn` | String | No | College Roll No / PRN |
| `clubName` | String | No | If organizer: Chapter / Club title |
| `avatarUrl` | String | No | Image URL |
| `isDeleted` | Boolean | Yes | Soft-delete flag (default: `false`) |
| `createdAt` | ISO8601 | Yes | Creation timestamp |

---

## 2. Event Entity (`events`)

| Field | Type | Required | Constraints / Notes |
| :--- | :--- | :--- | :--- |
| `id` | String | Yes | Unique ID (e.g. `evt-...`) |
| `title` | String | Yes | Event title |
| `category` | Enum | Yes | `Technology` \| `Cultural` \| `Social Impact` \| `Workshop` |
| `tags` | Array<String> | Yes | Searchable tags |
| `date` | Object | Yes | `{ fullDate, time, month, day }` |
| `venue` | String | Yes | Campus hall / location |
| `area` | String | Yes | Geographic area (e.g. Panchavati, Gangapur Road) |
| `fee` | Number | Yes | Price in INR (0 = Free) |
| `capacity` | Number | Yes | Maximum attendee capacity |
| `registeredCount` | Number | Yes | Live registered attendee counter |
| `organizerId` | String | Yes | Foreign Key &rarr; `users.id` |
| `status` | Enum | Yes | `Published` \| `Draft` \| `Cancelled` \| `PendingApproval` |
| `isDeleted` | Boolean | Yes | Soft-delete flag (default: `false`) |
| `createdAt` | ISO8601 | Yes | Creation timestamp |

---

## 3. Pass / Ticket Entity (`passes`)

| Field | Type | Required | Constraints / Notes |
| :--- | :--- | :--- | :--- |
| `ticketId` | String | Yes | Primary Key / Scannable ID (e.g. `YC-2026-TK-8492`) |
| `eventId` | String | Yes | Foreign Key &rarr; `events.id` |
| `userId` | String | Yes | Foreign Key &rarr; `users.id` (Student) |
| `eventTitle` | String | Yes | Denormalized for fast offline ticket rendering |
| `attendeeName` | String | Yes | Student full name |
| `studentEmail` | String | Yes | Academic email |
| `venue` | String | Yes | Event venue |
| `status` | Enum | Yes | `Valid` \| `Redeemed` \| `Cancelled` |
| `qrSignature` | String | Yes | Cryptographic HMAC-SHA256 signature |
| `amountPaid` | Number | Yes | Financial reconciliation (INR) |
| `issuedAt` | ISO8601 | Yes | Timestamp issued |
| `redeemedAt` | ISO8601 | No | Timestamp scanned at gate |

---

## 4. Broadcast Entity (`broadcasts`)

| Field | Type | Required | Constraints / Notes |
| :--- | :--- | :--- | :--- |
| `id` | String | Yes | Unique broadcast ID |
| `eventId` | String | Yes | Target event ID |
| `senderId` | String | Yes | Organizer user ID |
| `title` | String | Yes | Announcement title |
| `message` | String | Yes | Broadcast text message |
| `createdAt` | ISO8601 | Yes | Dispatch timestamp |

---

## 5. Audit Log Entity (`auditLogs`)

| Field | Type | Required | Constraints / Notes |
| :--- | :--- | :--- | :--- |
| `id` | String | Yes | Sequential audit ID |
| `actorId` | String | Yes | Admin / User initiating the action |
| `action` | String | Yes | e.g. `EVENT_APPROVE`, `CLUB_VERIFY_TOGGLE` |
| `targetId` | String | Yes | Target resource ID |
| `details` | Object | Yes | Snapshot of changed attributes |
| `integrityHash`| String | Yes | SHA-256 integrity hash of previous + current entry |
| `timestamp` | ISO8601 | Yes | Timestamp |
