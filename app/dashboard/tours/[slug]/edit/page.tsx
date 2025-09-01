'use client';

import { useEffect, useState } from 'react';
import { TourPackageForm } from '@/components/forms/tour-package-form';
import { Tour } from '@/types/tour';

export default function EditTourPage({ params }: { params: { slug: string } }) {
  const [tour, setTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTour() {
      try {
        const response = await fetch(`/api/tours/${params.slug}`);
        if (!response.ok) throw new Error('Failed to fetch tour');
        const data = await response.json();
        setTour(data);
      } catch (error) {
        console.error('Error fetching tour:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTour();
  }, [params.slug]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!tour) {
    return <div>Tour not found</div>;
  }

  const formattedTour = {
    ...tour,
    dates: tour.dates.map((date) => new Date(date)),
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-2xl font-bold mb-6'>Edit Tour Package</h1>
        <TourPackageForm initialData={formattedTour} />
      </div>
    </div>
  );
}
