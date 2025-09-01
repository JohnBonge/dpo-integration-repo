'use client';

import { cn } from '@/lib/utils';
import { BookingStatusType } from '@/types/booking';

interface BookingStatusProps {
  status: BookingStatusType;
}

const statusStyles = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  DISPUTED: 'bg-orange-100 text-orange-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
} as const;

const statusText = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  DISPUTED: 'Disputed',
  REFUNDED: 'Refunded',
} as const;

export function BookingStatus({ status }: BookingStatusProps) {
  return (
    <span
      className={cn(
        'px-3 py-1 text-sm font-medium rounded-full',
        statusStyles[status]
      )}
    >
      {statusText[status]}
    </span>
  );
}
