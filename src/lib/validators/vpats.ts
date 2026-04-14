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
