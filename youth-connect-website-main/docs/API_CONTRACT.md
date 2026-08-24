# API CONTRACT SPECIFICATION

All endpoints are served under `/api/v1` and use standard JSON envelopes.

```json
// Success Format
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}

// Error Format
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Human readable error description",
  "errors": [ ... ]
}
```

---

## 1. Authentication (`/api/v1/auth`)

### `POST /api/v1/auth/student/login`
- **Auth:** Public
- **Rate Limit:** 10 req / 15 min
- **Request Body:**
  ```json
  {
    "email": "21bce045@kkwieer.edu.in",
    "password": "password123",
    "prn": "21BCE045" // Optional alternative
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOi...",
      "user": { "id": "...", "name": "...", "email": "...", "role": "student", "college": "..." }
    }
  }
  ```

### `POST /api/v1/auth/organizer/login`
- **Auth:** Public
- **Rate Limit:** 10 req / 15 min
- **Request Body:**
  ```json
  {
    "email": "organizers@techsprint2026.org",
    "password": "password123"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Organizer authentication successful",
    "data": {
      "token": "eyJhbGciOi...",
      "user": { "id": "...", "name": "...", "email": "...", "role": "organizer", "clubName": "..." }
    }
  }
  ```

### `GET /api/v1/auth/me`
- **Auth:** Bearer JWT (Any authenticated user)
- **Response `200 OK`:** Profile object excluding sensitive hashes.

---

## 2. Events (`/api/v1/events`)

### `GET /api/v1/events`
- **Auth:** Public
- **Query Params:** `category`, `search`, `page`, `limit`, `priceRange`, `status`
- **Response `200 OK`:** Array of matching event cards and pagination metadata.

### `GET /api/v1/events/:id`
- **Auth:** Public
- **Response `200 OK`:** Complete event detail including schedule, venue, and perks.

### `POST /api/v1/events`
- **Auth:** Bearer JWT (`organizer`, `admin`)
- **Request Body:**
  ```json
  {
    "title": "HackSprint 2026",
    "category": "Technology",
    "venue": "Campus Auditorium",
    "capacity": 300,
    "fee": 0,
    "date": { "fullDate": "Nov 20, 2026", "time": "10:00 AM" }
  }
  ```
- **Response `201 Created`:** Created event object.

### `PUT /api/v1/events/:id`
- **Auth:** Bearer JWT (`organizer` owner, `admin`)
- **Response `200 OK`:** Updated event.

### `DELETE /api/v1/events/:id`
- **Auth:** Bearer JWT (`organizer` owner, `admin`)
- **Response `200 OK`:** Soft-deleted confirmation.

---

## 3. Digital Passes & Ticketing (`/api/v1/passes`)

### `POST /api/v1/passes`
- **Auth:** Bearer JWT (`student`)
- **Request Body:**
  ```json
  {
    "eventId": "evt-codefest-2024"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "message": "Pass issued successfully",
    "data": {
      "ticketId": "YC-2026-TK-8492",
      "eventId": "evt-codefest-2024",
      "attendeeName": "...",
      "status": "Valid",
      "qrSignature": "9f8a8...",
      "issuedAt": "2026-08-24T..."
    }
  }
  ```

### `GET /api/v1/passes/my`
- **Auth:** Bearer JWT (`student`)
- **Response `200 OK`:** Array of digital passes issued to authenticated student.

---

## 4. Gate Scanner (`/api/v1/gate`)

### `POST /api/v1/gate/scan`
- **Auth:** Bearer JWT (`organizer`, `admin`)
- **Request Body:**
  ```json
  {
    "ticketId": "YC-2026-TK-8492",
    "eventId": "evt-codefest-2024"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Gate check-in complete",
    "data": {
      "status": "VALID", // or "ALREADY_USED" | "WRONG_EVENT" | "TICKET_NOT_FOUND"
      "ticketId": "YC-2026-TK-8492",
      "attendee": { "name": "...", "college": "..." },
      "redeemedAt": "2026-08-24T..."
    }
  }
  ```

---

## 5. Broadcasts (`/api/v1/broadcasts`)

### `POST /api/v1/broadcasts`
- **Auth:** Bearer JWT (`organizer`, `admin`)
- **Request Body:**
  ```json
  {
    "eventId": "evt-codefest-2024",
    "title": "Lab Allotment Announcement",
    "message": "Reporting time moved to 8:30 AM at Gate 1."
  }
  ```
- **Response `201 Created`:** Created broadcast dispatch record.

---

## 6. Community Clubs (`/api/v1/community`)

### `GET /api/v1/community/clubs`
- **Auth:** Public
- **Response `200 OK`:** List of student clubs, verified badges, and member counts.

### `GET /api/v1/community/feed`
- **Auth:** Public
- **Response `200 OK`:** Live community social updates feed.

---

## 7. Admin Console (`/api/v1/admin`)

### `GET /api/v1/admin/dashboard`
- **Auth:** Bearer JWT (`admin`)
- **Response `200 OK`:** Platform metrics, total passes issued, revenue, active events.

### `GET /api/v1/admin/audit-logs`
- **Auth:** Bearer JWT (`admin`)
- **Response `200 OK`:** SHA-256 integrity chained audit logs.
