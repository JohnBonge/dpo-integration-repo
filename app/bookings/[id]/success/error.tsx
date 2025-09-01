'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Payment success page error:', error);
  }, [error]);

  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='max-w-md mx-auto text-center'>
        <h2 className='text-xl font-semibold mb-4'>Something went wrong!</h2>
        <div className='space-y-4'>
          <Button onClick={() => reset()} className='w-full'>
            Try again
          </Button>
          <Button
            onClick={() => router.push('/bookings')}
            variant='outline'
            className='w-full'
          >
            View My Bookings
          </Button>
        </div>
      </div>
    </div>
  );
}
