export function HomePageSkeleton() {
  return (
    <div className='animate-pulse'>
      {/* Hero Section Skeleton */}
      <div className='h-[600px] bg-gray-200 w-full' />

      {/* Featured Tours Section Skeleton */}
      <div className='container mx-auto px-4 py-16'>
        <div className='h-8 bg-gray-200 w-48 mb-8' />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='rounded-lg overflow-hidden'>
              <div className='h-64 bg-gray-200' />
              <div className='p-4 space-y-3'>
                <div className='h-6 bg-gray-200 w-3/4' />
                <div className='h-4 bg-gray-200 w-1/2' />
                <div className='h-4 bg-gray-200 w-2/3' />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section Skeleton */}
      <div className='container mx-auto px-4 py-16'>
        <div className='h-8 bg-gray-200 w-48 mb-8' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='h-96 bg-gray-200 rounded-lg' />
          <div className='space-y-4'>
            <div className='h-6 bg-gray-200 w-3/4' />
            <div className='h-4 bg-gray-200 w-full' />
            <div className='h-4 bg-gray-200 w-5/6' />
          </div>
        </div>
      </div>

      {/* Trust Badges Skeleton */}
      <div className='container mx-auto px-4 py-16'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='h-24 bg-gray-200 rounded-lg' />
          ))}
        </div>
      </div>

      {/* CTA Section Skeleton */}
      <div className='h-96 bg-gray-200 mt-16' />
    </div>
  );
}
