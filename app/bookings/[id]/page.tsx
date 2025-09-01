import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function BookingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      tourPackage: true,
    },
  });

  if (!booking) {
    notFound();
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-2xl font-bold mb-6'>Booking Details</h1>

        <div className='bg-white shadow rounded-lg p-6 space-y-4'>
          <div>
            <h2 className='text-xl font-semibold mb-2'>
              {booking.tourPackage.title}
            </h2>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='font-medium'>Start Date</p>
              <p className='text-gray-600'>
                {format(booking.startDate, 'PPP')}
              </p>
            </div>
            <div>
              <p className='font-medium'>Participants</p>
              <p className='text-gray-600'>{booking.participants}</p>
            </div>
            <div>
              <p className='font-medium'>Total Amount</p>
              <p className='text-gray-600'>
                ${Number(booking.totalAmount).toFixed(2)}
              </p>
            </div>
            <div>
              <p className='font-medium'>Booking Paid</p>
              <p className='text-gray-600'>
                ${(Number(booking.totalAmount) / 2).toFixed(2)}
              </p>
            </div>
            <div>
              <p className='font-medium'>Status</p>
              <p className='text-gray-600'>Booking Confirmed</p>
            </div>
          </div>

          <div className='border-t pt-4 mt-4'>
            <h3 className='font-medium mb-2'>Customer Information</h3>
            <p className='text-gray-600'>{booking.customerName}</p>
            <p className='text-gray-600'>{booking.customerEmail}</p>
            {booking.phone && <p className='text-gray-600'>{booking.phone}</p>}
          </div>

          <div className='flex gap-4 pt-4'>
            <Button asChild>
              <Link href='/'>Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
