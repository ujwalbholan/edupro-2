# EduPro

EduPro is a backend-first, multi-tenant education platform built as a NestJS modular monolith. It currently contains the control-plane, identity, invitation, and entitlement foundations.

## Prerequisites

- Node.js 18 or later
- pnpm 8.15.5
- Docker Desktop

## Start locally

```bash
pnpm install
pnpm predev
pnpm db:generate
pnpm db:seed
pnpm dev
```

PostgreSQL is exposed on the port defined by `POSTGRES_PORT` (currently the local stack uses `5436`). Mailpit is available on the port configured by `MAILPIT_UI_PORT`.

## Database workflow

After changing `packages/database/prisma/schema.prisma`:

```bash
pnpm db:migrate --name describe_the_change
pnpm db:generate
pnpm db:seed
```

Use `pnpm db:studio` to inspect local data. `db:seed` is idempotent and only inserts development reference data: permissions, features, plans, and plan-feature grants.

## API baseline

All API routes are versioned under `/v1`.

- `GET /v1/health/live` confirms that the process is running.
- `GET /v1/health/ready` confirms PostgreSQL connectivity.

Every response includes an `x-request-id` header. Validation failures use a consistent JSON response with `code: "VALIDATION_ERROR"` and field-level `errors`.

## Verification

```bash
pnpm build
pnpm test
pnpm test:e2e
pnpm lint
```

## Module boundaries

- `control-pannel`: tenant provisioning and institution configuration.
- `identity-service`: users, roles, permissions, sessions, and invitations.
- `health`: liveness and database-readiness endpoints.
- `packages/database`: Prisma schema, migrations, generated client, and database integration.

The next implementation phase is Control Plane completion: safe tenant provisioning, tenant defaults, domains, and audit logs.
