'use client';

import { useTours } from '@/lib/hooks/use-tours';
import TourCard from '@/components/tours/TourCard';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function FeaturedTours() {
  const { data: tours, isLoading, error } = useTours();

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-8 text-red-600'>
        <p>Failed to load tours</p>
      </div>
    );
  }

  if (!tours?.length) {
    return (
      <div className='text-center py-8 text-gray-600'>
        <p>No tours available at the moment.</p>
      </div>
    );
  }

  // Sort tours by price in descending order (highest to lowest) and take first 6
  const featuredTours = tours
    .sort((a, b) => Number(b.price) - Number(a.price))
    .slice(0, 6);

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {featuredTours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>

      <div className='text-center mt-12'>
        <Link href='/packages'>
          <Button size='lg' className='px-8 py-3'>
            View All Packages
          </Button>
        </Link>
      </div>
    </div>
  );
}
