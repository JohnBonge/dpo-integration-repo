import { z } from 'zod';

export const bookingSchema = z.object({
  tourPackageId: z.string(),
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  participants: z.number().min(1, 'At least 1 participant is required'),
  startDate: z.string().min(1, 'Please select a date'),
  phone: z.string().optional(),
  country: z.string().optional(),
});

// This is what the API expects
export const bookingRequestSchema = z.object({
  tourId: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  participants: z.number(),
  startDate: z.string(),
  phone: z.string().optional(),
  country: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
export type BookingRequest = z.infer<typeof bookingRequestSchema>;

// Schema for API responses
export const bookingResponseSchema = z.object({
  id: z.string(),
  tourPackageId: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  participants: z.number(),
  startDate: z.string(), // ISO date string
  status: z.string(),
  paymentStatus: z.string(),
  totalAmount: z.number(),
  createdAt: z.string(), // ISO date string
  updatedAt: z.string(), // ISO date string
});

export type BookingResponse = z.infer<typeof bookingResponseSchema>;
