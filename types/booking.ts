import type { Booking as PrismaBooking, TourPackage } from '@prisma/client';

export type BookingStatusType =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'REFUNDED';

export type PaymentStatusType = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type Booking = PrismaBooking;
export type BookingWithTour = Booking & {
  tourPackage: TourPackage;
  phone?: string;
  country?: string;
};

export interface SerializedBooking
  extends Omit<
    BookingWithTour,
    | 'totalAmount'
    | 'startDate'
    | 'paidAt'
    | 'createdAt'
    | 'confirmedAt'
    | 'tourPackage'
  > {
  totalAmount: number;
  startDate: string;
  paidAt: string | null;
  createdAt: string;
  confirmedAt: string | null;
  tourPackage: Omit<
    TourPackage,
    'price' | 'dates' | 'createdAt' | 'updatedAt'
  > & {
    price: number;
    dates: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface PaymentData {
  bookingId: string;
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  tourName: string;
}
