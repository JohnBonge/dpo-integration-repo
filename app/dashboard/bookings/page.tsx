'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { BookingStatus } from '@/components/bookings/booking-status';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import Loading from '@/components/loading';
import { toast } from 'sonner';
import { Search, Trash2, Filter, RefreshCw } from 'lucide-react';
import type { BookingWithTour } from '@/types/booking';

interface BookingFilters {
  search: string;
  status: string;
  paymentStatus: string;
  dateRange: string;
}

interface BookingApiResponse {
  id: string;
  customerName: string;
  customerEmail: string;
  phone?: string;
  country?: string;
  startDate: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  confirmedAt?: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  participants: number;
  tourPackage: {
    title: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithTour[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingWithTour[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filters, setFilters] = useState<BookingFilters>({
    search: '',
    status: 'all',
    paymentStatus: 'all',
    dateRange: 'all',
  });

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/bookings');
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();

      // Transform the data to match BookingWithTour type
      const transformedBookings = data.map((booking: BookingApiResponse) => ({
        ...booking,
        phone: booking.phone || undefined,
        country: booking.country || undefined,
        startDate: new Date(booking.startDate as string),
        createdAt: new Date(booking.createdAt as string),
        updatedAt: new Date(booking.updatedAt as string),
        paidAt: booking.paidAt ? new Date(booking.paidAt as string) : null,
        confirmedAt: booking.confirmedAt
          ? new Date(booking.confirmedAt as string)
          : null,
        tourPackage: booking.tourPackage,
      })) as BookingWithTour[];

      setBookings(transformedBookings);
      setFilteredBookings(transformedBookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete individual booking
  const deleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete booking');

      toast.success('Booking deleted successfully');
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  // Delete all bookings
  const deleteAllBookings = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch('/api/bookings/delete-all', {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete all bookings');

      toast.success('All bookings deleted successfully');
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete all bookings:', error);
      toast.error('Failed to delete all bookings');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter bookings based on current filters
  useEffect(() => {
    let filtered = [...bookings];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.customerName.toLowerCase().includes(searchLower) ||
          booking.customerEmail.toLowerCase().includes(searchLower) ||
          booking.tourPackage.title.toLowerCase().includes(searchLower) ||
          booking.id.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(
        (booking) => booking.status === filters.status
      );
    }

    // Payment status filter
    if (filters.paymentStatus !== 'all') {
      filtered = filtered.filter(
        (booking) => booking.paymentStatus === filters.paymentStatus
      );
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const filterDate = new Date();

      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(
            (booking) => booking.createdAt >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(filterDate.getDate() - 7);
          filtered = filtered.filter(
            (booking) => booking.createdAt >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(filterDate.getMonth() - 1);
          filtered = filtered.filter(
            (booking) => booking.createdAt >= filterDate
          );
          break;
      }
    }

    setFilteredBookings(filtered);
  }, [bookings, filters]);

  // Initial load
  useEffect(() => {
    fetchBookings();
  }, []);

  const handleFilterChange = (key: keyof BookingFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      paymentStatus: 'all',
      dateRange: 'all',
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='py-10'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl font-bold'>Bookings Management</h1>
          <div className='flex gap-2'>
            <Button onClick={fetchBookings} variant='outline' size='sm'>
              <RefreshCw className='h-4 w-4 mr-2' />
              Refresh
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='destructive'
                  size='sm'
                  disabled={bookings.length === 0}
                >
                  <Trash2 className='h-4 w-4 mr-2' />
                  Delete All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete All Bookings</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete all bookings? This action
                    cannot be undone and will permanently remove all booking
                    records from the database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={deleteAllBookings}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete All'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button asChild>
              <Link href='/dashboard'>Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className='p-6 mb-6'>
          <div className='flex flex-wrap gap-4 items-end'>
            <div className='flex-1 min-w-64'>
              <label className='block text-sm font-medium mb-2'>Search</label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Search by name, email, tour, or booking ID...'
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            <div className='min-w-40'>
              <label className='block text-sm font-medium mb-2'>Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Statuses</SelectItem>
                  <SelectItem value='PENDING'>Pending</SelectItem>
                  <SelectItem value='CONFIRMED'>Confirmed</SelectItem>
                  <SelectItem value='CANCELLED'>Cancelled</SelectItem>
                  <SelectItem value='COMPLETED'>Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='min-w-40'>
              <label className='block text-sm font-medium mb-2'>Payment</label>
              <Select
                value={filters.paymentStatus}
                onValueChange={(value) =>
                  handleFilterChange('paymentStatus', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Payments</SelectItem>
                  <SelectItem value='PENDING'>Pending</SelectItem>
                  <SelectItem value='PROCESSING'>Processing</SelectItem>
                  <SelectItem value='PAID'>Paid</SelectItem>
                  <SelectItem value='FAILED'>Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='min-w-40'>
              <label className='block text-sm font-medium mb-2'>
                Date Range
              </label>
              <Select
                value={filters.dateRange}
                onValueChange={(value) =>
                  handleFilterChange('dateRange', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Time</SelectItem>
                  <SelectItem value='today'>Today</SelectItem>
                  <SelectItem value='week'>Last 7 Days</SelectItem>
                  <SelectItem value='month'>Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={clearFilters} variant='outline' size='sm'>
              <Filter className='h-4 w-4 mr-2' />
              Clear Filters
            </Button>
          </div>

          <div className='mt-4 text-sm text-gray-600'>
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </Card>

        {/* Bookings Table */}
        <div className='rounded-md border'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b bg-muted/50'>
                  <th className='py-3 px-4 text-left'>Booking ID</th>
                  <th className='py-3 px-4 text-left'>Tour</th>
                  <th className='py-3 px-4 text-left'>Customer</th>
                  <th className='py-3 px-4 text-left'>Date</th>
                  <th className='py-3 px-4 text-left'>Status</th>
                  <th className='py-3 px-4 text-left'>Payment</th>
                  <th className='py-3 px-4 text-left'>Deposit Paid</th>
                  <th className='py-3 px-4 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className='py-8 px-4 text-center text-gray-500'
                    >
                      {bookings.length === 0
                        ? 'No bookings found'
                        : 'No bookings match your filters'}
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className='border-b hover:bg-muted/25'>
                      <td className='py-3 px-4'>
                        <span className='font-mono text-xs'>
                          {booking.id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className='py-3 px-4'>
                        <div
                          className='max-w-48 truncate'
                          title={booking.tourPackage.title}
                        >
                          {booking.tourPackage.title}
                        </div>
                      </td>
                      <td className='py-3 px-4'>
                        <div>
                          <div className='font-medium'>
                            {booking.customerName}
                          </div>
                          <div
                            className='text-xs text-gray-500 truncate max-w-48'
                            title={booking.customerEmail}
                          >
                            {booking.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td className='py-3 px-4'>
                        <div>
                          <div className='font-medium'>
                            {format(booking.startDate, 'MMM dd, yyyy')}
                          </div>
                          <div className='text-xs text-gray-500'>
                            Created: {format(booking.createdAt, 'MMM dd')}
                          </div>
                        </div>
                      </td>
                      <td className='py-3 px-4'>
                        <BookingStatus status={booking.status} />
                      </td>
                      <td className='py-3 px-4'>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            booking.paymentStatus === 'PAID'
                              ? 'bg-green-100 text-green-800'
                              : booking.paymentStatus === 'FAILED'
                              ? 'bg-red-100 text-red-800'
                              : booking.paymentStatus === 'PROCESSING'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className='py-3 px-4'>
                        <div>
                          <div className='font-medium'>
                            ${(Number(booking.totalAmount) / 2).toFixed(2)}
                          </div>
                          <div className='text-xs text-gray-500'>
                            Deposit (50% of $
                            {Number(booking.totalAmount).toFixed(2)})
                          </div>
                        </div>
                      </td>
                      <td className='py-3 px-4'>
                        <div className='flex gap-2'>
                          <Button asChild variant='outline' size='sm'>
                            <Link href={`/bookings/${booking.id}`}>View</Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant='outline'
                                size='sm'
                                className='text-red-600 hover:text-red-700'
                              >
                                <Trash2 className='h-3 w-3' />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Booking
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this booking
                                  for {booking.customerName}? This action cannot
                                  be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteBooking(booking.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
