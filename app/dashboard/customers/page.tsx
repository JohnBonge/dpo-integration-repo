import { Suspense } from 'react';
import { PrismaClient } from '@prisma/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Loading from '@/components/loading';
import { format } from 'date-fns';
import type { Customer } from '@/types/customer';

interface BookingData {
  customerName: string;
  customerEmail: string;
  createdAt: Date;
  tourPackage: {
    title: string;
  };
}

const prisma = new PrismaClient();

async function getCustomers(): Promise<Customer[]> {
  const bookings = await prisma.booking.findMany({
    select: {
      customerName: true,
      customerEmail: true,
      createdAt: true,
      tourPackage: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Group bookings by customer email
  const customerMap = bookings.reduce(
    (acc: Map<string, Customer>, booking: BookingData) => {
      const existingCustomer = acc.get(booking.customerEmail);
      if (existingCustomer) {
        existingCustomer.bookings.push({
          tourName: booking.tourPackage.title,
          date: booking.createdAt,
        });
        existingCustomer.totalBookings += 1;
        if (booking.createdAt > existingCustomer.lastBookingDate) {
          existingCustomer.lastBookingDate = booking.createdAt;
        }
      } else {
        acc.set(booking.customerEmail, {
          name: booking.customerName,
          email: booking.customerEmail,
          bookings: [
            {
              tourName: booking.tourPackage.title,
              date: booking.createdAt,
            },
          ],
          totalBookings: 1,
          lastBookingDate: booking.createdAt,
        });
      }
      return acc;
    },
    new Map<string, Customer>()
  );

  return Array.from(customerMap.values());
}

async function CustomersList() {
  const customers = await getCustomers();

  return (
    <div className='rounded-md border'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b bg-muted/50'>
              <th className='py-3 px-4 text-left'>Customer</th>
              <th className='py-3 px-4 text-left'>Email</th>
              <th className='py-3 px-4 text-left'>Total Bookings</th>
              <th className='py-3 px-4 text-left'>Last Booking</th>
              <th className='py-3 px-4 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.email} className='border-b'>
                <td className='py-3 px-4'>{customer.name}</td>
                <td className='py-3 px-4'>{customer.email}</td>
                <td className='py-3 px-4'>{customer.totalBookings}</td>
                <td className='py-3 px-4'>
                  {format(new Date(customer.lastBookingDate), 'PPP')}
                </td>
                <td className='py-3 px-4'>
                  <Button asChild variant='outline' size='sm'>
                    <Link
                      href={`/dashboard/customers/${encodeURIComponent(
                        customer.email
                      )}`}
                    >
                      View Details
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <div className='py-10'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl font-bold'>Customer Management</h1>
          <Button asChild>
            <Link href='/dashboard'>Back to Dashboard</Link>
          </Button>
        </div>

        <Suspense fallback={<Loading />}>
          <CustomersList />
        </Suspense>
      </div>
    </div>
  );
}
