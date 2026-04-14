# Salute di Ferro — Athlete Health Dashboard

Athlete-facing health dashboard MVP. Track metrics, log meals, upload medical reports, and manage appointments.

## Tech Stack

| Layer    | Tech                                   |
|----------|----------------------------------------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| Backend  | Express 5 + TypeScript                 |
| Database | PostgreSQL + Prisma ORM                |
| Auth     | JWT (httpOnly cookies)                 |
| Uploads  | Local filesystem (multer)              |

## Prerequisites

- **Node.js** 18+
- **PostgreSQL** running locally on port 5432

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url> && cd gym_dashboard

# Install both client and server
cd server && npm install && cd ../client && npm install && cd ..
```

### 2. Configure the database

Create the PostgreSQL database and set up the environment:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/salutediferro"
JWT_SECRET="pick-a-random-secret-string"
```

**Default value** (works if PostgreSQL uses user `postgres` with password `postgres`):

```
postgresql://postgres:postgres@localhost:5432/salutediferro
```

### 3. Push the database schema

```bash
cd server
npx prisma db push
```

This creates the `salutediferro` database (if it doesn't exist) and all tables.

### 4. Run the app

Open two terminals:

```bash
# Terminal 1 — Backend (port 3001)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

## Project Structure

```
gym_dashboard/
├── client/                  # React frontend
│   ├── src/
│   │   ├── api.ts           # API client (fetch wrapper)
│   │   ├── store.tsx         # Auth context + provider
│   │   ├── components/
│   │   │   ├── ui.tsx        # Shared UI components (Card, Btn, Inp, etc.)
│   │   │   └── DashLayout.tsx # Sidebar + main layout
│   │   ├── data/
│   │   │   ├── constants.ts  # Metric categories, GDPR items, meal names
│   │   │   └── foods.ts      # 55-item Italian food database (CREA/USDA)
│   │   └── pages/
│   │       ├── Login.tsx
│   │       ├── Register.tsx    # 2-step wizard with GDPR consent
│   │       ├── Dashboard.tsx   # Page router (sidebar nav)
│   │       ├── Home.tsx        # KPI cards dashboard
│   │       ├── SelfMetrics.tsx # 6 categories, 31 fields, BMI auto-calc
│   │       ├── FoodDiary.tsx   # 5 meals, food search, custom foods, macros
│   │       ├── MedicalReports.tsx # GDPR consent gate + upload
│   │       ├── Appointments.tsx   # CRUD
│   │       ├── Profile.tsx     # Edit name, phone, CF
│   │       ├── Privacy.tsx     # GDPR rights + consent toggles
│   │       └── Placeholders.tsx # Biomarcatori, Nutrizione, Allenamento, Supplementi
│   └── vite.config.ts        # Proxy /api → localhost:3001
│
├── server/                  # Express backend
│   ├── prisma/
│   │   └── schema.prisma    # Database schema (7 models)
│   ├── src/
│   │   ├── index.ts         # Express app entry
│   │   ├── middleware/
│   │   │   └── auth.ts      # JWT verify + sign
│   │   └── routes/
│   │       ├── auth.ts       # POST /register, /login, /logout, GET /me
│   │       ├── metrics.ts    # GET + POST /metrics
│   │       ├── food.ts       # GET/PUT /food/day/:date, custom foods
│   │       ├── reports.ts    # GET + POST (multipart) /reports
│   │       ├── appointments.ts # Full CRUD /appointments
│   │       └── profile.ts    # PUT /profile
│   ├── uploads/             # Medical report files stored here
│   ├── .env                 # Local config (not committed)
│   └── .env.example         # Template
│
└── sdf_dashboard.tsx        # Original prototype (reference only)
```

## Database Schema

| Table          | Purpose                                      |
|----------------|----------------------------------------------|
| User           | Athletes (email, password hash, name, phone, optional Codice Fiscale) |
| Consent        | GDPR consent records per user                |
| SelfMetric     | Health metrics (6 categories, 31 fields)     |
| FoodDay        | Daily meal log (5 meals with foods + macros) |
| CustomFood     | User-created food items                      |
| MedicalReport  | Uploaded reports with file references        |
| Appointment    | Self-created appointments                    |

## API Endpoints

| Method | Path                    | Auth | Description            |
|--------|-------------------------|------|------------------------|
| POST   | /api/auth/register      | No   | Create account         |
| POST   | /api/auth/login         | No   | Login, returns JWT     |
| POST   | /api/auth/logout        | No   | Clear cookie           |
| GET    | /api/auth/me            | Yes  | Current user           |
| PUT    | /api/profile            | Yes  | Update profile         |
| GET    | /api/metrics            | Yes  | List all metrics       |
| POST   | /api/metrics            | Yes  | Add metric entry       |
| GET    | /api/food/day/:date     | Yes  | Get meals for date     |
| PUT    | /api/food/day/:date     | Yes  | Save meals for date    |
| GET    | /api/food/custom-foods  | Yes  | List custom foods      |
| POST   | /api/food/custom-foods  | Yes  | Create custom food     |
| GET    | /api/reports            | Yes  | List reports           |
| POST   | /api/reports            | Yes  | Upload report (multipart) |
| GET    | /api/appointments       | Yes  | List appointments      |
| POST   | /api/appointments       | Yes  | Create appointment     |
| PUT    | /api/appointments/:id   | Yes  | Update appointment     |
| DELETE | /api/appointments/:id   | Yes  | Delete appointment     |

## Scripts

```bash
# Server
npm run dev          # Start with hot reload (tsx watch)
npm run db:push      # Sync Prisma schema to DB
npm run db:studio    # Open Prisma Studio (DB browser)
npm run generate     # Regenerate Prisma client (plain npx prisma generate)
npm run db:generate  # Windows-friendly: stops this repo’s server Node processes, then prisma generate (fixes EPERM)

# Client
npm run dev          # Vite dev server (port 5173)
npm run build        # Production build
npm run preview      # Preview production build
```

### Prisma `EPERM` on Windows (`query_engine-windows.dll.node`)

The dev server loads the Prisma engine; `npx prisma generate` then cannot replace the DLL. **Use:**

```bash
cd server
npm run db:generate
```

That stops Node processes tied to `gym_dashboard\server`, waits 2s, then runs `prisma generate`. Restart `npm run dev` afterward. Alternatively, stop the server manually (Ctrl+C), then run `npm run generate`.

## Environment Variables

### server/.env

| Variable     | Required | Default                                              | Description           |
|-------------|----------|------------------------------------------------------|-----------------------|
| DATABASE_URL | Yes      | postgresql://postgres:postgres@localhost:5432/salutediferro | PostgreSQL connection |
| JWT_SECRET   | Yes      | sdf-mvp-dev-secret                                   | JWT signing key       |
| PORT         | No       | 3001                                                 | Server port           |
