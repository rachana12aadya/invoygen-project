# invoygen

Invoice generation API. Wordmark is always **invoygen** (lowercase).

This repository currently ships the **backend** (Node.js, Express, MongoDB). The Next.js frontend is planned next.

## Stack

- Backend: Node.js 22 (Active LTS) + Express 4 + TypeScript (strict)
- Database: MongoDB with Mongoose
- Auth: email and password, access JWT + rotating refresh cookie

## Setup

```bash
cd backend
cp .env.example .env
# Fill JWT secrets (64+ chars each) and MongoDB/SMTP values
npm install
npm run dev
```

API base: `http://localhost:5000/api/v1`  
Liveness: `GET /health`  
Readiness: `GET /ready` (requires MongoDB)

### Tests and CI

```bash
cd backend
npm run typecheck
npm test
npm audit --audit-level=high
```

GitHub Actions runs the same commands on pull requests.

### Postman

Import `backend/postman/collection.json` and `backend/postman/environment.json`.

## Product docs

See [invoygenprd.md](invoygenprd.md) and [backend/docs/api](backend/docs/api).
