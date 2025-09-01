import * as z from 'zod';

export const paymentSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  tourName: z.string().min(1, 'Tour name is required'),
});

export type PaymentInput = z.infer<typeof paymentSchema>;
