'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Tour } from '@/types/tour';
import { toast } from 'sonner';

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await fetch('/api/tours');
      const data = await response.json();
      setTours(data);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
      toast.error('Failed to fetch tours');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;

    try {
      const response = await fetch(`/api/tours/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete tour');

      toast.success('Tour deleted successfully');
      fetchTours(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete tour:', error);
      toast.error('Failed to delete tour');
    }
  };

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Tour Packages</h1>
        <Link href='/dashboard/tours/new'>
          <Button>Add New Tour</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className='text-center py-4'>Loading tours...</div>
      ) : (
        <div className='bg-white rounded-lg shadow overflow-x-auto'>
          <table className='min-w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='py-3 px-4 text-left'>Title</th>
                <th className='py-3 px-4 text-left'>Duration</th>
                <th className='py-3 px-4 text-left'>Price</th>
                <th className='py-3 px-4 text-left'>Location</th>
                <th className='py-3 px-4 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className='py-4 px-4 text-center text-gray-500'
                  >
                    No tour packages found
                  </td>
                </tr>
              ) : (
                tours.map((tour) => (
                  <tr key={tour.id} className='border-b'>
                    <td className='py-3 px-4'>{tour.title}</td>
                    <td className='py-3 px-4'>{tour.duration} days</td>
                    <td className='py-3 px-4'>${tour.price}</td>
                    <td className='py-3 px-4'>{tour.location}</td>
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
      )}
    </div>
  );
}
