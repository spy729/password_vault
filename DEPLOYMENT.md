Deployment guide (no Docker)

This repository contains two apps:

- backend/ - Node.js + Express + TypeScript API
- frontend/ - Next.js + React + TypeScript frontend

Goal: Deploy the frontend to Vercel (or Netlify) and the backend to Render/Heroku (or any Node host). The apps talk via REST; the frontend reads the backend base URL from NEXT_PUBLIC_API_BASE.

Quick steps (recommended)

1) Backend (Render / Heroku)

- Create a new service (Web Service) on your host (Render or Heroku).
- Set the repo to point to this project and the root to `/backend`.
- Environment variables to set on the host:
  - MONGODB_URI: your MongoDB connection string (use URL encoding for special chars)
  - JWT_SECRET: a strong random secret
  - PORT: optional (default 5000)
  - NODE_ENV: production
  - ALLOWED_ORIGINS: comma-separated origins allowed to access the API in production (e.g. https://your-frontend.vercel.app)

- Build & start commands (Render):
  - Build command: npm install && npm run build
  - Start command: npm start

- On Heroku, the Procfile at `/backend/Procfile` will run `node dist/server.js`. Ensure you add a build step to compile TypeScript before start (Heroku Node buildpack runs `npm run build` if present in package.json's `build` script).

2) Frontend (Vercel)

- Import the `frontend/` folder into Vercel as a new project.
- Set environment variables in Vercel project settings:
  - NEXT_PUBLIC_API_BASE = https://your-backend-host.example.com

- Build command: `npm run build` (Vercel detects Next.js automatically). Deploy.

3) Local testing

- Backend:
  cd backend
  npm install
  npm run build
  npm start

- Frontend:
  cd frontend
  npm install
  NEXT_PUBLIC_API_BASE=http://localhost:5000 npm run dev

Security notes

- The server never stores plaintext passwords if the client follows the current flow: the frontend encrypts passwords client-side before POSTing. The backend now enforces that the `password` field looks like base64 ciphertext and rejects apparent plaintext.
- Do NOT store the master password on the server or in remote logs. LocalStorage currently stores a salt and auth token only.

If you'd like, I can:
- Prepare env templates and example Vercel/Render settings.
- Add GitHub Actions to auto-deploy backend/frontend on pushes.

