import { useState, useEffect } from 'react';
import type { Tour } from '@/types/tour';
import TourCard from '@/components/tours/TourCard';

export function FeaturedTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedTours() {
      try {
        const response = await fetch('/api/tours');
        const data = await response.json();
        // API response received

        const allTours = Array.isArray(data) ? data : [];
        console.log('Processed Tours:', allTours);

        const featured = allTours
          .sort((a: Tour, b: Tour) => Number(b.price) - Number(a.price))
          .slice(0, 6);

        console.log('Featured Tours:', featured);
        setTours(featured);
      } catch (error) {
        console.error('Error fetching featured tours:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedTours();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!tours.length) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500'>No tours available at the moment.</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
