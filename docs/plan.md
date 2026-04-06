# SaaS Template Roadmap

This repository evolves as `core platform + simple service modules + later domain packages`.

## Architecture Boundaries

### Core platform
- Auth, user/session, shared contracts, DB access, env/config, app shell.
- Not treated as removable modules.

### Service modules
- `email`
- `storage`
- `feature-flags`
- `jobs`

Simple-first rule:
- Start with one service = one file in `apps/api/src/services`.
- Example shape: `email.service.ts`, `storage.service.ts`.
- If a service stays small, keep it in one file.
- Split into more files only after discussion when real complexity appears.
- Avoid extra packages, blueprints, registries, or abstraction layers before they are needed.

### Later domain packages
- `billing`
- `product-analytics`
- `admin`
- `audit-log`
- `notifications`
- `teams/workspaces`

## Removal Rules
- Remove the service file.
- Remove direct imports and wiring.
- Remove routes, settings entries, or UI screens owned by the service.
- Remove service-specific tables or storage artifacts if they exist.

## Code Style Rules
- Use `type`, never `interface`.
- Prefer boring and obvious code over abstractions made “for the future”.
- Introduce extra layers only after concrete need and discussion.
- Config should live in a single `config` file with a nested object, not in scattered env helpers.
- UI should stay minimal: only required form fields, actions, and navigation.
- Avoid decorative sections, marketing copy, gradients, and extra widgets unless explicitly requested.
- Prefer very small border radius.

## Plan Maintenance Rules
- After each completed task, immediately mark it as completed in this roadmap before moving on.

## Wave 1 Backlog

- [x] `0. Roadmap document`
  - Keep this file as the living roadmap and execution queue.
- [x] `1. Simple foundation`
  - Keep config in a single nested `config` object.
  - Keep service architecture simple and local to the app.
  - Do not add framework-like abstractions for service modules.
- [ ] `2. UI foundation`
  - [x] Install `Mantine` packages for `apps/web`.
  - [x] Connect `MantineProvider`, global styles, and a shared theme entry point.
  - [ ] Define the baseline app shell, form primitives, and shared page layout on top of `Mantine`.
- [ ] `3. Page-by-page UI refresh`
  - Update one page per iteration; do not batch all page rewrites into a single change.
  - [x] `3.1 App shell and navigation`
    - Refresh the authenticated layout in `App.tsx`.
    - Move shared navigation and session actions onto `Mantine` components.
  - [x] `3.2 Login page`
    - Rebuild the login form and states with `Mantine`.
    - Keep only email, password, submit action, and sign-up link.
  - [x] `3.3 Signup page`
    - Rebuild the signup form, OAuth CTA, and validation states with `Mantine`.
    - Keep only required fields, sign-up action, Google CTA, and return-to-login link.
  - [ ] `3.4 Todos page`
    - Rebuild list, add form, item actions, loading, and error states with `Mantine`.
  - [ ] `3.5 About page`
    - Refresh the static informational page to match the shared layout and typography.
- [ ] `4. Email module`
  - Add `EmailService`, local/mock provider, env config, and server wiring.
  - Keep it transactional-only in v1.
- [ ] `5. Storage module`
  - Add `StorageService`, local provider, S3-ready adapter boundary, and upload flow.
- [ ] `6. Feature flags module`
  - Add `FeatureFlagService`, local static provider, and a clean resolver flow.
- [ ] `7. Jobs module`
  - Add `JobQueueService`, in-process provider, and a sample async job flow.
- [ ] `8. Hardening pass`
  - Normalize naming and config conventions across all services.
  - Update this document to match the real implementation.

## Review Rules For Each Iteration
- Readability of names and layout.
- Public interface clarity.
- Minimal number of files and moving parts.
- No premature abstractions.
- No hard provider lock-in.
- Dev mode works without external services.
- The service can be removed without repository archaeology.

## Test Expectations
- `pnpm build` stays green.
- Existing tests stay green.
- New code gets focused tests for config and provider selection.
- Local development does not require external credentials for Wave 1 modules.
