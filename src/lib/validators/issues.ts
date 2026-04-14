import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import {
  WCAG_CRITERION_CODES,
  SECTION_508_CRITERION_CODES,
  EN301549_CRITERION_CODES,
} from '@/lib/constants';

extendZodWithOpenApi(z);

const IssueBaseSchema = z.object({
  title: z.string().min(1).max(300).openapi({ example: 'Image missing alternative text' }),
  description: z
    .string()
    .max(5000)
    .optional()
    .openapi({ example: 'The hero image on the homepage has no alt attribute.' }),
  url: z.string().url().optional().or(z.literal('')).openapi({ example: 'https://acme.com/' }),
  severity: z.enum(['critical', 'high', 'medium', 'low']).optional().openapi({ example: 'high' }),
  status: z.enum(['open', 'resolved', 'wont_fix']).optional().openapi({ example: 'open' }),
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
  device_type: z.enum(['desktop', 'mobile', 'tablet']).optional().openapi({ example: 'desktop' }),
  browser: z.string().max(100).optional().openapi({ example: 'Chrome 124' }),
  operating_system: z.string().max(100).optional().openapi({ example: 'macOS 14' }),
  assistive_technology: z.string().max(200).optional().openapi({ example: 'NVDA 2024.1' }),
  user_impact: z
    .string()
    .max(2000)
    .optional()
    .openapi({ example: 'Screen reader users cannot identify the image.' }),
  selector: z.string().max(500).optional().openapi({ example: '.hero-section > img' }),
  code_snippet: z.string().max(5000).optional().openapi({ example: '<img src="hero.jpg">' }),
  suggested_fix: z
    .string()
    .max(5000)
    .optional()
    .openapi({ example: 'Add alt="Smiling customer using the ACME portal" to the img tag.' }),
  evidence_media: z
    .array(z.string())
    .optional()
    .openapi({ example: ['/api/media/proj/issue/screenshot.png'] }),
  tags: z
    .array(z.string().max(50))
    .optional()
    .openapi({ example: ['images', 'homepage'] }),
  created_by: z.string().max(200).optional().openapi({ example: 'jane' }),
  ai_suggested_codes: z
    .array(z.string())
    .optional()
    .openapi({ example: ['1.1.1', '1.4.5'] }),
  ai_confidence_score: z.number().nullable().optional().openapi({ example: 0.92 }),
});

export const CreateIssueSchema = IssueBaseSchema.openapi('CreateIssueRequest');
export const UpdateIssueSchema = IssueBaseSchema.partial().openapi('UpdateIssueRequest');

export type CreateIssueInput = z.infer<typeof CreateIssueSchema>;
export type UpdateIssueInput = z.infer<typeof UpdateIssueSchema>;
