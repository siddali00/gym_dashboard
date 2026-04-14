# Salute di Ferro — Multi-Role Health Platform

Full-stack health platform with 5 roles: **Cliente** (athlete), **Medico**, **Nutrizionista**, **Fabbro**, and **Coach di Ferro**. Professionals manage clients and enter biomarkers, nutrition plans, workouts, supplements, and metrics. Athletes view their data read-only.

## Tech Stack

| Layer    | Tech                                   |
|----------|----------------------------------------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| Backend  | Express 5 + TypeScript                 |
| Database | PostgreSQL + Prisma ORM                |
| Auth     | JWT (httpOnly cookies) with RBAC       |
| Uploads  | Local filesystem (multer)              |
| i18n     | Custom context provider (IT / EN)      |

## Roles

| Role             | DB value          | Access                                          |
|------------------|-------------------|-------------------------------------------------|
| Cliente          | `cliente`         | Self-metrics, food diary, appointments, reports; read-only views of biomarkers, nutrition, workouts, supplements |
| Medico           | `medico`          | Enter biomarkers, enter reports for linked clients |
| Nutrizionista    | `nutrizionista`   | Enter nutrition plans, supplements for linked clients |
| Fabbro           | `fabbro`          | Enter body metrics for linked clients            |
| Coach di Ferro   | `coach_di_ferro`  | Enter workouts, metrics, supplements for linked clients |

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
├── client/                    # React frontend
│   ├── src/
│   │   ├── api.ts             # API client (fetch wrapper, all endpoints)
│   │   ├── store.tsx           # Auth context + provider
│   │   ├── i18n.tsx            # Internationalization (IT/EN, ~200 key pairs)
│   │   ├── components/
│   │   │   ├── ui.tsx          # Shared UI components (Card, Btn, Inp, Sel, etc.)
│   │   │   ├── DashLayout.tsx  # Sidebar + main layout (role-aware)
│   │   │   ├── ClientSelector.tsx # Reusable client dropdown for pro forms
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── data/
│   │   │   ├── constants.ts    # Metric categories, GDPR items, meal names
│   │   │   └── foods.ts        # 55-item Italian food database (CREA/USDA)
│   │   └── pages/
│   │       ├── Login.tsx
│   │       ├── Register.tsx       # Role-aware: 2-step for athletes, 1-step for pros
│   │       ├── RoleLanding.tsx    # Role selection landing page
│   │       ├── Dashboard.tsx      # Athlete page router (sidebar nav)
│   │       ├── ProfDashboard.tsx  # Professional page router (role-driven nav)
│   │       ├── ProfHome.tsx       # Professional KPI cards + client overview
│   │       ├── ClientListPage.tsx # Link/unlink clients
│   │       ├── Home.tsx           # Athlete KPI cards
│   │       ├── SelfMetrics.tsx    # 6 categories, 31 fields, BMI auto-calc
│   │       ├── FoodDiary.tsx      # 5 meals, food search, custom foods, macros
│   │       ├── MedicalReports.tsx # GDPR consent gate + upload
│   │       ├── Appointments.tsx   # CRUD with edit support
│   │       ├── Profile.tsx        # Edit name, phone, CF
│   │       ├── Privacy.tsx        # GDPR rights + consent toggles
│   │       ├── Placeholders.tsx   # Real data: Biomarkers, Nutrition, Workouts, Supplements
│   │       ├── EntBiomarker.tsx   # Pro form: enter biomarkers for a client
│   │       ├── EntNutrition.tsx   # Pro form: enter nutrition plans
│   │       ├── EntWorkout.tsx     # Pro form: create workout programs
│   │       ├── EntSupplement.tsx  # Pro form: enter supplements
│   │       └── EntMetrics.tsx     # Pro form: enter body metrics
│   └── vite.config.ts          # Proxy /api → localhost:3001
│
├── server/                    # Express backend
│   ├── prisma/
│   │   └── schema.prisma      # Database schema (12 models)
│   ├── src/
│   │   ├── index.ts           # Express app entry (mounts all routes)
│   │   ├── middleware/
│   │   │   └── auth.ts        # JWT verify/sign + requireRole + requireProfessional
│   │   └── routes/
│   │       ├── auth.ts         # POST /register (role-aware), /login, /logout, GET /me
│   │       ├── metrics.ts      # GET + POST /metrics (supports pro clientId)
│   │       ├── food.ts         # GET/PUT /food/day/:date, custom foods
│   │       ├── reports.ts      # GET + POST (multipart) /reports
│   │       ├── appointments.ts # Full CRUD /appointments
│   │       ├── profile.ts      # PUT /profile
│   │       ├── biomarkers.ts   # GET (athlete) + POST (pro) /biomarkers
│   │       ├── nutrition.ts    # GET + POST /nutrition
│   │       ├── workouts.ts     # GET + POST /workouts
│   │       ├── supplements.ts  # GET + POST /supplements
│   │       └── links.ts        # Professional-client link management
│   ├── uploads/               # Medical report files stored here
│   ├── .env                   # Local config (not committed)
│   └── .env.example           # Template
│
└── sdf_dashboard.tsx          # Original prototype (reference only)
```

## Database Schema

| Table          | Purpose                                                    |
|----------------|------------------------------------------------------------|
| User           | All users (athletes + professionals) with role field       |
| Consent        | GDPR consent records per user                              |
| SelfMetric     | Health metrics (6 categories, 31 fields)                   |
| FoodDay        | Daily meal log (5 meals with foods + macros)               |
| CustomFood     | User-created food items                                    |
| MedicalReport  | Uploaded reports with file references                      |
| Appointment    | User appointments                                         |
| Biomarker      | Lab values entered by professionals for athletes           |
| NutritionPlan  | Nutrition plans entered by professionals                   |
| Workout        | Workout programs entered by professionals                  |
| Supplement     | Supplement protocols entered by professionals              |
| ProfLink       | Links a professional to a client (unique per pair)         |

## API Endpoints

### Authentication & Profile

| Method | Path                    | Auth | Description                    |
|--------|-------------------------|------|--------------------------------|
| POST   | /api/auth/register      | No   | Create account (accepts `role`) |
| POST   | /api/auth/login         | No   | Login, returns JWT with role   |
| POST   | /api/auth/logout        | No   | Clear cookie                   |
| GET    | /api/auth/me            | Yes  | Current user (includes role)   |
| PUT    | /api/profile            | Yes  | Update profile                 |

### Athlete Data

| Method | Path                    | Auth | Description                |
|--------|-------------------------|------|----------------------------|
| GET    | /api/metrics            | Yes  | List all metrics           |
| POST   | /api/metrics            | Yes  | Add metric entry           |
| GET    | /api/food/day/:date     | Yes  | Get meals for date         |
| PUT    | /api/food/day/:date     | Yes  | Save meals for date        |
| GET    | /api/food/custom-foods  | Yes  | List custom foods          |
| POST   | /api/food/custom-foods  | Yes  | Create custom food         |
| GET    | /api/reports            | Yes  | List reports               |
| POST   | /api/reports            | Yes  | Upload report (multipart)  |
| GET    | /api/appointments       | Yes  | List appointments          |
| POST   | /api/appointments       | Yes  | Create appointment         |
| PUT    | /api/appointments/:id   | Yes  | Update appointment         |
| DELETE | /api/appointments/:id   | Yes  | Delete appointment         |

### Professional Data Entry (requires linked client)

| Method | Path                    | Auth       | Description                     |
|--------|-------------------------|------------|---------------------------------|
| GET    | /api/biomarkers         | Yes        | Athlete reads own biomarkers    |
| POST   | /api/biomarkers         | Pro only   | Add biomarker for client        |
| GET    | /api/nutrition          | Yes        | Athlete reads own plans         |
| POST   | /api/nutrition          | Pro only   | Add nutrition plan for client   |
| GET    | /api/workouts           | Yes        | Athlete reads own workouts      |
| POST   | /api/workouts           | Pro only   | Add workout for client          |
| GET    | /api/supplements        | Yes        | Athlete reads own supplements   |
| POST   | /api/supplements        | Pro only   | Add supplement for client       |

### Client Link Management

| Method | Path                         | Auth     | Description                  |
|--------|------------------------------|----------|------------------------------|
| GET    | /api/links/my-clients        | Pro only | List linked clients          |
| GET    | /api/links/my-professionals  | Yes      | Athlete sees linked pros     |
| GET    | /api/links/all-clients       | Pro only | List all registered athletes |
| POST   | /api/links                   | Pro only | Link a client                |
| DELETE | /api/links/:clientId         | Pro only | Unlink a client              |

## Scripts

```bash
# Server
npm run dev          # Start with hot reload (tsx watch)
npm run db:push      # Sync Prisma schema to DB
npm run db:studio    # Open Prisma Studio (DB browser)
npm run generate     # Regenerate Prisma client (plain npx prisma generate)
npm run db:generate  # Windows-friendly: stops this repo's server Node processes, then prisma generate (fixes EPERM)

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
