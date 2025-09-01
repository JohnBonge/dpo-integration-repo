import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function PaymentSuccessPage({ searchParams }: Props) {
  const bookingId = searchParams.bookingId;

  if (!bookingId) {
    redirect('/');
  }

  return (
    <div className='container mx-auto px-4 py-24'>
      <Card className='max-w-md mx-auto text-center p-6'>
        <CheckCircle className='w-16 h-16 mx-auto mb-6 text-green-500' />
        <h1 className='text-2xl font-bold mb-4'>Payment Successful!</h1>
        <p className='mb-8 text-gray-600'>
          Your payment was successful and your booking has been confirmed. You
          will receive a confirmation email shortly.
        </p>
        <div className='space-y-4'>
          <Button asChild className='w-full'>
            <Link href={`/bookings/${bookingId}`}>View Booking Details</Link>
          </Button>
          <Button asChild variant='outline' className='w-full'>
            <Link href='/'>Return Home</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
