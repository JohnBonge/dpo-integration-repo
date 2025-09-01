'use client';

import { useState, useEffect } from 'react';
import TourCard from '@/components/tours/TourCard';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import type { Tour } from '@/types/tour';

interface RelatedToursProps {
  currentTourId: string;
}

export default function RelatedTours({ currentTourId }: RelatedToursProps) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTours() {
      try {
        const response = await fetch('/api/tours');
        const data = await response.json();

        // Filter out current tour and get random 3 tours
        const otherTours = data.filter(
          (tour: Tour) => tour.id !== currentTourId
        );
        const shuffled = otherTours.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        setTours(selected);
      } catch (error) {
        console.error('Error fetching tours:', error);
        setTours([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTours();
  }, [currentTourId]);

  if (isLoading) {
    return (
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h3 className='text-xl font-semibold mb-4'>Similar Tours</h3>
        <div className='space-y-4'>
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} variant='compact' />
          ))}
        </div>
      </div>
    );
  }

  if (!tours.length) {
    return null;
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h3 className='text-xl font-semibold mb-4'>Similar Tours</h3>
      <div className='space-y-4'>
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} variant='compact' />
        ))}
      </div>
    </div>
  );
}
