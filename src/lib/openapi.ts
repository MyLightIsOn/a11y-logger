import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { CreateProjectSchema, UpdateProjectSchema } from '@/lib/validators/projects';
import { CreateAssessmentSchema, UpdateAssessmentSchema } from '@/lib/validators/assessments';
import { CreateIssueSchema, UpdateIssueSchema } from '@/lib/validators/issues';
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
import { CreateUserSchema, UpdateUserSchema, LoginSchema } from '@/lib/validators/users';
import { CreateVpatSchema, UpdateVpatSchema } from '@/lib/validators/vpats';

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
          schema: z
            .object({
              success: z.literal(true),
              data: z.object({ username: z.string(), role: z.string() }),
            })
            .openapi('LoginResponse'),
        },
      },
    },
    401: {
      description: 'Invalid credentials',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
          schema: z
            .object({ enabled: z.boolean().openapi({ example: true }) })
            .openapi('AuthToggleRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Auth toggle successful',
      content: {
        'application/json': {
          schema: z
            .object({ success: z.literal(true), data: z.object({ enabled: z.boolean() }) })
            .openapi('AuthToggleResponse'),
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
          schema: z
            .object({
              success: z.literal(true),
              data: z.array(z.object({ id: z.string(), username: z.string(), role: z.string() })),
            })
            .openapi('UsersListResponse'),
        },
      },
    },
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
          schema: z
            .object({
              success: z.literal(true),
              data: z.object({ id: z.string(), username: z.string(), role: z.string() }),
            })
            .openapi('UserResponse'),
        },
      },
    },
    400: {
      description: 'Validation error',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
          schema: z.object({
            success: z.literal(true),
            data: z.object({ id: z.string(), username: z.string(), role: z.string() }),
          }),
        },
      },
    },
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    404: {
      description: 'Not found',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
          schema: z.object({
            success: z.literal(true),
            data: z.object({ id: z.string(), username: z.string(), role: z.string() }),
          }),
        },
      },
    },
    400: {
      description: 'Validation error',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    404: {
      description: 'Not found',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
    200: {
      description: 'Deleted',
      content: { 'application/json': { schema: z.object({ success: z.literal(true) }) } },
    },
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    404: {
      description: 'Not found',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
          schema: z
            .object({ success: z.literal(true), data: z.record(z.string(), SettingValueSchema) })
            .openapi('SettingsResponse'),
        },
      },
    },
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
          schema: z.object({
            success: z.literal(true),
            data: z.record(z.string(), SettingValueSchema),
          }),
        },
      },
    },
    400: {
      description: 'Validation error',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
          schema: z
            .object({
              success: z.literal(true),
              data: z.object({ key: z.string(), value: SettingValueSchema }),
            })
            .openapi('SettingResponse'),
        },
      },
    },
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    404: {
      description: 'Not found',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
          schema: z.object({
            success: z.literal(true),
            data: z.object({ key: z.string(), value: SettingValueSchema }),
          }),
        },
      },
    },
    400: {
      description: 'Validation error',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    404: {
      description: 'Not found',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
