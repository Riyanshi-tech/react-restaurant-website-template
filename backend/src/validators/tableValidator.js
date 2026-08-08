import { z } from 'zod';

export const createTableSchema = z.object({
  tableNumber: z
    .number({ required_error: 'Table number is required' })
    .int()
    .min(1, 'Table number must be at least 1'),
  name: z
    .string({ required_error: 'Table name is required' })
    .min(2, 'Table name must be at least 2 characters')
    .max(50, 'Table name cannot exceed 50 characters'),
  capacity: z
    .number({ required_error: 'Capacity is required' })
    .int()
    .min(1, 'Capacity must be at least 1 seat'),
  location: z
    .string({ required_error: 'Location is required' })
    .min(2, 'Location must be at least 2 characters'),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'INACTIVE']).optional(),
  isActive: z.boolean().optional()
});

export const updateTableSchema = z.object({
  tableNumber: z
    .number()
    .int()
    .min(1, 'Table number must be at least 1')
    .optional(),
  name: z
    .string()
    .min(2, 'Table name must be at least 2 characters')
    .max(50, 'Table name cannot exceed 50 characters')
    .optional(),
  capacity: z
    .number()
    .int()
    .min(1, 'Capacity must be at least 1 seat')
    .optional(),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters')
    .optional(),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'INACTIVE']).optional(),
  isActive: z.boolean().optional()
});
