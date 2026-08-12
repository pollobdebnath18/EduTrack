# EduTrack

Assignment & Submission Management System — a full-stack app for managing courses, assignments, and student submissions.

- **Live Client:** https://edutrack-client-ten.vercel.app
- **Live API:** https://edutrack-server-umber.vercel.app
- **Database:** PostgreSQL (hosted on Neon)

## Tech Stack

### Client — `EduTrack-Client`
- Next.js 16 (App Router, React 19, TypeScript)
- Tailwind CSS v4
- React Icons

### Server — `EduTrack-Server`
- Node.js + Express 5 (TypeScript)
- Prisma ORM 7 (`@prisma/adapter-pg`) + PostgreSQL
- JWT authentication (`jsonwebtoken`) + `bcrypt`
- CORS enabled for all origins

## Features

### Roles
- **Admin** — manage users, courses, subjects, assignments and submissions.
- **Teacher** — create/update/delete assignments, set title/description/deadline/max marks/status, review submissions, grade and give feedback.
- **Student** — view assignments (by subject), see details and deadlines, submit answers, update submissions before the deadline, view status/marks/feedback.

### Pages (Client)
- Home, About, Contact, Sign In, Sign Up, Profile
- Assignments (list) — `/assignments`
- Assignment details — `/assignments/[id]`
- Create assignment — `/assignments/new`

## Project Structure

```
EduTrack/
├── EduTrack-Client/          # Next.js frontend
│   ├── src/
│   │   ├── app/              # Routes (App Router)
│   │   └── lib/              # api.ts (fetch client), auth.js (localStorage auth)
│   └── next.config.mjs
├── EduTrack-Server/          # Express + Prisma backend
│   ├── src/
│   │   ├── routes/           # auth, users, subjects, assignments, submissions
│   │   ├── middlewares/      # authenticate (JWT)
│   │   └── lib/              # prisma client, jwt helpers
│   ├── prisma/
│   │   ├── schema.prisma     # User, Subject, Assignment, Submission
│   │   └── migrations/
│   ├── prisma.config.ts      # Prisma 7 CLI config (migrate/db push adapter)
│   └── vercel.json
└── requirements.txt          # Project brief
```

## Getting Started

### 1. Clone & install

```bash
# Client
cd EduTrack-Client
npm install

# Server
cd ../EduTrack-Server
npm install
```

### 2. Environment variables

Create `.env` in `EduTrack-Server` (see `.env.example`):

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>?sslmode=require
PORT=5000
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

Create `.env.local` in `EduTrack-Client`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Database (Prisma)

```bash
cd EduTrack-Server
npx prisma migrate deploy   # apply existing migrations
npx prisma db push          # or sync schema directly (Prisma 7, via prisma.config.ts)
npx prisma studio           # (optional) browse the data
```

### 4. Run locally

```bash
# Server  -> http://localhost:5000
cd EduTrack-Server
npm run dev

# Client  -> http://localhost:3000
cd EduTrack-Client
npm run dev
```

## API Reference

All routes return JSON. Everything except `/api/auth` requires a header `Authorization: Bearer <token>`.

| Method | Endpoint                | Auth | Description                        |
|--------|-------------------------|------|------------------------------------|
| POST   | `/api/auth/signup`      | No   | Register `{name, email, password}` |
| POST   | `/api/auth/signin`      | No   | Login `{email, password}`          |
| GET    | `/api/users`            | Yes  | List users                         |
| GET    | `/api/users/:id`        | Yes  | Get user                           |
| PATCH  | `/api/users/:id`        | Yes  | Update `{name, email}`             |
| DELETE | `/api/users/:id`        | Yes  | Soft-delete user                   |
| POST   | `/api/subjects`         | Yes  | Create subject                     |
| GET    | `/api/subjects`         | Yes  | List subjects                      |
| GET    | `/api/subjects/:id`     | Yes  | Get subject                        |
| PATCH  | `/api/subjects/:id`     | Yes  | Update subject                     |
| DELETE | `/api/subjects/:id`     | Yes  | Soft-delete subject                |
| POST   | `/api/assignments`      | Yes  | Create assignment                  |
| GET    | `/api/assignments`      | Yes  | List assignments (with subject)    |
| GET    | `/api/assignments/:id`  | Yes  | Get assignment                     |
| PATCH  | `/api/assignments/:id`  | Yes  | Update assignment                  |
| DELETE | `/api/assignments/:id`  | Yes  | Soft-delete assignment             |
| POST   | `/api/submissions`      | Yes  | Submit/update answer               |
| GET    | `/api/submissions`      | Yes  | List own submissions               |
| GET    | `/api/submissions/:id`  | Yes  | Get submission                     |
| PATCH  | `/api/submissions/:id`  | Yes  | Grade `{marks, feedback, status}`  |
| DELETE | `/api/submissions/:id`  | Yes  | Soft-delete submission             |

### Assignment fields
`title`, `description?`, `subjectId`, `startDate?`, `deadline?`, `maxMarks?` (default 100), `status` (`Draft` | `Published` | `Closed`).

### Submission fields
`assignmentId`, `answer?`, `marks?`, `feedback?`, `status` (`Pending` | `Submitted` | `Graded` | `Late`).

## Data Model

- **User** (`id`, `name`, `email` unique, `password` hashed, `role` Admin/Student/Teacher, `isDeleted`)
- **Subject** (`id`, `name`, `description?`) — has many assignments
- **Assignment** (`id`, `title`, `description?`, `subjectId` FK, `startDate?`, `deadline?`, `maxMarks`, `status`) — belongs to a subject, has many submissions
- **Submission** (`id`, `assignmentId` FK, `userId` FK, `answer?`, `marks?`, `feedback?`, `status`) — one per user per assignment (upserted on submit)

## Deployment (Vercel)

### Server
1. Push `EduTrack-Server` to a Vercel project (framework preset: Other).
2. `vercel-build` script runs `prisma generate && tsc`.
3. `vercel.json` routes all requests to `dist/app.js`.
4. Add env vars: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`. Use a hosted Postgres (e.g. Neon) — localhost URLs won't work on Vercel.
5. `.vercelignore` keeps `.env` out of deployments.

### Client
1. Push `EduTrack-Client` to a Vercel project (Next.js preset).
2. Add env var: `NEXT_PUBLIC_API_URL=https://<your-server-domain>/api` (no trailing slash; leave off when testing locally).
3. Deploy — the app reads the token from `localStorage` under `edutrack_auth` and sends it as a `Bearer` header.

### Database (Neon)
1. Create a free project at neon.tech.
2. Use the **Prisma-style** connection string (pooler) and include `sslmode=require`.
3. Apply schema against the cloud DB:
   ```bash
   cd EduTrack-Server
   DATABASE_URL="postgresql://..." npx prisma migrate deploy
   DATABASE_URL="postgresql://..." npx prisma db push
   ```

## Notes
- All deletes are **soft deletes** (`isDeleted` flag) — records are hidden, not removed.
- Auth uses the `edutrack_auth` localStorage key (`{ token, user }`).