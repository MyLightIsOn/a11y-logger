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
              data: z.object({ id: z.string(), username: z.string(), role: z.string() }),
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
  method: 'get',
  path: '/api/auth/toggle',
  tags: ['Auth'],
  summary: 'Get authentication status',
  description: 'Returns whether authentication is currently enabled.',
  responses: {
    200: {
      description: 'Current auth status',
      content: {
        'application/json': {
          schema: z
            .object({ success: z.literal(true), data: z.object({ enabled: z.boolean() }) })
            .openapi('AuthStatusResponse'),
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
    409: {
      description: 'No user accounts exist',
      content: { 'application/json': { schema: ErrorResponseSchema } },
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
    204: {
      description: 'Deleted',
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
  method: 'put',
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
  summary: 'Reset all data (full database wipe)',
  description:
    'Deletes all user data including projects, assessments, issues, reports, VPATs, and users. This action is irreversible.',
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
          schema: z
            .object({
              success: z.literal(true),
              data: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  description: z.string().nullable(),
                  product_url: z.string().nullable(),
                  status: z.string(),
                  created_at: z.string(),
                })
              ),
            })
            .openapi('ProjectsListResponse'),
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
          schema: z
            .object({
              success: z.literal(true),
              data: z.object({
                id: z.string(),
                name: z.string(),
                description: z.string().nullable(),
                product_url: z.string().nullable(),
                status: z.string(),
                created_at: z.string(),
              }),
            })
            .openapi('ProjectResponse'),
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
  path: '/api/projects/{projectId}',
  tags: ['Projects'],
  summary: 'Get project',
  security: auth,
  request: { params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }) }) },
  responses: {
    200: {
      description: 'Project',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              id: z.string(),
              name: z.string(),
              description: z.string().nullable(),
              product_url: z.string().nullable(),
              status: z.string(),
              created_at: z.string(),
            }),
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
  path: '/api/projects/{projectId}',
  tags: ['Projects'],
  summary: 'Update project',
  security: auth,
  request: {
    params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }) }),
    body: { content: { 'application/json': { schema: UpdateProjectSchema } } },
  },
  responses: {
    200: {
      description: 'Updated project',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              id: z.string(),
              name: z.string(),
              description: z.string().nullable(),
              product_url: z.string().nullable(),
              status: z.string(),
              created_at: z.string(),
            }),
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
  path: '/api/projects/{projectId}',
  tags: ['Projects'],
  summary: 'Delete project',
  security: auth,
  request: { params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }) }) },
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

// ─── Assessments ──────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/projects/{projectId}/assessments',
  tags: ['Assessments'],
  summary: 'List assessments for a project',
  security: auth,
  request: { params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }) }) },
  responses: {
    200: {
      description: 'List of assessments',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  status: z.string(),
                  project_id: z.string(),
                  created_at: z.string(),
                })
              ),
            })
            .openapi('AssessmentsListResponse'),
        },
      },
    },
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    404: {
      description: 'Project not found',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
    201: {
      description: 'Assessment created',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.object({
                id: z.string(),
                name: z.string(),
                status: z.string(),
                project_id: z.string(),
                created_at: z.string(),
              }),
            })
            .openapi('AssessmentResponse'),
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
      description: 'Project not found',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/projects/{projectId}/assessments/{assessmentId}',
  tags: ['Assessments'],
  summary: 'Get assessment',
  security: auth,
  request: {
    params: z.object({
      projectId: z.string().openapi({ example: 'proj-uuid' }),
      assessmentId: z.string().openapi({ example: 'assess-uuid' }),
    }),
  },
  responses: {
    200: {
      description: 'Assessment',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              id: z.string(),
              name: z.string(),
              status: z.string(),
              project_id: z.string(),
              created_at: z.string(),
            }),
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
  path: '/api/projects/{projectId}/assessments/{assessmentId}',
  tags: ['Assessments'],
  summary: 'Update assessment',
  security: auth,
  request: {
    params: z.object({
      projectId: z.string().openapi({ example: 'proj-uuid' }),
      assessmentId: z.string().openapi({ example: 'assess-uuid' }),
    }),
    body: { content: { 'application/json': { schema: UpdateAssessmentSchema } } },
  },
  responses: {
    200: {
      description: 'Updated assessment',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              id: z.string(),
              name: z.string(),
              status: z.string(),
              project_id: z.string(),
              created_at: z.string(),
            }),
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
  path: '/api/projects/{projectId}/assessments/{assessmentId}',
  tags: ['Assessments'],
  summary: 'Delete assessment',
  security: auth,
  request: {
    params: z.object({
      projectId: z.string().openapi({ example: 'proj-uuid' }),
      assessmentId: z.string().openapi({ example: 'assess-uuid' }),
    }),
  },
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

// ─── Issues ───────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/projects/{projectId}/assessments/{assessmentId}/issues',
  tags: ['Issues'],
  summary: 'List issues in an assessment',
  security: auth,
  request: {
    params: z.object({
      projectId: z.string().openapi({ example: 'proj-uuid' }),
      assessmentId: z.string().openapi({ example: 'assess-uuid' }),
    }),
  },
  responses: {
    200: {
      description: 'List of issues',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.array(
                z.object({
                  id: z.string(),
                  title: z.string(),
                  severity: z.string().nullable(),
                  status: z.string(),
                  created_at: z.string(),
                })
              ),
            })
            .openapi('IssuesListResponse'),
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
  method: 'post',
  path: '/api/projects/{projectId}/assessments/{assessmentId}/issues',
  tags: ['Issues'],
  summary: 'Create issue',
  security: auth,
  request: {
    params: z.object({
      projectId: z.string().openapi({ example: 'proj-uuid' }),
      assessmentId: z.string().openapi({ example: 'assess-uuid' }),
    }),
    body: { content: { 'application/json': { schema: CreateIssueSchema } } },
  },
  responses: {
    201: {
      description: 'Issue created',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.object({
                id: z.string(),
                title: z.string(),
                severity: z.string().nullable(),
                status: z.string(),
                created_at: z.string(),
              }),
            })
            .openapi('IssueResponse'),
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
  method: 'get',
  path: '/api/projects/{projectId}/assessments/{assessmentId}/issues/{issueId}',
  tags: ['Issues'],
  summary: 'Get issue',
  security: auth,
  request: {
    params: z.object({
      projectId: z.string().openapi({ example: 'proj-uuid' }),
      assessmentId: z.string().openapi({ example: 'assess-uuid' }),
      issueId: z.string().openapi({ example: 'issue-uuid' }),
    }),
  },
  responses: {
    200: {
      description: 'Issue',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              id: z.string(),
              title: z.string(),
              severity: z.string().nullable(),
              status: z.string(),
              created_at: z.string(),
            }),
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
  path: '/api/projects/{projectId}/assessments/{assessmentId}/issues/{issueId}',
  tags: ['Issues'],
  summary: 'Update issue',
  security: auth,
  request: {
    params: z.object({
      projectId: z.string().openapi({ example: 'proj-uuid' }),
      assessmentId: z.string().openapi({ example: 'assess-uuid' }),
      issueId: z.string().openapi({ example: 'issue-uuid' }),
    }),
    body: { content: { 'application/json': { schema: UpdateIssueSchema } } },
  },
  responses: {
    200: {
      description: 'Updated issue',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              id: z.string(),
              title: z.string(),
              severity: z.string().nullable(),
              status: z.string(),
              created_at: z.string(),
            }),
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
  path: '/api/projects/{projectId}/assessments/{assessmentId}/issues/{issueId}',
  tags: ['Issues'],
  summary: 'Delete issue',
  security: auth,
  request: {
    params: z.object({
      projectId: z.string().openapi({ example: 'proj-uuid' }),
      assessmentId: z.string().openapi({ example: 'assess-uuid' }),
      issueId: z.string().openapi({ example: 'issue-uuid' }),
    }),
  },
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

registry.registerPath({
  method: 'post',
  path: '/api/projects/{projectId}/assessments/{assessmentId}/issues/import',
  tags: ['Issues'],
  summary: 'Import issues (CSV)',
  description:
    'Accepts a `multipart/form-data` request with a `file` field containing a CSV of issues.',
  security: auth,
  request: {
    params: z.object({
      projectId: z.string().openapi({ example: 'proj-uuid' }),
      assessmentId: z.string().openapi({ example: 'assess-uuid' }),
    }),
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            file: z.string().openapi({ format: 'binary', description: 'CSV file of issues' }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Import result',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.object({ imported: z.number(), skipped: z.number() }),
            })
            .openapi('ImportIssuesResponse'),
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
  method: 'get',
  path: '/api/projects/{projectId}/issues',
  tags: ['Issues'],
  summary: 'List all issues for a project (across all assessments)',
  security: auth,
  request: { params: z.object({ projectId: z.string().openapi({ example: 'proj-uuid' }) }) },
  responses: {
    200: {
      description: 'List of issues',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                severity: z.string().nullable(),
                status: z.string(),
                assessment_id: z.string(),
                created_at: z.string(),
              })
            ),
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
  method: 'get',
  path: '/api/issues/by-criterion',
  tags: ['Issues'],
  summary: 'Get issues grouped by WCAG criterion',
  security: auth,
  request: {
    query: z.object({
      projectId: z
        .string()
        .optional()
        .openapi({ example: 'proj-uuid', description: 'Filter by project' }),
    }),
  },
  responses: {
    200: {
      description: 'Issues grouped by criterion code',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.record(z.string(), z.array(z.object({ id: z.string(), title: z.string() }))),
            })
            .openapi('IssuesByCriterionResponse'),
        },
      },
    },
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

// ─── Reports ──────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/reports',
  tags: ['Reports'],
  summary: 'List reports',
  security: auth,
  responses: {
    200: {
      description: 'List of reports',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.array(
                z.object({
                  id: z.string(),
                  title: z.string(),
                  published: z.boolean(),
                  created_at: z.string(),
                })
              ),
            })
            .openapi('ReportsListResponse'),
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
  path: '/api/reports',
  tags: ['Reports'],
  summary: 'Create report',
  security: auth,
  request: { body: { content: { 'application/json': { schema: CreateReportSchema } } } },
  responses: {
    201: {
      description: 'Report created',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.object({
                id: z.string(),
                title: z.string(),
                published: z.boolean(),
                created_at: z.string(),
              }),
            })
            .openapi('ReportResponse'),
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
      description: 'Assessment not found',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
    200: {
      description: 'Report',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              id: z.string(),
              title: z.string(),
              published: z.boolean(),
              content: ReportContentSchema.optional(),
              created_at: z.string(),
            }),
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
  path: '/api/reports/{id}',
  tags: ['Reports'],
  summary: 'Update report',
  security: auth,
  request: {
    params: z.object({ id: z.string().openapi({ example: 'report-uuid' }) }),
    body: { content: { 'application/json': { schema: UpdateReportSchema } } },
  },
  responses: {
    200: {
      description: 'Updated report',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              id: z.string(),
              title: z.string(),
              published: z.boolean(),
              created_at: z.string(),
            }),
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
  path: '/api/reports/{id}',
  tags: ['Reports'],
  summary: 'Delete report',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'report-uuid' }) }) },
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

registry.registerPath({
  method: 'get',
  path: '/api/reports/{id}/issues',
  tags: ['Reports'],
  summary: 'List issues included in a report',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'report-uuid' }) }) },
  responses: {
    200: {
      description: 'Issues',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(
              z.object({ id: z.string(), title: z.string(), severity: z.string().nullable() })
            ),
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
  method: 'post',
  path: '/api/reports/{id}/publish',
  tags: ['Reports'],
  summary: 'Publish report',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'report-uuid' }) }) },
  responses: {
    200: {
      description: 'Report published',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({ id: z.string(), published: z.literal(true) }),
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
  method: 'post',
  path: '/api/reports/{id}/export',
  tags: ['Reports'],
  summary: 'Export report as DOCX',
  description: 'Returns a binary DOCX file.',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'report-uuid' }) }) },
  responses: {
    200: {
      description: 'DOCX file',
      content: {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
          schema: z.string().openapi({ format: 'binary' }),
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

// ─── VPATs ────────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/vpats',
  tags: ['VPATs'],
  summary: 'List VPATs',
  security: auth,
  request: {
    query: z.object({
      projectId: z
        .string()
        .optional()
        .openapi({ example: 'proj-uuid', description: 'Filter by project' }),
    }),
  },
  responses: {
    200: {
      description: 'List of VPATs',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.array(
                z.object({
                  id: z.string(),
                  title: z.string(),
                  standard_edition: z.string(),
                  published: z.boolean(),
                  created_at: z.string(),
                })
              ),
            })
            .openapi('VpatsListResponse'),
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
  path: '/api/vpats',
  tags: ['VPATs'],
  summary: 'Create VPAT',
  security: auth,
  request: { body: { content: { 'application/json': { schema: CreateVpatSchema } } } },
  responses: {
    201: {
      description: 'VPAT created',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.object({
                id: z.string(),
                title: z.string(),
                standard_edition: z.string(),
                published: z.boolean(),
                created_at: z.string(),
              }),
            })
            .openapi('VpatResponse'),
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
      description: 'Project not found',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
    200: {
      description: 'VPAT',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              id: z.string(),
              title: z.string(),
              standard_edition: z.string(),
              published: z.boolean(),
              created_at: z.string(),
            }),
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
  path: '/api/vpats/{id}',
  tags: ['VPATs'],
  summary: 'Update VPAT',
  security: auth,
  request: {
    params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }) }),
    body: { content: { 'application/json': { schema: UpdateVpatSchema } } },
  },
  responses: {
    200: {
      description: 'Updated VPAT',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              id: z.string(),
              title: z.string(),
              standard_edition: z.string(),
              published: z.boolean(),
              created_at: z.string(),
            }),
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
  path: '/api/vpats/{id}',
  tags: ['VPATs'],
  summary: 'Delete VPAT',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }) }) },
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

registry.registerPath({
  method: 'post',
  path: '/api/vpats/{id}/cover-sheet',
  tags: ['VPATs'],
  summary: 'Update VPAT cover sheet',
  security: auth,
  request: {
    params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }) }),
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              vendor_name: z.string().optional(),
              product_name: z.string().optional(),
              product_version: z.string().optional(),
              report_date: z.string().optional(),
              contact_email: z.string().optional(),
              notes: z.string().optional(),
            })
            .openapi('CoverSheetRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Cover sheet updated',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true), data: z.object({ id: z.string() }) }),
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
  method: 'post',
  path: '/api/vpats/{id}/publish',
  tags: ['VPATs'],
  summary: 'Publish VPAT',
  description: 'Marks the VPAT as published. All criterion rows must be reviewed first.',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }) }) },
  responses: {
    200: {
      description: 'VPAT published',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({ id: z.string(), published: z.literal(true) }),
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
    422: {
      description: 'Unresolved rows or not reviewed',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
    200: {
      description: 'VPAT unpublished',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({ id: z.string(), published: z.literal(false) }),
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
  method: 'post',
  path: '/api/vpats/{id}/review',
  tags: ['VPATs'],
  summary: 'Mark VPAT as reviewed',
  security: auth,
  request: {
    params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }) }),
    body: {
      content: {
        'application/json': {
          schema: z.object({ reviewer_name: z.string().min(1).openapi({ example: 'Jane Smith' }) }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'VPAT reviewed',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true), data: z.object({ id: z.string() }) }),
        },
      },
    },
    400: {
      description: 'reviewer_name is required',
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
    422: {
      description: 'Unresolved rows',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
    200: {
      description: 'DOCX file',
      content: {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
          schema: z.string().openapi({ format: 'binary' }),
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
  method: 'patch',
  path: '/api/vpats/{id}/rows/{rowId}',
  tags: ['VPATs'],
  summary: 'Update a criterion row',
  security: auth,
  request: {
    params: z.object({
      id: z.string().openapi({ example: 'vpat-uuid' }),
      rowId: z.string().openapi({ example: 'row-uuid' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              conformance: z
                .enum([
                  'supports',
                  'partially_supports',
                  'does_not_support',
                  'not_applicable',
                  'not_evaluated',
                ])
                .optional()
                .openapi({ example: 'supports' }),
              remarks: z
                .string()
                .max(5000)
                .optional()
                .openapi({ example: 'All images have appropriate alt text.' }),
            })
            .openapi('UpdateRowRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Updated row',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              id: z.string(),
              conformance: z.string().nullable(),
              remarks: z.string().nullable(),
            }),
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
  path: '/api/vpats/{id}/rows/{rowId}/generate',
  tags: ['VPATs'],
  summary: 'AI-generate conformance text for a criterion row',
  security: auth,
  request: {
    params: z.object({
      id: z.string().openapi({ example: 'vpat-uuid' }),
      rowId: z.string().openapi({ example: 'row-uuid' }),
    }),
  },
  responses: {
    200: {
      description: 'Generated row',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              id: z.string(),
              conformance: z.string().nullable(),
              remarks: z.string().nullable(),
            }),
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
    422: {
      description: 'AI not configured',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/vpats/{id}/rows/{rowId}/components/{componentName}',
  tags: ['VPATs'],
  summary: 'Update a component within a criterion row',
  security: auth,
  request: {
    params: z.object({
      id: z.string().openapi({ example: 'vpat-uuid' }),
      rowId: z.string().openapi({ example: 'row-uuid' }),
      componentName: z.string().openapi({ example: 'web' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              conformance: z
                .enum([
                  'supports',
                  'partially_supports',
                  'does_not_support',
                  'not_applicable',
                  'not_evaluated',
                ])
                .optional(),
              remarks: z.string().max(5000).optional(),
            })
            .openapi('UpdateComponentRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Updated component',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true), data: z.object({ id: z.string() }) }),
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
  path: '/api/vpats/{id}/rows/generate-all',
  tags: ['VPATs'],
  summary: 'AI-generate conformance text for all criterion rows',
  security: auth,
  request: { params: z.object({ id: z.string().openapi({ example: 'vpat-uuid' }) }) },
  responses: {
    200: {
      description: 'Generation complete',
      content: {
        'application/json': {
          schema: z.object({ success: z.literal(true), data: z.object({ generated: z.number() }) }),
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
    422: {
      description: 'AI not configured',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
    200: {
      description: 'List of versions',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.array(z.object({ version: z.number(), published_at: z.string() })),
            })
            .openapi('VpatVersionsResponse'),
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
  method: 'get',
  path: '/api/vpats/{id}/versions/{version}',
  tags: ['VPATs'],
  summary: 'Get a specific published version of a VPAT',
  security: auth,
  request: {
    params: z.object({
      id: z.string().openapi({ example: 'vpat-uuid' }),
      version: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      description: 'VPAT version snapshot',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              version: z.number(),
              snapshot: z.unknown(),
              published_at: z.string(),
            }),
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
  method: 'post',
  path: '/api/vpats/{id}/versions/{version}/export',
  tags: ['VPATs'],
  summary: 'Export a specific VPAT version as DOCX',
  description: 'Returns a binary DOCX file for the specified published version.',
  security: auth,
  request: {
    params: z.object({
      id: z.string().openapi({ example: 'vpat-uuid' }),
      version: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      description: 'DOCX file',
      content: {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
          schema: z.string().openapi({ format: 'binary' }),
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
  method: 'post',
  path: '/api/vpats/import',
  tags: ['VPATs'],
  summary: 'Import a VPAT from a YAML/ZIP file',
  description:
    'Accepts a `multipart/form-data` request with a `file` field containing a VPAT export file.',
  security: auth,
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z
            .object({
              file: z
                .string()
                .openapi({ format: 'binary', description: 'VPAT export file (YAML or ZIP)' }),
              project_id: z.string().openapi({ example: 'proj-uuid' }),
            })
            .openapi('ImportVpatRequest'),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'VPAT imported',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({ id: z.string(), title: z.string() }),
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

// ─── Dashboard ────────────────────────────────────────────────────────────────

const dashboardQueryParams = z.object({
  projectId: z
    .string()
    .optional()
    .openapi({ example: 'proj-uuid', description: 'Filter by project' }),
  statuses: z
    .string()
    .optional()
    .openapi({
      example: 'open,wont_fix',
      description: 'Comma-separated issue statuses to include',
    }),
});

registry.registerPath({
  method: 'get',
  path: '/api/dashboard/issue-statistics',
  tags: ['Dashboard'],
  summary: 'Issue counts by severity',
  security: auth,
  request: { query: dashboardQueryParams },
  responses: {
    200: {
      description: 'Severity breakdown',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.object({
                critical: z.number(),
                high: z.number(),
                medium: z.number(),
                low: z.number(),
              }),
            })
            .openapi('IssueStatisticsResponse'),
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
  method: 'get',
  path: '/api/dashboard/pour-radar',
  tags: ['Dashboard'],
  summary: 'POUR radar chart data',
  description:
    'Returns issue counts grouped by POUR principle (Perceivable, Operable, Understandable, Robust).',
  security: auth,
  request: { query: dashboardQueryParams },
  responses: {
    200: {
      description: 'POUR breakdown',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.array(z.object({ principle: z.string(), count: z.number() })),
            })
            .openapi('PourRadarResponse'),
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
  method: 'get',
  path: '/api/dashboard/timeseries',
  tags: ['Dashboard'],
  summary: 'Issue count over time',
  security: auth,
  request: { query: dashboardQueryParams },
  responses: {
    200: {
      description: 'Time series data',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.array(z.object({ date: z.string(), count: z.number() })),
            })
            .openapi('TimeseriesResponse'),
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
  method: 'get',
  path: '/api/dashboard/repeat-offenders',
  tags: ['Dashboard'],
  summary: 'Most frequently violated WCAG criteria',
  security: auth,
  request: { query: dashboardQueryParams },
  responses: {
    200: {
      description: 'Repeat offender criteria',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.array(
                z.object({ code: z.string(), count: z.number(), description: z.string() })
              ),
            })
            .openapi('RepeatOffendersResponse'),
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
  method: 'get',
  path: '/api/dashboard/wcag-criteria',
  tags: ['Dashboard'],
  summary: 'Issue counts by WCAG criterion',
  security: auth,
  request: { query: dashboardQueryParams },
  responses: {
    200: {
      description: 'Issues by WCAG criterion',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.array(z.object({ code: z.string(), count: z.number() })),
            })
            .openapi('WcagCriteriaResponse'),
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
  method: 'get',
  path: '/api/dashboard/tags',
  tags: ['Dashboard'],
  summary: 'Issue counts by tag',
  security: auth,
  request: { query: dashboardQueryParams },
  responses: {
    200: {
      description: 'Issues by tag',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.array(z.object({ tag: z.string(), count: z.number() })),
            })
            .openapi('TagsResponse'),
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
  method: 'get',
  path: '/api/dashboard/environment',
  tags: ['Dashboard'],
  summary: 'Issue counts by environment (device, browser, OS)',
  security: auth,
  request: { query: dashboardQueryParams },
  responses: {
    200: {
      description: 'Environment breakdown',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.object({
                device_type: z.record(z.string(), z.number()),
                browser: z.record(z.string(), z.number()),
                operating_system: z.record(z.string(), z.number()),
              }),
            })
            .openapi('EnvironmentResponse'),
        },
      },
    },
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
    200: {
      description: 'All criteria',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.array(
                z.object({
                  code: z.string(),
                  title: z.string(),
                  standard: z.string(),
                  level: z.string().optional(),
                })
              ),
            })
            .openapi('CriteriaResponse'),
        },
      },
    },
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
    200: {
      description: 'Connection OK',
      content: {
        'application/json': {
          schema: z
            .object({ success: z.literal(true), data: z.object({ provider: z.string() }) })
            .openapi('AiTestResponse'),
        },
      },
    },
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    503: {
      description: 'AI not configured',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/ai/generate-issue',
  tags: ['AI'],
  summary: 'AI-generate issue field suggestions',
  description:
    'Sends an accessibility observation to the configured AI provider and returns suggested field values. Only returns a field if the corresponding `current` field is empty.',
  security: auth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              ai_description: z
                .string()
                .openapi({
                  example: 'The submit button has no visible focus indicator when tabbed to.',
                }),
              current: z
                .object({
                  title: z.string().nullable().optional(),
                  description: z.string().nullable().optional(),
                  severity: z.string().nullable().optional(),
                  user_impact: z.string().nullable().optional(),
                  suggested_fix: z.string().nullable().optional(),
                  wcag_codes: z.array(z.string()).optional(),
                  section_508_codes: z.array(z.string()).optional(),
                  eu_codes: z.array(z.string()).optional(),
                })
                .optional(),
            })
            .openapi('GenerateIssueRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'AI suggestions (null fields already have values)',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.object({
                title: z.string().nullable(),
                description: z.string().nullable(),
                severity: z.string().nullable(),
                user_impact: z.string().nullable(),
                suggested_fix: z.string().nullable(),
                wcag_codes: z.array(z.string()).nullable(),
                section_508_codes: z.array(z.string()).nullable(),
                eu_codes: z.array(z.string()).nullable(),
              }),
            })
            .openapi('GenerateIssueResponse'),
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
    503: {
      description: 'AI not configured',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
          schema: z
            .object({
              criterion_code: z.string().openapi({ example: '1.1.1' }),
              criterion_title: z.string().openapi({ example: 'Non-text Content' }),
              issues: z
                .array(z.object({ title: z.string(), description: z.string().optional() }))
                .optional(),
            })
            .openapi('GenerateVpatNarrativeRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Generated narrative',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.object({ conformance: z.string(), remarks: z.string() }),
            })
            .openapi('GenerateVpatNarrativeResponse'),
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
    503: {
      description: 'AI not configured',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
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
          schema: z
            .object({ report_id: z.string().openapi({ example: 'report-uuid' }) })
            .openapi('AiReportSectionRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Generated executive summary',
      content: {
        'application/json': {
          schema: z
            .object({ success: z.literal(true), data: z.object({ body: z.string() }) })
            .openapi('AiExecutiveSummaryResponse'),
        },
      },
    },
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    404: {
      description: 'Report not found',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    503: {
      description: 'AI not configured',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/ai/report/quick-wins',
  tags: ['AI'],
  summary: 'AI-generate quick wins for a report',
  security: auth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({ report_id: z.string().openapi({ example: 'report-uuid' }) }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Generated quick wins',
      content: {
        'application/json': {
          schema: z
            .object({ success: z.literal(true), data: z.object({ items: z.array(z.string()) }) })
            .openapi('AiQuickWinsResponse'),
        },
      },
    },
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    404: {
      description: 'Report not found',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    503: {
      description: 'AI not configured',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/ai/report/top-risks',
  tags: ['AI'],
  summary: 'AI-generate top risks for a report',
  security: auth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({ report_id: z.string().openapi({ example: 'report-uuid' }) }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Generated top risks',
      content: {
        'application/json': {
          schema: z
            .object({ success: z.literal(true), data: z.object({ items: z.array(z.string()) }) })
            .openapi('AiTopRisksResponse'),
        },
      },
    },
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    404: {
      description: 'Report not found',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    503: {
      description: 'AI not configured',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/ai/report/user-impact',
  tags: ['AI'],
  summary: 'AI-generate user impact section for a report',
  security: auth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({ report_id: z.string().openapi({ example: 'report-uuid' }) }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Generated user impact',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.object({
                screen_reader: z.string(),
                low_vision: z.string(),
                color_vision: z.string(),
                keyboard_only: z.string(),
                cognitive: z.string(),
                deaf_hard_of_hearing: z.string(),
              }),
            })
            .openapi('AiUserImpactResponse'),
        },
      },
    },
    401: {
      description: 'Unauthenticated',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    404: {
      description: 'Report not found',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    503: {
      description: 'AI not configured',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

// ─── Media ────────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'post',
  path: '/api/media/upload',
  tags: ['Media'],
  summary: 'Upload a media file',
  description:
    'Accepts `multipart/form-data`. Allowed types: image/png, image/jpeg, image/gif, image/webp, video/mp4, video/webm, video/quicktime. Max size: 10MB.',
  security: auth,
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z
            .object({
              file: z.string().openapi({ format: 'binary', description: 'Media file' }),
              projectId: z.string().openapi({ example: 'proj-uuid' }),
              issueId: z.string().openapi({ example: 'issue-uuid' }),
            })
            .openapi('MediaUploadRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Upload successful',
      content: {
        'application/json': {
          schema: z
            .object({
              success: z.literal(true),
              data: z.object({
                url: z
                  .string()
                  .openapi({ example: '/api/media/proj-uuid/issue-uuid/screenshot.png' }),
              }),
            })
            .openapi('MediaUploadResponse'),
        },
      },
    },
    400: {
      description: 'Validation error (file type, size, or missing fields)',
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
  path: '/api/media/{path}',
  tags: ['Media'],
  summary: 'Serve a media file',
  description: 'Serves a previously uploaded media file by its path.',
  security: auth,
  request: {
    params: z.object({
      path: z.string().openapi({ example: 'proj-uuid/issue-uuid/screenshot.png' }),
    }),
  },
  responses: {
    200: {
      description: 'Media file bytes',
      content: { 'image/*': { schema: z.string().openapi({ format: 'binary' }) } },
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
