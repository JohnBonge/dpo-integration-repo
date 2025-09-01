'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface Booking {
  id: string;
  tourPackage: {
    title: string;
  };
  startDate: string;
  participants: number;
  totalAmount: number | string; // Can be string/Decimal from Prisma
  customerName: string;
}

export default function PaymentSuccessPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    console.log('Fetching booking:', params.id);
    fetch(`/api/bookings/${params.id}`)
      .then((res) => res.json())
      .then((data: Booking) => {
        // Booking data retrieved
        setBooking(data);
      })
      .catch((error) => console.error('Error fetching booking:', error));
  }, [params.id]);

  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='max-w-md mx-auto text-center'>
        <div className='mb-8'>
          <CheckCircle2 className='h-16 w-16 text-green-500 mx-auto mb-4' />
          <h1 className='text-2xl font-bold mb-2'>Payment Successful!</h1>
          <p className='text-gray-600'>
            Thank you for booking with us. Your payment has been processed
            successfully.
          </p>
        </div>

        {booking && (
          <div className='bg-white shadow rounded-lg p-6 mb-8'>
            <h2 className='font-semibold mb-4'>Booking Details</h2>
            <div className='space-y-2 text-left'>
              <p>
                <span className='font-medium'>Tour:</span>{' '}
                {booking.tourPackage.title}
              </p>
              <p>
                <span className='font-medium'>Date:</span>{' '}
                {new Date(booking.startDate).toLocaleDateString()}
              </p>
              <p>
                <span className='font-medium'>Participants:</span>{' '}
                {booking.participants}
              </p>
              <p>
                <span className='font-medium'>Total Tour Price:</span> $
                {Number(booking.totalAmount).toFixed(2)}
              </p>
              <p>
                <span className='font-medium'>Deposit Paid (50%):</span> $
                {(Number(booking.totalAmount) / 2).toFixed(2)}
              </p>
              <p>
                <span className='font-medium'>Balance Due:</span> $
                {(Number(booking.totalAmount) / 2).toFixed(2)}{' '}
                <span className='text-sm text-gray-500'>
                  (due 30 days before tour)
                </span>
              </p>
              <p>
                <span className='font-medium'>Booked By:</span>{' '}
                {booking.customerName}
              </p>
              <p>
                <span className='font-medium'>Status:</span>{' '}
                <span className='text-green-600 font-semibold'>Confirmed</span>
              </p>
            </div>
          </div>
        )}

        <div className='space-y-4'>
          <Button
            onClick={() => router.push(`/bookings/${params.id}`)}
            className='w-full'
          >
            View Booking Details
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant='outline'
            className='w-full'
          >
            Return Home
          </Button>
        </div>

        <div className='mt-8 p-4 bg-blue-50 rounded-lg'>
          <h3 className='font-semibold text-blue-900 mb-2'>
            What happens next?
          </h3>
          <ul className='text-sm text-blue-800 space-y-1'>
            <li>• You will receive a confirmation email shortly</li>
            <li>• Our team will contact you 24-48 hours before your tour</li>
            <li>• Keep your booking ID handy for reference</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
