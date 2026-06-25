# TaskFlow Backend

This is the backend API for the TaskFlow application.

## Requirements

- Node.js 20+
- PostgreSQL

## Setup

1. Copy `.env.example` to `.env` and set your database and JWT values.
2. Install dependencies:
   npm install
3. Start in development mode:
   npm run dev
4. Build for production:
   npm run build
   npm start

## Scripts

- `npm run dev` — start development server with `nodemon`
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run compiled production server

## Project structure

- `src/` — TypeScript source files
- `src/app.ts` — Express application entrypoint
- `src/routes/` — route definitions
- `src/controllers/` — request handlers
- `src/models/` — Sequelize models and database setup
- `src/config/` — database configuration

## Notes

- Authentication routes are available under `/api/auth`
- The app connects to PostgreSQL via `DATABASE_URL` or dedicated DB config in `.env`
