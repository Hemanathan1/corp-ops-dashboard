# CorpOps Dashboard

A full-stack internal operations tool built to demonstrate end-to-end
software delivery: frontend, backend, database, auth, containerization,
CI/CD, and an integrated AI feature — the layers a modern corporate
engineering team actually works across.

## Tech stack

| Layer          | Technology                                  |
|----------------|----------------------------------------------|
| Frontend       | Next.js 14, React, TypeScript, Tailwind CSS  |
| Backend / API  | Node.js, Express, TypeScript, Zod validation |
| Database       | PostgreSQL via Prisma ORM                    |
| Caching        | Redis (wired via Docker Compose)             |
| Auth           | JWT-based auth, bcrypt password hashing      |
| AI integration | Anthropic Claude API (task summarization)    |
| DevOps         | Docker, Docker Compose, GitHub Actions CI    |

## Architecture

```
Browser
  │
  ▼
Next.js frontend (port 3000)
  │  REST calls, Bearer JWT
  ▼
Express API (port 4000)
  │             │
  ▼             ▼
PostgreSQL    Anthropic API
(Prisma)      (task summaries)
```

- **Auth flow**: register/login issue a JWT; the frontend stores it and
  attaches it as a Bearer token on every API call; `requireAuth` middleware
  verifies it on protected routes.
- **Data model**: `User` 1—N `Task`, with role-based access (`ADMIN`,
  `MANAGER`, `EMPLOYEE`) modeled for future permission checks.
- **AI feature**: `/api/ai/summarize-tasks` pulls a user's open tasks and
  asks Claude to produce a short prioritized briefing — a realistic
  "AI copilot" feature pattern used across corporate SaaS tools today.

## Running locally

1. Copy `backend/.env.example` to `backend/.env` and fill in `JWT_SECRET`
   and `ANTHROPIC_API_KEY`.
2. From the project root:
   ```bash
   docker compose up --build
   ```
3. Frontend: http://localhost:3000
   Backend health check: http://localhost:4000/health

Or run each side manually without Docker:
```bash
cd backend && npm install && npx prisma migrate dev && npm run dev
cd frontend && npm install && npm run dev
```

## CI/CD

`.github/workflows/ci.yml` builds and type-checks both the frontend and
backend on every push and pull request to `main` — the same pattern used
for real deployment pipelines.

## Project structure

```
corp-ops-dashboard/
├── backend/            Express API, Prisma schema, JWT auth, AI route
├── frontend/            Next.js app (login, dashboard, task management)
├── docker-compose.yml   Postgres + Redis + backend + frontend
├── .github/workflows/   CI pipeline
└── README.md
```

## Using this for your resume

Suggested resume bullet points:

- Built a full-stack corporate operations tool (Next.js, Node/Express,
  PostgreSQL, Prisma) with JWT authentication and role-based access control.
- Integrated the Anthropic Claude API to auto-generate prioritized task
  briefings, reducing manual status-reporting effort.
- Containerized the application with Docker Compose and set up a GitHub
  Actions CI pipeline for automated build verification.

Next steps to make it even stronger:
- Deploy the frontend to Vercel and the backend to Render/Railway/Fly.io,
  and link the live demo on your resume.
- Add automated tests (Jest/Supertest for the API, Playwright for the UI).
- Add a real admin/manager view using the existing `Role` field.
