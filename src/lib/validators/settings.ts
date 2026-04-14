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
