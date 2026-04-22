# API Documentation Design

**Date:** 2026-04-13  
**Issue:** HCI-Design-Lab/a11y-logger#85  
**Status:** Approved

---

## Summary

Add full API documentation for all 54 REST endpoints in `src/app/api/`. Documentation is generated from annotated Zod validators using `@asteasolutions/zod-to-openapi`, served as an OpenAPI 3.0 JSON spec at `/api/openapi.json`, and rendered interactively via Redoc at `/api-docs`.

**Primary audience:** Contributors (understanding the API to contribute) and integrators (building tools against the API) equally.

---

## Architecture

Three layers:

1. **Annotated validators** — The 7 existing Zod validator files in `src/lib/validators/` are extended with `.openapi()` metadata (title, description, examples) using `@asteasolutions/zod-to-openapi`. These become reusable `#/components/schemas` entries.

2. **Spec builder** (`src/lib/openapi.ts`) — Registers all schemas and defines all 54 route operations (path, method, parameters, request body ref, response ref, auth requirement). Exports a `generateOpenApiDocument()` function.

3. **Spec endpoint + UI** — `src/app/api/openapi.json/route.ts` serves the spec as JSON at request time (no build step, no committed generated file). `src/app/api-docs/page.tsx` renders Redoc.

The spec is generated at request time to avoid build-time complexity and keep the spec always in sync with the code.

---

## Validator Annotations

All 7 validator files are migrated to the `@asteasolutions/zod-to-openapi` pattern:

- `extendZodWithOpenApi(z)` called once per file
- Each schema field gets `.openapi({ example })` where useful
- Each top-level schema gets `.openapi({ title, description })`

**Files to migrate:**
- `src/lib/validators/assessments.ts`
- `src/lib/validators/issues.ts`
- `src/lib/validators/projects.ts`
- `src/lib/validators/reports.ts`
- `src/lib/validators/settings.ts`
- `src/lib/validators/users.ts`
- `src/lib/validators/vpats.ts`

Response shapes (`{ success, data, error, code }`) are defined as shared components directly in `src/lib/openapi.ts`, not in validator files, since they are structural rather than domain schemas.

---

## Route Definitions (`src/lib/openapi.ts`)

All 54 operations are registered with:

- **Tags** for grouping in the UI: `Auth`, `Projects`, `Assessments`, `Issues`, `Reports`, `VPATs`, `Dashboard`, `AI`, `Media`, `Settings`, `Users`
- **Path and query parameters** (e.g. `projectId`, `assessmentId`, `issueId`, `id`, `key`, `path`, `version`)
- **Request body** referencing annotated Zod schemas (where applicable)
- **Responses** using shared wrapper schemas for success (200/201) and errors (400/401/404/422/500/503)
- **Security** — a `sessionAuth` cookie security scheme applied to all routes except `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/auth/toggle`. The spec description notes that authentication is optional and controlled by the `auth_enabled` application setting.

Routes without Zod validators (dashboard aggregates, AI generation, media) have request/response shapes defined inline in `src/lib/openapi.ts`.

**Spec metadata:**
- Title: `a11y Logger API`
- Version: from `package.json`
- Description: brief overview of the offline-first accessibility program management tool
- Base URL: `/`

**Error codes documented:**
- `VALIDATION_ERROR` (400)
- `UNAUTHENTICATED` (401)
- `NOT_FOUND` (404)
- `UNRESOLVED_ROWS` (422)
- `NOT_REVIEWED` (422)
- `AI_NOT_CONFIGURED` (503)
- `INTERNAL_ERROR` (500)

---

## Interactive UI (`/api-docs`)

Redoc is used (over Swagger UI) for:
- Clean three-panel layout suited to reading 54 endpoints
- No "Try it out" interactive requests (appropriate for a local tool)
- Minimal configuration

Implementation:

```tsx
// src/app/api-docs/page.tsx
import { RedocStandalone } from 'redoc'
export default function ApiDocsPage() {
  return <RedocStandalone specUrl="/api/openapi.json" />
}
```

```ts
// src/app/api/openapi.json/route.ts
import { generateOpenApiDocument } from '@/lib/openapi'
export function GET() {
  return Response.json(generateOpenApiDocument())
}
```

`/api-docs` is added to public paths in `src/middleware.ts` (no auth required).

A link to `/api-docs` is added to the README.

---

## Dependencies to Add

- `@asteasolutions/zod-to-openapi` — OpenAPI spec generation from Zod schemas
- `redoc` — Interactive API documentation UI

---

## Files Created / Modified

| File | Action |
|------|--------|
| `src/lib/validators/assessments.ts` | Modify — add `.openapi()` annotations |
| `src/lib/validators/issues.ts` | Modify — add `.openapi()` annotations |
| `src/lib/validators/projects.ts` | Modify — add `.openapi()` annotations |
| `src/lib/validators/reports.ts` | Modify — add `.openapi()` annotations |
| `src/lib/validators/settings.ts` | Modify — add `.openapi()` annotations |
| `src/lib/validators/users.ts` | Modify — add `.openapi()` annotations |
| `src/lib/validators/vpats.ts` | Modify — add `.openapi()` annotations |
| `src/lib/openapi.ts` | Create — spec builder with all 54 route definitions |
| `src/app/api/openapi.json/route.ts` | Create — serves the spec as JSON |
| `src/app/api-docs/page.tsx` | Create — Redoc UI page |
| `src/middleware.ts` | Modify — add `/api-docs` to public paths |
| `README.md` | Modify — add link to `/api-docs` |
| `package.json` | Modify — add new dependencies |
