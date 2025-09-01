'use client';

import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type PaymentStatus = 'processing' | 'success' | 'failed' | 'cancelled';

interface PaymentConfirmationProps {
  status: PaymentStatus;
  message?: string;
  bookingId?: string;
}

const statusConfig = {
  processing: {
    icon: Loader2,
    title: 'Processing Payment',
    message: 'Please wait while we verify your payment...',
    iconClass: 'text-blue-500 animate-spin',
  },
  success: {
    icon: CheckCircle,
    title: 'Payment Successful',
    message: 'Your booking has been confirmed. Check your email for details.',
    iconClass: 'text-green-500',
  },
  failed: {
    icon: XCircle,
    title: 'Payment Failed',
    message:
      'Your payment was unsuccessful. Please try again or contact support.',
    iconClass: 'text-red-500',
  },
  cancelled: {
    icon: XCircle,
    title: 'Payment Cancelled',
    message:
      'Your payment was cancelled. Please try again or contact support if you need assistance.',
    iconClass: 'text-red-500',
  },
};

export function PaymentConfirmation({
  status,
  message,
  bookingId,
}: PaymentConfirmationProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className='container mx-auto px-4 py-24'>
      <div className='max-w-md mx-auto text-center'>
        <Icon className={`w-16 h-16 mx-auto mb-6 ${config.iconClass}`} />
        <h1 className='text-2xl font-bold mb-4'>{config.title}</h1>
        <p className='mb-8 text-gray-600'>{message || config.message}</p>
        <div className='space-y-4'>
          {status === 'success' && bookingId && (
            <Button asChild className='w-full'>
              <Link href={`/bookings/${bookingId}`}>View Booking Details</Link>
            </Button>
          )}
          <Button
            asChild
            variant={status === 'success' ? 'outline' : 'default'}
            className='w-full'
          >
            <Link href='/'>Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
