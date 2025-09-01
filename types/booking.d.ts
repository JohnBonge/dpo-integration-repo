import { TourPackage } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { BookingStatusType, PaymentStatusType } from './booking';

interface BookingWithTour {
  id: string;
  tourPackageId: string;
  customerName: string;
  customerEmail: string;
  participants: number;
  startDate: Date;
  status: BookingStatusType;
  paymentStatus: PaymentStatusType;
  totalAmount: Decimal;
  createdAt: Date;
  updatedAt: Date;
  tourPackage: TourPackage;
  phone?: string;
  country?: string;
}
