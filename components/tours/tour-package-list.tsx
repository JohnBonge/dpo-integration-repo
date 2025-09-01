'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { TourPackage } from '@prisma/client';

export function TourPackageList() {
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTours();
  }, []);

  async function fetchTours() {
    try {
      const response = await fetch('/api/tours');
      if (!response.ok) throw new Error('Failed to fetch tours');
      const data = await response.json();
      const sortedTours = Array.isArray(data)
        ? data.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        : [];
      setTours(sortedTours);
    } catch (error) {
      console.error('Failed to load tours:', error);
      toast.error('Failed to load tours');
      setTours([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm('Are you sure you want to delete this tour package?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tours/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete tour package');
      }

      toast.success('Tour package deleted successfully');
      fetchTours(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete tour:', error);
      toast.error('Failed to delete tour package');
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(tours)) {
    console.error('Tours data is not an array:', tours);
    return <div>Error: Invalid tour data</div>;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Tour Packages</h1>
        <Link href='/dashboard/tours/new'>
          <Button>Add New Tour</Button>
        </Link>
      </div>

      <div className='bg-white rounded-lg shadow overflow-x-auto'>
        <table className='min-w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-3 px-4 text-left'>Title</th>
              <th className='py-3 px-4 text-left'>Duration</th>
              <th className='py-3 px-4 text-left'>Price</th>
              <th className='py-3 px-4 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.length === 0 ? (
              <tr>
                <td colSpan={4} className='py-4 px-4 text-center text-gray-500'>
                  No tour packages found
                </td>
              </tr>
            ) : (
              tours.map((tour) => (
                <tr key={tour.id} className='border-b'>
                  <td className='py-3 px-4'>{tour.title}</td>
                  <td className='py-3 px-4'>{tour.duration} days</td>
                  <td className='py-3 px-4'>${tour.price.toString()}</td>
                  <td className='py-3 px-4'>
                    <div className='flex space-x-2'>
                      <Link href={`/dashboard/tours/${tour.slug}/edit`}>
                        <Button variant='outline' size='sm'>
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDelete(tour.slug)}
                        className='text-red-600 hover:text-red-700'
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
