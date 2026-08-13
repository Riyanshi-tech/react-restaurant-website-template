import { z } from 'zod';

export const createMenuItemSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  price: z.coerce.number().min(0, 'Price must be >= 0'),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'desserts', 'drinks']),
  description: z.string().min(1, 'Description is required').trim(),
  tag: z.string().trim().optional().or(z.literal('')),
  image: z.string().trim().optional().or(z.literal(''))
});

export const updateMenuItemSchema = createMenuItemSchema.partial();
