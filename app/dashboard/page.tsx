import { format } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { BookingStatus } from '@/components/bookings/booking-status';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import type { BookingWithTour } from '@/types/booking';

// Add export config to prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getStats() {
  try {
    // Use a single prisma instance for all queries
    const [totalBookings, recentBookings, paidBookings] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          tourPackage: true,
        },
      }),
      prisma.booking.findMany({
        where: {
          paymentStatus: 'PAID',
        },
        select: {
          tourPackage: {
            select: {
              price: true,
            },
          },
          participants: true,
        },
      }),
    ]);

    const revenue = paidBookings.reduce(
      (acc, booking) =>
        acc + Number(booking.tourPackage.price) * booking.participants,
      0
    );

    // Transform the bookings to match BookingWithTour type
    const transformedBookings = recentBookings.map((booking) => ({
      ...booking,
      phone: booking.phone || undefined,
      country: booking.country || undefined,
      tourPackage: booking.tourPackage,
    })) as BookingWithTour[];

    return {
      totalBookings,
      recentBookings: transformedBookings,
      revenue,
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    throw new Error('Failed to fetch dashboard stats');
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className='space-y-6 p-6'>
      <div className='grid gap-4 md:grid-cols-3'>
        <div className='bg-white p-6 rounded-lg shadow-sm'>
          <h3 className='text-sm font-medium text-gray-500 mb-1'>
            Total Bookings
          </h3>
          <p className='text-3xl font-bold'>{stats.totalBookings}</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-sm'>
          <h3 className='text-sm font-medium text-gray-500 mb-1'>Revenue</h3>
          <p className='text-3xl font-bold'>
            ${stats.revenue.toLocaleString()}
          </p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-sm'>
          <h3 className='text-sm font-medium text-gray-500 mb-1'>
            Conversion Rate
          </h3>
          <p className='text-3xl font-bold'>64%</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className='bg-white rounded-lg shadow-sm'>
        <div className='p-6 border-b'>
          <h2 className='text-lg font-semibold'>Recent Bookings</h2>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b bg-muted/50'>
                <th className='py-3 px-4 text-left'>Customer</th>
                <th className='py-3 px-4 text-left'>Tour</th>
                <th className='py-3 px-4 text-left'>Date</th>
                <th className='py-3 px-4 text-left'>Status</th>
                <th className='py-3 px-4 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBookings.map((booking) => (
                <tr key={booking.id} className='border-b'>
                  <td className='py-3 px-4'>{booking.customerName}</td>
                  <td className='py-3 px-4'>{booking.tourPackage.title}</td>
                  <td className='py-3 px-4'>
                    {format(new Date(booking.startDate), 'PPP')}
                  </td>
                  <td className='py-3 px-4'>
                    <BookingStatus status={booking.status} />
                  </td>
                  <td className='py-3 px-4'>
                    <Button asChild variant='outline' size='sm'>
                      <Link href={`/bookings/${booking.id}`}>View</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
