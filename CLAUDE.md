# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development (all apps):**
```bash
pnpm dev          # Start all apps (web on :5173, api on :3001)
pnpm build        # Build all packages/apps in dependency order
pnpm lint         # Lint all packages
```

**API only:**
```bash
cd apps/api
pnpm dev          # tsx watch src/index.ts on PORT=3001
pnpm db:push      # Apply schema changes to SQLite DB (runs drizzle-kit push)
```

**Web only:**
```bash
cd apps/web
pnpm dev          # Vite dev server on :5173
pnpm build        # Type-check + Vite build
```

## Architecture

This is a **Turbo + pnpm monorepo** with three packages:

- `apps/api` — Hono HTTP server exposing an ORPC endpoint at `/rpc`
- `apps/web` — React 19 + React Router 7 SPA, calls the API via ORPC client
- `packages/shared` — **the contract layer**: exports the ORPC contract and Zod schemas used by both apps

### Type-safe RPC via ORPC

The key architectural pattern is a shared contract that keeps API and client in sync:

1. **`packages/shared/src/todo-contract.ts`** — defines procedures (input/output schemas via Zod) without any implementation
2. **`apps/api/src/orpc/router.ts`** — implements the contract; handlers live in `src/orpc/todos/`
3. **`apps/web/src/api/orpc.ts`** — creates a typed client from the same contract; components call `orpc.todos.list({})` etc.

Adding a new procedure: define it in the shared contract first, implement it in the API router, then call it from the web client — TypeScript enforces consistency.

### Database

SQLite via Drizzle ORM. The DB file is created at `apps/api/data/local.db` on first run. Schema is in `apps/api/src/db/schema.ts`. After changing the schema run `pnpm db:push` from `apps/api`.

### Build order

`turbo.json` ensures `packages/shared` is built before either app starts, since both import from it. Always run `pnpm build` from the root after changing shared types.
