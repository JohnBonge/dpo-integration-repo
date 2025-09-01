'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PaymentButton } from '@/components/payment/payment-button';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import type { BookingWithTour } from '@/types/booking';
import { formatCurrency } from '@/lib/invoice';

const BookingConfirmContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingWithTour | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bookingId = searchParams.get('bookingId');
    if (bookingId) {
      setIsLoading(true);
      fetch(`/api/bookings/${bookingId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch booking');
          return res.json();
        })
        .then((data) => setBooking(data))
        .catch((error) => {
          console.error('Error fetching booking:', error);
          router.push('/404');
        })
        .finally(() => setIsLoading(false));
    }
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-3xl mx-auto text-center'>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-3xl mx-auto text-center'>
          <p>Booking not found</p>
          <Button className='mt-4' onClick={() => router.push('/')}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const totalPrice = Number(booking.totalAmount);
  const depositAmount = totalPrice * 0.5;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-3xl mx-auto'>
        <h1 className='text-2xl font-bold mb-6'>Confirm Your Booking</h1>

        <div className='bg-white shadow rounded-lg p-6 mb-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4'>
            {/* Left Column */}
            <div className='space-y-4'>
              <div>
                <h2 className='font-semibold text-gray-700'>Customer Name</h2>
                <p className='text-gray-900'>{booking.customerName}</p>
              </div>

              <div>
                <h2 className='font-semibold text-gray-700'>Email</h2>
                <p className='text-gray-900 break-all'>
                  {booking.customerEmail}
                </p>
              </div>

              <div>
                <h2 className='font-semibold text-gray-700'>Phone</h2>
                <p className='text-gray-900'>
                  {booking.phone || 'Not provided'}
                </p>
              </div>

              <div>
                <h2 className='font-semibold text-gray-700'>Country</h2>
                <p className='text-gray-900'>
                  {booking.country || 'Not specified'}
                </p>
              </div>

              <div>
                <h2 className='font-semibold text-gray-700'>Tour Package</h2>
                <p className='text-gray-900 font-medium'>
                  {booking.tourPackage.title}
                </p>
              </div>

              <div>
                <h2 className='font-semibold text-gray-700'>Start Date</h2>
                <p className='text-gray-900'>
                  {new Date(booking.startDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className='space-y-4'>
              <div>
                <h2 className='font-semibold text-gray-700'>
                  Number of Participants
                </h2>
                <p className='text-gray-900'>{booking.participants} people</p>
              </div>

              <div>
                <h2 className='font-semibold text-gray-700'>
                  Price per Person
                </h2>
                <p className='text-gray-900'>
                  {formatCurrency(booking.tourPackage.price)}
                </p>
              </div>

              <div>
                <h2 className='font-semibold text-gray-700'>Total Price</h2>
                <p className='text-gray-900 text-lg font-semibold'>
                  {formatCurrency(totalPrice)}
                </p>
              </div>

              <div>
                <h2 className='font-semibold text-gray-700'>
                  Required Deposit (50%)
                </h2>
                <p className='text-green-600 text-lg font-bold'>
                  {formatCurrency(depositAmount)}
                </p>
              </div>

              <div>
                <h2 className='font-semibold text-gray-700'>Payment Status</h2>
                <p
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    booking.paymentStatus === 'PAID'
                      ? 'bg-green-100 text-green-800'
                      : booking.paymentStatus === 'PROCESSING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : booking.paymentStatus === 'FAILED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {booking.paymentStatus === 'PAID' && '✓ Paid'}
                  {booking.paymentStatus === 'PROCESSING' && '⏳ Processing'}
                  {booking.paymentStatus === 'FAILED' && '❌ Failed'}
                  {booking.paymentStatus === 'PENDING' && '⏱️ Pending Payment'}
                </p>
              </div>

              <div>
                <h2 className='font-semibold text-gray-700'>Booking Status</h2>
                <p
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'CANCELLED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {booking.status === 'CONFIRMED' && '✓ Confirmed'}
                  {booking.status === 'CANCELLED' && '❌ Cancelled'}
                  {booking.status === 'PENDING' && '⏱️ Pending Confirmation'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6'>
          <h3 className='text-lg font-semibold mb-4'>Complete Your Payment</h3>

          {booking.paymentStatus === 'PAID' ? (
            <div className='text-center'>
              <p className='text-green-600 font-medium mb-4'>
                ✓ Payment completed! Your booking is confirmed.
              </p>
              <Button asChild>
                <a href={`/bookings/${booking.id}/success`}>
                  View Booking Details
                </a>
              </Button>
            </div>
          ) : (
            <>
              <div className='mb-4'>
                <p className='text-sm text-gray-600 mb-2'>
                  To secure your booking, please pay the required 50% deposit of{' '}
                  <span className='font-semibold'>
                    {formatCurrency(depositAmount)}
                  </span>
                  .
                </p>
                <p className='text-xs text-gray-500'>
                  The remaining balance of{' '}
                  {formatCurrency(totalPrice - depositAmount)} will be due 30
                  days before your tour date.
                </p>
              </div>

              <PaymentButton
                amount={depositAmount}
                customer={{
                  email: booking.customerEmail,
                  name: booking.customerName,
                }}
                customizations={{
                  title: 'Ingoma Tours Booking',
                  description: `50% Deposit for ${booking.tourPackage.title} (${booking.participants} participants)`,
                }}
                bookingId={booking.id}
              />
            </>
          )}
        </div>

        <div className='flex gap-4 justify-center'>
          <Button variant='outline' onClick={() => router.back()}>
            ← Back to Booking
          </Button>
          <Button variant='ghost' onClick={() => router.push('/')}>
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function ConfirmBookingPage() {
  return (
    <Suspense fallback={<div>Loading booking details...</div>}>
      <BookingConfirmContent />
    </Suspense>
  );
}
