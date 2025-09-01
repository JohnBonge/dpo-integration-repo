'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Page Error:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center'>
      <h2 className='text-4xl font-bold mb-4'>Something went wrong!</h2>
      <p className='text-gray-600 mb-4'>{error.message}</p>
      <p className='text-sm text-gray-500 mb-8'>
        We apologize for the inconvenience. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
