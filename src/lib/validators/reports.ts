import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const ReportContentSchema = z
  .object({
    executive_summary: z
      .object({ body: z.string().openapi({ example: 'This assessment identified...' }) })
      .optional(),
    top_risks: z
      .object({
        items: z.array(z.string()).openapi({ example: ['Missing alt text on 12 images'] }),
      })
      .optional(),
    quick_wins: z
      .object({ items: z.array(z.string()).openapi({ example: ['Add lang attribute to <html>'] }) })
      .optional(),
    user_impact: z
      .object({
        screen_reader: z.string().openapi({ example: 'Users encounter unlabeled form fields.' }),
        low_vision: z.string().openapi({ example: 'Contrast ratios fail in 3 components.' }),
        color_vision: z.string().openapi({ example: 'Color alone conveys status in charts.' }),
        keyboard_only: z.string().openapi({ example: 'Focus trap present in modal dialogs.' }),
        cognitive: z.string().openapi({ example: 'Error messages lack recovery guidance.' }),
        deaf_hard_of_hearing: z.string().openapi({ example: 'Videos lack captions on 2 pages.' }),
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
