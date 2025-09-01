import { FeaturedTours } from './FeaturedTours';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export function FeaturedToursSection() {
  return (
    <div className='py-16 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold mb-4'>Featured Tours</h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Discover our most popular tours and start planning your next
            adventure
          </p>
        </div>

        <ErrorBoundary>
          <FeaturedTours />
        </ErrorBoundary>
      </div>
    </div>
  );
}
