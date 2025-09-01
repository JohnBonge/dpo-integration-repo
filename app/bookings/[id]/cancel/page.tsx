import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentCancelPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className='py-24'>
      <div className='container mx-auto px-4'>
        <div className='max-w-2xl mx-auto text-center'>
          <div className='mb-8 flex justify-center'>
            <XCircle className='h-16 w-16 text-red-500' />
          </div>
          <h1 className='text-4xl font-bold mb-4'>Payment Cancelled</h1>
          <p className='text-gray-600 mb-8'>
            Your payment was cancelled. Do not worry, you can try again whenever
            you are ready.
          </p>
          <div className='space-x-4'>
            <Button asChild>
              <Link href={`/bookings/${params.id}`}>Return to Booking</Link>
            </Button>
            <Button variant='outline' asChild>
              <Link href='/contact'>Need Help?</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
