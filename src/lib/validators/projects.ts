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
