import { z } from 'zod';

export const tourSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  duration: z.number().min(1, 'Duration must be at least 1 day'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  location: z.string().min(1, 'Location is required'),
  coverImage: z.string().url('Must be a valid URL'),
  dates: z.array(z.date()).optional(),
  itinerary: z
    .array(
      z.object({
        day: z.number(),
        title: z.string().min(1, 'Title is required'),
        description: z.string().min(1, 'Description is required'),
      })
    )
    .optional(),
  slug: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TourInput = z.infer<typeof tourSchema>;
