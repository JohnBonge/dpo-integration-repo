import { getTours } from '@/lib/api';
import TourCard from '@/components/tours/TourCard';
import CorporatePackageCard from '@/components/tours/CorporatePackageCard';
import type { Tour } from '@/types/tour';
import ErrorBoundary from '@/components/error-boundary';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { Suspense } from 'react';
import { SearchTours } from '@/components/tours/search-tours';
import type { Metadata } from 'next';
import { defaultMetadata } from '@/lib/shared-metadata';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function LoadingState() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// Generate dynamic metadata
export async function generateMetadata({
  searchParams,
}: {
  searchParams: {
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    duration?: string;
  };
}): Promise<Metadata> {
  // Base title and description
  let title = 'Tour Packages - Explore Rwanda with Ingoma Tours';
  let description =
    'Discover our carefully curated Rwanda tour packages, from gorilla trekking to cultural experiences. Find your perfect adventure.';

  // Modify title based on search parameters
  if (searchParams.q) {
    title = `${searchParams.q} Tours - Ingoma Tours Packages`;
    description = `Explore our ${searchParams.q} tours and packages in Rwanda. Find your perfect adventure with Ingoma Tours.`;
  }

  // Add price range to description if specified
  if (searchParams.minPrice || searchParams.maxPrice) {
    const priceRange = `${
      searchParams.minPrice ? `from $${searchParams.minPrice}` : ''
    }${searchParams.maxPrice ? ` to $${searchParams.maxPrice}` : ''}`;
    description += ` Tours available ${priceRange}.`;
  }

  // Add duration if specified
  if (searchParams.duration) {
    description += ` ${searchParams.duration}-day tours available.`;
  }

  return {
    title,
    description,
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      images: [
        {
          url: 'https://res.cloudinary.com/diffklgzw/image/upload/v1731060255/50489669208_fc63428e08_o_jvm2ky.jpg',
          width: 1200,
          height: 630,
          alt: 'Ingoma Tours Packages',
        },
      ],
    },
    alternates: {
      canonical: 'https://ingomatours.com/packages',
    },
    keywords: [
      'Rwanda tours',
      'Kigali tours',
      'Akagera tours',
      'Rwanda travel tours',
      'gorilla trekking',
      'cultural tours',
      'Rwanda travel packages',
      'African safaris',
      searchParams.q || '',
    ].filter(Boolean),
  };
}

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    duration?: string;
  };
}) {
  let tours: Tour[] = [];
  let error = null;

  try {
    tours = await getTours();

    // Filter tours based on search parameters
    if (tours.length > 0) {
      if (searchParams.q) {
        const searchQuery = searchParams.q.toLowerCase();
        tours = tours.filter(
          (tour) =>
            tour.title.toLowerCase().includes(searchQuery) ||
            tour.description.toLowerCase().includes(searchQuery) ||
            tour.location.toLowerCase().includes(searchQuery)
        );
      }

      if (searchParams.minPrice) {
        tours = tours.filter(
          (tour) => Number(tour.price) >= Number(searchParams.minPrice)
        );
      }

      if (searchParams.maxPrice) {
        tours = tours.filter(
          (tour) => Number(tour.price) <= Number(searchParams.maxPrice)
        );
      }

      if (searchParams.duration) {
        tours = tours.filter(
          (tour) => tour.duration === Number(searchParams.duration)
        );
      }

      // Sort tours by price in descending order (highest to lowest)
      tours = tours.sort((a, b) => Number(b.price) - Number(a.price));
    }
  } catch (err) {
    error = 'Failed to load tours';
    console.error('Error loading tours:', err);
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center mb-12'>
          <h1 className='text-3xl font-bold mb-4'>Tour Packages</h1>
          <div className='text-red-600'>{error}</div>
        </div>
      </div>
    );
  }

  if (!tours || tours.length === 0) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center mb-12'>
          <h1 className='text-3xl font-bold mb-4'>Tour Packages</h1>
          <div className='text-gray-600'>No tours available at the moment.</div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='text-center mb-12'>
        <h1 className='text-3xl font-bold mb-4'>Tour Packages</h1>
        <p className='text-gray-600 max-w-2xl mx-auto'>
          From cultural immersions to wildlife adventures, our packages are
          thoughtfully crafted to ensure the highest quality experience for our
          valued customers.
        </p>
      </div>

      <div className='mb-8'>
        <SearchTours />
      </div>

      <ErrorBoundary>
        <Suspense fallback={<LoadingState />}>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <CorporatePackageCard />
            {tours.map((tour: Tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
