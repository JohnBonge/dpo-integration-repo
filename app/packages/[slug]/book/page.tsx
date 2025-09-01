'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import type { Tour } from '@/types/tour';

interface BookingFormData {
  customerName: string;
  customerEmail: string;
  participants: number;
}

interface BookPageProps {
  params: {
    slug: string;
  };
}

export default function BookPage({ params }: BookPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: '',
    customerEmail: '',
    participants: 1,
  });

  // Fetch tour data
  useEffect(() => {
    async function fetchTour() {
      try {
        const response = await fetch(`/api/tours/${params.slug}`);
        if (!response.ok) throw new Error('Failed to fetch tour');
        const data = await response.json();
        setTour(data);
      } catch (error) {
        console.error('Error fetching tour:', error);
        toast.error('Failed to load tour details');
      }
    }
    fetchTour();
  }, [params.slug]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tour || !selectedDate) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tourId: tour.id,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          participants: formData.participants,
          bookingDate: format(selectedDate, 'yyyy-MM-dd'),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const data = await response.json();
      toast.success('Booking created successfully!');
      router.push(`/bookings/${data.id}`);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to create booking'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!tour) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='max-w-2xl mx-auto p-6'>
        <h1 className='text-2xl font-bold mb-6'>Book {tour.title}</h1>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium mb-1'>Name</label>
            <Input
              value={formData.customerName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customerName: e.target.value,
                }))
              }
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Email</label>
            <Input
              type='email'
              value={formData.customerEmail}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customerEmail: e.target.value,
                }))
              }
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>
              Number of Participants
            </label>
            <Input
              type='number'
              min='1'
              value={formData.participants}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  participants: parseInt(e.target.value) || 1,
                }))
              }
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>
              Select Date
            </label>
            <Calendar
              mode='single'
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className='rounded-md border'
            />
          </div>

          <Button
            type='submit'
            className='w-full'
            disabled={isLoading || !selectedDate}
          >
            {isLoading ? 'Processing...' : 'Book Now'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
