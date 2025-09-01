'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface PaymentStatusProps {
  bookingId: string;
}

export function PaymentStatus({ bookingId }: PaymentStatusProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // 🚧 Placeholder for DPO integration
      toast.info('DPO payment integration coming soon!', {
        description: `Booking ID: ${bookingId}`,
      });

      // Example future DPO logic:
      // const response = await fetch('/api/payments/dpo/initialize', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ bookingId }),
      // });
      // const { paymentUrl } = await response.json();
      // window.location.href = paymentUrl;

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={isLoading} className='w-full'>
      {isLoading ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Processing...
        </>
      ) : (
        'Pay Now'
      )}
    </Button>
  );
}