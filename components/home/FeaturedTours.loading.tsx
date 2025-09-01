import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedToursLoading() {
  return (
    <section className='py-24 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <Skeleton className='h-8 w-64 mx-auto mb-4' />
          <Skeleton className='h-4 w-96 mx-auto' />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className='h-96 w-full rounded-lg' />
          ))}
        </div>

        <div className='text-center'>
          <Button disabled size='lg'>
            View All Packages
          </Button>
        </div>
      </div>
    </section>
  );
}
