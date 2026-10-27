# HR Analytics for Employee Performance Dashboard

A full-stack HR analytics dashboard for exploring employee, performance review, attendance, task, and report data. The application uses a React/Vite frontend, an Express API, and MySQL.

## Features

- Employee directory with employee profile details
- Organization overview and employee reports
- Performance review, attendance, and task records
- User registration and login
- CSV-backed sample data for employees, reviews, attendance, and tasks
- Dashboard charts and metric summaries

## Tech stack

- **Frontend:** React 19, Vite, React Router, Tailwind CSS, Recharts, Axios
- **Backend:** Node.js, Express 5, MySQL (`mysql2`), JWT
- **Sample data:** CSV files in `synthetic_hr_dataset/`

## Sample dataset

The repository includes synthetic sample data. Record counts below exclude each CSV's header row.

| File | Records | Description |
| --- | ---: | --- |
| `employees.csv` | 1,000 | Employee and department details |
| `performance_reviews.csv` | 6,000 | Six half-yearly reviews per employee, covering 2023-H1 through 2025-H2 |
| `attendance_monthly.csv` | 12,000 | Twelve monthly attendance records per employee for 2025 |
| `tasks.csv` | 10,000 | Ten task assignments per employee |

All records are fictional and intended for development and demonstration, not real employment decisions.

## Prerequisites

- Node.js and npm
- MySQL Server

## Setup

### 1. Create the database

Create the database configured for the backend. The provided schema uses `Hr_Analytics`:

```sql
CREATE DATABASE IF NOT EXISTS Hr_Analytics;
```

### 2. Configure the backend

In `Backend/`, create a `.env` file with your local MySQL credentials and a private JWT signing key:

```dotenv
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=Hr_Analytics
SECRET_KEY=replace_with_a_private_random_value
PORT=5000
```

The frontend currently sends API requests to `http://localhost:5000/api`, so configure the backend to listen on port `5000` unless you also update the frontend API base URL.

### 3. Install dependencies

Run these commands from the repository root:

```sh
cd Backend
npm install
cd ../Frontend
npm install
```

### 4. Initialize and seed the database

From `Backend/`, run:

```sh
node src/database/seed.js
```

The seed script creates the dashboard tables and loads available CSV data from `synthetic_hr_dataset/`. The database must already exist and be accessible using the backend `.env` settings.

### 5. Start the application

In one terminal, start the API from `Backend/`:

```sh
npm run dev
```

In another terminal, start the frontend from `Frontend/`:

```sh
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## API overview

The API is mounted under `/api` and includes:

| Area | Base path |
| --- | --- |
| Authentication | `/api/auth` |
| Employees | `/api/employees` |
| Performance reviews | `/api/performance-reviews` |
| Attendance | `/api/attendance` |
| Tasks | `/api/tasks` |
| Reports | `/api/reports` |
| Leave | `/api/leave` |
| Annual summaries | `/api/annual-summary` |
| Performance | `/api/performance` |
| Training | `/api/training` |
| Exits | `/api/exits` |
| KPIs | `/api/kpi` |

## Project structure

```text
Backend/                 Express API, database connection, routes, and controllers
Frontend/                React/Vite application
synthetic_hr_dataset/    Database schema and sample CSV data
```

## Available frontend scripts

Run these from `Frontend/`:

```sh
npm run dev      # Start the Vite development server
npm run build    # Create a production build
npm run preview  # Preview the production build
npm run lint     # Run ESLint
```

---

## 🚀 Production Deployment Guide

The application is structured for flexibility: deploy Frontend and Backend together as a unified service, deploy them separately to cloud platforms, or deploy with Docker.

### Option 1: Docker (Fastest, zero-config full stack)

Launch MySQL 8.0 and the production HR Pulse service with a single command:

```sh
docker compose up -d --build
```

- Access the application at `http://localhost:5000`
- MySQL initializes automatically from `Backend/src/database/schema.sql`

---

### Option 2: Unified Monorepo (Render, Railway, or AWS / VPS)

The Backend automatically serves the compiled Frontend bundle from `Frontend/dist` in production:

1. **Build command:** `npm run build` (runs `npm run build --prefix Frontend`)
2. **Start command:** `npm start` (runs `npm start --prefix Backend`)
3. **Environment variables on host:**
   - `PORT=5000` (or host-assigned)
   - `NODE_ENV=production`
   - `DATABASE_URL` (or `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL=true`)
   - `SECRET_KEY=your_jwt_secret`

---

### Option 3: Separate Frontend & Backend

#### Backend (Render / Railway / Fly.io / AWS)
1. Point root directory to `Backend/`
2. **Build command:** `npm install`
3. **Start command:** `npm start`
4. **Environment variables:**
   - `PORT=5000`
   - `DATABASE_URL` or individual `DB_*` vars
   - `SECRET_KEY=your_jwt_secret`
   - `CLIENT_URL=https://your-frontend-domain.vercel.app`

#### Frontend (Vercel / Netlify)
1. Point root directory to `Frontend/`
2. Framework: **Vite**
3. **Build command:** `npm run build`
4. **Output directory:** `dist`
5. **Environment variables:**
   - `VITE_API_BASE_URL=https://your-backend-domain.onrender.com/api`
   - `VITE_AUTH_BASE_URL=https://your-backend-domain.onrender.com/api/auth`
6. Vercel SPA routing is pre-configured via `vercel.json`; Netlify routing is pre-configured via `public/_redirects`.

