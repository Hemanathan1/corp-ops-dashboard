# CorpOps Dashboard

A full-stack internal operations tool: task tracking with authentication,
a PostgreSQL-backed data model, and an AI-generated priority briefing —
built, deployed, and debugged end to end.

**Live app**: https://corp-ops-dashboard.vercel.app
**Backend health check**: https://corp-ops-dashboard.onrender.com/health

## Tech stack

| Layer          | Technology                                  |
|----------------|----------------------------------------------|
| Frontend       | Next.js 14, React, TypeScript, Tailwind CSS  |
| Backend / API  | Node.js, Express, TypeScript, Zod validation |
| Database       | PostgreSQL (Neon) via Prisma ORM             |
| Auth           | JWT-based auth, bcrypt password hashing      |
| AI integration | Google Gemini API (task summarization)       |
| Hosting        | Vercel (frontend), Render (backend, Docker)  |
| DevOps         | Docker, GitHub Actions CI                    |

## Architecture

```
Browser
  │
  ▼
Next.js frontend (Vercel)
  │  REST calls, Bearer JWT
  ▼
Express API (Render, Docker)
  │             │
  ▼             ▼
PostgreSQL    Gemini API
(Prisma/Neon) (task summaries)
```

- **Auth flow**: register/login issue a JWT; the frontend stores it and
  attaches it as a Bearer token on every API call; `requireAuth` middleware
  verifies it on protected routes.
- **Data model**: `User` 1—N `Task`, with role-based access (`ADMIN`,
  `MANAGER`, `EMPLOYEE`) modeled for future permission checks.
- **AI feature**: `/api/ai/summarize-tasks` pulls a user's open tasks and
  asks Gemini to produce a short, prioritized briefing.
- **Design**: a custom "ledger" visual identity (not a default template) —
  warm paper background, Fraunces display type, IBM Plex Mono for data
  labels, task rows styled as ledger entries — with full light/dark mode.

## Running locally

1. Copy `backend/.env.example` to `backend/.env` and fill in `DATABASE_URL`,
   `JWT_SECRET`, and `GEMINI_API_KEY`.
2. Backend:
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npm run dev
   ```
3. Frontend (separate terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Frontend: http://localhost:3000 · Backend health check: http://localhost:4000/health

Or with Docker Compose from the project root:
```bash
docker compose up --build
```

## Debugging notes (real issues hit while building this)

Shipping this end to end surfaced a handful of real-world integration
problems, each fixed along the way:

- **Missing `DATABASE_URL` at runtime** — Prisma failed with
  `Environment variable not found: DATABASE_URL` because the `.env` file
  wasn't loaded before the first request. Fixed by confirming `dotenv.config()`
  runs at the top of `index.ts` and that `.env` (not `.env.example`) exists
  in `backend/`.
- **Missing database tables** — `The table 'public.User' does not exist`
  after connecting to a fresh Neon database. Fixed by running
  `npx prisma migrate dev` before first use.
- **Deprecated AI model** — Google deprecated `gemini-2.0-flash` mid-project;
  the fix was a one-line model name update to `gemini-3.5-flash`.
- **Prisma + Alpine Linux incompatibility** — the Docker build failed at
  runtime with a missing `libssl.so.1.1` shared library. Fixed by installing
  OpenSSL in the Dockerfile (`RUN apk add --no-cache openssl`) and adding
  `binaryTargets = ["native", "linux-musl-openssl-3.0.x"]` to the Prisma
  schema so it builds the right engine for Render's Alpine-based containers.
- **TypeScript strict-mode build failure in production** — `response.json()`
  returns `unknown` under stricter type definitions, which passed locally
  but failed Render's fresh install. Fixed by explicitly typing the parsed
  response.
- **Leaked secrets caught by GitHub push protection** — an API key ended up
  in `.env.example` instead of a placeholder on the first commit. GitHub's
  secret scanning blocked the push; fixed by rotating the exposed credentials
  and amending the commit before it was ever public.

## Project structure

```
corp-ops-dashboard/
├── backend/            Express API, Prisma schema, JWT auth, AI route
├── frontend/           Next.js app (login, register, dashboard)
├── docker-compose.yml  Postgres + Redis + backend + frontend (local dev)
├── .github/workflows/  CI pipeline
└── README.md
```

## Resume bullet points

- Built and deployed a full-stack corporate operations tool (Next.js,
  Node/Express, PostgreSQL, Prisma) with JWT authentication and
  role-based access control.
- Integrated the Google Gemini API to auto-generate prioritized task
  briefings from live task data.
- Diagnosed and resolved production deployment issues spanning
  environment configuration, database migrations, Docker/Alpine Linux
  compatibility, and TypeScript strict-mode type errors.
- Designed a distinct visual identity with full light/dark theming,
  rather than relying on default UI templates.