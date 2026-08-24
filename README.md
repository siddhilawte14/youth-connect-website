# YouthConnect Campus Hub

Hyperlocal collegiate campus platform for discovering college hackathons, cultural fests, certified NGO volunteering drives, and technical workshops across Nashik and Pune campuses.

---

## 📁 Project Architecture (Separated Frontend & Backend)

```
youth-connect-website/
├── frontend/                  # React Frontend SPA Application
│   ├── src/                   # React Components, Contexts & Layouts
│   ├── index.html             # Frontend Entrypoint
│   ├── package.json           # Frontend Dependencies
│   └── vite.config.ts         # Vite Bundler Configuration
│
├── backend/                   # Node.js Express REST API
│   ├── src/
│   │   ├── config/            # Environment & Database Store
│   │   ├── controllers/       # HTTP Request Handlers
│   │   ├── middlewares/       # JWT Auth, RBAC, Rate Limiting & Validation
│   │   ├── repositories/      # Data Persistence & Query Interfaces
│   │   ├── routes/            # REST API Route Definitions (/api/v1/...)
│   │   ├── services/          # Core Business Logic & HMAC Crypto
│   │   └── utils/             # Cryptographic & Response Helpers
│   ├── tests/                 # Automated Backend Integration Test Suite
│   ├── package.json           # Backend Dependencies
│   ├── .env.example           # Backend Environment Configuration
│   └── .env.test              # Test Environment Configuration
│
├── docs/                      # Architectural & API Contract Documentation
│   ├── API_CONTRACT.md        # Complete REST API Specifications
│   ├── ARCHITECTURE.md        # 3-Tier Layered Architecture
│   ├── DATABASE.md            # Entity Schemas & Relationships
│   ├── BUSINESS_RULES.md      # Enforced Business Logic
│   ├── SECURITY.md            # Security Policies & HMAC Signing
│   └── MEMORY.md              # Project Working Memory
│
├── index.html                 # Standalone Root App (Instant Live GitHub Pages Demo)
├── package.json               # Root Monorepo Orchestration Scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Running the Backend API (`/backend`)
```powershell
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Run automated tests (11/11 passing)
npm test

# Start backend dev server with hot-reload (Port 5000)
npm run dev
```

### 2. Running the Frontend (`/frontend`)
```powershell
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server (Port 3000)
npm run dev
```

### 3. Orchestration from Root Directory
```powershell
# Run backend tests
npm run test:backend

# Start backend server
npm run dev:backend

# Start frontend server
npm run dev:frontend
```

---

## 🔐 Default Demo Credentials

| Role | Email / Identifier | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Student** | `siddhi.lawte@met.edu.in` / `21bce045@kkwieer.edu.in` | `password123` | Student Passport, Digital QR Passes, Social Credits |
| **Organizer** | `organizers@techsprint2026.org` | `password123` | Event Publishing, Gate QR Scanner, Broadcast Dispatch |
| **Admin** | `admin@youthconnect.in` | `admin123` | Verification Badges, Platform Stats, Audit Logs |

---

## 🧪 Testing
The backend includes a comprehensive zero-dependency automated test suite covering:
- Student authentication (Email & PRN)
- Organizer security passkey gate
- Duplicate pass registration prevention
- Event capacity enforcement
- HMAC-SHA256 digital pass verification
- Gate scanner statuses (`VALID`, `ALREADY_USED`, `WRONG_EVENT`, `TICKET_NOT_FOUND`)
- Chained SHA-256 audit logging

Run tests with:
```powershell
npm run test:backend
```
