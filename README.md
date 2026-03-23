# monorepo-test

A full-stack todo app built as a type-safe TypeScript monorepo. The API and web client share a contract layer so procedure signatures and data shapes are enforced across both ends at compile time.

## Tech

- **Turborepo + pnpm** — monorepo tooling and task orchestration
- **Hono** — lightweight HTTP server (API)
- **ORPC** — type-safe RPC with a shared contract between server and client
- **Zod** — runtime schema validation
- **Drizzle ORM + SQLite** — database access and migrations
- **React 19 + React Router 7** — frontend SPA
- **Vite** — frontend build tool

## Prerequisites

- Node.js 18+
- pnpm 9+

## Setup

```bash
pnpm install
pnpm build
```

## Running

```bash
pnpm dev
```

- Web: http://localhost:5173
- API: http://localhost:3001
