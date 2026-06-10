# AI Customer Support Dashboard

Internal AI-assisted support dashboard MVP built with `Next.js`, `Tailwind`, `Prisma`, `PostgreSQL`, and the `OpenAI API`.

The app is designed for small support teams to:

- manage conversations across a shared workspace
- maintain a knowledge base and canned responses
- generate grounded AI draft replies
- review drafts before use
- track operational and AI usage metrics

## Status

This repository currently contains:

- a working `Next.js` dashboard app
- role-aware demo login and workspace flows
- dashboard, conversations, knowledge base, canned responses, and settings screens
- AI draft generation flow with knowledge grounding and approval outcomes
- a Prisma schema and seed script for the intended PostgreSQL data model
- a committed initial Prisma SQL migration
- Docker scaffolding

Important current implementation note:

- When `DATABASE_URL` is configured, the app now reads and writes through Prisma-backed persistence.
- When `DATABASE_URL` is not configured, the app falls back to seeded demo data in [`src/lib/demo-data.ts`](/home/kdawg/AI/AI_Customer_Support_Dashboard/src/lib/demo-data.ts).

## Tech Stack

- `Next.js 15`
- `React 19`
- `Tailwind CSS`
- `Prisma`
- `PostgreSQL`
- `OpenAI API`
- `Vitest`
- `Docker`

## Requirements

- `Node.js 22+`
- `pnpm 10+`
- optional: `PostgreSQL 16+`
- optional: `Docker` and `docker compose`

## Environment Variables

Copy `.env.example` to `.env.local` or `.env`:

```bash
cp .env.example .env.local
```

Variables:

- `DATABASE_URL`
  Used by Prisma when generating, pushing, or migrating the PostgreSQL schema.
- `OPENAI_API_KEY`
  Optional for local demo use. If omitted, the app falls back to a local draft-generation path.
- `SESSION_SECRET`
  Reserved for future session hardening. The current demo session flow is cookie-based and lightweight.
- `DB_PORT`
  Optional Docker-only host port override for PostgreSQL when `5432` is already in use locally.

## Install

```bash
pnpm install
```

## Run Locally

Start the development server:

```bash
pnpm dev
```

Open:

- [http://localhost:3000/login](http://localhost:3000/login)

## Demo Accounts

The seeded app includes these demo users:

- Admin: `ava@stackbeacon.test`
- Support Agent: `sam@stackbeacon.test`
- Viewer: `vera@stackbeacon.test`

Password for all demo accounts:

- `demo1234`

## Available Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm test
pnpm db:generate
pnpm db:push
pnpm db:migrate
pnpm db:seed
```

What they do:

- `pnpm dev`
  Starts the Next.js development server.
- `pnpm build`
  Builds the app for production.
- `pnpm start`
  Runs the production build.
- `pnpm test`
  Runs the Vitest test suite.
- `pnpm db:generate`
  Generates the Prisma client.
- `pnpm db:push`
  Pushes the Prisma schema to a configured database.
- `pnpm db:migrate`
  Runs a Prisma development migration.
- `pnpm db:seed`
  Seeds the PostgreSQL database using the Prisma seed script.

## Database Notes

The intended relational model includes:

- users
- organisations
- organisation members
- conversations
- messages
- internal notes
- knowledge base articles
- canned responses
- AI reply generations
- organisation settings
- usage events

Prisma files:

- Schema: [`prisma/schema.prisma`](/home/kdawg/AI/AI_Customer_Support_Dashboard/prisma/schema.prisma)
- Migration: [`prisma/migrations/0001_init/migration.sql`](/home/kdawg/AI/AI_Customer_Support_Dashboard/prisma/migrations/0001_init/migration.sql)
- Seed: [`prisma/seed.ts`](/home/kdawg/AI/AI_Customer_Support_Dashboard/prisma/seed.ts)

If you want to prepare a live local database:

1. Start PostgreSQL.
2. Set `DATABASE_URL`.
3. Run:

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

## Docker

Build and run the app with PostgreSQL:

```bash
docker compose up --build
```

Expected services:

- app on `http://localhost:3000`
- postgres on `localhost:${DB_PORT:-5432}`

If local port `5432` is already in use, run Docker with a different host port:

```bash
DB_PORT=5433 docker compose up --build
```

## Runbook

Operational setup and database lifecycle steps are documented in:

- [docs/runbook.md](/home/kdawg/AI/AI_Customer_Support_Dashboard/docs/runbook.md)

## MVP Features

- Organisation-scoped login and registration
- Roles: `Admin`, `Support Agent`, `Viewer`
- Dashboard overview metrics
- Conversation list with status filtering
- Assignment, draft editing, notes, and resolution flow
- Knowledge base CRUD
- Canned response CRUD and usage counting
- AI draft generation with:
  - approved knowledge grounding
  - source visibility
  - confidence label
  - knowledge-gap warning
  - approval outcome tracking
- Settings for company support preferences and AI usage limits
- Light and dark mode
- Shared theme tokens and semantic status colors

## Validation

The current implementation has been validated with:

```bash
pnpm test
pnpm exec prisma generate
pnpm build
```

## Project Structure

```text
src/app                 App routes, layouts, and server actions
src/components          Dashboard UI components
src/lib                 Demo store, metrics, auth, AI, guards, utilities
prisma                  Database schema and seed script
openspec                Proposal, design, specs, and tasks
```

## Known Limitations

- Persistence depends on `DATABASE_URL`. Without it, the app falls back to the seeded in-memory demo store.
- Authentication is suitable for MVP/demo use and is not production hardened.
- Live outbound customer messaging is not implemented.
- External inbox integrations are not included in V1.
- The OpenAI integration supports a fallback mode when no API key is configured.
