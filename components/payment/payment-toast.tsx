'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function PaymentToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      toast.success(
        'Payment successful! Check your email for booking details.'
      );
    } else if (payment === 'failed') {
      toast.error('Payment failed. Please try again or contact support.');
    }
  }, [searchParams]);

  return null;
}
