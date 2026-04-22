# API Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add interactive OpenAPI documentation for all 54 REST API endpoints, served at `/api-docs` via Redoc, generated from annotated Zod validators.

**Architecture:** Annotate the 7 existing Zod validator files with `.openapi()` metadata using `@asteasolutions/zod-to-openapi`. A new `src/lib/openapi.ts` file registers all schemas and defines all 54 route operations, exporting `generateOpenApiDocument()`. A route at `/api/openapi.json` serves the spec; a page at `/api-docs` renders it via Redoc.

**Tech Stack:** `@asteasolutions/zod-to-openapi`, `redoc`, Next.js App Router, Zod v4, TypeScript

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/lib/validators/projects.ts` | Modify | Add `.openapi()` annotations to `CreateProjectSchema`, `UpdateProjectSchema` |
| `src/lib/validators/assessments.ts` | Modify | Add `.openapi()` annotations to `CreateAssessmentSchema`, `UpdateAssessmentSchema` |
| `src/lib/validators/issues.ts` | Modify | Add `.openapi()` annotations to `CreateIssueSchema`, `UpdateIssueSchema` |
| `src/lib/validators/reports.ts` | Modify | Add `.openapi()` annotations to `CreateReportSchema`, `UpdateReportSchema`, `ReportContentSchema` |
| `src/lib/validators/settings.ts` | Modify | Add `.openapi()` annotations to `UpdateSettingSchema`, `BatchUpdateSettingsSchema` |
| `src/lib/validators/users.ts` | Modify | Add `.openapi()` annotations to `CreateUserSchema`, `UpdateUserSchema`, `LoginSchema` |
| `src/lib/validators/vpats.ts` | Modify | Add `.openapi()` annotations to `CreateVpatSchema`, `UpdateVpatSchema` |
| `src/lib/openapi.ts` | Create | `OpenAPIRegistry`, all 54 route definitions, `generateOpenApiDocument()` |
| `src/app/api/openapi.json/route.ts` | Create | Serve the OpenAPI spec as JSON |
| `src/app/api-docs/page.tsx` | Create | Render Redoc UI |
| `src/middleware.ts` | Modify | Add `/api-docs` and `/api/openapi.json` to `PUBLIC_PATHS` |
| `README.md` | Modify | Add link to `/api-docs` |

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install packages**

```bash
npm install @asteasolutions/zod-to-openapi redoc
```

Expected output: packages added to `node_modules`, `package.json` and `package-lock.json` updated.

- [ ] **Step 2: Verify install**

```bash
node -e "require('@asteasolutions/zod-to-openapi'); require('redoc'); console.log('ok')"
```

Expected: `ok`

- [ ] **Step 3: Check TypeScript resolves the new packages**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors related to the new packages (may have pre-existing errors — that's fine).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add zod-to-openapi and redoc dependencies"
```

---

## Task 2: Annotate `projects` and `settings` validators

**Files:**
- Modify: `src/lib/validators/projects.ts`
- Modify: `src/lib/validators/settings.ts`

These are the two simplest validators — good for establishing the annotation pattern before tackling larger ones.

**Important:** `@asteasolutions/zod-to-openapi` works by extending the Zod instance. Call `extendZodWithOpenApi(z)` once at the top of each file that uses annotations. This mutates the Zod instance in-place (safe, idempotent).

- [ ] **Step 1: Update `src/lib/validators/projects.ts`**

Replace the entire file with:

```typescript
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreateProjectSchema = z
  .object({
    name: z.string().min(1).max(200).openapi({ example: 'ACME Web Portal' }),
    description: z
      .string()
      .max(2000)
      .optional()
      .openapi({ example: 'Main customer-facing web application' }),
    product_url: z
      .union([z.string().url(), z.literal('')])
      .optional()
      .transform((v) => (v === '' ? undefined : v))
      .openapi({ example: 'https://acme.com' }),
    status: z.enum(['active', 'archived']).optional().openapi({ example: 'active' }),
  })
  .openapi('CreateProjectRequest');

export const UpdateProjectSchema = CreateProjectSchema.partial().openapi('UpdateProjectRequest');

export type CreateProjectInput = z.input<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
```

- [ ] **Step 2: Update `src/lib/validators/settings.ts`**

Replace the entire file with:

```typescript
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const SettingValueSchema = z
  .union([z.string(), z.number(), z.boolean(), z.null()])
  .openapi({ example: 'anthropic' });

export const UpdateSettingSchema = z
  .object({
    value: SettingValueSchema,
  })
  .openapi('UpdateSettingRequest');

export const BatchUpdateSettingsSchema = z
  .record(z.string(), SettingValueSchema)
  .openapi('BatchUpdateSettingsRequest');

export type SettingValue = z.infer<typeof SettingValueSchema>;
export type UpdateSettingInput = z.infer<typeof UpdateSettingSchema>;
export type BatchUpdateSettingsInput = z.infer<typeof BatchUpdateSettingsSchema>;
```

- [ ] **Step 3: Run type-check to verify no regressions**

```bash
npx tsc --noEmit 2>&1
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/validators/projects.ts src/lib/validators/settings.ts
git commit -m "feat: add openapi annotations to projects and settings validators"
```

---

## Task 3: Annotate `users` and `assessments` validators

**Files:**
- Modify: `src/lib/validators/users.ts`
- Modify: `src/lib/validators/assessments.ts`

- [ ] **Step 1: Update `src/lib/validators/users.ts`**

Replace the entire file with:

```typescript
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreateUserSchema = z
  .object({
    username: z.string().min(1).max(50).openapi({ example: 'jane' }),
    password: z.string().min(8).max(100).openapi({ example: 'supersecret123' }),
    role: z.enum(['admin', 'member']).optional().openapi({ example: 'member' }),
  })
  .openapi('CreateUserRequest');

export const UpdateUserSchema = z
  .object({
    username: z.string().min(1).max(50).optional().openapi({ example: 'jane' }),
    password: z.string().min(8).max(100).optional().openapi({ example: 'newsecret456' }),
    role: z.enum(['admin', 'member']).optional().openapi({ example: 'admin' }),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })
  .openapi('UpdateUserRequest');

export const LoginSchema = z
  .object({
    username: z.string().min(1, 'Username is required').openapi({ example: 'jane' }),
    password: z.string().min(1, 'Password is required').openapi({ example: 'supersecret123' }),
  })
  .openapi('LoginRequest');

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
```

- [ ] **Step 2: Update `src/lib/validators/assessments.ts`**

Replace the entire file with:

```typescript
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const dateRangeRefine = (data: { test_date_start?: string; test_date_end?: string }) => {
  if (data.test_date_start && data.test_date_end) {
    return new Date(data.test_date_end) >= new Date(data.test_date_start);
  }
  return true;
};

const dateRangeRefineOptions = {
  message: 'test_date_end must be greater than or equal to test_date_start',
  path: ['test_date_end'],
};

const AssessmentBaseSchema = z.object({
  name: z.string().min(1).max(200).openapi({ example: 'Q1 Accessibility Audit' }),
  description: z
    .string()
    .max(2000)
    .optional()
    .openapi({ example: 'Initial WCAG 2.2 AA assessment' }),
  status: z.enum(['ready', 'in_progress', 'completed']).optional().openapi({ example: 'in_progress' }),
  test_date_start: z
    .string()
    .datetime()
    .optional()
    .openapi({ example: '2026-01-01T00:00:00.000Z' }),
  test_date_end: z
    .string()
    .datetime()
    .optional()
    .openapi({ example: '2026-01-31T23:59:59.000Z' }),
  assigned_to: z.string().optional().openapi({ example: 'jane' }),
});

export const CreateAssessmentSchema = AssessmentBaseSchema.refine(
  dateRangeRefine,
  dateRangeRefineOptions
).openapi('CreateAssessmentRequest');

export const UpdateAssessmentSchema = AssessmentBaseSchema.partial()
  .extend({ project_id: z.string().uuid().optional().openapi({ example: 'proj-uuid-here' }) })
  .refine(dateRangeRefine, dateRangeRefineOptions)
  .openapi('UpdateAssessmentRequest');

export type CreateAssessmentInput = z.infer<typeof CreateAssessmentSchema>;
export type UpdateAssessmentInput = z.infer<typeof UpdateAssessmentSchema>;

// Form-local schema: accepts YYYY-MM-DD strings (HTML date input format).
// API-level date validation (ISO datetime) is handled server-side.
export const AssessmentFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(200),
    description: z.string().max(2000).optional(),
    status: z.enum(['ready', 'in_progress', 'completed']),
    test_date_start: z.string().optional(),
    test_date_end: z.string().optional(),
    project_id: z.string().optional(),
  })
  .refine(
    (d) => {
      if (d.test_date_start && d.test_date_end) {
        return new Date(d.test_date_end) >= new Date(d.test_date_start);
      }
      return true;
    },
    { message: 'End date must be on or after start date', path: ['test_date_end'] }
  );

export type AssessmentFormData = z.infer<typeof AssessmentFormSchema>;
```

- [ ] **Step 3: Run type-check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/validators/users.ts src/lib/validators/assessments.ts
git commit -m "feat: add openapi annotations to users and assessments validators"
```

---

## Task 4: Annotate `reports` and `vpats` validators

**Files:**
- Modify: `src/lib/validators/reports.ts`
- Modify: `src/lib/validators/vpats.ts`

- [ ] **Step 1: Update `src/lib/validators/reports.ts`**

Replace the entire file with:

```typescript
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const ReportContentSchema = z
  .object({
    executive_summary: z
      .object({ body: z.string().openapi({ example: 'This assessment identified...' }) })
      .optional(),
    top_risks: z
      .object({ items: z.array(z.string()).openapi({ example: ['Missing alt text on 12 images'] }) })
      .optional(),
    quick_wins: z
      .object({ items: z.array(z.string()).openapi({ example: ['Add lang attribute to <html>'] }) })
      .optional(),
    user_impact: z
      .object({
        screen_reader: z.string().openapi({ example: 'Users encounter unlabeled form fields.' }),
        low_vision: z.string().openapi({ example: 'Contrast ratios fail in 3 components.' }),
        color_vision: z.string().openapi({ example: 'Color alone conveys status in charts.' }),
        keyboard_only: z
          .string()
          .openapi({ example: 'Focus trap present in modal dialogs.' }),
        cognitive: z.string().openapi({ example: 'Error messages lack recovery guidance.' }),
        deaf_hard_of_hearing: z
          .string()
          .openapi({ example: 'Videos lack captions on 2 pages.' }),
      })
      .optional(),
  })
  .strict()
  .openapi('ReportContent');

const ReportBaseSchema = z.object({
  title: z.string().min(1).max(200).openapi({ example: 'Q1 Accessibility Report' }),
  content: ReportContentSchema.optional(),
});

export const CreateReportSchema = ReportBaseSchema.extend({
  assessment_ids: z
    .array(z.string().min(1))
    .min(1)
    .openapi({ example: ['assess-uuid-1', 'assess-uuid-2'] }),
}).openapi('CreateReportRequest');

export const UpdateReportSchema = ReportBaseSchema.partial()
  .extend({
    assessment_ids: z
      .array(z.string().min(1))
      .min(1)
      .optional()
      .openapi({ example: ['assess-uuid-1'] }),
  })
  .openapi('UpdateReportRequest');

export type ReportContent = z.infer<typeof ReportContentSchema>;
export type CreateReportInput = z.infer<typeof CreateReportSchema>;
export type UpdateReportInput = z.infer<typeof UpdateReportSchema>;
```

- [ ] **Step 2: Update `src/lib/validators/vpats.ts`**

Replace the entire file with:

```typescript
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const STANDARD_EDITIONS = ['WCAG', '508', 'EU', 'INT'] as const;
export const PRODUCT_SCOPES = [
  'web',
  'software-desktop',
  'software-mobile',
  'documents',
  'hardware',
  'telephony',
] as const;

export const CreateVpatSchema = z
  .object({
    title: z.string().min(1).max(200).openapi({ example: 'ACME Portal VPAT 2026' }),
    project_id: z.string().min(1).openapi({ example: 'proj-uuid-here' }),
    standard_edition: z.enum(STANDARD_EDITIONS).default('WCAG').openapi({ example: 'WCAG' }),
    wcag_version: z.enum(['2.1', '2.2']).default('2.1').openapi({ example: '2.2' }),
    wcag_level: z.enum(['A', 'AA', 'AAA']).default('AA').openapi({ example: 'AA' }),
    product_scope: z
      .array(z.enum(PRODUCT_SCOPES))
      .min(1)
      .default(['web'])
      .openapi({ example: ['web'] }),
    description: z
      .string()
      .max(1000)
      .nullable()
      .optional()
      .openapi({ example: 'Covers the main portal application.' }),
  })
  .openapi('CreateVpatRequest');

export const UpdateVpatSchema = z
  .object({
    title: z.string().min(1).max(200).openapi({ example: 'ACME Portal VPAT 2026 (revised)' }),
  })
  .partial()
  .refine((d) => d.title !== undefined, { message: 'At least one field must be provided' })
  .openapi('UpdateVpatRequest');

export type CreateVpatInput = z.infer<typeof CreateVpatSchema>;
export type CreateVpatParams = z.input<typeof CreateVpatSchema>;
export type UpdateVpatInput = z.infer<typeof UpdateVpatSchema>;
export type StandardEdition = (typeof STANDARD_EDITIONS)[number];
export type ProductScope = (typeof PRODUCT_SCOPES)[number];
```

- [ ] **Step 3: Run type-check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/validators/reports.ts src/lib/validators/vpats.ts
git commit -m "feat: add openapi annotations to reports and vpats validators"
```

---

## Task 5: Annotate `issues` validator

**Files:**
- Modify: `src/lib/validators/issues.ts`

The issues validator is the largest, importing criterion code arrays from constants. It gets its own task.

- [ ] **Step 1: Update `src/lib/validators/issues.ts`**

Replace the entire file with:

```typescript
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import {
  WCAG_CRITERION_CODES,
  SECTION_508_CRITERION_CODES,
  EN301549_CRITERION_CODES,
} from '@/lib/constants';

extendZodWithOpenApi(z);

const IssueBaseSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(300)
    .openapi({ example: 'Image missing alternative text' }),
  description: z
    .string()
    .max(5000)
    .optional()
    .openapi({ example: 'The hero image on the homepage has no alt attribute.' }),
  url: z
    .string()
    .url()
    .optional()
    .or(z.literal(''))
    .openapi({ example: 'https://acme.com/' }),
  severity: z
    .enum(['critical', 'high', 'medium', 'low'])
    .optional()
    .openapi({ example: 'high' }),
  status: z
    .enum(['open', 'resolved', 'wont_fix'])
    .optional()
    .openapi({ example: 'open' }),
  wcag_codes: z
    .array(z.enum(WCAG_CRITERION_CODES as unknown as [string, ...string[]]))
    .optional()
    .openapi({ example: ['1.1.1'] }),
  section_508_codes: z
    .array(z.enum(SECTION_508_CRITERION_CODES as unknown as [string, ...string[]]))
    .optional()
    .openapi({ example: ['502.3'] }),
  eu_codes: z
    .array(z.enum(EN301549_CRITERION_CODES as unknown as [string, ...string[]]))
    .optional()
    .openapi({ example: ['9.1.1.1'] }),
  device_type: z
    .enum(['desktop', 'mobile', 'tablet'])
    .optional()
    .openapi({ example: 'desktop' }),
  browser: z.string().max(100).optional().openapi({ example: 'Chrome 124' }),
  operating_system: z.string().max(100).optional().openapi({ example: 'macOS 14' }),
  assistive_technology: z
    .string()
    .max(200)
    .optional()
    .openapi({ example: 'NVDA 2024.1' }),
  user_impact: z
    .string()
    .max(2000)
    .optional()
    .openapi({ example: 'Screen reader users cannot identify the image.' }),
  selector: z
    .string()
    .max(500)
    .optional()
    .openapi({ example: '.hero-section > img' }),
  code_snippet: z
    .string()
    .max(5000)
    .optional()
    .openapi({ example: '<img src="hero.jpg">' }),
  suggested_fix: z
    .string()
    .max(5000)
    .optional()
    .openapi({ example: 'Add alt="Smiling customer using the ACME portal" to the img tag.' }),
  evidence_media: z.array(z.string()).optional().openapi({ example: ['/api/media/proj/issue/screenshot.png'] }),
  tags: z
    .array(z.string().max(50))
    .optional()
    .openapi({ example: ['images', 'homepage'] }),
  created_by: z.string().max(200).optional().openapi({ example: 'jane' }),
  ai_suggested_codes: z.array(z.string()).optional().openapi({ example: ['1.1.1', '1.4.5'] }),
  ai_confidence_score: z.number().nullable().optional().openapi({ example: 0.92 }),
});

export const CreateIssueSchema = IssueBaseSchema.openapi('CreateIssueRequest');
export const UpdateIssueSchema = IssueBaseSchema.partial().openapi('UpdateIssueRequest');

export type CreateIssueInput = z.infer<typeof CreateIssueSchema>;
export type UpdateIssueInput = z.infer<typeof UpdateIssueSchema>;
```

- [ ] **Step 2: Run type-check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no new errors.

- [ ] **Step 3: Run tests to verify validator behavior unchanged**

```bash
npm test 2>&1 | tail -20
```

Expected: all tests pass (no validator-related regressions).

- [ ] **Step 4: Commit**

```bash
git add src/lib/validators/issues.ts
git commit -m "feat: add openapi annotations to issues validator"
```

---

## Task 6: Create the OpenAPI spec builder — shared components and Auth/Users/Settings routes

**Files:**
- Create: `src/lib/openapi.ts`

This task creates `src/lib/openapi.ts` with the registry setup, shared response schemas, and the first three route groups (Auth, Users, Settings — 8 routes total). Tasks 7–9 extend the same file with remaining route groups.

- [ ] **Step 1: Create `src/lib/openapi.ts`**

```typescript
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import {
  CreateProjectSchema,
  UpdateProjectSchema,
} from '@/lib/validators/projects';
import {
  CreateAssessmentSchema,
  UpdateAssessmentSchema,
} from '@/lib/validators/assessments';
import {
  CreateIssueSchema,
  UpdateIssueSchema,
} from '@/lib/validators/issues';
import {
  CreateReportSchema,
  UpdateReportSchema,
  ReportContentSchema,
} from '@/lib/validators/reports';
import {
  UpdateSettingSchema,
  BatchUpdateSettingsSchema,
  SettingValueSchema,
} from '@/lib/validators/settings';
import {
  CreateUserSchema,
  UpdateUserSchema,
  LoginSchema,
} from '@/lib/validators/users';
import {
  CreateVpatSchema,
  UpdateVpatSchema,
} from '@/lib/validators/vpats';

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// ─── Shared response schemas ────────────────────────────────────────────────

const ErrorResponseSchema = z
  .object({
    success: z.literal(false),
    error: z.string().openapi({ example: 'Not found' }),
    code: z
      .enum([
        'VALIDATION_ERROR',
        'UNAUTHENTICATED',
        'NOT_FOUND',
        'UNRESOLVED_ROWS',
        'NOT_REVIEWED',
        'AI_NOT_CONFIGURED',
        'AI_ERROR',
        'INTERNAL_ERROR',
      ])
      .openapi({ example: 'NOT_FOUND' }),
  })
  .openapi('ErrorResponse');

registry.register('ErrorResponse', ErrorResponseSchema);

// ─── Register domain schemas ─────────────────────────────────────────────────

registry.register('CreateProjectRequest', CreateProjectSchema);
registry.register('UpdateProjectRequest', UpdateProjectSchema);
registry.register('CreateAssessmentRequest', CreateAssessmentSchema);
registry.register('UpdateAssessmentRequest', UpdateAssessmentSchema);
registry.register('CreateIssueRequest', CreateIssueSchema);
registry.register('UpdateIssueRequest', UpdateIssueSchema);
registry.register('CreateReportRequest', CreateReportSchema);
registry.register('UpdateReportRequest', UpdateReportSchema);
registry.register('ReportContent', ReportContentSchema);
registry.register('UpdateSettingRequest', UpdateSettingSchema);
registry.register('BatchUpdateSettingsRequest', BatchUpdateSettingsSchema);
registry.register('CreateUserRequest', CreateUserSchema);
registry.register('UpdateUserRequest', UpdateUserSchema);
registry.register('LoginRequest', LoginSchema);
registry.register('CreateVpatRequest', CreateVpatSchema);
registry.register('UpdateVpatRequest', UpdateVpatSchema);

// ─── Security scheme ─────────────────────────────────────────────────────────

registry.registerComponent('securitySchemes', 'sessionAuth', {
  type: 'apiKey',
  in: 'cookie',
  name: 'session',
  description:
    'HMAC-SHA256 signed session cookie. Only required when authentication is enabled (controlled by the `auth_enabled` app setting).',
});

const auth = [{ sessionAuth: [] }];

// ─── Auth ────────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  tags: ['Auth'],
  summary: 'Log in',
  description: 'Authenticates with username and password. Sets a signed session cookie on success.',
  request: { body: { content: { 'application/json': { schema: LoginSchema } } } },
  responses: {
    200: {
      description: 'Login successful',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true), data: z.object({ username: z.string(), role: z.string() }) }).openapi('LoginResponse'),
        },
      },
    },
    401: { description: 'Invalid credentials', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/logout',
  tags: ['Auth'],
  summary: 'Log out',
  description: 'Clears the session cookie.',
  responses: {
    200: {
      description: 'Logout successful',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true) }).openapi('LogoutResponse'),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/toggle',
  tags: ['Auth'],
  summary: 'Toggle authentication',
  description: 'Enables or disables authentication. Sets the `auth_enabled` cookie.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({ enabled: z.boolean().openapi({ example: true }) }).openapi('AuthToggleRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Auth toggle successful',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true), data: z.object({ enabled: z.boolean() }) }).openapi('AuthToggleResponse'),
        },
      },
    },
  },
});

// ─── Users ────────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/users',
  tags: ['Users'],
  summary: 'List users',
  security: auth,
  responses: {
    200: {
      description: 'List of users',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true), data: z.array(z.object({ id: z.string(), username: z.string(), role: z.string() })) }).openapi('UsersListResponse'),
        },
      },
    },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/users',
  tags: ['Users'],
  summary: 'Create user',
  security: auth,
  request: { body: { content: { 'application/json': { schema: CreateUserSchema } } } },
  responses: {
    201: {
      description: 'User created',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), username: z.string(), role: z.string() }) }).openapi('UserResponse'),
        },
      },
    },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/users/{id}',
  tags: ['Users'],
  summary: 'Get user',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'user-uuid' }) }) },
  responses: {
    200: {
      description: 'User',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), username: z.string(), role: z.string() }) }),
        },
      },
    },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/users/{id}',
  tags: ['Users'],
  summary: 'Update user',
  security: auth,
  request: {
    params: z.object({ id: z.string().openapi({ example: 'user-uuid' }) }),
    body: { content: { 'application/json': { schema: UpdateUserSchema } } },
  },
  responses: {
    200: {
      description: 'Updated user',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), username: z.string(), role: z.string() }) }),
        },
      },
    },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/users/{id}',
  tags: ['Users'],
  summary: 'Delete user',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'user-uuid' }) }) },
  responses: {
    200: { description: 'Deleted', content: { 'application/json': { schema: z.object({ success: z.literal(true) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

// ─── Settings ─────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/settings',
  tags: ['Settings'],
  summary: 'Get all settings',
  security: auth,
  responses: {
    200: {
      description: 'All settings as a key-value map',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true), data: z.record(z.string(), SettingValueSchema) }).openapi('SettingsResponse'),
        },
      },
    },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/settings',
  tags: ['Settings'],
  summary: 'Batch update settings',
  security: auth,
  request: { body: { content: { 'application/json': { schema: BatchUpdateSettingsSchema } } } },
  responses: {
    200: {
      description: 'Updated settings',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true), data: z.record(z.string(), SettingValueSchema) }),
        },
      },
    },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/settings/{key}',
  tags: ['Settings'],
  summary: 'Get a single setting',
  security: auth,
  request: { params: z.object({ key: z.string().openapi({ example: 'ai_provider' }) }) },
  responses: {
    200: {
      description: 'Setting value',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true), data: z.object({ key: z.string(), value: SettingValueSchema }) }).openapi('SettingResponse'),
        },
      },
    },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/settings/{key}',
  tags: ['Settings'],
  summary: 'Update a single setting',
  security: auth,
  request: {
    params: z.object({ key: z.string().openapi({ example: 'ai_provider' }) }),
    body: { content: { 'application/json': { schema: UpdateSettingSchema } } },
  },
  responses: {
    200: {
      description: 'Updated setting',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true), data: z.object({ key: z.string(), value: SettingValueSchema }) }),
        },
      },
    },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/settings/reset',
  tags: ['Settings'],
  summary: 'Reset all settings to defaults',
  security: auth,
  responses: {
    200: {
      description: 'Settings reset',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true) }),
        },
      },
    },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

// ─── Generator export ────────────────────────────────────────────────────────

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'a11y Logger API',
      version: '0.2.0',
      description:
        'REST API for a11y Logger — a free, offline-first accessibility program management tool. Authentication is optional and controlled by the `auth_enabled` application setting.',
    },
    servers: [{ url: '/', description: 'Local development server' }],
  });
}
```

- [ ] **Step 2: Run type-check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/openapi.ts
git commit -m "feat: add openapi spec builder with auth, users, and settings routes"
```

---

## Task 7: Extend spec builder — Projects, Assessments, Issues routes

**Files:**
- Modify: `src/lib/openapi.ts` (append after the Settings section, before the generator export)

- [ ] **Step 1: Add Projects routes to `src/lib/openapi.ts`**

Insert the following block **before** the `// ─── Generator export` comment:

```typescript
// ─── Projects ────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/projects',
  tags: ['Projects'],
  summary: 'List projects',
  security: auth,
  responses: {
    200: {
      description: 'List of projects',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true), data: z.array(z.object({ id: z.string(), name: z.string(), description: z.string().nullable(), product_url: z.string().nullable(), status: z.string(), created_at: z.string() })) }).openapi('ProjectsListResponse'),
        },
      },
    },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/projects',
  tags: ['Projects'],
  summary: 'Create project',
  security: auth,
  request: { body: { content: { 'application/json': { schema: CreateProjectSchema } } } },
  responses: {
    201: {
      description: 'Project created',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), name: z.string(), description: z.string().nullable(), product_url: z.string().nullable(), status: z.string(), created_at: z.string() }) }).openapi('ProjectResponse'),
        },
      },
    },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/projects/{projectId}',
  tags: ['Projects'],
  summary: 'Get project',
  security: auth,
  request: { params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }) }) },
  responses: {
    200: { description: 'Project', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), name: z.string(), description: z.string().nullable(), product_url: z.string().nullable(), status: z.string(), created_at: z.string() }) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/projects/{projectId}',
  tags: ['Projects'],
  summary: 'Update project',
  security: auth,
  request: {
    params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }) }),
    body: { content: { 'application/json': { schema: UpdateProjectSchema } } },
  },
  responses: {
    200: { description: 'Updated project', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), name: z.string(), description: z.string().nullable(), product_url: z.string().nullable(), status: z.string(), created_at: z.string() }) }) } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/projects/{projectId}',
  tags: ['Projects'],
  summary: 'Delete project',
  security: auth,
  request: { params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }) }) },
  responses: {
    200: { description: 'Deleted', content: { 'application/json': { schema: z.object({ success: z.literal(true) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

// ─── Assessments ──────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/projects/{projectId}/assessments',
  tags: ['Assessments'],
  summary: 'List assessments for a project',
  security: auth,
  request: { params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }) }) },
  responses: {
    200: { description: 'List of assessments', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(z.object({ id: z.string(), name: z.string(), status: z.string(), project_id: z.string(), created_at: z.string() })) }).openapi('AssessmentsListResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Project not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/projects/{projectId}/assessments',
  tags: ['Assessments'],
  summary: 'Create assessment',
  security: auth,
  request: {
    params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }) }),
    body: { content: { 'application/json': { schema: CreateAssessmentSchema } } },
  },
  responses: {
    201: { description: 'Assessment created', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), name: z.string(), status: z.string(), project_id: z.string(), created_at: z.string() }) }).openapi('AssessmentResponse') } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Project not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/projects/{projectId}/assessments/{assessmentId}',
  tags: ['Assessments'],
  summary: 'Get assessment',
  security: auth,
  request: { params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }), assessmentId: z.string().openapi({ example: 'assess-uuid' }) }) },
  responses: {
    200: { description: 'Assessment', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), name: z.string(), status: z.string(), project_id: z.string(), created_at: z.string() }) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/projects/{projectId}/assessments/{assessmentId}',
  tags: ['Assessments'],
  summary: 'Update assessment',
  security: auth,
  request: {
    params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }), assessmentId: z.string().openapi({ example: 'assess-uuid' }) }),
    body: { content: { 'application/json': { schema: UpdateAssessmentSchema } } },
  },
  responses: {
    200: { description: 'Updated assessment', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), name: z.string(), status: z.string(), project_id: z.string(), created_at: z.string() }) }) } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/projects/{projectId}/assessments/{assessmentId}',
  tags: ['Assessments'],
  summary: 'Delete assessment',
  security: auth,
  request: { params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }), assessmentId: z.string().openapi({ example: 'assess-uuid' }) }) },
  responses: {
    200: { description: 'Deleted', content: { 'application/json': { schema: z.object({ success: z.literal(true) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

// ─── Issues ───────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/projects/{projectId}/assessments/{assessmentId}/issues',
  tags: ['Issues'],
  summary: 'List issues in an assessment',
  security: auth,
  request: { params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }), assessmentId: z.string().openapi({ example: 'assess-uuid' }) }) },
  responses: {
    200: { description: 'List of issues', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(z.object({ id: z.string(), title: z.string(), severity: z.string().nullable(), status: z.string(), created_at: z.string() })) }).openapi('IssuesListResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/projects/{projectId}/assessments/{assessmentId}/issues',
  tags: ['Issues'],
  summary: 'Create issue',
  security: auth,
  request: {
    params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }), assessmentId: z.string().openapi({ example: 'assess-uuid' }) }),
    body: { content: { 'application/json': { schema: CreateIssueSchema } } },
  },
  responses: {
    201: { description: 'Issue created', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), title: z.string(), severity: z.string().nullable(), status: z.string(), created_at: z.string() }) }).openapi('IssueResponse') } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/projects/{projectId}/assessments/{assessmentId}/issues/{issueId}',
  tags: ['Issues'],
  summary: 'Get issue',
  security: auth,
  request: { params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }), assessmentId: z.string().openapi({ example: 'assess-uuid' }), issueId: z.string().openapi({ example: 'issue-uuid' }) }) },
  responses: {
    200: { description: 'Issue', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), title: z.string(), severity: z.string().nullable(), status: z.string(), created_at: z.string() }) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/projects/{projectId}/assessments/{assessmentId}/issues/{issueId}',
  tags: ['Issues'],
  summary: 'Update issue',
  security: auth,
  request: {
    params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }), assessmentId: z.string().openapi({ example: 'assess-uuid' }), issueId: z.string().openapi({ example: 'issue-uuid' }) }),
    body: { content: { 'application/json': { schema: UpdateIssueSchema } } },
  },
  responses: {
    200: { description: 'Updated issue', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), title: z.string(), severity: z.string().nullable(), status: z.string(), created_at: z.string() }) }) } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/projects/{projectId}/assessments/{assessmentId}/issues/{issueId}',
  tags: ['Issues'],
  summary: 'Delete issue',
  security: auth,
  request: { params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }), assessmentId: z.string().openapi({ example: 'assess-uuid' }), issueId: z.string().openapi({ example: 'issue-uuid' }) }) },
  responses: {
    200: { description: 'Deleted', content: { 'application/json': { schema: z.object({ success: z.literal(true) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/projects/{projectId}/assessments/{assessmentId}/issues/import',
  tags: ['Issues'],
  summary: 'Import issues (CSV)',
  description: 'Accepts a `multipart/form-data` request with a `file` field containing a CSV of issues.',
  security: auth,
  request: {
    params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }), assessmentId: z.string().openapi({ example: 'assess-uuid' }) }),
    body: { content: { 'multipart/form-data': { schema: z.object({ file: z.string().openapi({ format: 'binary', description: 'CSV file of issues' }) }) } } },
  },
  responses: {
    200: { description: 'Import result', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ imported: z.number(), skipped: z.number() }) }).openapi('ImportIssuesResponse') } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/projects/{projectId}/issues',
  tags: ['Issues'],
  summary: 'List all issues for a project (across all assessments)',
  security: auth,
  request: { params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }) }) },
  responses: {
    200: { description: 'List of issues', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(z.object({ id: z.string(), title: z.string(), severity: z.string().nullable(), status: z.string(), assessment_id: z.string(), created_at: z.string() })) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/issues/by-criterion',
  tags: ['Issues'],
  summary: 'Get issues grouped by WCAG criterion',
  security: auth,
  request: {
    query: z.object({
      projectId: z.string().optional().openapi({ example: 'proj-uuid', description: 'Filter by project' }),
    }),
  },
  responses: {
    200: { description: 'Issues grouped by criterion code', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.record(z.string(), z.array(z.object({ id: z.string(), title: z.string() }))) }).openapi('IssuesByCriterionResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});
```

- [ ] **Step 2: Run type-check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/openapi.ts
git commit -m "feat: add projects, assessments, and issues routes to openapi spec"
```

---

## Task 8: Extend spec builder — Reports, VPATs routes

**Files:**
- Modify: `src/lib/openapi.ts` (append before the generator export)

- [ ] **Step 1: Add Reports routes to `src/lib/openapi.ts`**

Insert the following before `// ─── Generator export`:

```typescript
// ─── Reports ──────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/reports',
  tags: ['Reports'],
  summary: 'List reports',
  security: auth,
  responses: {
    200: { description: 'List of reports', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(z.object({ id: z.string(), title: z.string(), published: z.boolean(), created_at: z.string() })) }).openapi('ReportsListResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/reports',
  tags: ['Reports'],
  summary: 'Create report',
  security: auth,
  request: { body: { content: { 'application/json': { schema: CreateReportSchema } } } },
  responses: {
    201: { description: 'Report created', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), title: z.string(), published: z.boolean(), created_at: z.string() }) }).openapi('ReportResponse') } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Assessment not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/reports/{id}',
  tags: ['Reports'],
  summary: 'Get report',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'report-uuid' }) }) },
  responses: {
    200: { description: 'Report', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), title: z.string(), published: z.boolean(), content: ReportContentSchema.optional(), created_at: z.string() }) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/reports/{id}',
  tags: ['Reports'],
  summary: 'Update report',
  security: auth,
  request: {
    params: z.object({ id: z.string().openapi({ example: 'report-uuid' }) }),
    body: { content: { 'application/json': { schema: UpdateReportSchema } } },
  },
  responses: {
    200: { description: 'Updated report', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), title: z.string(), published: z.boolean(), created_at: z.string() }) }) } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/reports/{id}',
  tags: ['Reports'],
  summary: 'Delete report',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'report-uuid' }) }) },
  responses: {
    200: { description: 'Deleted', content: { 'application/json': { schema: z.object({ success: z.literal(true) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/reports/{id}/issues',
  tags: ['Reports'],
  summary: 'List issues included in a report',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'report-uuid' }) }) },
  responses: {
    200: { description: 'Issues', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(z.object({ id: z.string(), title: z.string(), severity: z.string().nullable() })) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/reports/{id}/publish',
  tags: ['Reports'],
  summary: 'Publish report',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'report-uuid' }) }) },
  responses: {
    200: { description: 'Report published', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), published: z.literal(true) }) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/reports/{id}/export',
  tags: ['Reports'],
  summary: 'Export report as DOCX',
  description: 'Returns a binary DOCX file.',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'report-uuid' }) }) },
  responses: {
    200: { description: 'DOCX file', content: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { schema: z.string().openapi({ format: 'binary' }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

// ─── VPATs ────────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/vpats',
  tags: ['VPATs'],
  summary: 'List VPATs',
  security: auth,
  request: { query: z.object({ projectId: z.string().optional().openapi({ example: 'proj-uuid', description: 'Filter by project' }) }) },
  responses: {
    200: { description: 'List of VPATs', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(z.object({ id: z.string(), title: z.string(), standard_edition: z.string(), published: z.boolean(), created_at: z.string() })) }).openapi('VpatsListResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/vpats',
  tags: ['VPATs'],
  summary: 'Create VPAT',
  security: auth,
  request: { body: { content: { 'application/json': { schema: CreateVpatSchema } } } },
  responses: {
    201: { description: 'VPAT created', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), title: z.string(), standard_edition: z.string(), published: z.boolean(), created_at: z.string() }) }).openapi('VpatResponse') } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Project not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/vpats/{id}',
  tags: ['VPATs'],
  summary: 'Get VPAT',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }) }) },
  responses: {
    200: { description: 'VPAT', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), title: z.string(), standard_edition: z.string(), published: z.boolean(), created_at: z.string() }) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/vpats/{id}',
  tags: ['VPATs'],
  summary: 'Update VPAT',
  security: auth,
  request: {
    params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }) }),
    body: { content: { 'application/json': { schema: UpdateVpatSchema } } },
  },
  responses: {
    200: { description: 'Updated VPAT', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), title: z.string(), standard_edition: z.string(), published: z.boolean(), created_at: z.string() }) }) } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/vpats/{id}',
  tags: ['VPATs'],
  summary: 'Delete VPAT',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }) }) },
  responses: {
    200: { description: 'Deleted', content: { 'application/json': { schema: z.object({ success: z.literal(true) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/vpats/{id}/cover-sheet',
  tags: ['VPATs'],
  summary: 'Update VPAT cover sheet',
  security: auth,
  request: {
    params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }) }),
    body: { content: { 'application/json': { schema: z.object({ vendor_name: z.string().optional(), product_name: z.string().optional(), product_version: z.string().optional(), report_date: z.string().optional(), contact_email: z.string().optional(), notes: z.string().optional() }).openapi('CoverSheetRequest') } } },
  },
  responses: {
    200: { description: 'Cover sheet updated', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string() }) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/vpats/{id}/publish',
  tags: ['VPATs'],
  summary: 'Publish VPAT',
  description: 'Marks the VPAT as published. All criterion rows must be reviewed first.',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }) }) },
  responses: {
    200: { description: 'VPAT published', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), published: z.literal(true) }) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
    422: { description: 'Unresolved rows or not reviewed', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/vpats/{id}/unpublish',
  tags: ['VPATs'],
  summary: 'Unpublish VPAT',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }) }) },
  responses: {
    200: { description: 'VPAT unpublished', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), published: z.literal(false) }) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/vpats/{id}/review',
  tags: ['VPATs'],
  summary: 'Mark VPAT as reviewed',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }) }) },
  responses: {
    200: { description: 'VPAT reviewed', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string() }) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
    422: { description: 'Unresolved rows', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/vpats/{id}/export',
  tags: ['VPATs'],
  summary: 'Export VPAT as DOCX',
  description: 'Returns a binary DOCX file.',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }) }) },
  responses: {
    200: { description: 'DOCX file', content: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { schema: z.string().openapi({ format: 'binary' }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/vpats/{id}/rows/{rowId}',
  tags: ['VPATs'],
  summary: 'Update a criterion row',
  security: auth,
  request: {
    params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }), rowId: z.string().openapi({ example: 'row-uuid' }) }),
    body: { content: { 'application/json': { schema: z.object({ conformance: z.enum(['supports', 'partially_supports', 'does_not_support', 'not_applicable', 'not_evaluated']).optional().openapi({ example: 'supports' }), remarks: z.string().max(5000).optional().openapi({ example: 'All images have appropriate alt text.' }) }).openapi('UpdateRowRequest') } } },
  },
  responses: {
    200: { description: 'Updated row', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), conformance: z.string().nullable(), remarks: z.string().nullable() }) }) } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/vpats/{id}/rows/{rowId}/generate',
  tags: ['VPATs'],
  summary: 'AI-generate conformance text for a criterion row',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }), rowId: z.string().openapi({ example: 'row-uuid' }) }) },
  responses: {
    200: { description: 'Generated row', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), conformance: z.string().nullable(), remarks: z.string().nullable() }) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
    503: { description: 'AI not configured', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/vpats/{id}/rows/{rowId}/components/{componentName}',
  tags: ['VPATs'],
  summary: 'Update a component within a criterion row',
  security: auth,
  request: {
    params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }), rowId: z.string().openapi({ example: 'row-uuid' }), componentName: z.string().openapi({ example: 'web' }) }),
    body: { content: { 'application/json': { schema: z.object({ conformance: z.enum(['supports', 'partially_supports', 'does_not_support', 'not_applicable', 'not_evaluated']).optional(), remarks: z.string().max(5000).optional() }).openapi('UpdateComponentRequest') } } },
  },
  responses: {
    200: { description: 'Updated component', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string() }) }) } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/vpats/{id}/rows/generate-all',
  tags: ['VPATs'],
  summary: 'AI-generate conformance text for all criterion rows',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }) }) },
  responses: {
    200: { description: 'Generation complete', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ generated: z.number() }) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
    503: { description: 'AI not configured', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/vpats/{id}/versions',
  tags: ['VPATs'],
  summary: 'List published versions of a VPAT',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }) }) },
  responses: {
    200: { description: 'List of versions', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(z.object({ version: z.number(), published_at: z.string() })) }).openapi('VpatVersionsResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/vpats/{id}/versions/{version}',
  tags: ['VPATs'],
  summary: 'Get a specific published version of a VPAT',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }), version: z.string().openapi({ example: '1' }) }) },
  responses: {
    200: { description: 'VPAT version snapshot', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ version: z.number(), snapshot: z.unknown(), published_at: z.string() }) }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/vpats/{id}/versions/{version}/export',
  tags: ['VPATs'],
  summary: 'Export a specific VPAT version as DOCX',
  description: 'Returns a binary DOCX file for the specified published version.',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }), version: z.string().openapi({ example: '1' }) }) },
  responses: {
    200: { description: 'DOCX file', content: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { schema: z.string().openapi({ format: 'binary' }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/vpats/import',
  tags: ['VPATs'],
  summary: 'Import a VPAT from a YAML/ZIP file',
  description: 'Accepts a `multipart/form-data` request with a `file` field containing a VPAT export file.',
  security: auth,
  request: { body: { content: { 'multipart/form-data': { schema: z.object({ file: z.string().openapi({ format: 'binary', description: 'VPAT export file (YAML or ZIP)' }), project_id: z.string().openapi({ example: 'proj-uuid' }) }).openapi('ImportVpatRequest') } } } },
  responses: {
    201: { description: 'VPAT imported', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ id: z.string(), title: z.string() }) }) } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});
```

- [ ] **Step 2: Run type-check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/openapi.ts
git commit -m "feat: add reports and vpats routes to openapi spec"
```

---

## Task 9: Extend spec builder — Dashboard, AI, Media, Criteria routes

**Files:**
- Modify: `src/lib/openapi.ts` (append before the generator export)

- [ ] **Step 1: Add remaining routes to `src/lib/openapi.ts`**

Insert the following before `// ─── Generator export`:

```typescript
// ─── Dashboard ────────────────────────────────────────────────────────────────

const dashboardQueryParams = z.object({
  projectId: z.string().optional().openapi({ example: 'proj-uuid', description: 'Filter by project' }),
  statuses: z.string().optional().openapi({ example: 'open,wont_fix', description: 'Comma-separated issue statuses to include' }),
});

registry.registerPath({
  method: 'get',
  path: '/api/dashboard/issue-statistics',
  tags: ['Dashboard'],
  summary: 'Issue counts by severity',
  security: auth,
  request: { query: dashboardQueryParams },
  responses: {
    200: { description: 'Severity breakdown', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ critical: z.number(), high: z.number(), medium: z.number(), low: z.number() }) }).openapi('IssueStatisticsResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/dashboard/pour-radar',
  tags: ['Dashboard'],
  summary: 'POUR radar chart data',
  description: 'Returns issue counts grouped by POUR principle (Perceivable, Operable, Understandable, Robust).',
  security: auth,
  request: { query: dashboardQueryParams },
  responses: {
    200: { description: 'POUR breakdown', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(z.object({ principle: z.string(), count: z.number() })) }).openapi('PourRadarResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/dashboard/timeseries',
  tags: ['Dashboard'],
  summary: 'Issue count over time',
  security: auth,
  request: { query: dashboardQueryParams },
  responses: {
    200: { description: 'Time series data', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(z.object({ date: z.string(), count: z.number() })) }).openapi('TimeseriesResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/dashboard/repeat-offenders',
  tags: ['Dashboard'],
  summary: 'Most frequently violated WCAG criteria',
  security: auth,
  request: { query: dashboardQueryParams },
  responses: {
    200: { description: 'Repeat offender criteria', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(z.object({ code: z.string(), count: z.number(), description: z.string() })) }).openapi('RepeatOffendersResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/dashboard/wcag-criteria',
  tags: ['Dashboard'],
  summary: 'Issue counts by WCAG criterion',
  security: auth,
  request: { query: dashboardQueryParams },
  responses: {
    200: { description: 'Issues by WCAG criterion', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(z.object({ code: z.string(), count: z.number() })) }).openapi('WcagCriteriaResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/dashboard/tags',
  tags: ['Dashboard'],
  summary: 'Issue counts by tag',
  security: auth,
  request: { query: dashboardQueryParams },
  responses: {
    200: { description: 'Issues by tag', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(z.object({ tag: z.string(), count: z.number() })) }).openapi('TagsResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/dashboard/environment',
  tags: ['Dashboard'],
  summary: 'Issue counts by environment (device, browser, OS)',
  security: auth,
  request: { query: dashboardQueryParams },
  responses: {
    200: { description: 'Environment breakdown', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ device_type: z.record(z.string(), z.number()), browser: z.record(z.string(), z.number()), operating_system: z.record(z.string(), z.number()) }) }).openapi('EnvironmentResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

// ─── Criteria ─────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/criteria',
  tags: ['Criteria'],
  summary: 'List all WCAG/508/EN301549 criteria',
  security: auth,
  responses: {
    200: { description: 'All criteria', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(z.object({ code: z.string(), title: z.string(), standard: z.string(), level: z.string().optional() })) }).openapi('CriteriaResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

// ─── AI ───────────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'post',
  path: '/api/ai/test-connection',
  tags: ['AI'],
  summary: 'Test AI provider connection',
  security: auth,
  responses: {
    200: { description: 'Connection OK', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ provider: z.string() }) }).openapi('AiTestResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    503: { description: 'AI not configured', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/ai/generate-issue',
  tags: ['AI'],
  summary: 'AI-generate issue field suggestions',
  description: 'Sends an accessibility observation to the configured AI provider and returns suggested field values. Only returns a field if the corresponding `current` field is empty.',
  security: auth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            ai_description: z.string().openapi({ example: 'The submit button has no visible focus indicator when tabbed to.' }),
            current: z.object({
              title: z.string().nullable().optional(),
              description: z.string().nullable().optional(),
              severity: z.string().nullable().optional(),
              user_impact: z.string().nullable().optional(),
              suggested_fix: z.string().nullable().optional(),
              wcag_codes: z.array(z.string()).optional(),
              section_508_codes: z.array(z.string()).optional(),
              eu_codes: z.array(z.string()).optional(),
            }).optional(),
          }).openapi('GenerateIssueRequest'),
        },
      },
    },
  },
  responses: {
    200: { description: 'AI suggestions (null fields already have values)', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ title: z.string().nullable(), description: z.string().nullable(), severity: z.string().nullable(), user_impact: z.string().nullable(), suggested_fix: z.string().nullable(), wcag_codes: z.array(z.string()).nullable(), section_508_codes: z.array(z.string()).nullable(), eu_codes: z.array(z.string()).nullable() }) }).openapi('GenerateIssueResponse') } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    503: { description: 'AI not configured', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/ai/generate-vpat-narrative',
  tags: ['AI'],
  summary: 'AI-generate a VPAT narrative for a criterion',
  security: auth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            criterion_code: z.string().openapi({ example: '1.1.1' }),
            criterion_title: z.string().openapi({ example: 'Non-text Content' }),
            issues: z.array(z.object({ title: z.string(), description: z.string().optional() })).optional(),
          }).openapi('GenerateVpatNarrativeRequest'),
        },
      },
    },
  },
  responses: {
    200: { description: 'Generated narrative', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ conformance: z.string(), remarks: z.string() }) }).openapi('GenerateVpatNarrativeResponse') } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    503: { description: 'AI not configured', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/ai/report/executive-summary',
  tags: ['AI'],
  summary: 'AI-generate an executive summary for a report',
  security: auth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({ report_id: z.string().openapi({ example: 'report-uuid' }) }).openapi('AiReportSectionRequest'),
        },
      },
    },
  },
  responses: {
    200: { description: 'Generated executive summary', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ body: z.string() }) }).openapi('AiExecutiveSummaryResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Report not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
    503: { description: 'AI not configured', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/ai/report/quick-wins',
  tags: ['AI'],
  summary: 'AI-generate quick wins for a report',
  security: auth,
  request: { body: { content: { 'application/json': { schema: z.object({ report_id: z.string().openapi({ example: 'report-uuid' }) }) } } } },
  responses: {
    200: { description: 'Generated quick wins', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ items: z.array(z.string()) }) }).openapi('AiQuickWinsResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Report not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
    503: { description: 'AI not configured', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/ai/report/top-risks',
  tags: ['AI'],
  summary: 'AI-generate top risks for a report',
  security: auth,
  request: { body: { content: { 'application/json': { schema: z.object({ report_id: z.string().openapi({ example: 'report-uuid' }) }) } } } },
  responses: {
    200: { description: 'Generated top risks', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ items: z.array(z.string()) }) }).openapi('AiTopRisksResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Report not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
    503: { description: 'AI not configured', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/ai/report/user-impact',
  tags: ['AI'],
  summary: 'AI-generate user impact section for a report',
  security: auth,
  request: { body: { content: { 'application/json': { schema: z.object({ report_id: z.string().openapi({ example: 'report-uuid' }) }) } } } },
  responses: {
    200: { description: 'Generated user impact', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ screen_reader: z.string(), low_vision: z.string(), color_vision: z.string(), keyboard_only: z.string(), cognitive: z.string(), deaf_hard_of_hearing: z.string() }) }).openapi('AiUserImpactResponse') } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Report not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
    503: { description: 'AI not configured', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

// ─── Media ────────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'post',
  path: '/api/media/upload',
  tags: ['Media'],
  summary: 'Upload a media file',
  description: 'Accepts `multipart/form-data`. Allowed types: image/png, image/jpeg, image/gif, image/webp, video/mp4, video/webm, video/quicktime. Max size: 10MB.',
  security: auth,
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            file: z.string().openapi({ format: 'binary', description: 'Media file' }),
            projectId: z.string().openapi({ example: 'proj-uuid' }),
            issueId: z.string().openapi({ example: 'issue-uuid' }),
          }).openapi('MediaUploadRequest'),
        },
      },
    },
  },
  responses: {
    200: { description: 'Upload successful', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.object({ url: z.string().openapi({ example: '/api/media/proj-uuid/issue-uuid/screenshot.png' }) }) }).openapi('MediaUploadResponse') } } },
    400: { description: 'Validation error (file type, size, or missing fields)', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/media/{path}',
  tags: ['Media'],
  summary: 'Serve a media file',
  description: 'Serves a previously uploaded media file by its path.',
  security: auth,
  request: { params: z.object({ path: z.string().openapi({ example: 'proj-uuid/issue-uuid/screenshot.png' }) }) },
  responses: {
    200: { description: 'Media file bytes', content: { 'image/*': { schema: z.string().openapi({ format: 'binary' }) } } },
    401: { description: 'Unauthenticated', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
});
```

- [ ] **Step 2: Run type-check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/openapi.ts
git commit -m "feat: add dashboard, ai, media, and criteria routes to openapi spec"
```

---

## Task 10: Create the spec endpoint and Redoc UI page

**Files:**
- Create: `src/app/api/openapi.json/route.ts`
- Create: `src/app/api-docs/page.tsx`
- Modify: `src/middleware.ts`

- [ ] **Step 1: Create `src/app/api/openapi.json/route.ts`**

```typescript
import { generateOpenApiDocument } from '@/lib/openapi';

export function GET() {
  return Response.json(generateOpenApiDocument());
}
```

- [ ] **Step 2: Create `src/app/api-docs/page.tsx`**

```tsx
'use client';

import dynamic from 'next/dynamic';

const RedocStandalone = dynamic(
  () => import('redoc').then((mod) => mod.RedocStandalone),
  { ssr: false }
);

export default function ApiDocsPage() {
  return (
    <RedocStandalone
      specUrl="/api/openapi.json"
      options={{
        hideDownloadButton: false,
        theme: { colors: { primary: { main: '#2563eb' } } },
      }}
    />
  );
}
```

Note: `dynamic` with `ssr: false` is required because Redoc uses browser APIs (`window`) that are not available during SSR.

- [ ] **Step 3: Add `/api-docs` to public paths in `src/middleware.ts`**

Change:

```typescript
const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout', '/api/auth/toggle'];
```

To:

```typescript
const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout', '/api/auth/toggle', '/api-docs', '/api/openapi.json'];
```

- [ ] **Step 4: Run type-check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no new errors.

- [ ] **Step 5: Start the dev server and verify**

```bash
npm run dev
```

Open `http://localhost:3000/api-docs` in a browser. You should see the Redoc interface with all 11 tag groups and ~54 endpoints listed.

Open `http://localhost:3000/api/openapi.json` — you should see valid JSON with `openapi: "3.0.0"`.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/openapi.json/route.ts src/app/api-docs/page.tsx src/middleware.ts
git commit -m "feat: serve openapi spec at /api/openapi.json and redoc ui at /api-docs"
```

---

## Task 11: Update README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add API docs link to README**

Open `README.md` and add the following after the "Getting Started" section (or wherever is most natural in the existing structure):

```markdown
## API Documentation

Interactive API documentation is available at [`/api-docs`](http://localhost:3000/api-docs) when the app is running. The raw OpenAPI 3.0 spec is served at `/api/openapi.json`.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add api documentation link to README"
```

---

## Task 12: Smoke test the full spec

This task verifies the generated spec is well-formed and covers all 54 endpoints.

- [ ] **Step 1: Start the dev server if not already running**

```bash
npm run dev
```

- [ ] **Step 2: Fetch and count the paths**

```bash
curl -s http://localhost:3000/api/openapi.json | node -e "
  const spec = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
  const paths = Object.keys(spec.paths);
  let ops = 0;
  paths.forEach(p => ops += Object.keys(spec.paths[p]).length);
  console.log('Paths:', paths.length, '| Operations:', ops);
  console.log('Tags:', [...new Set(Object.values(spec.paths).flatMap(p => Object.values(p).flatMap(o => o.tags ?? [])))].sort().join(', '));
"
```

Expected output (approximately):
```
Paths: 46  | Operations: 54
Tags: AI, Assessments, Auth, Criteria, Dashboard, Issues, Media, Projects, Reports, Settings, Users, VPATs
```

Note: path count is lower than operation count because some paths have multiple methods (e.g. GET + POST on `/api/projects`).

- [ ] **Step 3: Validate JSON parses without error**

The command above confirms this — if it prints tags, the JSON is valid.

- [ ] **Step 4: Verify Redoc renders all tag groups**

In the browser at `http://localhost:3000/api-docs`, confirm:
- Left sidebar shows all 12 tag groups
- Each endpoint shows request body schema with examples where applicable
- Error responses show `ErrorResponse` schema

- [ ] **Step 5: Final commit if any fixes were needed**

If any issues were found and fixed in this task, commit them:

```bash
git add -p
git commit -m "fix: correct openapi spec issues found during smoke test"
```
