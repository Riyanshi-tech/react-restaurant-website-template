import { z } from 'zod';

export const createUserSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'MANAGER', 'CASHIER'], {
    errorMap: () => ({ message: 'Role must be ADMIN, MANAGER, or CASHIER' })
  }),
  isActive: z.boolean().optional(),
  permissions: z.array(z.string()).optional()
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .optional(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'CASHIER'], {
    errorMap: () => ({ message: 'Role must be ADMIN, MANAGER, or CASHIER' })
  }).optional(),
  isActive: z.boolean().optional(),
  permissions: z.array(z.string()).optional()
});
