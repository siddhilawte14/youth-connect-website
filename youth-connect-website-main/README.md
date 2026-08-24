# Youth Connect

Hyper-local student event discovery and community platform for Nashik colleges.

```
youth-connect/
├── backend/       Express.js REST API (Node 18+, in-memory store)
├── frontend/      Vite + React + TypeScript SPA
├── docs/          Architecture, API contract, business rules, memory
└── package.json   Root scripts to run both services
```

---

## Quick Start

### 1. Install dependencies

```bash
# From the project root — installs both backend and frontend
npm run install:all
```

Or install separately:

```bash
cd backend && npm install
cd frontend && npm install
```

### 2. Configure environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env — set JWT_SECRET and QR_HMAC_SECRET to strong random strings

# Frontend (optional — dev proxy handles /api automatically)
cp frontend/.env.example frontend/.env
```

### 3. Run in development

Open **two terminals**:

```bash
# Terminal 1 — backend (http://localhost:5000)
cd backend
npm run dev

# Terminal 2 — frontend (http://localhost:3000)
cd frontend
npm run dev
```

The Vite dev server proxies all `/api/*` requests to `http://localhost:5000` automatically.

---

## Seed Credentials

| Role      | Email / PRN                          | Password      |
|-----------|--------------------------------------|---------------|
| Student   | `21bce045@kkwieer.edu.in` or `21BCE045` | `password123` |
| Organizer | `organizers@techsprint2026.org`      | `password123` |
| Admin     | `admin@youthconnect.in`              | `admin123`    |

---

## Backend

```
backend/
├── src/
│   ├── config/        env, database (in-memory store + seed), logger
│   ├── constants/     roles, event categories, scan statuses
│   ├── controllers/   auth, event, pass, gate, broadcast, community, admin
│   ├── middlewares/   auth, role, validation, rate limiter, error handler
│   ├── repositories/  user, event, pass, broadcast, community, auditLog
│   ├── routes/        all route definitions
│   ├── services/      business logic layer
│   ├── utils/         jwt, password, qrCrypto, response
│   ├── app.js         Express app setup
│   └── server.js      Entry point
└── tests/
    └── runAllTests.js  11-test automated suite
```

**Start:** `cd backend && npm start`  
**Dev (watch):** `cd backend && npm run dev`  
**Test:** `cd backend && node --env-file=.env.test tests/runAllTests.js`

### Key API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/login/student` | — | Student login (email or PRN) |
| POST | `/api/v1/auth/login/organizer` | — | Organizer login |
| POST | `/api/v1/auth/register` | — | Register new account |
| GET | `/api/v1/auth/profile` | Bearer | Current user profile |
| GET | `/api/v1/events` | Optional | List / filter events |
| POST | `/api/v1/events` | organizer/admin | Create event |
| PUT | `/api/v1/events/:id` | organizer/admin | Update event |
| DELETE | `/api/v1/events/:id` | organizer/admin | Soft-delete event |
| POST | `/api/v1/passes/register` | student | Register & get digital pass |
| GET | `/api/v1/passes/mine` | Bearer | My passes |
| POST | `/api/v1/gate/verify` | organizer/admin | Verify QR ticket |
| POST | `/api/v1/gate/redeem` | organizer/admin | Check-in (redeem) ticket |
| POST | `/api/v1/broadcasts` | organizer/admin | Send broadcast to attendees |
| GET | `/api/v1/community/clubs` | — | List clubs |
| GET | `/api/v1/community/updates` | — | Community feed |
| POST | `/api/v1/admin/events/:id/approve` | admin | Approve event |
| POST | `/api/v1/admin/clubs/:id/toggle-verify` | admin | Toggle club badge |
| GET | `/api/v1/admin/audit-logs` | admin | Audit log |
| GET | `/api/v1/admin/stats` | admin | Dashboard stats |

---

## Frontend

```
frontend/
├── src/
│   ├── components/    All UI components
│   ├── context/       AuthContext
│   ├── data/          Mock/seed data (used before backend integration)
│   ├── layouts/       StudentLayout
│   ├── pages/         Page-level components
│   ├── App.tsx        Root app with routing
│   ├── main.tsx       React entry point
│   ├── types.ts       Shared TypeScript types
│   └── index.css      Tailwind + global styles
├── index.html
├── vite.config.ts     Dev server + /api proxy
└── tsconfig.json
```

**Dev:** `cd frontend && npm run dev`  
**Build:** `cd frontend && npm run build`

---

## Data persistence

The backend uses an **in-memory store** that resets on restart. All seed data is re-applied on each boot. This requires no database setup for development. To add persistence, swap the repository implementations in `backend/src/repositories/` for a MongoDB or PostgreSQL adapter — the service layer needs no changes.

---

## Docs

| File | Contents |
|------|----------|
| `docs/MEMORY.md` | Current implementation state — read this first in a new AI session |
| `docs/BUSINESS_RULES.md` | All enforced business rules (BR-001 – BR-015) |
| `docs/SECURITY.md` | Auth, RBAC, rate limiting, QR integrity |
| `docs/ERROR_HANDLING.md` | Error codes and response format |
| `docs/VALIDATION.md` | Field-level validation rules |
| `docs/DECISIONS.md` | Architecture decision log |
| `docs/CHANGELOG.md` | Change history |
| `docs/TODO.md` | Remaining and future work |
