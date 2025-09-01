export default function TourLoading() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid md:grid-cols-3 gap-8'>
        <div className='md:col-span-2'>
          {/* Cover Image Skeleton */}
          <div className='relative h-[400px] mb-8 rounded-lg overflow-hidden bg-gray-200 animate-pulse' />

          {/* Title Skeleton */}
          <div className='h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse' />

          {/* Details Skeleton */}
          <div className='flex gap-4 mb-4'>
            <div className='h-6 bg-gray-200 rounded w-24 animate-pulse' />
            <div className='h-6 bg-gray-200 rounded w-24 animate-pulse' />
          </div>

          {/* Description Skeleton */}
          <div className='space-y-3'>
            <div className='h-4 bg-gray-200 rounded w-full animate-pulse' />
            <div className='h-4 bg-gray-200 rounded w-5/6 animate-pulse' />
            <div className='h-4 bg-gray-200 rounded w-4/6 animate-pulse' />
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className='md:col-span-1'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse' />
            <div className='h-8 bg-gray-200 rounded w-1/3 mb-6 animate-pulse' />
            <div className='space-y-4'>
              <div className='h-10 bg-gray-200 rounded animate-pulse' />
              <div className='h-10 bg-gray-200 rounded animate-pulse' />
              <div className='h-10 bg-gray-200 rounded animate-pulse' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
