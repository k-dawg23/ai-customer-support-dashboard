# Runbook

This runbook covers the practical setup and database lifecycle for the current MVP.

## 1. Local App Only

Use this when you only need the UI and demo data.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open:

- [http://localhost:3000/login](http://localhost:3000/login)

Demo users:

- `ava@stackbeacon.test`
- `sam@stackbeacon.test`
- `vera@stackbeacon.test`

Password:

- `demo1234`

## 2. Local PostgreSQL Workflow

Use this when you want to validate the Prisma schema and seed path against a live database.

### 2.1 Start PostgreSQL

You can use either your own local Postgres instance or Docker.

Expected connection string:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/support_dashboard"
```

If local port `5432` is already busy, use a different host port with Docker and update `DATABASE_URL` to match:

```bash
DB_PORT=5433 docker compose up -d db
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/support_dashboard"
```

### 2.2 Prepare environment

```bash
cp .env.example .env.local
```

Update `DATABASE_URL` if your database differs.

### 2.3 Generate Prisma client

```bash
pnpm db:generate
```

### 2.4 Apply schema

Preferred when using committed migrations:

```bash
pnpm db:migrate --name init
```

Fast path if you only need the schema applied without creating a new migration:

```bash
pnpm db:push
```

Note:

- `prisma/migrations/0001_init/migration.sql` is the committed baseline migration for this repo.

### 2.5 Seed data

```bash
pnpm db:seed
```

This creates:

- one demo organisation
- admin, agent, and viewer demo users
- seeded conversations
- seeded KB articles
- seeded canned responses
- one AI generation record
- usage history

### 2.6 Verify database state

Check that the Prisma client can connect and the seed path completed successfully.

Suggested spot checks:

```sql
select count(*) from "Organisation";
select count(*) from "User";
select count(*) from "Conversation";
select count(*) from "KnowledgeBaseArticle";
select count(*) from "CannedResponse";
select count(*) from "AiReplyGeneration";
```

Expected seeded minimums:

- `Organisation`: 1
- `User`: 3
- `Conversation`: 1 or more
- `KnowledgeBaseArticle`: 3
- `CannedResponse`: 2
- `AiReplyGeneration`: 1

## 3. Docker Workflow

Start app and database together:

```bash
docker compose up --build
```

Services:

- app: `http://localhost:3000`
- postgres: `localhost:5432`

If `5432` is unavailable:

```bash
DB_PORT=5433 docker compose up --build
```

Then use:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/support_dashboard"
```

If you want to apply schema and seed after the database starts:

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

## 4. Reset Workflow

If you want a clean database:

1. drop and recreate the target database, or
2. use Prisma reset in a disposable local environment

Example:

```bash
pnpm exec prisma migrate reset --force
```

Then reseed:

```bash
pnpm db:seed
```

## 5. Current Architecture Boundary

The runtime store now supports both modes through [`src/lib/store.ts`](/home/kdawg/AI/AI_Customer_Support_Dashboard/src/lib/store.ts):

- with `DATABASE_URL`, reads and writes are persisted through Prisma
- without `DATABASE_URL`, the app falls back to [`src/lib/demo-data.ts`](/home/kdawg/AI/AI_Customer_Support_Dashboard/src/lib/demo-data.ts) for a seeded demo workspace

That means:

- dashboard changes are durable across restarts when Postgres is configured
- local UI-only demos still work without a database
