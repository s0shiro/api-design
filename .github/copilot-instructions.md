# Copilot Instructions - Habit Tracker API

## Architecture Overview

This is an **Express 5 + Drizzle ORM + PostgreSQL** REST API for habit tracking, using Node.js 24+ with native TypeScript (`.ts` imports throughout).

**Layer structure:**

```
src/index.ts          → Entry point (starts server)
src/server.ts         → Express app setup with middleware
src/routes/           → Route definitions with Zod validation
src/controllers/      → Request handlers (business logic)
src/services/         → Reusable data access functions
src/db/schema.ts      → Drizzle schema + relations + Zod schemas
src/middleware/       → Auth, validation, error handling
```

## Key Patterns

### Database & Schema

- **Drizzle ORM** with PostgreSQL driver (`pg`). Schema in `src/db/schema.ts`.
- Use `drizzle-zod` to generate Zod schemas from tables: `createInsertSchema(users)`.
- Relations are defined separately using `relations()` for type-safe joins.
- UUIDs for all primary keys (`uuid().defaultRandom()`).
- Always use transactions for multi-table operations (see `habitController.ts`).

### Validation Pattern

Validation is middleware-based using Zod:

```typescript
// Define schema in route file
const createHabitSchema = z.object({ name: z.string(), ... })
// Apply as middleware
router.post('/', validateBody(createHabitSchema), createHabit)
```

Use `validateBody()`, `validateParams()`, or `validateQuery()` from `src/middleware/validation.ts`.

### Authentication

- JWT-based auth using `jose` library (not jsonwebtoken).
- Protected routes use `authenticateToken` middleware.
- Access user in controllers via `req.user` (typed as `AuthenticatedRequest`).
- Token contains: `{ id, email, username }`.

### Error Handling

- Use `APIError` class from `src/middleware/errorHandler.ts` for custom errors.
- Global error handler adds stack traces in dev mode only.

## Environment Configuration

**Critical:** Uses `custom-env` for stage-based loading (`APP_STAGE=dev|test|production`).

- `.env` → development
- `.env.test` → testing

Required env vars (validated with Zod in `env.ts`):

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Min 32 chars
- `GEMINI_API_KEY` - For AI features

## Developer Commands

```bash
npm run dev          # Node --watch mode (no nodemon needed)
npm run test         # Runs with APP_STAGE=test
npm run db:generate  # Generate migration from schema changes
npm run db:push      # Push schema directly (dev only)
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
```

## Testing

- **Vitest** with `supertest` for integration tests.
- Tests run sequentially (`maxConcurrency: 1`) to avoid DB conflicts.
- Global setup drops/recreates tables using `drizzle-kit push`.
- Use helpers from `src/tests/setup/dbHelper.ts`:
  ```typescript
  const { token, user } = await createTestUser()
  await createTestHabit(user.id, { name: 'Exercise' })
  await cleanUpDatabase() // Call in afterEach
  ```

## Code Style

- Native ESM with `.ts` extensions in imports: `import db from '../db/connection.ts'`
- Type imports use `type` keyword: `import type { Request } from 'express'`
- Controllers are async functions, not classes.
- Use `db.query.tableName.findMany()` for reads with relations.
- Use `db.insert/update/delete().returning()` for writes.
