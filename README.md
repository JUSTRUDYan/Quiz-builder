# QuizBuilder

## Run tasks

Prerequisites
- Node.js 18+ and npm
- Nx CLI (optional): `npm i -g nx`
- Install dependencies: `npm install`

Environment
- Set environment variables as needed:
  - Backend: `API_BASE_URL` (server) or `NEXT_PUBLIC_API_BASE_URL` (client)
  - Frontend: uses `/api` by default (adjust proxy or env if needed)

Backend (apps/backend)
- Development (watch + serve):
  - `npx nx serve backend`            # builds and runs with development config
- Production build:
  - `npx nx build backend --configuration=production`
- Optional prune/copy steps (for deployment artifacts):
  - `npx nx run backend:prune`

Frontend (apps/frontend)
- Development:
  - `npx nx run frontend:dev`         # runs `next dev` in apps/frontend
- Production build:
  - `npx nx run frontend:build`       # runs `next build`
- Start production server:
  - `npx nx run frontend:serve-static`  # runs `next start`

Monorepo tips
- View project targets:
  - `npx nx show project backend --web`
  - `npx nx show project frontend --web`
- Watch and rebuild frontend deps:
  - `npx nx run frontend:watch-deps`
