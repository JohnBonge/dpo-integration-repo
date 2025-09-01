'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Booking {
  id: string;
  tourPackage: {
    title: string;
  };
  startDate: string;
  participants: number;
  totalAmount: number;
  customerName: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

function BookingSearchContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchBookings = useCallback(async () => {
    if (!email.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(
        `/api/bookings/search?email=${encodeURIComponent(email)}`
      );
      const data = await response.json();

      if (response.ok) {
        setBookings(data.bookings || []);
      } else {
        console.error('Search failed:', data.error);
        setBookings([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (searchParams.get('email')) {
      searchBookings();
    }
  }, [searchParams, searchBookings]);

  const getStatusIcon = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'PAID' || status === 'CONFIRMED') {
      return <CheckCircle className='h-5 w-5 text-green-500' />;
    } else if (paymentStatus === 'FAILED') {
      return <XCircle className='h-5 w-5 text-red-500' />;
    } else {
      return <Clock className='h-5 w-5 text-yellow-500' />;
    }
  };

  const getStatusText = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'PAID' || status === 'CONFIRMED') {
      return 'Confirmed';
    } else if (paymentStatus === 'FAILED') {
      return 'Payment Failed';
    } else {
      return 'Pending Payment';
    }
  };

  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='max-w-2xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold mb-4'>Check Your Booking</h1>
          <p className='text-gray-600'>
            Enter your email address to find your recent bookings and check
            payment status
          </p>
        </div>

        <Card className='p-6 mb-8'>
          <div className='flex gap-4'>
            <Input
              type='email'
              placeholder='Enter your email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchBookings()}
              className='flex-1'
            />
            <Button
              onClick={searchBookings}
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (
                <>
                  <Search className='h-4 w-4 mr-2 animate-spin' />
                  Searching...
                </>
              ) : (
                <>
                  <Search className='h-4 w-4 mr-2' />
                  Search
                </>
              )}
            </Button>
          </div>
        </Card>

        {hasSearched && (
          <div>
            {bookings.length > 0 ? (
              <div className='space-y-4'>
                <h2 className='text-xl font-semibold mb-4'>Your Bookings</h2>
                {bookings.map((booking) => (
                  <Card key={booking.id} className='p-6'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          {getStatusIcon(booking.status, booking.paymentStatus)}
                          <h3 className='font-semibold'>
                            {booking.tourPackage.title}
                          </h3>
                        </div>
                        <div className='text-sm text-gray-600 space-y-1'>
                          <p>
                            <strong>Date:</strong>{' '}
                            {new Date(booking.startDate).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Participants:</strong>{' '}
                            {booking.participants}
                          </p>
                          <p>
                            <strong>Amount:</strong> ${booking.totalAmount}
                          </p>
                          <p>
                            <strong>Status:</strong>{' '}
                            {getStatusText(
                              booking.status,
                              booking.paymentStatus
                            )}
                          </p>
                          <p>
                            <strong>Booked:</strong>{' '}
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            (window.location.href = `/bookings/${booking.id}/success`)
                          }
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className='p-8 text-center'>
                <div className='text-gray-500'>
                  <Search className='h-12 w-12 mx-auto mb-4 opacity-50' />
                  <h3 className='text-lg font-medium mb-2'>
                    No bookings found
                  </h3>
                  <p>
                    We couldn&apos;t find any bookings associated with this
                    email address.
                  </p>
                  <p className='text-sm mt-2'>
                    Make sure you&apos;re using the same email address you used
                    when booking.
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}

        <div className='mt-8 p-4 bg-blue-50 rounded-lg'>
          <h3 className='font-semibold text-blue-900 mb-2'>
            Just completed a payment?
          </h3>
          <p className='text-sm text-blue-800'>
            If you just completed a payment on IremboPay, it may take a few
            moments for your booking status to update. Please wait a minute and
            search again, or contact us if you continue to have issues.
          </p>
        </div>
      </div>
    </div>
  );
}

function BookingSearchFallback() {
  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='max-w-2xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold mb-4'>Check Your Booking</h1>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    </div>
  );
}

export default function BookingSearchPage() {
  return (
    <Suspense fallback={<BookingSearchFallback />}>
      <BookingSearchContent />
    </Suspense>
  );
}
