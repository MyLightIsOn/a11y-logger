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
