import { useState, useEffect } from 'react';
import type { Tour } from '@/types/tour';
import TourCard from '@/components/tours/TourCard';

export function RelatedTours({ currentTour }: { currentTour: Tour }) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedTours() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/tours');
        const data = await response.json();

        // Debug logs
        // API response received

        // Handle different response structures
        const allTours = data?.tours || data?.data || data || [];

        if (!Array.isArray(allTours)) {
          console.error('Tours data is not an array:', allTours);
          setTours([]);
          return;
        }

        const related = allTours
          .filter((tour: Tour) => tour.id !== currentTour.id)
          .slice(0, 3);

        setTours(related);
      } catch (error) {
        console.error('Error fetching related tours:', error);
        setTours([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRelatedTours();
  }, [currentTour]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(tours) || tours.length === 0) {
    return <div>No related tours found.</div>;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
